import { NextResponse } from "next/server";

/* =============================================================
   문의·신청 접수 엔드포인트
   -------------------------------------------------------------
   브라우저 → 이 라우트 → 구글 Apps Script 웹훅 → 시트 기록 + 메일 발송.

   브라우저에서 웹훅을 직접 부르지 않는 이유:
     1. 웹훅 주소가 클라이언트 번들에 박혀 스팸 표적이 된다
     2. Apps Script는 CORS가 까다로워 브라우저에서 응답을 못 읽는다
        → 실패해도 성공처럼 보이게 되는데, 문의 접수에서는 그게 최악이다

   설정 방법: project/INQUIRY_WEBHOOK_SETUP.md
   ============================================================= */

/** 접수 종류 — 시트에서 두 폼을 구분하는 값 */
type InquiryType = "inquiry" | "trial";

const FIELD_LIMIT = 500;
const MESSAGE_LIMIT = 2000;

/** 신뢰 경계다. 클라이언트 검증과 별개로 여기서 다시 본다. */
function clean(value: unknown, limit = FIELD_LIMIT): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, limit);
}

export async function POST(request: Request) {
  const webhook = process.env.INQUIRY_WEBHOOK_URL;

  /* 웹훅이 설정되지 않았으면 접수된 척하지 않는다.
     조용히 성공을 반환하면 문의가 유실된 걸 아무도 모른다. */
  if (!webhook) {
    console.error("[inquiry] INQUIRY_WEBHOOK_URL이 설정되지 않았습니다.");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  const type: InquiryType = body.type === "trial" ? "trial" : "inquiry";

  const payload = {
    type,
    company: clean(body.company),
    name: clean(body.name),
    phone: clean(body.phone),
    email: clean(body.email),
    bizNo: clean(body.bizNo),
    channel: clean(body.channel),
    source: clean(body.source),
    message: clean(body.message, MESSAGE_LIMIT),
    // 서버 시각으로 찍는다. 클라이언트 시계는 믿지 않는다.
    submittedAt: new Date().toISOString(),
  };

  // 업체명·담당자명·연락처는 이게 없으면 연락 자체가 불가능하다
  if (!payload.company || !payload.name || !payload.phone) {
    return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Apps Script가 느릴 때 요청이 영원히 매달리지 않게 한다
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      console.error("[inquiry] 웹훅 응답 오류", res.status, await res.text().catch(() => ""));
      return NextResponse.json({ ok: false, error: "webhook_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    /* 접수 실패는 곧 리드 유실이다. 로그에 원문을 남겨 나중에 복구할 수 있게 한다. */
    console.error("[inquiry] 웹훅 호출 실패", error, JSON.stringify(payload));
    return NextResponse.json({ ok: false, error: "network" }, { status: 502 });
  }
}
