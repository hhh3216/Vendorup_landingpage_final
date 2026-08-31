"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";
import { HERO_FRAMES, REDUCED_MOTION_FRAME } from "./HeroFrames";
import { smoothScrollTo, usePrefersReducedMotion } from "@/lib/reveal";

/* =============================================================
   §5 히어로 영상 (18초 루프)
   -------------------------------------------------------------
   ⚠️ 준비물: HERO_VIDEO_PROMPT.md 기준으로 제작될 18초 루프 영상.
   파일이 준비되면 아래 두 상수에 경로만 넣으면 <video>로 전환된다
   (마크업·IO 일시정지·reduced-motion 분기는 이미 전부 붙어 있다).

     public/hero/hero-loop.mp4   — H.264, 2.5MB 이하 목표
     public/hero/hero-loop.webm  — 대체 포맷
     public/hero/poster.jpg      — 프레임 01 (phone-idle)
     public/hero/still-05b.jpg   — 프레임 05b (approve), reduced-motion 대체

   영상이 없는 동안에는 시안과 동일한 4프레임 목업이 자동으로 표시된다.
   ============================================================= */
const HERO_VIDEO = {
  mp4: "/hero/hero-loop.mp4",
  webm: "/hero/hero-loop.webm",
  poster: "",
  reducedMotionStill: "",
};

const HAS_VIDEO = Boolean(HERO_VIDEO.mp4 || HERO_VIDEO.webm);

/** 목업 프레임 순환 간격 (시안의 setInterval 2400ms와 동일) */
const FRAME_MS = 2400;

export default function Hero() {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [frame, setFrame] = useState(0);
  const [visible, setVisible] = useState(true);
  const reduced = usePrefersReducedMotion();

  /* §8.2 히어로 영상은 뷰포트 밖으로 나가면 pause() (IO 기반).
     목업 폴백도 같은 신호로 순환을 멈춘다. */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (visible && !reduced) void video.play().catch(() => {});
    else video.pause();
  }, [visible, reduced]);

  /* 목업 폴백 순환. reduced-motion이면 05b(approve)에 고정한다 (§5.2). */
  useEffect(() => {
    if (HAS_VIDEO) return;
    if (reduced) {
      setFrame(REDUCED_MOTION_FRAME);
      return;
    }
    if (!visible) return;
    const t = setInterval(() => setFrame((i) => (i + 1) % HERO_FRAMES.length), FRAME_MS);
    return () => clearInterval(t);
  }, [visible, reduced]);

  /* 목업 무대(732×412)를 카드 크기에 맞춰 덮도록 스케일.
     영상이 붙으면 object-fit: cover가 대신하므로 이 계산은 사라진다. */
  useEffect(() => {
    if (HAS_VIDEO) return;
    const el = cardRef.current;
    if (!el) return;

    const fit = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      el.style.setProperty("--scene-scale", String(Math.min(w / 732, h / 412)));
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* §4.1 2차 CTA → §6 데모 섹션으로 scrollTo 스무스 스크롤 (800ms).
     도착 후 입력창에 포커스 링 1회 점등. 자동 재생은 하지 않는다. */
  const goToDemo = () => {
    const el = document.getElementById("demo");
    if (!el) return;
    smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 56, 800, () => {
      window.dispatchEvent(new CustomEvent("vendorup:demo-focus-ping"));
    });
  };

  const goToApply = () => {
    const el = document.getElementById("apply");
    if (el) smoothScrollTo(el.getBoundingClientRect().top + window.scrollY - 56);
  };

  const Active = HERO_FRAMES[frame].Frame;

  return (
    <section className={styles.hero} id="top">
      <div className={styles.card} ref={cardRef}>
        {HAS_VIDEO ? (
          reduced && HERO_VIDEO.reducedMotionStill ? (
            /* §5.2 reduced-motion: 자동재생 정지, 프레임 05b 정지 이미지로 대체 */
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={styles.stillFrame}
              src={HERO_VIDEO.reducedMotionStill}
              alt="Vendor-UP이 정리한 주문을 담당자가 승인하는 화면"
            />
          ) : (
            /* muted와 playsinline 없으면 모바일에서 재생되지 않는다 (§5.2) */
            <video
              ref={videoRef}
              className={styles.video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={HERO_VIDEO.poster || undefined}
              aria-label="카톡으로 온 주문이 Vendor-UP에서 품목코드가 매겨진 주문서로 정리되는 과정"
            >
              {HERO_VIDEO.webm && <source src={HERO_VIDEO.webm} type="video/webm" />}
              {HERO_VIDEO.mp4 && <source src={HERO_VIDEO.mp4} type="video/mp4" />}
            </video>
          )
        ) : (
          /* 영상 미수령 상태의 목업 무대 */
          <div className={styles.scene} aria-hidden="true">
            {HERO_FRAMES.map(({ id, Frame }, i) => (
              <div
                key={id}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: i === frame ? 1 : 0,
                  transition: "opacity var(--d-base) var(--ease-inout)",
                }}
              >
                <Frame />
              </div>
            ))}
            <span className="sr-only">
              카톡으로 온 주문이 Vendor-UP에서 품목코드가 매겨진 주문서로 정리되는 과정
            </span>
          </div>
        )}

        {/* §5.2 오버레이는 영상보다 위 레이어에 항상 고정 — 페이드인 하지 않는다 */}
        <div className={styles.gradient} />
        {!HAS_VIDEO && (
          <div className={styles.slot}>HERO 영상 자리 · {HERO_FRAMES[frame].id}</div>
        )}

        {/* 헤드라인을 셋으로 끊어 좌 / 폰 위 / 우로 벌린다.
            가운데 조각이 폰 목업 정중앙에 오도록 space-between으로 배치한다. */}
        <div className={styles.copy}>
          <h1 className={styles.headline}>
            <span>카톡·문자로 온 주문</span>
            <span>오늘도</span>
            <span>수기로 입력하셨나요?</span>
          </h1>
        </div>
      </div>

      <div className={styles.below}>
        <p className={styles.sub}>
          카톡·문자로 들어온 주문을 Vendor-UP이 읽고,{" "}
          <b className={styles.subStrong}>
            품목과 수량을 뽑아 우리 회사 품목코드에 맞춰 ERP에 올립니다.
          </b>{" "}
          <b className={styles.subBrand}>거래처는 하던 대로 주문하시면 됩니다.</b> 새로 깔 앱도,
          배울 양식도 없습니다.
        </p>

        <div className={styles.actions}>
          <div className={styles.actionRow}>
            <button className="btn btn-ghost" onClick={goToDemo}>
              30초 만에 어떻게 되는지 보기
            </button>
            <button className="btn btn-primary" onClick={goToApply}>
              무료로 시작하기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
