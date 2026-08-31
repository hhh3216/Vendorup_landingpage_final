import styles from "./CompareSlider.module.css";

const ORDER_TEXT = `안녕하세요~ A매장입니다
내일 주문 넣을게요

양파 10kg 2박스
계란 15판
대파 5단이요
청상추 2박스도 같이 부탁드려요

세금계산서 발행도 부탁드립니다

감사합니다`;

const ROWS = [
  { code: "VG-0142", name: "양파", spec: "10kg", qty: "2", unit: "박스" },
  { code: "EG-0031", name: "계란", spec: "대란 30구", qty: "15", unit: "판" },
  { code: "VG-0088", name: "대파", spec: "1단", qty: "5", unit: "단" },
  { code: "VG-0210", name: "청상추", spec: "2kg", qty: "2", unit: "박스" },
];

/* 드래그 손잡이 없이 좌/우를 그대로 나란히 보여주는 2열 그리드.
   비교의 결론은 "무엇이 바뀌었나"이지 조작이 아니므로 인터랙션은 두지 않는다. */
export default function CompareSlider() {
  const cell = (extra?: string, last?: boolean) =>
    `${styles.td} ${last ? styles.tdLast : ""} ${extra ?? ""}`;

  return (
    <div className={styles.wrap}>
      {/* 지금 · 카톡 원문 */}
      <div className={`${styles.pane} ${styles.before}`}>
        <div className={styles.beforeInner}>
          <div className={styles.avatar}>A</div>
          <div className={styles.bubble}>{ORDER_TEXT}</div>
        </div>
        <div className={styles.tagBefore}>지금 · 카톡 원문</div>
      </div>

      {/* 도입 후 · 정형화된 주문 */}
      <div className={`${styles.pane} ${styles.after}`}>
        <div className={styles.afterInner}>
          <div className={styles.erpCard}>
            <div className={styles.erpHead}>
              <div className={styles.erpStore}>A매장</div>
              <div className={styles.erpDate}>2026. 8. 29. 배송</div>
            </div>

            <div className={styles.erpGrid}>
              <div className={`${styles.th} ${styles.thCode}`}>품목코드</div>
              <div className={styles.th}>품목명</div>
              <div className={`${styles.th} ${styles.hideNarrow}`}>규격</div>
              <div className={`${styles.th} ${styles.thRight}`}>수량</div>
              <div className={`${styles.th} ${styles.thRight} ${styles.hideNarrow}`}>단위</div>
              <div className={styles.rule} />

              {ROWS.map((row, i) => {
                const last = i === ROWS.length - 1;
                return (
                  <div key={row.code} style={{ display: "contents" }}>
                    <div className={cell(undefined, last)}>
                      <span className={styles.code}>{row.code}</span>
                    </div>
                    <div className={cell(styles.name, last)}>{row.name}</div>
                    <div className={cell(`${styles.spec} ${styles.hideNarrow}`, last)}>
                      {row.spec}
                    </div>
                    <div className={cell(styles.qty, last)}>{row.qty}</div>
                    <div className={cell(`${styles.unit} ${styles.hideNarrow}`, last)}>
                      {row.unit}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.erpFoot}>세금계산서 발행 요청</div>
          </div>
        </div>
        <div className={styles.tagAfter}>도입 후 · 정형화된 주문</div>
      </div>
    </div>
  );
}
