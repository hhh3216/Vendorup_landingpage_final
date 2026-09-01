/* =============================================================
   문의·신청 접수 — 브라우저에서 구글 Apps Script로 직접 전송
   -------------------------------------------------------------
   이 사이트는 정적 배포(S3 + CloudFront)라 우리 쪽 서버가 없다.
   그래서 Apps Script가 서버 역할을 대신하고, 브라우저가 직접 호출한다.

   ⚠️ Content-Type이 text/plain인 이유 (바꾸지 말 것):
      application/json으로 보내면 브라우저가 먼저 OPTIONS 요청(preflight)을
      보내는데, Apps Script는 OPTIONS를 처리하지 못해 CORS 오류로 막힌다.
      text/plain은 preflight 없이 바로 가는 "단순 요청"이라 통과한다.
      본문은 그대로 JSON 문자열이고, doPost에서 JSON.parse로 읽는다.
   ============================================================= */

export type InquiryPayload = {
  /** 시트에서 두 폼을 구분하는 값 */
  type: 'inquiry' | 'trial';
  company: string;
  name: string;
  phone: string;
  email?: string;
  bizNo?: string;
  channel?: string;
  source?: string;
  message?: string;
  /** 스팸 봇만 채우는 함정 칸. 값이 있으면 Apps Script가 버린다. */
  website?: string;
};

const WEBHOOK = process.env.NEXT_PUBLIC_INQUIRY_WEBHOOK_URL;

/**
 * 접수를 보낸다. 성공하면 true.
 * 실패를 성공으로 감추지 않는다 — 호출한 쪽에서 안내 문구를 띄운다.
 */
export async function submitInquiry(payload: InquiryPayload): Promise<boolean> {
  if (!WEBHOOK) {
    /* 빌드할 때 NEXT_PUBLIC_INQUIRY_WEBHOOK_URL이 없으면 여기로 온다.
       조용히 성공을 반환하면 문의가 통째로 유실되므로 반드시 실패로 둔다. */
    console.error(
      '[inquiry] NEXT_PUBLIC_INQUIRY_WEBHOOK_URL이 설정되지 않았습니다. ' +
        'project/INQUIRY_WEBHOOK_SETUP.md 참고.'
    );
    return false;
  }

  //정적 랜딩페이지에서 App Script로 직접 전송을 위해 mode를 수정하였고, 응답내용을 읽지 않도록 수정함//
  try {
    await fetch(WEBHOOK, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        ...payload,
        submittedAt: new Date().toISOString(),
      }),
    });

    return true;
  } catch (error) {
    console.error('[inquiry] 전송 실패', error);
    return false;
  }
}
