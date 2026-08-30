/* =============================================================
   §4.4 작동 원리 — 우측 스텝 카드 6장 (시안 그대로 이식)
   -------------------------------------------------------------
   ⚠️ 준비물 (ANIMATION_SPEC §4.4): 제품 스크린샷 5장은 기획서 체크리스트
   미확정 항목이다. 미수령 상태이므로 시안의 목업 카드로 구현했다.
   ▶▶ 실제 스크린샷을 받으면 각 카드의 `<StepVisual>` 블록만 <img>로 교체하면 된다.
      교체 지점은 카드마다 "SCREENSHOT SLOT" 주석으로 표시해 두었다.
   ============================================================= */

import styles from "./HowItWorks.module.css";

const KAKAO_SHORT = `안녕하세요~ A매장입니다
내일 주문 넣을게요

양파 10kg 2박스
계란 15판
대파 5단이요`;

/* --- STEP 01 받는다 --- */
function Step01() {
  return (
    /* SCREENSHOT SLOT — 실제 수신함 스크린샷으로 교체 */
    <div className={styles.kakaoBox}>
      <div className={styles.kakaoAvatar}>A</div>
      <div className={styles.kakaoBubble}>{KAKAO_SHORT}</div>
    </div>
  );
}

/* --- STEP 02 전달한다 --- */
function Step02() {
  return (
    /* SCREENSHOT SLOT — 채널 연동 / 붙여넣기 화면 스크린샷으로 교체 */
    <div className={styles.twoWays}>
      <div className={styles.way}>
        <div className={styles.wayBadge}>방식 1</div>
        <div className={styles.wayTitle}>카톡으로 바로 받기</div>
        <p className={styles.wayBody}>
          거래처가 Vendor-UP 채널로 주문을 보내면 원문이 그대로 들어옵니다.
        </p>
        <div className={styles.wayFlow}>
          거래처 카톡<span className={styles.wayArrow}>→</span>Vendor-UP
        </div>
      </div>
      <div className={styles.way}>
        <div className={`${styles.wayBadge} ${styles.wayBadgeCyan}`}>방식 2</div>
        <div className={styles.wayTitle}>받은 주문 붙여넣기</div>
        <p className={styles.wayBody}>
          지금 쓰는 카톡·문자로 받은 뒤, 그 내용을 그대로 복사해 붙여넣습니다.
        </p>
        <div className={styles.wayFlow}>
          우리 카톡<span className={styles.wayArrow}>→</span>복사·붙여넣기
        </div>
      </div>
    </div>
  );
}

/* --- STEP 03 추출한다 --- */
function Step03() {
  const v = styles.tokenViolet;
  const c = styles.tokenCyan;
  return (
    /* SCREENSHOT SLOT — 추출 결과 화면 스크린샷으로 교체 */
    <div className={styles.extract}>
      <span className={v}>양파</span> <span className={c}>10kg</span> <span className={v}>2박스</span>
      <br />
      <span className={v}>계란</span> <span className={v}>15판</span> ·{" "}
      <span className={v}>대파</span> <span className={v}>5단</span>
      <br />
      <span className={styles.tokenMuted}>내일 오전 10시 전까지 도착 부탁드리고</span>
    </div>
  );
}

/* --- STEP 04 맞춘다 --- */
const MATCHES = [
  { name: "양파", code: "VG-0142" },
  { name: "계란", code: "EG-0031" },
  { name: "대파", code: "VG-0088" },
];

function Step04() {
  return (
    /* SCREENSHOT SLOT — 품목코드 매칭 화면 스크린샷으로 교체 */
    <div className={styles.matchBox}>
      {MATCHES.map((m) => (
        <div className={styles.matchRow} key={m.code}>
          <div className={styles.matchName}>{m.name}</div>
          <div className={styles.matchArrow}>→</div>
          <span className={styles.matchCode}>{m.code}</span>
        </div>
      ))}
    </div>
  );
}

/* --- STEP 05 확인한다 --- */
const CONFIRM_ROWS = [
  { name: "양파 10kg", qty: "2박스", code: "VG-0142" },
  { name: "계란", qty: "15판", code: "EG-0031" },
  { name: "대파", qty: "5단", code: "VG-0088" },
  { name: "청상추", qty: "2박스", code: "VG-0210" },
];

function Step05() {
  return (
    /* SCREENSHOT SLOT — 승인 대기 화면 스크린샷으로 교체 */
    <div className={styles.confirmBox}>
      <div className={styles.confirmGrid}>
        <div className={styles.confirmTh}>품목</div>
        <div className={styles.confirmTh}>수량</div>
        <div className={styles.confirmTh}>품목코드</div>

        {CONFIRM_ROWS.map((r) => (
          <div key={r.code} style={{ display: "contents" }}>
            <div className={styles.confirmName}>{r.name}</div>
            <div className={styles.confirmQty}>{r.qty}</div>
            <div className={styles.confirmCode}>{r.code}</div>
          </div>
        ))}
      </div>

      <div className={styles.confirmFoot}>
        <div>
          <div className={styles.confirmAsk}>이대로 승인하시겠습니까?</div>
          <div className={styles.confirmMeta}>A매장 주문 4건 · 2026. 8. 29. 배송</div>
        </div>
        <div className={styles.confirmApprove}>승인</div>
      </div>
    </div>
  );
}

/* --- STEP 06 등록한다 --- */
function Step06() {
  return (
    /* SCREENSHOT SLOT — ERP 등록 완료 화면 스크린샷으로 교체 */
    <div className={styles.registerBox}>
      <div className={styles.registerHead}>
        <div className={styles.registerCheck}>✓</div>
        <div className={styles.registerTitle}>ERP 등록 완료 · A매장 주문 4건</div>
      </div>

      <div className={styles.registerGrid}>
        <div className={styles.registerTh}>전표번호</div>
        <div className={styles.registerTh}>거래처</div>
        <div className={styles.registerTh}>품목수</div>
        <div className={`${styles.registerTh} ${styles.registerThRight}`}>상태</div>

        <div className={styles.registerSlip}>SO-260829-014</div>
        <div className={styles.registerStore}>A매장</div>
        <div className={styles.registerCount}>4건</div>
        <div className={styles.registerStatusCell}>
          <span className={styles.registerBadge}>등록</span>
        </div>

        <div className={`${styles.registerSlip} ${styles.dim}`}>SO-260829-013</div>
        <div className={`${styles.registerStore} ${styles.dim}`}>B식당</div>
        <div className={`${styles.registerCount} ${styles.dim}`}>7건</div>
        <div className={styles.registerStatusCell}>
          <span className={`${styles.registerBadge} ${styles.registerBadgeDim}`}>등록</span>
        </div>
      </div>
    </div>
  );
}

export type Step = {
  no: string;
  title: string;
  body: string;
  Visual: () => React.JSX.Element;
};

export const STEPS: Step[] = [
  {
    no: "01",
    title: "받는다",
    body: "카톡·문자로 들어온 주문 문장이 Vendor-UP으로 모입니다. 정해진 양식이 없어도 됩니다.",
    Visual: Step01,
  },
  {
    no: "02",
    title: "전달한다",
    body: "주문 원문이 Vendor-UP에 도착하는 방법은 두 가지입니다. 업체 사정에 맞는 쪽을 고르시면 됩니다.",
    Visual: Step02,
  },
  {
    no: "03",
    title: "추출한다",
    body: '문장에서 품목, 규격, 수량, 납품일, 거래처를 AI가 뽑아냅니다. "어제랑 똑같이" 같은 말도 이전 주문 이력으로 해석합니다.',
    Visual: Step03,
  },
  {
    no: "04",
    title: "맞춘다",
    body: "거래처가 부르는 이름을 우리 회사 품목코드로 자동 변환합니다. 쓸수록 매칭 정확도가 올라갑니다.",
    Visual: Step04,
  },
  {
    no: "05",
    title: "확인한다",
    body: "정리된 주문이 화면에 뜹니다. 담당자가 훑어보고 승인하면 됩니다.",
    Visual: Step05,
  },
  {
    no: "06",
    title: "등록한다",
    body: "승인 즉시 ERP에 반영됩니다. 담당자는 등록된 주문만 확인하면 됩니다.",
    Visual: Step06,
  },
];
