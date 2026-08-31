"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ConsultBanner.module.css";

/* 푸터의 "카톡·문자 상담"을 누르면 뜨는 연락 방법 배너.
   카카오톡 채널 링크가 아직 없어 그 옵션은 비활성으로 둔다.
   ⚠️ 연동 지점: 채널이 열리면 kakaoHref에 pf.kakao.com/... 링크를 넣고
   .btnSoon → 일반 <a> 링크로 바꾼다. */
const kakaoHref: string | null = null;

export default function ConsultBanner() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCloseEvent = () => setOpen(false);
    el.addEventListener("close", onCloseEvent);
    return () => el.removeEventListener("close", onCloseEvent);
  }, []);

  return (
    <>
      <button className={styles.trigger} onClick={() => setOpen(true)}>
        카톡·문자 상담
      </button>

      <dialog ref={ref} className={styles.dialog} aria-labelledby="consult-title">
        <button className={styles.close} onClick={() => setOpen(false)} aria-label="닫기">
          ✕
        </button>

        <h2 className={styles.title} id="consult-title">
          어떻게 연락드릴까요?
        </h2>
        <p className={styles.lead}>편하신 방법으로 문의해 주세요. 영업일 기준 빠르게 답변드립니다.</p>

        <div className={styles.options}>
          <a className={styles.option} href="tel:01029155311">
            <span className={styles.optionIcon} aria-hidden="true">
              ☎
            </span>
            <span className={styles.optionBody}>
              <span className={styles.optionTitle}>전화로 상담하기</span>
              <span className={styles.optionNote}>010-2915-5311 · 지금 바로 연결됩니다</span>
            </span>
          </a>

          {kakaoHref ? (
            <a className={styles.option} href={kakaoHref} target="_blank" rel="noreferrer noopener">
              <span className={styles.optionIcon} aria-hidden="true">
                💬
              </span>
              <span className={styles.optionBody}>
                <span className={styles.optionTitle}>카톡으로 상담하기</span>
                <span className={styles.optionNote}>카카오톡 채널로 연결됩니다</span>
              </span>
            </a>
          ) : (
            <div className={`${styles.option} ${styles.optionSoon}`}>
              <span className={styles.optionIcon} aria-hidden="true">
                💬
              </span>
              <span className={styles.optionBody}>
                <span className={styles.optionTitle}>카톡 상담 준비 중</span>
                <span className={styles.optionNote}>
                  카카오톡 채널을 여는 중입니다. 지금은 전화로 문의해 주세요.
                </span>
              </span>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
