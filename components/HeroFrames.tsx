/* =============================================================
   히어로 영상 목업 프레임 (시안 `1. Landing Page.dc.html` 그대로 이식)
   -------------------------------------------------------------
   실제 18초 루프 영상(HERO_VIDEO_PROMPT.md)이 준비되기 전까지의 폴백.
   732×412 무대 좌표계 안에서만 그려지고, 무대 전체가 카드 크기에 맞춰
   scale 되므로 여기서는 반응형을 신경 쓰지 않는다.

   프레임 4장 = 영상의 핵심 비트 4개:
     01 phone-idle · 03b chat-messy · 04a logo · 05b approve
   ============================================================= */

const ORDER_TEXT = `안녕하세요~ A매장입니다
내일 주문 넣을게요

양파 10kg 2박스
계란 15판
대파 5단이요
청상추 2박스도 같이 부탁드려요

세금계산서 발행도 부탁드립니다

감사합니다`;

const PHONE: React.CSSProperties = {
  position: "absolute",
  left: "68%",
  top: 52,
  transform: "translateX(-50%) scale(.78)",
  transformOrigin: "top center",
  width: 170,
  height: 352,
  borderRadius: 30,
  background: "#0E0F12",
  padding: 6,
  boxSizing: "border-box",
  boxShadow: "0 24px 44px -20px rgba(16,24,40,.4)",
};

/** 01 phone-idle — 잠금화면에 주문 알림이 떠 있는 "이전" 상태 */
function FrameIdle() {
  return (
    <div style={PHONE}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 25,
          overflow: "hidden",
          background: "linear-gradient(180deg,#E5E9EE 0%,#C7CFD8 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 5,
            left: "50%",
            transform: "translateX(-50%)",
            width: 52,
            height: 15,
            borderRadius: 8,
            background: "#0E0F12",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 26,
            left: 14,
            right: 14,
            borderRadius: 13,
            /* 불투명 배경 — backdrop-filter는 PNG 추출에서 음영으로 깨진다 (chat1) */
            background: "rgba(255,255,255,.94)",
            padding: "8px 9px",
            display: "flex",
            gap: 7,
            alignItems: "flex-start",
            boxShadow: "0 8px 18px -8px rgba(16,24,40,.3)",
          }}
        >
          {/* 일반 메신저 아이콘 — 실제 카카오톡 마크를 쓰지 않는다 (HERO_VIDEO_PROMPT §6) */}
          <div
            style={{ width: 24, height: 24, borderRadius: 7, background: "#FEE500", flex: "none" }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "700 9px -apple-system,'Apple SD Gothic Neo',sans-serif" }}>
              A매장 사장님
            </div>
            <div
              style={{
                font: "400 8.5px/1.35 -apple-system,'Apple SD Gothic Neo',sans-serif",
                color: "rgba(26,26,26,.75)",
                marginTop: 1,
              }}
            >
              안녕하세요, A매장입니다. 내일 주문 넣을게요...
            </div>
          </div>
        </div>
        <div
          style={{ position: "absolute", top: 112, left: 0, right: 0, textAlign: "center", opacity: 0.5 }}
        >
          <div
            style={{
              font: "200 44px/1 -apple-system,'Apple SD Gothic Neo',sans-serif",
              letterSpacing: "-.04em",
            }}
          >
            9:41
          </div>
        </div>
      </div>
    </div>
  );
}

/** 03b chat-messy — 비정형 주문 원문. 영상에서 2.4초 완전 정지하는 구간. */
function FrameChat() {
  return (
    <div style={PHONE}>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 25,
          overflow: "hidden",
          background: "#B2C7DA",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 40,
            background: "rgba(178,199,218,.95)",
            display: "flex",
            alignItems: "flex-end",
            padding: "0 10px 7px",
            boxSizing: "border-box",
            font: "700 10px -apple-system,'Apple SD Gothic Neo',sans-serif",
          }}
        >
          A매장 사장님
        </div>
        <div
          style={{
            position: "absolute",
            top: 48,
            left: 8,
            right: 8,
            display: "flex",
            gap: 5,
            alignItems: "flex-start",
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 7,
              background: "#fff",
              flex: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "700 8px Pretendard,sans-serif",
              color: "#6B7684",
            }}
          >
            A
          </div>
          <div
            style={{
              background: "#fff",
              borderRadius: "3px 11px 11px 11px",
              padding: "9px 10px",
              font: "400 9.5px/1.55 -apple-system,'Apple SD Gothic Neo',sans-serif",
              whiteSpace: "pre-line",
              wordBreak: "keep-all",
              width: 118,
              boxSizing: "border-box",
            }}
          >
            {ORDER_TEXT}
          </div>
        </div>
      </div>
    </div>
  );
}

/** 04a logo — 문제에서 제품으로 넘어가는 브랜드 스탬프 */
function FrameLogo() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#fff",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: 66,
        boxSizing: "border-box",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logo-full.png"
        alt="Vendor-UP"
        style={{ width: 232, height: 179, display: "block" }}
      />
    </div>
  );
}

const CELL = "1px solid rgba(16,24,40,.06)";

const ROWS = [
  { code: "VG-0142", name: "양파", spec: "10kg", qty: "2", unit: "박스" },
  { code: "EG-0031", name: "계란", spec: "대란 30구", qty: "15", unit: "판" },
  { code: "VG-0088", name: "대파", spec: "1단", qty: "5", unit: "단" },
  { code: "VG-0210", name: "청상추", spec: "2kg", qty: "2", unit: "박스" },
];

/** 05b approve — 정리된 결과 + 승인 버튼. 스토리의 결론 프레임. */
function FrameApprove() {
  const head = (label: string, right = false, brand = false): React.CSSProperties => ({
    font: "700 12px Pretendard,sans-serif",
    color: brand ? "#5630E3" : "rgba(26,26,26,.45)",
    paddingBottom: 8,
    textAlign: right ? "right" : "left",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#F7F8FA",
        padding: "52px 34px 0",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 16px 40px -22px rgba(16,24,40,.22)",
          padding: "22px 24px",
          transform: "scale(.52)",
          transformOrigin: "top center",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <div style={{ font: "800 22px Pretendard,sans-serif", letterSpacing: "-.035em" }}>A매장</div>
          <div style={{ font: "500 14px Pretendard,sans-serif", color: "rgba(26,26,26,.5)" }}>
            2026. 8. 29. 배송
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr 120px 62px 62px",
            marginTop: 16,
            fontFamily: "Pretendard,sans-serif",
          }}
        >
          <div style={head("", false, true)}>품목코드</div>
          <div style={head("")}>품목명</div>
          <div style={head("")}>규격</div>
          <div style={head("", true)}>수량</div>
          <div style={head("", true)}>단위</div>
          <div style={{ gridColumn: "1/-1", height: 2, background: "rgba(16,24,40,.1)" }} />

          {ROWS.map((row, i) => {
            const last = i === ROWS.length - 1;
            const base: React.CSSProperties = {
              padding: "10px 0",
              borderBottom: last ? undefined : CELL,
            };
            return (
              <div key={row.code} style={{ display: "contents" }}>
                <div style={base}>
                  <span
                    style={{
                      font: "700 12px ui-monospace,Menlo,monospace",
                      color: "#5630E3",
                      background: "rgba(86,48,227,.08)",
                      padding: "3px 7px",
                      borderRadius: 5,
                    }}
                  >
                    {row.code}
                  </span>
                </div>
                <div style={{ ...base, font: "700 15px Pretendard,sans-serif" }}>{row.name}</div>
                <div
                  style={{
                    ...base,
                    font: "500 14px Pretendard,sans-serif",
                    color: "rgba(26,26,26,.6)",
                  }}
                >
                  {row.spec}
                </div>
                <div style={{ ...base, font: "700 15px Pretendard,sans-serif", textAlign: "right" }}>
                  {row.qty}
                </div>
                <div
                  style={{
                    ...base,
                    font: "500 14px Pretendard,sans-serif",
                    color: "rgba(26,26,26,.6)",
                    textAlign: "right",
                  }}
                >
                  {row.unit}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid rgba(16,24,40,.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ font: "800 17px Pretendard,sans-serif", letterSpacing: "-.03em" }}>
            이대로 승인하시겠습니까?
          </div>
          <div
            style={{
              background: "#5630E3",
              color: "#fff",
              font: "700 14px Pretendard,sans-serif",
              padding: "10px 26px",
              borderRadius: 10,
              boxShadow: "0 0 0 4px rgba(86,48,227,.14)",
            }}
          >
            승인
          </div>
        </div>
      </div>
    </div>
  );
}

export const HERO_FRAMES = [
  { id: "01 phone-idle", Frame: FrameIdle },
  { id: "03b chat-messy", Frame: FrameChat },
  { id: "04a logo", Frame: FrameLogo },
  { id: "05b approve", Frame: FrameApprove },
] as const;

/** §5.2 reduced-motion 대체는 05b(approve) — 스토리의 결론이 담긴 프레임 */
export const REDUCED_MOTION_FRAME = 3;
