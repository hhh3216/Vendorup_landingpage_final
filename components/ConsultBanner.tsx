"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ConsultBanner.module.css";
import { OPERATOR } from "@/lib/operatorInfo";

/* 푸터 상담창도 사업자 정보와 동일한 연락처를 사용한다. */

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
        카카오톡·전화 상담
      </button>

      <dialog ref={ref} className={styles.dialog} aria-labelledby="consult-title">
        <button className={styles.close} onClick={() => setOpen(false)} aria-label="닫기">
          ✕
        </button>

        <h2 className={styles.title} id="consult-title">
          어떻게 연락드릴까요?
        </h2>
        <p className={styles.lead}>편하신 방법으로 문의해 주세요. 상담시간은 {OPERATOR.hours}입니다.</p>

        <div className={styles.options}>
          {OPERATOR.phones.map((phone) => (
            <a key={phone.tel} className={styles.option} href={`tel:${phone.tel}`}>
              <span className={styles.optionIcon} aria-hidden="true">
                ☎
              </span>
              <span className={styles.optionBody}>
                <span className={styles.optionTitle}>전화로 상담하기</span>
                <span className={styles.optionNote}>{phone.label}</span>
              </span>
            </a>
          ))}

          <a className={styles.option} href={OPERATOR.kakaoChatUrl} target="_blank" rel="noreferrer noopener">
            <span className={styles.optionIcon} aria-hidden="true">
              💬
            </span>
            <span className={styles.optionBody}>
              <span className={styles.optionTitle}>카톡으로 상담하기</span>
              <span className={styles.optionNote}>카카오톡 채널로 연결됩니다</span>
            </span>
          </a>
        </div>
      </dialog>
    </>
  );
}
