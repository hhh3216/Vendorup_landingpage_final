"use client";

import { useEffect, useState } from "react";
import styles from "./SideRail.module.css";
import { smoothScrollTo } from "@/lib/reveal";

const SECTIONS = [
  { id: "problem", label: "문제" },
  { id: "solution", label: "해결" },
  { id: "how-it-works", label: "작동 원리" },
  { id: "channels", label: "접수 방식" },
  { id: "demo", label: "라이브 데모" },
  { id: "roadmap", label: "로드맵" },
  { id: "pricing", label: "요금" },
  { id: "faq", label: "FAQ" },
];

export default function SideRail() {
  const [active, setActive] = useState<string | null>(null);

  /* 활성 섹션 판정도 IO로. 스크롤 이벤트를 추가로 붙이지 않는다 (§8.2).
     여기서는 위아래로 오갈 때 계속 갱신돼야 하므로 unobserve 하지 않는다 —
     §3의 1회성 규칙은 "진입 애니메이션"에 대한 것이고, 이건 내비게이션 상태다. */
  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!els.length) return;

    const visible = new Map<string, number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        // 화면을 가장 많이 차지한 섹션을 활성으로
        let best: string | null = null;
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        setActive(best);
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.9], rootMargin: "-76px 0px -40% 0px" },
    );

    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <nav className={styles.rail} aria-label="페이지 섹션">
      {SECTIONS.map((section, i) => {
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            className={`${styles.item} ${isActive ? styles.active : ""}`}
            aria-current={isActive ? "true" : undefined}
            onClick={() => {
              const el = document.getElementById(section.id);
              if (el) smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 76);
            }}
          >
            <span className={styles.marker}>
              <span className={styles.dot} />
              {i < SECTIONS.length - 1 && <span className={styles.stem} />}
            </span>
            <span className={styles.label}>{section.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
