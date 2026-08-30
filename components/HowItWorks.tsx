"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./HowItWorks.module.css";
import { STEPS } from "./StepCards";
import { smoothScrollTo, stagger, useIsMobile } from "@/lib/reveal";

/* =============================================================
   §4.4 작동 원리 5스텝(시안은 6스텝) — 토스식 sticky 전환

   활성 스텝 인덱스는 트랙별 IntersectionObserver로 계산한다.
   스크롤 이벤트 + 계산식보다 IO가 훨씬 안정적이고 가볍다 (§4.4).
   빠르게 스크롤해서 스텝이 건너뛰어져도 정상 동작이다 — 하이재킹 없음.
   ============================================================= */
const TRACK_IO: IntersectionObserverInit = {
  rootMargin: "-45% 0px -45% 0px",
  threshold: 0,
};

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [stackedIn, setStackedIn] = useState<Set<number>>(new Set());
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const isMobile = useIsMobile();

  /* §7 모바일: sticky 해제 + 카드마다 공통 진입 규칙(§3). 1회성. */
  useEffect(() => {
    if (!isMobile) return;
    const nodes = cardRefs.current.filter((n): n is HTMLElement => Boolean(n));
    if (!nodes.length) return;

    const io = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.card);
          setStackedIn((prev) => new Set(prev).add(index));
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -12% 0px" },
    );

    for (const node of nodes) io.observe(node);
    return () => io.disconnect();
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) return; // §7 모바일은 sticky 전환 자체를 쓰지 않는다
    const nodes = trackRefs.current.filter((n): n is HTMLDivElement => Boolean(n));
    if (!nodes.length) return;

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const index = Number((entry.target as HTMLElement).dataset.index);
        if (!Number.isNaN(index)) setActive(index);
      }
    }, TRACK_IO);

    for (const node of nodes) io.observe(node);
    return () => io.disconnect();
  }, [isMobile]);

  /* 좌측 스텝을 누르면 해당 트랙으로 이동. 스크롤 하이재킹이 아니라
     사용자가 명시적으로 요청한 이동이므로 스무스 스크롤을 쓴다. */
  const jumpToStep = (index: number) => {
    const track = trackRefs.current[index];
    if (!track) return;
    smoothScrollTo(track.getBoundingClientRect().top + window.scrollY - 120);
  };

  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.grid}>
        {/* --- 좌측: sticky --- */}
        <div className={styles.left}>
          <h2 className={styles.title} data-reveal>
            어떻게 되는 건가요?
          </h2>

          <div className={styles.stepList}>
            {STEPS.map((step, i) => (
              <button
                key={step.no}
                className={`${styles.stepItem} ${i === active ? styles.stepActive : ""}`}
                onClick={() => jumpToStep(i)}
                aria-current={i === active ? "step" : undefined}
              >
                <span className={styles.tick} aria-hidden="true" />
                <span className={styles.stepText}>
                  <span className={styles.stepNo}>{step.no}</span>
                  <span className={styles.stepTitle}>{step.title}</span>
                </span>
              </button>
            ))}
          </div>

          <div className={styles.note}>
            스크롤에 따라 좌측 스텝이 하나씩 활성화됩니다.
          </div>
        </div>

        {/* --- 우측: 스크롤에 따라 교체 --- */}
        <div className={styles.right} style={{ ["--steps" as string]: STEPS.length }}>
          {/* 트랙: 스텝당 100vh. 관측 전용이라 아무것도 그리지 않는다. */}
          <div className={styles.tracks} aria-hidden="true">
            {STEPS.map((step, i) => (
              <div
                key={step.no}
                className={styles.track}
                data-index={i}
                ref={(el) => {
                  trackRefs.current[i] = el;
                }}
              />
            ))}
          </div>

          <div className={styles.stage}>
            {STEPS.map((step, i) => {
              const { Visual } = step;
              const state = isMobile
                ? styles.cardActive
                : i === active
                  ? styles.cardActive
                  : i < active
                    ? styles.cardPast
                    : "";

              return (
                <article
                  key={step.no}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  data-card={i}
                  className={`${styles.card} ${state} ${styles.cardStacked} ${
                    stackedIn.has(i) ? styles.stackedIn : ""
                  }`}
                  aria-hidden={!isMobile && i !== active}
                  style={stagger(i)}
                >
                  <div className={styles.cardNo}>STEP {step.no}</div>
                  <h3 className={styles.cardTitle}>{step.title}</h3>
                  <p className={styles.cardBody}>{step.body}</p>
                  <div className={styles.cardVisual}>
                    <Visual />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
