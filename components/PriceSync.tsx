"use client";

import { useState } from "react";
import styles from "./PriceSync.module.css";
import { stagger } from "@/lib/reveal";

/* =============================================================
   원가 연동 판매가 자동 조정
   -------------------------------------------------------------
   상품 원가가 바뀌면 그 상품을 파는 거래처들의 판매가를
   각 거래처의 마진 정책대로 다시 계산한다.
   이 섹션의 요점은 "자동 계산"이 아니라 "적용 전에 보고 고른다" 다.
   그래서 토글이 실제로 동작하고, 끈 거래처는 값이 그대로 남는다.
   ============================================================= */
const PRODUCT = "사과 10kg";
/** 바뀌는 건 이 상품의 원가 하나뿐이다. 거래처마다 다른 건 원가가 아니라 마진 정책이다. */
const OLD_COST = 10_000;
const NEW_COST = 12_000;

type Policy =
  | { kind: "rate"; value: number } // 원가 대비 비율
  | { kind: "flat"; value: number }; // 원가 + 고정 이익금

type Client = { name: string; policy: Policy };

const CLIENTS: Client[] = [
  { name: "A식당", policy: { kind: "rate", value: 0.2 } },
  { name: "B식당", policy: { kind: "flat", value: 3_000 } },
  { name: "C식당", policy: { kind: "rate", value: 0.25 } },
];

/** 기본값을 "전체 ON"으로 두면 선택할 수 있다는 게 안 보인다. 하나는 꺼 둔다. */
const DEFAULT_APPLIED = [true, true, false];

const priceOf = (policy: Policy, cost: number) =>
  policy.kind === "rate" ? Math.round(cost * (1 + policy.value)) : cost + policy.value;

const policyLabel = (policy: Policy) =>
  policy.kind === "rate"
    ? `마진율 ${Math.round(policy.value * 100)}%`
    : `고정 이익 ${policy.value.toLocaleString("ko-KR")}원`;

const won = (n: number) => `${n.toLocaleString("ko-KR")}원`;

export default function PriceSync() {
  const [applied, setApplied] = useState<boolean[]>(DEFAULT_APPLIED);

  const toggle = (i: number) =>
    setApplied((prev) => prev.map((on, idx) => (idx === i ? !on : on)));

  const allOn = applied.every(Boolean);
  const appliedCount = applied.filter(Boolean).length;

  return (
    <section className="section-pad" id="price-sync">
      <h2 className="h2" data-reveal>
        상품 원가가 오르면, 판매가도 <span className={styles.titleAccent}>마진 그대로</span> 따라
        오릅니다.
      </h2>
      <p className={styles.lead} data-reveal style={stagger(1)}>
        사과 원가가 오르면, 사과를 파는 거래처들의 판매가가 각자 정해둔 마진에 맞춰 한 번에 다시
        계산됩니다. 거래처마다 마진율로 받는 곳도, 고정 이익금으로 받는 곳도 있는데 그 차이를 그대로
        반영합니다. 다만 <b>바로 바꾸지는 않습니다.</b> 적용할 거래처를 고르고, 바뀔 가격을 먼저
        확인한 다음 적용합니다.
      </p>

      <div className={styles.panel} data-reveal style={stagger(2)}>
        <div className={styles.costBar}>
          <div className={styles.costLabel}>{PRODUCT} · 상품 원가 인상</div>
          <div className={styles.costValues}>
            <span className={styles.costOld}>{won(OLD_COST)}</span>
            <span className={styles.costArrow} aria-hidden="true">
              →
            </span>
            <span className={styles.costNew}>{won(NEW_COST)}</span>
          </div>
        </div>

        <div className={styles.toolbar}>
          <span className={styles.toolbarText}>
            전체 거래처 적용
            <span className={styles.toolbarCount}>
              {appliedCount}/{CLIENTS.length}곳 선택됨
            </span>
          </span>
          <button
            type="button"
            className={styles.toolbarBtn}
            onClick={() => setApplied(CLIENTS.map(() => !allOn))}
          >
            {allOn ? "전체 해제" : "전체 선택"}
          </button>
        </div>

        <div className={styles.table} role="table">
          <div className={`${styles.row} ${styles.headRow}`} role="row">
            <div className={styles.thName} role="columnheader">
              거래처
            </div>
            <div className={styles.thPolicy} role="columnheader">
              마진 정책
            </div>
            <div className={styles.thNow} role="columnheader">
              지금 판매가
            </div>
            <div className={styles.thNext} role="columnheader">
              적용 후
            </div>
            <div className={styles.thToggle} role="columnheader">
              적용
            </div>
          </div>

          {CLIENTS.map((client, i) => {
            const current = priceOf(client.policy, OLD_COST);
            const next = priceOf(client.policy, NEW_COST);
            const on = applied[i];

            return (
              <div key={client.name} className={`${styles.row} ${styles.bodyRow}`} role="row">
                <div className={styles.name} role="cell">
                  {client.name}
                </div>
                <div className={styles.policy} role="cell" data-col="마진 정책">
                  {policyLabel(client.policy)}
                </div>
                <div className={styles.now} role="cell" data-col="지금 판매가">
                  {won(current)}
                </div>
                <div
                  className={`${styles.next} ${on ? styles.nextOn : styles.nextOff}`}
                  role="cell"
                  data-col="적용 후"
                >
                  {won(on ? next : current)}
                  {on && <span className={styles.delta}>+{won(next - current)}</span>}
                </div>
                <div className={styles.toggleCell} role="cell">
                  <button
                    type="button"
                    className={`${styles.toggle} ${on ? styles.toggleOn : ""}`}
                    role="switch"
                    aria-checked={on}
                    aria-label={`${client.name} 가격 변경 적용`}
                    onClick={() => toggle(i)}
                  >
                    <span className={styles.knob} aria-hidden="true" />
                    <span className={styles.toggleText}>{on ? "ON" : "OFF"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.foot}>
          <span className={styles.footNote}>
            토글을 눌러보세요. 끈 거래처는 지금 가격 그대로 둡니다.
          </span>
          <span className={styles.footCta} aria-hidden="true">
            확인 후 {appliedCount}곳 적용
          </span>
        </div>
      </div>

      <div className={styles.steps}>
        {["원가 변경", "거래처별 새 판매가 자동 계산", "변경 전/후 비교 확인", "최종 적용"].map(
          (step, i) => (
            <div key={step} className={styles.step} data-reveal="sm" style={stagger(i)}>
              <span className={styles.stepNo}>{i + 1}</span>
              <span className={styles.stepText}>{step}</span>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
