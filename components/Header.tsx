"use client";

import { useState } from "react";
import styles from "./Header.module.css";
import InquiryModal from "./InquiryModal";
import { smoothScrollTo } from "@/lib/reveal";

const NAV = [
  { label: "작동 원리", id: "how-it-works" },
  { label: "접수 방식", id: "channels" },
  { label: "요금", id: "pricing" },
  { label: "FAQ", id: "faq" },
];

export default function Header() {
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // §8.3-10 scrollIntoView 금지 — scrollTo 스무스 스크롤
    smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 56);
  };

  return (
    <header className={styles.header}>
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
        <button className={styles.ctaGhost} onClick={() => setInquiryOpen(true)}>
          문의하기
        </button>
        <button className={styles.cta} onClick={() => jump("apply")}>
          지금 시작하기
        </button>
      </div>

      <InquiryModal open={inquiryOpen} onClose={() => setInquiryOpen(false)} />
    </header>
  );
}
