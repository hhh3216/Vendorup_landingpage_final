"use client";

import { useEffect, useState, type ReactNode } from "react";
import styles from "./Solution.module.css";
import CompareSlider from "./CompareSlider";
import { stagger, useInViewOnce, useIsMobile } from "@/lib/reveal";

type Row = {
  label: string;
  now: string;
  after: ReactNode;
  /** "(그대로)" 행 — 안 바뀌는 게 요점이므로 Before/After 동시에 보인다 (§4.3) */
  unchanged?: boolean;
};

const ROWS: Row[] = [
  {
    label: "거래처가 주문하는 방식",
    now: "카톡·문자",
    after: (
      <>
        카톡·문자 <b>그대로</b>
      </>
    ),
    unchanged: true,
  },
  { label: "주문서 읽기", now: "사람이 하나씩 확인", after: "AI가 자동으로 읽음" },
  { label: "품목 매칭", now: "담당자 기억에 의존", after: "우리 회사 품목코드로 자동 매칭" },
  { label: "ERP 입력", now: "한 건씩 손으로 타이핑", after: "확인 후 자동 등록" },
  { label: "반복 작업량", now: "주문 건수만큼 그대로", after: "확인 한 번으로 축소" },
];

/* §4.3 행당 100ms 간격 / §7 모바일에서는 60ms */
const ROW_STEP_DESKTOP = 100;
const ROW_STEP_MOBILE = 60;

export default function Solution() {
  const [tableRef, tableInView] = useInViewOnce<HTMLDivElement>();
  const [filled, setFilled] = useState(false);
  const isMobile = useIsMobile();
  const step = isMobile ? ROW_STEP_MOBILE : ROW_STEP_DESKTOP;

  useEffect(() => {
    if (tableInView) setFilled(true);
  }, [tableInView]);

  /* (그대로) 행은 순차 채움에서 빠지므로, 지연 계산에서도 제외한다. */
  let animatedIndex = -1;

  return (
    <section className="section-pad" id="solution">
      <h2 className="h2" data-reveal>
        받는 방식은 그대로, 입력만 사라집니다.
      </h2>

      {/* 강조 스트립: 공통 규칙, --d-slow */}
      <div className={styles.strip} data-reveal data-reveal-slow style={stagger(1)}>
        <div className={styles.stripTitle}>거래처는 지금 하던 대로 주문하면 됩니다.</div>
        <p className={styles.stripBody}>
          앱을 새로 깔 필요도, 낯선 양식을 배울 필요도 없습니다. 바뀌는 건 우리 쪽 입력 과정뿐입니다.
        </p>
      </div>

      <div data-reveal style={stagger(2)}>
        <CompareSlider />
      </div>

      <div className={styles.table} ref={tableRef} data-reveal style={stagger(3)}>
        <div className={`${styles.row} ${styles.headRow}`}>
          <div className={styles.thBlank} />
          <div className={styles.thNow}>지금</div>
          <div className={styles.thAfter}>Vendor-UP 도입 후</div>
        </div>

        {ROWS.map((row, i) => {
          if (!row.unchanged) animatedIndex += 1;
          const delay = row.unchanged ? 0 : animatedIndex * step;

          return (
            <div
              key={row.label}
              className={`${styles.row} ${i > 0 ? styles.divided : ""}`}
            >
              <div className={styles.label}>{row.label}</div>

              {/* Before 컬럼은 처음부터 보인다 */}
              <div className={styles.now} data-col="지금">
                {row.now}
              </div>

              <div
                className={`${styles.after} ${
                  row.unchanged ? "" : styles.afterAnimated
                } ${filled ? styles.rowIn : ""}`}
                data-col="도입 후"
                style={{ ["--row-delay" as string]: `${delay}ms` }}
              >
                {row.after}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.values}>
        <div className={`${styles.value} ${styles.valueLead}`} data-reveal style={stagger(0)}>
          거래처는 하던 대로 카톡·문자만 보내면 됩니다.
        </div>
        <div className={styles.value} data-reveal style={stagger(1)}>
          읽고 찾고 치는 반복 작업이 사라집니다.{" "}
          <span className={styles.valueMuted}>담당자는 확인만 합니다.</span>
        </div>
        <div className={styles.value} data-reveal style={stagger(2)}>
          바뀌는 건 사이에 있던 &lsquo;옮겨 적는 손&rsquo;뿐입니다.
        </div>
      </div>
    </section>
  );
}
