"use client";

import { useState } from "react";
import styles from "./PriceSync.module.css";
import { stagger } from "@/lib/reveal";

/* =============================================================
   원가 연동 판매가 자동 조정
   -------------------------------------------------------------
   주인공은 "상품"이다. 과일은 매일 시세가 바뀌고, 상품마다 마진이
   정해져 있으니 원가가 움직이면 판매가도 그 마진 그대로 따라간다.
   거래처는 보조다 — 이번 변경을 받을지 말지만 고른다.

   가격을 손으로 적지 않는다. 마진 정책에서 계산해야 원가를 바꿔도
   표의 숫자가 어긋나지 않는다.
   ============================================================= */
type Margin =
  | { kind: "rate"; value: number } // 원가 대비 비율
  | { kind: "flat"; value: number }; // 원가 + 고정 이익금

type Product = {
  name: string;
  margin: Margin;
  /** 시세가 움직인 폭 */
  oldCost: number;
  newCost: number;
};

const PRODUCTS: Product[] = [
  { name: "사과 10kg", margin: { kind: "rate", value: 0.2 }, oldCost: 10_000, newCost: 12_000 },
  { name: "배 10kg", margin: { kind: "rate", value: 0.25 }, oldCost: 20_000, newCost: 22_000 },
  { name: "수박 1통", margin: { kind: "flat", value: 3_000 }, oldCost: 8_000, newCost: 9_500 },
];

const CLIENTS = ["A식당", "B식당", "C식당"];

/** 전체 ON으로 두면 "고를 수 있다"는 게 안 보인다. 하나는 꺼 둔다. */
const DEFAULT_APPLIED = [true, true, false];

const priceOf = (margin: Margin, cost: number) =>
  margin.kind === "rate" ? Math.round(cost * (1 + margin.value)) : cost + margin.value;

const marginLabel = (margin: Margin) =>
  margin.kind === "rate"
    ? `마진율 ${Math.round(margin.value * 100)}%`
    : `고정 이익 ${margin.value.toLocaleString("ko-KR")}원`;

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

function Shift({ before, after, strong }: { before: number; after: number; strong?: boolean }) {
  return (
    <span className={styles.shift}>
      <span className={styles.before}>{won(before)}</span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
      <span className={strong ? styles.afterStrong : styles.after}>{won(after)}</span>
    </span>
  );
}

export default function PriceSync() {
  const [applied, setApplied] = useState<boolean[]>(DEFAULT_APPLIED);

  const toggle = (i: number) =>
    setApplied((prev) => prev.map((on, idx) => (idx === i ? !on : on)));

  const allOn = applied.every(Boolean);
  const appliedCount = applied.filter(Boolean).length;

  return (
    <section className="section-pad" id="price-sync">
      <h2 className={`h2 ${styles.title}`} data-reveal>
        시세는 매일 바뀝니다. 판매가는 <span className={styles.titleAccent}>
          <span className={styles.brand}>Vendor-UP</span> AI
        </span>가
        조정합니다.
      </h2>
      <p className={styles.lead} data-reveal style={stagger(1)}>
        야채·과일은 매일 시세가 바뀝니다. 상품마다 남길 마진을 한 번 정해두면, 원가가 움직일 때
        판매가가 그 마진 그대로 다시 계산됩니다. 다만 <b>바로 바꾸지는 않습니다.</b> 바뀔 가격을
        먼저 확인하고, 적용할 거래처를 고른 다음 적용합니다.
      </p>

      <div className={styles.panel} data-reveal style={stagger(2)}>
        <div className={styles.costBar}>
          <div className={styles.costLabel}>오늘 시세 반영</div>
          <div className={styles.costCount}>원가 변경 {PRODUCTS.length}건</div>
        </div>

        <div className={styles.table} role="table">
          <div className={`${styles.row} ${styles.headRow}`} role="row">
            <div role="columnheader">상품</div>
            <div role="columnheader">마진</div>
            <div role="columnheader">원가</div>
            <div role="columnheader">판매가</div>
          </div>

          {PRODUCTS.map((product) => (
            <div key={product.name} className={`${styles.row} ${styles.bodyRow}`} role="row">
              <div className={styles.name} role="cell">
                {product.name}
              </div>
              <div className={styles.margin} role="cell" data-col="마진">
                {marginLabel(product.margin)}
              </div>
              <div className={styles.cost} role="cell" data-col="원가">
                <Shift before={product.oldCost} after={product.newCost} />
              </div>
              <div className={styles.price} role="cell" data-col="판매가">
                <Shift
                  before={priceOf(product.margin, product.oldCost)}
                  after={priceOf(product.margin, product.newCost)}
                  strong
                />
              </div>
            </div>
          ))}
        </div>

        {/* 거래처는 보조 — 이번 변경을 받을지 말지만 고른다 */}
        <div className={styles.clients}>
          <div className={styles.clientsHead}>
            <span className={styles.clientsTitle}>적용할 거래처</span>
            <button
              type="button"
              className={styles.clientsAll}
              onClick={() => setApplied(CLIENTS.map(() => !allOn))}
            >
              {allOn ? "전체 해제" : "전체 선택"}
            </button>
          </div>

          <div className={styles.chips}>
            {CLIENTS.map((client, i) => (
              <button
                key={client}
                type="button"
                className={`${styles.chip} ${applied[i] ? styles.chipOn : ""}`}
                role="switch"
                aria-checked={applied[i]}
                onClick={() => toggle(i)}
              >
                <span className={styles.knob} aria-hidden="true" />
                {client}
                <span className={styles.chipState}>{applied[i] ? "ON" : "OFF"}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.foot}>
          <span className={styles.footNote}>끈 거래처는 지금 가격 그대로 둡니다.</span>
          <span className={styles.footCta} aria-hidden="true">
            확인 후 {appliedCount}곳 적용
          </span>
        </div>
      </div>

      <div className={styles.steps}>
        {[
          "시세 변동으로 원가 변경",
          "상품 마진대로 판매가 자동 계산",
          "변경 전/후 비교 확인",
          "적용할 거래처 선택 후 적용",
        ].map((step, i) => (
          <div key={step} className={styles.step} data-reveal="sm" style={stagger(i)}>
            <span className={styles.stepNo}>{i + 1}</span>
            <span className={styles.stepText}>{step}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
