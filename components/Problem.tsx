"use client";

import { useEffect, useState } from "react";
import styles from "./Problem.module.css";
import { stagger, useInViewOnce } from "@/lib/reveal";

/* 1번 카드 반복 아이콘: 좌→우 순차 등장, 각 90ms 간격 (§4.2) */
const ICON_STEP = 90;
const ICON_OPACITIES = [0.85, 0.5, 0.3, 0.18, 0.1];

function RepeatIcons() {
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (inView) setFired(true);
  }, [inView]);

  return (
    <div className={styles.repeatIcons} ref={ref} aria-hidden="true">
      {ICON_OPACITIES.map((opacity, i) => (
        <span
          key={i}
          className={`${styles.repeatIcon} ${styles.repeatIconAnimated} ${
            fired ? styles.iconIn : ""
          }`}
          style={{
            borderColor: `rgba(255,255,255,${opacity})`,
            ["--icon-delay" as string]: `${i * ICON_STEP}ms`,
          }}
        />
      ))}
      {/* 마지막 아이콘까지 들어온 뒤 아무것도 하지 않는다 — 반복 루프 금지 */}
    </div>
  );
}

export default function Problem() {
  return (
    <section className={`${styles.section} section-pad`} id="problem">
      {/* 다크 섹션 내부 요소는 y 거리 --y-lg */}
      <h2 className={styles.headline} data-reveal="lg">
        주문 하나에 손이 몇 번 갑니까?
      </h2>

      <p className={styles.lead} data-reveal="lg" style={stagger(1)}>
        읽고, 품목코드 찾고, 수량 옮겨 적고, ERP에 치고. 주문 한 건마다 이 과정을 사람이 반복합니다.
        <br />
        하루 수십, 수백 건이 쌓이면 문제는 여기서 시작됩니다.
      </p>

      <div className={styles.grid}>
        {/* 1번 카드 — 끝없는 반복 입력 */}
        <div className={styles.card} data-reveal="lg" style={stagger(2)}>
          <RepeatIcons />
          <div className={styles.cardTitle}>끝없는 반복 입력</div>
          <p className={styles.cardBody}>
            카톡을 열어 읽고, 우리 품목코드를 찾고, 수량을 옮겨 적고, ERP에 다시 칩니다. 주문 한 건에
            같은 동작이 네다섯 번. 머리를 쓰는 일이 아니라 <b>손이 버티는 일</b>이 됩니다.
          </p>
        </div>

        {/* 2·3번 카드 — 공통 규칙만 */}
        <div className={styles.card} data-reveal="lg" style={stagger(3)}>
          <div className={styles.typo} aria-hidden="true">
            <span className={styles.typoOld}>2</span>
            <span className={styles.typoNew}>20</span>
            <span className={styles.typoUnit}>박스</span>
          </div>
          <div className={styles.cardTitle}>오입력</div>
          <p className={styles.cardBody}>
            같은 작업을 수백 번 반복하면 눈이 흐려집니다. 2박스가 20박스로, 5단이 15단으로 바뀝니다.
            오입력은 담당자가 부주의해서가 아니라 <b>사람이 계속 옮겨 적기 때문에</b> 생깁니다.
          </p>
        </div>

        <div className={styles.card} data-reveal="lg" style={stagger(4)}>
          <div className={styles.bars} aria-hidden="true">
            <div className={styles.bar} style={{ width: 96, background: "rgba(255,255,255,.22)" }} />
            <div className={styles.bar} style={{ width: 132, background: "rgba(255,255,255,.16)" }} />
            <div className={styles.bar} style={{ width: 64, background: "rgba(255,255,255,.4)" }} />
          </div>
          <div className={styles.cardTitle}>주문 누락</div>
          <p className={styles.cardBody}>
            여러 거래처 주문이 한 채팅방, 한 문자함에 뒤섞여 있습니다. 손으로 하나씩 훑다 한 건을
            놓치면, 다음 날 배송 사고와 클레임으로 돌아옵니다.
          </p>
        </div>
      </div>

      {/* 섹션 마무리 한 줄: 카드보다 200ms 늦게, 단독으로 진입 (§4.2) */}
      <div
        className={styles.closer}
        data-reveal="lg"
        style={{ ["--reveal-delay" as string]: "200ms" }}
      >
        <span className={styles.closerAccent}>반복 입력이 남아 있는 한</span>, 오입력과 누락은 계속
        나옵니다.
      </div>
    </section>
  );
}
