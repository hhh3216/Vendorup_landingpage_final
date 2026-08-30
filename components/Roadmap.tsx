"use client";

import { useEffect, useState } from "react";
import styles from "./Roadmap.module.css";
import { stagger, useInViewOnce } from "@/lib/reveal";

type Item = {
  status: "now" | "wip";
  badge: string;
  title: React.ReactNode;
  body: string;
  note?: string;
};

const ROW_1: Item[] = [
  {
    status: "now",
    badge: "지금 이용 가능",
    title: (
      <>
        수·발주 ERP
        <br />+ AI 주문 자동전산화
      </>
    ),
    body: "카톡·문자로 온 주문을 읽어 품목코드로 맞추고, 담당자 승인을 거쳐 ERP에 등록합니다.",
  },
  {
    status: "wip",
    badge: "개발 중",
    title: "시세 변동 자동 반영",
    body: "야채·과일은 매일 시세가 바뀝니다. 시세를 받아 품목별 마진율에 맞춰 판매가를 자동으로 조정합니다.",
    note: "시세 데이터 출처: [확정 필요]",
  },
  {
    status: "wip",
    badge: "개발 중",
    title: "AI 재고 관리",
    body: "주문과 입고가 쌓이면 재고는 계산의 문제가 됩니다. 어떤 품목이 언제 부족해질지, 얼마나 발주해야 할지 알려드립니다.",
  },
];

const ROW_2: Item[] = [
  {
    status: "wip",
    badge: "개발 중",
    title: "배송기사 추적",
    body: "지금 어느 기사가 어디쯤 가고 있는지, 어떤 거래처에 도착했는지 확인할 수 있습니다.",
  },
  {
    status: "wip",
    badge: "개발 중",
    title: "AI 배송",
    body: "기사 수와 그날 나갈 배송지를 넣기만 하면, 기사별 배송 동선을 자동으로 짜드립니다.",
    note: "지도 서비스 연동이 필요해 별도 요금이 부과됩니다.",
  },
  {
    status: "wip",
    badge: "개발 중",
    title: "사진·캡처·전화 주문 인식",
    body: "손으로 쓴 발주서를 찍어 보내는 거래처, 전화로 부르는 거래처도 있습니다. 이것들도 자동으로 읽어내는 기능을 준비하고 있습니다.",
  },
];

/* 라인이 다 그려진 후 항목 카드가 스태거로 진입 (§4.7).
   --d-slow(800ms) 만큼 기다렸다가 카드 스태거를 시작한다. */
const LINE_MS = 800;

function Card({ item, delay, drawn }: { item: Item; delay: number; drawn: boolean }) {
  const isNow = item.status === "now";

  return (
    <div>
      {isNow ? (
        <div className={`${styles.lineFilled} ${drawn ? styles.drawn : ""}`} />
      ) : (
        /* 미채움 구간은 점선으로 처음부터 보인다 */
        <div className={styles.lineDashed} />
      )}

      <div style={{ ["--reveal-delay" as string]: `${delay}ms` }} data-reveal>
        <div className={styles.badgeWrap}>
          <div className={`${styles.badge} ${isNow ? styles.badgeNow : ""}`}>{item.badge}</div>
        </div>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardBody}>{item.body}</p>
        {item.note && <div className={styles.cardNote}>{item.note}</div>}
      </div>
    </div>
  );
}

export default function Roadmap() {
  const [lineRef, lineInView] = useInViewOnce<HTMLDivElement>();
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    if (lineInView) setDrawn(true);
  }, [lineInView]);

  return (
    <section className="section-pad" id="roadmap">
      <div className="eyebrow" data-reveal="sm">
        로드맵
      </div>
      <h2 className={styles.title} data-reveal>
        주문 입력은 <span className={styles.titleAccent}>시작</span>입니다.
      </h2>
      <p className={styles.lead} data-reveal>
        Vendor-UP은 도매 현장에서 사람 손이 가장 많이 가는 순서대로 자동화하고 있습니다.
      </p>

      <div className={`${styles.grid} ${styles.gridFirst}`} ref={lineRef}>
        {ROW_1.map((item, i) => (
          <Card key={item.badge + i} item={item} delay={LINE_MS + i * 70} drawn={drawn} />
        ))}
      </div>

      <div className={`${styles.grid} ${styles.gridSecond}`}>
        {ROW_2.map((item, i) => (
          <Card key={item.badge + i} item={item} delay={i * 70} drawn={drawn} />
        ))}
      </div>

      <div className={styles.closer} data-reveal style={stagger(1)}>
        지금 시작하시면, 나중에 나오는 기능도 <b>초기 파트너 조건 그대로</b> 쓰실 수 있습니다.
      </div>
    </section>
  );
}
