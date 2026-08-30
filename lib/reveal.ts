"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

/* =============================================================
   §3 공통 스크롤 진입 규칙
   - 트리거: IntersectionObserver, threshold 0.15, rootMargin '0px 0px -12% 0px'
   - 1회성: 한 번 등장한 요소는 다시 재생하지 않는다 (unobserve 후 클래스 유지)
   ============================================================= */

export const REVEAL_IO: IntersectionObserverInit = {
  threshold: 0.15,
  rootMargin: "0px 0px -12% 0px",
};

/** §2 스태거: 형제 요소 간 지연. 최대 6개까지만 스태거, 7번째부터는 동시. */
export function stagger(index: number, step = 70): CSSProperties {
  return { ["--reveal-delay" as string]: `${Math.min(index, 6) * step}ms` };
}

/**
 * 페이지 전역 [data-reveal] 요소를 감시한다.
 * §8.1 — 기본 CSS가 최종 상태이므로, JS가 실패해도 콘텐츠는 그대로 보인다.
 */
export function useRevealObserver() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) return;

    // §8.2 will-change는 애니메이션 직전에만 부여하고 완료 후 제거
    const clearWillChange = (el: HTMLElement) => {
      el.style.willChange = "";
    };

    const io = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.style.willChange = "opacity, transform";
        el.classList.add("is-in");
        el.addEventListener("transitionend", () => clearWillChange(el), { once: true });
        observer.unobserve(el); // 1회성
      }
    }, REVEAL_IO);

    for (const node of nodes) io.observe(node);
    return () => io.disconnect();
  }, []);
}

/**
 * 한 블록이 뷰포트에 들어온 순간을 1회만 알려준다.
 * 섹션 내부의 순차 연출(표 채움, 플로우 노드, 로드맵 라인 등)의 시작점.
 */
export function useInViewOnce<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // JS가 붙기 전 기본 상태가 최종 상태이므로, 관찰 실패 시에도 손해가 없다.
    const io = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        setInView(true);
        observer.unobserve(entry.target); // 1회성
      }
    }, REVEAL_IO);

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, inView];
}

/** 사용자가 모션 축소를 요청했는지 (§8.1). SSR 안전. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/** 모바일 폴백 분기 (§7 < 768px). SSR 안전. */
export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return mobile;
}

/**
 * §8.3-10 `scrollIntoView` 금지. 스무스 스크롤은 scrollTo로 직접 구현한다.
 * 800ms, --ease-inout (cubic-bezier(.4,0,.2,1)).
 */
export function smoothScrollTo(targetY: number, duration = 800, onDone?: () => void) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, targetY);
    onDone?.();
    return;
  }

  const startY = window.scrollY;
  const delta = targetY - startY;
  const start = performance.now();

  // cubic-bezier(.4, 0, .2, 1) 근사 — --ease-inout
  const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    window.scrollTo(0, startY + delta * easeInOut(t));
    if (t < 1) requestAnimationFrame(step);
    else onDone?.();
  };

  requestAnimationFrame(step);
}
