"use client";

import styles from "./Impact.module.css";
import { stagger } from "@/lib/reveal";

/* =============================================================
   도입 효과 — 자체 산출 추정치
   -------------------------------------------------------------
   ⚠️ 아직 실고객 실측 데이터가 없다. 아래 ASSUMPTIONS 하나만 고치면
   화면의 세 숫자와 각주가 전부 따라 움직인다. 실제 운영 데이터가
   쌓이면 이 상수를 실측치로 교체하고, 각주의 "자체 산출 기준"을
   "고객사 실측" 문구로 바꾸면 된다.

   숫자를 화면에 하드코딩하지 말 것 — 가정과 결과가 어긋나는 순간
   각주가 거짓말이 된다.
   ============================================================= */
const ASSUMPTIONS = {
  /** 주문 1건에 들어 있는 평균 품목 수 */
  itemsPerOrder: 10,
  /** 수기 입력 시 품목 1개당 소요 — 품목 찾기 + 수량 입력 + 확인 */
  secPerItemManual: 25,
  /** Vendor-UP 사용 시 주문 1건당 소요 — 붙여넣기 + 결과 확인 */
  secPerOrderVendorup: 15,
  /** 도매업체 1곳의 하루 평균 주문 건수 */
  ordersPerDay: 50,
  /** 월 영업일 */
  workdaysPerMonth: 26,
  /** 인건비 환산 시급 */
  wonPerHour: 12_000,
};

const A = ASSUMPTIONS;

const manualSecPerOrder = A.itemsPerOrder * A.secPerItemManual;
const savedSecPerOrder = manualSecPerOrder - A.secPerOrderVendorup;
const cutPercent = Math.round((savedSecPerOrder / manualSecPerOrder) * 100);
const savedHoursPerYear =
  (savedSecPerOrder * A.ordersPerDay * A.workdaysPerMonth * 12) / 3600;
const savedWonPerYear = savedHoursPerYear * A.wonPerHour;

/** 추정치를 1,018시간처럼 보여주면 실측치로 오해된다. 유효 자리에서 끊는다. */
const roundTo = (value: number, unit: number) => Math.round(value / unit) * unit;

const STATS = [
  {
    value: `${cutPercent}%`,
    accent: "violet" as const,
    label: "주문 1건 입력 시간 감소",
    detail: `${Math.round(manualSecPerOrder / 60)}분 ${manualSecPerOrder % 60}초 → ${A.secPerOrderVendorup}초`,
  },
  {
    value: `${roundTo(savedHoursPerYear, 100).toLocaleString("ko-KR")}시간`,
    accent: "cyan" as const,
    label: "연간 수기 입력에서 사라지는 시간",
    detail: `하루 ${A.ordersPerDay}건 주문 기준`,
  },
  {
    value: `${roundTo(savedWonPerYear / 10_000, 100).toLocaleString("ko-KR")}만원`,
    accent: "violet" as const,
    label: "연간 절감액 (인건비 환산)",
    detail: `시급 ${A.wonPerHour.toLocaleString("ko-KR")}원 기준`,
  },
];

export default function Impact() {
  return (
    <section className="section-pad" id="impact">
      <h2 className="h2" data-reveal>
        <span className={styles.brand}>Vendor-UP</span>이{" "}
        <span className={styles.titleAccent}>아껴드리는</span> 시간과 비용
      </h2>
      <p className={styles.lead} data-reveal style={stagger(1)}>
        품목 {A.itemsPerOrder}개짜리 주문 하나를 사람이 치면 {Math.round(manualSecPerOrder / 60)}분이
        넘게 걸립니다. Vendor-UP은 붙여넣고 확인하는 {A.secPerOrderVendorup}초로 끝납니다.
      </p>

      <div className={styles.grid}>
        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={styles.card}
            data-reveal
            style={stagger(i + 2)}
          >
            <div className={styles.valueWrap}>
              <span className={styles.value}>{stat.value}</span>
              <span
                className={`${styles.underline} ${
                  stat.accent === "cyan" ? styles.underlineCyan : ""
                }`}
                aria-hidden="true"
              />
            </div>
            <div className={styles.label}>{stat.label}</div>
            <div className={styles.detail}>{stat.detail}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
