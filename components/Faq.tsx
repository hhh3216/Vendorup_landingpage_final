"use client";

import { useId, useState } from "react";
import styles from "./Faq.module.css";

/* 답변 카피는 기획서 `uploads/LandingPage_v3.md` §9 기준.
   3번 답변에서 "확신이 낮은 항목 표시" 문구는 뺐다 — 시안에서 확신도 열을
   제거하기로 확정했기 때문이다(chat1: "확신도 확인 필요 이런 거 다 빼줘"). */
const FAQ = [
  {
    q: "거래처도 뭔가 새로 설치해야 하나요?",
    a: "아니요. 거래처는 지금 하던 그대로 카톡·문자로 주문을 보내면 됩니다. 앱을 깔거나 새 양식을 배울 필요가 없습니다. 방식 2를 택하시면 거래처가 카톡에 채널 하나를 추가하는 정도이고, 방식 1을 택하시면 그것조차 없습니다.",
  },
  {
    q: "ERP는 어떻게 되나요? 기존에 쓰던 ERP를 계속 써야 하나요?",
    a: "Vendor-UP은 자체 수·발주 ERP를 제공하며, 기존에 쓰시던 ERP를 대체하는 형태로 도입됩니다. 비정형 주문 자동화가 처음부터 그 안에 들어 있습니다. 기존 ERP에 있던 데이터는 초기 세팅 과정에서 이관을 도와드립니다.",
  },
  {
    q: "AI가 잘못 읽으면 어떡하죠?",
    a: "정리된 주문은 담당자 확인 화면을 먼저 거칩니다. 승인 전에 화면에서 바로 고칠 수 있고, 승인하지 않으면 ERP에 등록되지 않습니다.",
  },
  {
    q: "품목 이름을 거래처마다 다르게 부르는데요.",
    a: "거래처별 호칭을 우리 회사 품목코드에 한 번 연결해두면, 이후로는 알아서 매칭합니다. 쓸수록 정확해집니다.",
  },
  {
    q: "사진이나 캡처, 전화로 온 주문도 처리되나요?",
    a: "현재는 텍스트 주문을 처리합니다. 사진·캡처 인식과 전화 주문 처리는 준비 중이며, 추후 제공 예정입니다.",
  },
  {
    q: "주문 데이터가 밖으로 새지 않나요?",
    a: "거래처·단가 정보는 업체의 핵심 자산입니다. Vendor-UP에 들어온 데이터는 외부로 제공되지 않으며, 외부 AI 학습에 사용되지 않습니다. 상세 보안 정책(암호화 방식, 저장 위치, 접근 권한)은 곧 별도 페이지로 공개합니다.",
  },
];

export default function Faq() {
  /* 첫 항목만 펼친 상태로 시작.
     아코디언은 배타적이지 않다 — 여러 개 동시 펼침 허용 (§4.9). */
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const baseId = useId();

  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
    // 펼칠 때 자동 스크롤 하지 않는다 (scrollIntoView 사용 금지 — §4.9)
  };

  return (
    <section className={styles.section} id="faq">
      <h2 className={styles.title} data-reveal>
        자주 묻는 질문
      </h2>

      {/* 진입 애니메이션은 아코디언 전체 블록 단위로 1회 */}
      <div data-reveal>
        {FAQ.map((item, i) => {
          const isOpen = open.has(i);
          const panelId = `${baseId}-panel-${i}`;
          const buttonId = `${baseId}-button-${i}`;

          return (
            <div key={item.q} className={`${styles.item} ${isOpen ? styles.open : ""}`}>
              <button
                id={buttonId}
                className={styles.trigger}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
              >
                <span className={styles.q}>{item.q}</span>
                <span className={styles.icon} aria-hidden="true">
                  <span className={styles.bar} />
                  <span className={`${styles.bar} ${styles.barV}`} />
                </span>
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`${styles.panel} ${isOpen ? styles.panelOpen : ""}`}
              >
                <div className={styles.panelInner}>
                  <p className={styles.a}>{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div className={styles.tail} />
      </div>
    </section>
  );
}
