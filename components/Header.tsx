"use client";

import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import { smoothScrollTo } from "@/lib/reveal";

const NAV = [
  { label: "작동 원리", id: "how-it-works" },
  { label: "접수 방식", id: "channels" },
  { label: "요금", id: "pricing" },
  { label: "FAQ", id: "faq" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  /* §4.0 스크롤 0 → 8px 구간에서만 상태가 바뀐다.
     §8.2 페이지 전체에서 스크롤 이벤트 리스너는 이것 하나뿐. passive + rAF 스로틀. */
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // §8.3-10 scrollIntoView 금지 — scrollTo 스무스 스크롤
    smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 76);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <a className={styles.brand} href="#top" aria-label="Vendor-UP 홈">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo-mark.png" alt="" className={styles.brandMark} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo-wordmark.png" alt="Vendor-UP" className={styles.brandWord} />
      </a>

      <div className={styles.right}>
        <nav className={styles.nav} aria-label="주요 섹션">
          {NAV.map((item) => (
            <button key={item.id} className={styles.navLink} onClick={() => jump(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <button className={styles.cta} onClick={() => jump("apply")}>
          7일 무료로 시작하기
        </button>
      </div>
    </header>
  );
}
