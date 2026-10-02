"use client";

import styles from "./TopBanner.module.css";
import { smoothScrollTo } from "@/lib/reveal";

/* =============================================================
   최상단 모집 배너
   -------------------------------------------------------------
   sticky 가 아니다 — 헤더(56px, sticky top:0)보다 위에서 흘러 올라가고
   헤더만 남는다. 페이지 곳곳의 scrollTo 보정값 56은 그대로 유효하다.

   ⚠️ "N자리 남음" 류의 잔여 수량은 넣지 않는다. 실제로 세고 있지 않으면
   지어낸 숫자가 되고, 그 순간 이 배너는 거짓 표시가 된다. 긴박감은
   이미 참인 사실(30개사 한정 · 마감 후 정가 전환)에서만 가져온다.
   ============================================================= */
export default function TopBanner() {
  const goToApply = () => {
    const el = document.getElementById("apply");
    if (el) smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 56);
  };

  return (
    <button className={styles.bar} onClick={goToApply}>
      <span className={styles.dot} aria-hidden="true" />
      <b className={styles.lead}>초기 파트너 30개사 모집 중</b>
      <span className={styles.note}>마감되면 정가로 전환됩니다</span>
      <span className={styles.cta}>
        신청하기
        <span aria-hidden="true"> →</span>
      </span>
    </button>
  );
}
