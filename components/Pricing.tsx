"use client";

import styles from "./Pricing.module.css";
import { smoothScrollTo, useIsMobile } from "@/lib/reveal";

type Feature = { label: string; on: boolean; strong?: boolean };

const FEATURES = [
  "수·발주 ERP",
  "AI 주문 자동전산화",
  "AI 재고 관리",
  "시세 변동 자동 반영",
  "배송기사 추적",
] as const;

const make = (onCount: number, strongIndex?: number): Feature[] =>
  FEATURES.map((label, i) => ({ label, on: i < onCount, strong: i === strongIndex }));

const BONUS = [
  { title: "품목코드 초기 세팅 대행", body: "고객사 품목 리스트를 받아 매칭 기준을 함께 잡아드립니다" },
  { title: "카톡·문자 주문 채널 연동 설정", body: "설정은 저희가 합니다" },
  { title: "7일 무료 체험", body: "카드 등록 없이" },
  { title: "전담 담당자 직통 상담", body: "초기 파트너 기간 동안" },
];

/* §4.8 가운데 AI ORDER부터 진입 → 좌우가 --stagger 뒤에 따라온다.
   주력 플랜에 시선이 먼저 가야 한다.
   §7 모바일에서는 AI ORDER가 맨 위로 가므로 스태거 순서도 위→아래가 된다. */
const STAGGER = 70;

function Features({ items }: { items: Feature[] }) {
  return (
    <>
      {items.map((f) => (
        <div key={f.label} className={`${styles.feature} ${f.on ? "" : styles.featureOff}`}>
          <span className={f.strong ? styles.featureStrong : undefined}>{f.label}</span>
          <span className={f.on ? styles.on : undefined}>{f.on ? "포함" : "—"}</span>
        </div>
      ))}
    </>
  );
}

export default function Pricing() {
  const isMobile = useIsMobile();

  // 데스크탑: 가운데(0) → 좌우(70ms) / 모바일: AI ORDER(0) → BASIC(70) → INVENTORY(140)
  const delay = {
    basic: isMobile ? STAGGER : STAGGER,
    main: 0,
    inventory: isMobile ? STAGGER * 2 : STAGGER,
  };

  const goToApply = () => {
    const el = document.getElementById("apply");
    if (el) smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 56);
  };

  return (
    <section className={`${styles.section} section-pad`} id="pricing">
      <div className={styles.head}>
        <h2 className="h2" data-reveal>
          Vendor-UP 요금 안내
        </h2>
        <p className={styles.sub} data-reveal style={{ ["--reveal-delay" as string]: "70ms" }}>
          초기 파트너 한정 · 정가 대비 <b>월 40,000원 할인</b>
        </p>
        <div className={styles.urgency} data-reveal="sm" style={{ ["--reveal-delay" as string]: "140ms" }}>
          초기 파트너 10개사 마감 시 종료
        </div>
      </div>

      <div className={styles.grid}>
        {/* BASIC — 나머지 플랜은 --d-enter */}
        <div
          className={styles.plan}
          data-reveal
          style={{ ["--reveal-delay" as string]: `${delay.basic}ms` }}
        >
          <div className={styles.planName}>BASIC</div>
          <div className={styles.planDesc}>수·발주 업무를 시스템으로</div>
          <div className={styles.listPrice}>89,000원/월</div>
          <div className={styles.price}>
            49,000원<span className={styles.per}>/월</span>
          </div>
          <div className={styles.avail}>바로 이용 가능</div>
          <div className={styles.rule} />
          <div className={styles.features}>
            <Features items={make(1)} />
          </div>
        </div>

        {/* AI ORDER — 주력 플랜. --d-slow 로 가장 먼저 진입한다. */}
        <div
          className={`${styles.plan} ${styles.planMain}`}
          data-reveal
          data-reveal-slow
          style={{ ["--reveal-delay" as string]: `${delay.main}ms` }}
        >
          <div className={styles.mainHead}>
            <div className={`${styles.planName} ${styles.planNameMain}`}>AI ORDER</div>
            {/* 카드와 함께 등장 — 뱃지 단독 팝인 없음 */}
            <span className={styles.recommend}>추천</span>
          </div>
          <div className={styles.planDescMain}>주문 입력을 AI가 대신</div>
          <div className={`${styles.listPrice} ${styles.listPriceMain}`}>129,000원/월</div>
          <div className={`${styles.price} ${styles.priceMain}`}>
            89,000원<span className={`${styles.per} ${styles.perMain}`}>/월</span>
          </div>
          <div className={`${styles.avail} ${styles.availMain}`}>바로 이용 가능</div>
          <div className={`${styles.rule} ${styles.ruleMain}`} />
          <div className={`${styles.features} ${styles.featuresMain}`}>
            <Features items={make(2, 1)} />
          </div>
          <button className={styles.planCta} onClick={goToApply}>
            무료로 시작하기
          </button>
        </div>

        {/* AI INVENTORY */}
        <div
          className={styles.plan}
          data-reveal
          style={{ ["--reveal-delay" as string]: `${delay.inventory}ms` }}
        >
          <div className={styles.planName}>AI INVENTORY</div>
          <div className={styles.planDesc}>재고·시세·배송까지</div>
          <div className={styles.listPrice}>169,000원/월</div>
          <div className={styles.price}>
            129,000원<span className={styles.per}>/월</span>
          </div>
          <div className={styles.avail}>3~6개월 내 출시 예정</div>
          <div className={styles.rule} />
          <div className={styles.features}>
            <Features items={make(5)} />
          </div>
        </div>
      </div>

      <div className={styles.footnote} data-reveal="sm">
        AI 배송(배송 동선 자동 세팅)은 지도 서비스 연동 비용이 발생해 플랜과 별개로 추가
        과금됩니다 · 기능은 지속적으로 개선됩니다
      </div>

      <div className={styles.bonus} data-reveal>
        <div className={styles.bonusTitle}>함께 드리는 것</div>
        <div className={styles.bonusGrid}>
          {BONUS.map((item, i) => (
            <div
              key={item.title}
              className={styles.bonusItem}
              data-reveal="sm"
              /* 가치 스택 체크리스트: 항목당 60ms 스태거 */
              style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}
            >
              <span className={styles.check} aria-hidden="true">
                ✓
              </span>
              <div className={styles.bonusText}>
                <b>{item.title}</b> — {item.body}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.bonusRule} />
        <div className={styles.bonusFoot}>
          7일 무료. 카드 등록 없이 시작하고, 안 맞으면 그냥 안 쓰시면 됩니다.
          <br />
          <span className={styles.bonusFootMuted}>
            약정도 없습니다. 월 단위로 언제든 중단하실 수 있습니다.
          </span>
        </div>
      </div>
    </section>
  );
}
