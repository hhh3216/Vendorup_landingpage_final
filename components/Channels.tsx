"use client";

import { useEffect, useState } from "react";
import styles from "./Channels.module.css";
import { useInViewOnce } from "@/lib/reveal";

/* §4.5 카드 내부 단계는 80ms 간격으로 순차 등장 */
const NODE_STEP = 80;

type Node = { title: string; body: string; accent?: boolean };

const WAY_1: Node[] = [
  { title: "음식점이 카톡·문자로 주문", body: "받는 번호도, 방식도 지금과 같습니다" },
  {
    title: "도매업체가 Vendor-UP에 붙여넣기",
    body: "받은 주문 문장을 채팅창에 그대로 복사",
    accent: true,
  },
  { title: "품목·수량 추출 후 품목코드 매칭", body: "우리 회사 코드 기준으로 정리됩니다" },
  { title: "담당자가 확인하고 승인", body: "틀린 곳은 승인 전에 고치면 됩니다" },
  { title: "ERP 등록", body: "승인 즉시 전표로 반영됩니다" },
];

const WAY_2: Node[] = [
  {
    title: "음식점이 Vendor-UP 카톡으로 주문",
    body: "받는 번호만 Vendor-UP 채널로 바뀝니다",
    accent: true,
  },
  { title: "품목·수량 추출 후 품목코드 매칭", body: "붙여넣는 과정 없이 바로 정리됩니다" },
  { title: "담당자가 확인하고 승인", body: "틀린 곳은 승인 전에 고치면 됩니다" },
  { title: "ERP 등록", body: "승인 즉시 전표로 반영됩니다" },
];

function Flow({ nodes, fired, cyan }: { nodes: Node[]; fired: boolean; cyan?: boolean }) {
  return (
    <div className={styles.flow}>
      {nodes.map((node, i) => (
        <div
          key={node.title}
          className={`${styles.node} ${
            node.accent ? (cyan ? styles.nodeAccentCyan : styles.nodeAccent) : ""
          } ${styles.nodeAnimated} ${fired ? styles.nodeIn : ""}`}
          style={{ ["--node-delay" as string]: `${i * NODE_STEP}ms` }}
        >
          <div
            className={`${styles.nodeNo} ${
              node.accent ? (cyan ? styles.nodeNoAccentCyan : styles.nodeNoAccent) : ""
            }`}
          >
            {i + 1}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              className={`${styles.nodeTitle} ${
                node.accent ? (cyan ? styles.nodeTitleAccentCyan : styles.nodeTitleAccent) : ""
              }`}
            >
              {node.title}
            </div>
            <div className={styles.nodeBody}>{node.body}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Channels() {
  /* 두 카드의 플로우 애니메이션은 **동시에 시작**한다.
     그래서 관측 대상도 두 카드를 감싼 그리드 하나뿐이다. */
  const [gridRef, inView] = useInViewOnce<HTMLDivElement>();
  const [fired, setFired] = useState(false);

  useEffect(() => {
    if (inView) setFired(true);
  }, [inView]);

  return (
    <section className="section-pad" id="channels">
      <div className={styles.head}>
        <div className={styles.kicker} data-reveal="sm">
          주문 접수 모델
        </div>
        <h2 className={styles.title} data-reveal>
          주문은 어떻게
          <br />
          저희 쪽으로 들어오나요?
        </h2>
        <p className={styles.sub} data-reveal>
          두 가지 방식을 모두 지원합니다. 업체 사정에 맞는 쪽을 고르시면 됩니다.
        </p>
        <p className={styles.sub} data-reveal>
          <b>어느 쪽이든 음식점(거래처)은 하던 대로 카톡·문자로 주문을 보내면 됩니다.</b>
        </p>
      </div>

      {/* 두 카드 동시 진입 — 스태거 없음 */}
      <div className={styles.grid} ref={gridRef} data-reveal>
        <article className={styles.card}>
          <div className={styles.badge}>방식 1 · 거래처 번호도 그대로</div>
          <h3 className={styles.cardTitle}>
            도매업체가 받은 주문을
            <br />
            그대로 옮겨 붙이는 방식
          </h3>
          <p className={styles.cardBody}>
            도매업체가 지금처럼 자기 카톡·문자로 주문을 받되, 받은 내용을 Vendor-UP 채팅창에 그대로
            복사해 붙여넣습니다.
          </p>

          <Flow nodes={WAY_1} fired={fired} />

          <div className={styles.foot}>
            <div className={styles.footInner}>
              <div className={styles.footTitle}>번호도, 받는 방식도 완전히 그대로입니다.</div>
              <div className={styles.footNote}>도매업체만 저희 채팅창에 붙여넣으면 됩니다.</div>
            </div>
          </div>
        </article>

        <article className={styles.card}>
          <div className={`${styles.badge} ${styles.badgeCyan}`}>방식 2 · 추가 입력조차 없이</div>
          <h3 className={styles.cardTitle}>
            음식점이 Vendor-UP 카톡으로
            <br />
            직접 보내는 방식
          </h3>
          <p className={styles.cardBody}>
            음식점이 평소처럼 카톡·문자로 주문을 보내되, 받는 곳이 Vendor-UP 채널입니다. 정리된
            주문을 도매업체에 전달합니다.
          </p>

          <Flow nodes={WAY_2} fired={fired} cyan />

          <div className={styles.foot}>
            <div className={`${styles.footInner} ${styles.footInnerCyan}`}>
              <div className={styles.footTitle}>
                번호는 Vendor-UP으로 바뀌지만, 여전히 카톡·문자입니다.
              </div>
              <div className={`${styles.footNote} ${styles.footNoteCyan}`}>
                앱 설치도, 새 양식도 없습니다.
              </div>
            </div>
          </div>
        </article>
      </div>

      <p className={styles.closer} data-reveal="sm">
        두 방식 모두 음식점 쪽에는 새로운 걸 요구하지 않습니다. 차이는{" "}
        <b>&ldquo;누가 Vendor-UP에 원문을 전달하느냐&rdquo;</b>뿐입니다.
      </p>
    </section>
  );
}
