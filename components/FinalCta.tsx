"use client";

import { useState } from "react";
import styles from "./FinalCta.module.css";
import { stagger } from "@/lib/reveal";

type Status = "idle" | "submitting" | "done";

const CHANNELS = ["카톡", "문자", "전화", "복합"] as const;

const STEPS = [
  {
    title: "신청서를 남기시면 담당자가 연락드립니다",
    body: "주문을 어떻게 받고 계신지 먼저 여쭤봅니다. 통화는 10분이면 충분합니다.",
  },
  {
    title: "품목코드·거래처 세팅을 같이 잡습니다",
    body: "쓰던 품목 리스트를 주시면 매칭 기준을 저희가 만들어 드립니다.",
  },
  {
    title: "7일 동안 실제 주문으로 직접 써보세요",
    body: "카드 등록도, 약정도 없습니다. 안 맞으면 그냥 안 쓰시면 됩니다.",
  },
];

type Fields = {
  company: string;
  name: string;
  phone: string;
  email: string;
  bizNo: string;
};

const EMPTY: Fields = { company: "", name: "", phone: "", email: "", bizNo: "" };

export default function FinalCta() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [channel, setChannel] = useState<string>("카톡");
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    // 입력을 시작하면 그 필드의 오류 표시를 거둔다
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const validate = () => {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!fields.company.trim()) next.company = "업체명을 입력해 주세요.";
    if (!fields.name.trim()) next.name = "담당자명을 입력해 주세요.";
    if (!/^[0-9-]{9,}$/.test(fields.phone.trim())) next.phone = "연락 가능한 번호를 입력해 주세요.";
    if (fields.email.trim() && !/^\S+@\S+\.\S+$/.test(fields.email.trim())) {
      next.email = "이메일 형식을 확인해 주세요.";
    }
    return next;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const found = validate();
    setErrors(found);
    // 유효성 오류: 필드 테두리 색 전환만. shake 애니메이션 금지 (§4.10).
    if (Object.keys(found).length) return;

    setStatus("submitting");

    /* ⚠️ 연동 지점: 실제 신청 접수 엔드포인트가 정해지면 여기에 붙인다.
       기획서 권장 흐름은 "제출 후 담당자가 전화로 이관 상담"이므로,
       접수만 하고 즉시 감사 메시지로 전환한다. */
    await new Promise((resolve) => setTimeout(resolve, 900));

    setStatus("done");
  };

  return (
    <section className={styles.section} id="apply">
      <div className={styles.grid}>
        <div>
          {/* 다크/브랜드 구간이므로 y 거리 --y-lg */}
          <div className={styles.kicker} data-reveal="lg">
            초기 파트너 10개사 모집 중
          </div>
          <h2 className={styles.title} data-reveal="lg" style={stagger(1)}>
            지금 바로 사용해보십시오.
          </h2>
          <p className={styles.sub} data-reveal="lg" style={stagger(2)}>
            카드 등록 없이 7일 무료로 시작합니다. 지금 초기 파트너 10개사를 모집 중이며, 10개사
            안에 드시면 AI ORDER를 <b>월 89,000원</b>으로 쓰실 수 있습니다.
          </p>

          <div className={styles.pills} data-reveal="lg" style={stagger(3)}>
            <span className={styles.pill}>정가 대비 월 40,000원 할인</span>
            <span className={styles.pill}>10개사 마감 시 종료</span>
            <span className={styles.pill}>약정 없이 월 단위</span>
          </div>

          <div className={styles.steps} data-reveal="lg" style={stagger(4)}>
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className={`${styles.step} ${i === STEPS.length - 1 ? styles.stepLast : ""}`}
              >
                <div className={styles.stepNo}>{i + 1}</div>
                <div>
                  <div className={styles.stepTitle}>{step.title}</div>
                  <div className={styles.stepBody}>{step.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 폼 블록 단위로 한 번에 진입 — 필드별 스태거 없음 */}
        <div className={styles.card} data-reveal="lg" style={stagger(2)}>
          {status === "done" ? (
            <div className={styles.thanks} role="status">
              <div className={styles.thanksMark}>✓</div>
              <div className={styles.thanksTitle}>신청이 접수되었습니다.</div>
              <p className={styles.thanksBody}>
                영업일 기준 1일 내에 담당자가 연락드립니다. 주문을 어떻게 받고 계신지 먼저 여쭤보고,
                품목코드 세팅까지 같이 잡아드리겠습니다.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className={styles.cardTitle}>7일 무료 체험 신청</div>
              <div className={styles.cardSub}>
                1분이면 끝납니다 · 접수 후 영업일 기준 1일 내 연락
              </div>

              <div className={styles.fields}>
                <div>
                  <label className={styles.label} htmlFor="f-company">
                    업체명
                  </label>
                  <input
                    id="f-company"
                    className={`${styles.input} ${errors.company ? styles.inputError : ""}`}
                    placeholder="예) 우리청과"
                    value={fields.company}
                    onChange={set("company")}
                    aria-invalid={Boolean(errors.company)}
                  />
                  {errors.company && <div className={styles.errorText}>{errors.company}</div>}
                </div>

                <div className={styles.pair}>
                  <div>
                    <label className={styles.label} htmlFor="f-name">
                      담당자명
                    </label>
                    <input
                      id="f-name"
                      className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                      placeholder="성함"
                      value={fields.name}
                      onChange={set("name")}
                      aria-invalid={Boolean(errors.name)}
                    />
                    {errors.name && <div className={styles.errorText}>{errors.name}</div>}
                  </div>
                  <div>
                    <label className={styles.label} htmlFor="f-phone">
                      연락처
                    </label>
                    <input
                      id="f-phone"
                      type="tel"
                      inputMode="tel"
                      className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
                      placeholder="010-"
                      value={fields.phone}
                      onChange={set("phone")}
                      aria-invalid={Boolean(errors.phone)}
                    />
                    {errors.phone && <div className={styles.errorText}>{errors.phone}</div>}
                  </div>
                </div>

                <div>
                  <label className={styles.label} htmlFor="f-email">
                    이메일
                  </label>
                  <input
                    id="f-email"
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
                  <label className={styles.label} htmlFor="f-bizno">
                    사업자등록번호
                  </label>
                  <input
                    id="f-bizno"
                    className={styles.input}
                    placeholder="000-00-00000"
                    value={fields.bizNo}
                    onChange={set("bizNo")}
                  />
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
              </div>

              <button className={styles.submit} type="submit" disabled={status === "submitting"}>
                {status === "submitting" ? (
                  <>
                    <span className={styles.spinner} aria-hidden="true" />
                    접수 중…
                  </>
                ) : (
                  "무료 체험 신청하기"
                )}
              </button>

              <div className={styles.fineprint}>
                카드 등록 없이 시작 · 초기 파트너 10개사 마감 시 종료
                <br />
                제출 시 <span className={styles.fineprintLink}>개인정보 수집·이용</span>에 동의하게
                됩니다
              </div>

              <div className={styles.cardRule} />
              <div className={styles.consult}>
                <div className={styles.consultText}>먼저 물어보고 싶으신가요?</div>
                <div className={styles.consultBtns}>
                  {/* ⚠️ 연동 지점: 카카오톡 상담 채널이 열리면 여기를 <a href>로 바꾼다. */}
                  <span className={`${styles.consultBtn} ${styles.consultBtnSoon}`}>
                    카톡 상담 준비 중
                  </span>
                  <a href="tel:01029155311" className={styles.consultBtn}>
                    전화 상담
                  </a>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
