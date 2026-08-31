"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./InquiryModal.module.css";

/* 네이티브 <dialog>를 쓴다. 배경 딤(::backdrop), ESC 닫기, 포커스 가둠,
   바깥 스크롤 잠금을 브라우저가 이미 해준다 — 직접 만들 이유가 없다. */

type Fields = {
  company: string;
  name: string;
  phone: string;
  email: string;
  message: string;
};

const EMPTY: Fields = { company: "", name: "", phone: "", email: "", message: "" };

/** 지금 주문을 어떻게 받고 있는지 — 상담 전에 알면 통화가 짧아진다. */
const CHANNELS = ["카톡", "문자", "전화", "복합"] as const;

/** 어디서 알고 왔는지 — 마케팅 채널 효과 확인용 */
const SOURCES = ["인스타그램", "지인 소개", "네이버 카페", "직접 영업", "기타"] as const;

export default function InquiryModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [channel, setChannel] = useState<string>("카톡");
  const [source, setSource] = useState<string>("");
  const [agree, setAgree] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields | "agree", string>>>({});
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  /* ESC나 배경 클릭으로 닫힐 때도 부모 상태를 맞춰준다 */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onCloseEvent = () => onClose();
    el.addEventListener("close", onCloseEvent);
    return () => el.removeEventListener("close", onCloseEvent);
  }, [onClose]);

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const next: Partial<Record<keyof Fields | "agree", string>> = {};
    if (!fields.company.trim()) next.company = "업체명을 입력해 주세요.";
    if (!fields.name.trim()) next.name = "담당자명을 입력해 주세요.";
    if (!/^[0-9-]{9,}$/.test(fields.phone.trim())) next.phone = "연락 가능한 번호를 입력해 주세요.";
    if (fields.email.trim() && !/^\S+@\S+\.\S+$/.test(fields.email.trim())) {
      next.email = "이메일 형식을 확인해 주세요.";
    }
    if (!agree) next.agree = "개인정보 수집·이용에 동의해 주세요.";

    setErrors(next);
    if (Object.keys(next).length) return;

    /* ⚠️ 연동 지점: 문의 접수 엔드포인트가 정해지면 여기에 붙인다.
       지금은 접수 화면으로만 전환한다 (FinalCta의 신청 폼과 같은 방식). */
    setSent(true);
  };

  const close = () => {
    onClose();
    // 닫는 애니메이션이 없으므로 즉시 초기화해도 사용자에게 보이지 않는다
    setSent(false);
    setFields(EMPTY);
    setChannel("카톡");
    setSource("");
    setAgree(false);
    setErrors({});
  };

  return (
    <dialog ref={ref} className={styles.dialog} aria-labelledby="inquiry-title">
      <button className={styles.close} onClick={close} aria-label="닫기">
        ✕
      </button>

      {sent ? (
        <div className={styles.thanks} role="status">
          <div className={styles.thanksMark}>✓</div>
          <div className={styles.thanksTitle}>문의가 접수되었습니다.</div>
          <p className={styles.thanksBody}>
            영업일 기준 1일 내에 담당자가 연락드립니다. 급하시면 010-2915-5311로 바로 전화 주셔도
            됩니다.
          </p>
          <button className={styles.thanksBtn} onClick={close}>
            닫기
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <h2 className={styles.title} id="inquiry-title">
            Vendor-UP 도입 문의
          </h2>
          <p className={styles.lead}>
            주문을 어떻게 받고 계신지, 품목 수가 어느 정도인지 여쭤보고 맞는 방식을 제안드립니다.
            통화는 10분이면 충분합니다. 급하시면{" "}
            <a href="tel:01029155311">010-2915-5311</a>로 바로 연락 주셔도 됩니다.
          </p>

          <div className={styles.fields}>
            <div>
              <label className={styles.label} htmlFor="q-company">
                업체명 <span className={styles.req}>*</span>
              </label>
              <input
                id="q-company"
                className={`${styles.input} ${errors.company ? styles.inputError : ""}`}
                placeholder="예: 우리청과"
                value={fields.company}
                onChange={set("company")}
                aria-invalid={Boolean(errors.company)}
              />
              {errors.company && <div className={styles.errorText}>{errors.company}</div>}
            </div>

            <div className={styles.pair}>
              <div>
                <label className={styles.label} htmlFor="q-name">
                  담당자명 <span className={styles.req}>*</span>
                </label>
                <input
                  id="q-name"
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                  placeholder="성함"
                  value={fields.name}
                  onChange={set("name")}
                  aria-invalid={Boolean(errors.name)}
                />
                {errors.name && <div className={styles.errorText}>{errors.name}</div>}
              </div>
              <div>
                <label className={styles.label} htmlFor="q-phone">
                  연락처 <span className={styles.req}>*</span>
                </label>
                <input
                  id="q-phone"
                  type="tel"
                  inputMode="tel"
                  className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                  placeholder="예: 010-0000-0000"
                  value={fields.phone}
                  onChange={set("phone")}
                  aria-invalid={Boolean(errors.phone)}
                />
                {errors.phone && <div className={styles.errorText}>{errors.phone}</div>}
              </div>
            </div>

            <div>
              <label className={styles.label} htmlFor="q-email">
                이메일
              </label>
              <input
                id="q-email"
                type="email"
                className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                placeholder="example@company.co.kr"
                value={fields.email}
                onChange={set("email")}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <div className={styles.errorText}>{errors.email}</div>}
            </div>

            <div>
              <span className={styles.label}>주로 받는 주문 방식</span>
              <div className={styles.choices} role="radiogroup" aria-label="주로 받는 주문 방식">
                {CHANNELS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="radio"
                    aria-checked={channel === c}
                    className={`${styles.choice} ${channel === c ? styles.choiceOn : ""}`}
                    onClick={() => setChannel(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className={styles.label}>어떻게 알고 오셨나요?</span>
              <div className={styles.choices} role="radiogroup" aria-label="유입 경로">
                {SOURCES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={source === s}
                    className={`${styles.choice} ${source === s ? styles.choiceOn : ""}`}
                    onClick={() => setSource(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={styles.label} htmlFor="q-message">
                문의 내용
              </label>
              <textarea
                id="q-message"
                className={styles.textarea}
                rows={3}
                placeholder="예: 하루 주문 30건 정도인데 품목이 200개쯤 됩니다. 세팅에 얼마나 걸릴까요?"
                value={fields.message}
                onChange={set("message")}
              />
            </div>

            <div>
              <label className={styles.agree}>
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => {
                    setAgree(e.target.checked);
                    setErrors((prev) => ({ ...prev, agree: undefined }));
                  }}
                />
                <span>
                  <span className={styles.agreeLink}>개인정보 수집·이용</span>에 동의합니다{" "}
                  <span className={styles.req}>*</span>
                </span>
              </label>
              {errors.agree && <div className={styles.errorText}>{errors.agree}</div>}
            </div>
          </div>

          <button className={styles.submit} type="submit">
            문의 남기기
          </button>
        </form>
      )}
    </dialog>
  );
}
