"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./LiveDemo.module.css";
import { EXAMPLES, PLACEHOLDER, parseOrder, type DemoRow, type Segment } from "@/lib/demoData";
import { smoothScrollTo, useIsMobile, usePrefersReducedMotion } from "@/lib/reveal";

/* =============================================================
   §6.1 상태 머신
   idle ─(전송/예시)→ sending → extracting → matching → pending ─(승인)→ done
     ▲                                                              │
     └──────────────────── (다시 해보기) ───────────────────────────┘
   ============================================================= */
type Phase = "idle" | "sending" | "extracting" | "matching" | "pending" | "done" | "nudge";

/* §6.2 상태별 지속 시간. 총 처리 약 1.9초. */
const T = {
  sending: 300,
  extracting: 900,
  matching: 700,
  tokenStep: 120, // 토큰당 하이라이트 점등 간격
  rowStep: 120, // 결과 행당 교체 간격
  failAfter: 300, // §6.3 실패 시 extracting 300ms 후 중단
  nudge: 2400, // 예시 칩 하이라이트 유지 시간
} as const;

type TabState = {
  phase: Phase;
  text: string;
  rows: DemoRow[];
  segments: Segment[];
  litTokens: number;
  codesLit: boolean;
};

const EMPTY: TabState = {
  phase: "idle",
  text: "",
  rows: [],
  segments: [],
  litTokens: 0,
  codesLit: false,
};

/* 시안의 탭 순서 그대로.
   ANIMATION_SPEC §6은 탭1을 "카톡 채널"로 적고 있지만, 시안(최신)에서는
   탭1이 "받은 주문 붙여넣기"다. 번호가 아니라 **동작**으로 매핑했다:
     paste  → 입력 텍스트가 우측 "원문" 영역으로 크로스페이드
     kakao  → 말풍선이 채팅 영역으로 팝인 */
const TABS = [
  { id: "paste", label: "받은 주문 붙여넣기" },
  { id: "kakao", label: "Vendor-UP 카톡으로 받기" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STATUS: Record<Phase, { title: string; badge: string; step: string }> = {
  idle: { title: "입력 전", badge: "", step: "01 · 대기" },
  sending: { title: "처리 중", badge: "", step: "01 · 수신" },
  extracting: { title: "처리 중", badge: "", step: "02 · 추출" },
  matching: { title: "처리 중", badge: "", step: "03 · 매칭" },
  pending: { title: "승인 대기", badge: "pending", step: "04 · 확인" },
  done: { title: "승인 완료", badge: "done", step: "05 · 등록" },
  nudge: { title: "입력 전", badge: "", step: "01 · 대기" },
};

export default function LiveDemo() {
  const [tab, setTab] = useState<TabId>("paste");
  /* §6.3 탭별 상태는 독립 유지. 탭1을 done까지 본 뒤 탭2에 갔다 와도 done 그대로. */
  const [states, setStates] = useState<Record<TabId, TabState>>({
    paste: { ...EMPTY },
    kakao: { ...EMPTY },
  });
  const [input, setInput] = useState("");
  const [ping, setPing] = useState(false);
  const [pulse, setPulse] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isMobile = useIsMobile();
  const reduced = usePrefersReducedMotion();

  const state = states[tab];

  const patch = useCallback(
    (id: TabId, next: Partial<TabState>) =>
      setStates((prev) => ({ ...prev, [id]: { ...prev[id], ...next } })),
    [],
  );

  /* §6.3 처리 중 재전송: 진행 중 상태를 취소하고 새로 시작. 큐에 쌓지 않는다. */
  const clearTimers = useCallback(() => {
    for (const t of timers.current) clearTimeout(t);
    timers.current = [];
  }, []);

  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  /* §4.1 히어로 2차 CTA로 도착했을 때 포커스 링 1회 점등(0.6s 후 소멸).
     자동 재생은 하지 않는다. */
  useEffect(() => {
    const onPing = () => {
      setPing(true);
      setTimeout(() => setPing(false), 600);
      inputRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener("vendorup:demo-focus-ping", onPing);
    return () => window.removeEventListener("vendorup:demo-focus-ping", onPing);
  }, []);

  const run = useCallback(
    (raw: string) => {
      const text = raw.trim();
      // §6.3 빈 입력 전송: 아무 일도 일어나지 않는다. 흔들기·경고 금지.
      if (!text) return;

      clearTimers();
      const id = tab;
      const parsed = parseOrder(text);

      setInput(""); // 입력창은 즉시 비워짐
      patch(id, {
        phase: "sending",
        text,
        rows: [],
        segments: parsed.ok ? parsed.segments : [{ text, hit: false }],
        litTokens: 0,
        codesLit: false,
      });

      /* §7 모바일: 전송 시 결과 영역으로 스무스 스크롤 400ms (이때만 허용) */
      if (isMobile && stageRef.current) {
        const top = stageRef.current.getBoundingClientRect().top + window.scrollY - 90;
        after(T.sending, () => smoothScrollTo(top, 400));
      }

      after(T.sending, () => patch(id, { phase: "extracting" }));

      /* §6.3 자유 입력 실패: 처리 애니메이션을 끝까지 돌리지 않는다.
         extracting 300ms 후 중단 → 안내 한 줄 + 예시 칩 하이라이트. */
      if (!parsed.ok) {
        after(T.sending + T.failAfter, () => {
          patch(id, { phase: "nudge" });
          after(T.nudge, () => patch(id, { phase: "idle", text: "", segments: [] }));
        });
        return;
      }

      // extracting: 토큰에 하이라이트 배경이 좌→우 순차 점등 (토큰당 120ms)
      const hits = parsed.segments.filter((s) => s.hit).length;
      for (let i = 1; i <= hits; i += 1) {
        after(T.sending + i * T.tokenStep, () => patch(id, { litTokens: i }));
      }

      // matching: 스켈레톤이 행 단위로 실제 값으로 교체 (행당 120ms, 위→아래)
      const matchAt = T.sending + T.extracting;
      after(matchAt, () => patch(id, { phase: "matching", rows: parsed.rows }));

      // 품목코드 칩은 마지막에 전체 동시 점등 + 0.3s 글로우 1회
      const codesAt = matchAt + parsed.rows.length * T.rowStep;
      after(codesAt, () => patch(id, { codesLit: true }));

      // pending: 뱃지 팝인 + 카드 성장 + 승인 버튼 글로우 1회
      after(matchAt + T.matching, () => {
        patch(id, { phase: "pending" });
        setPulse(true);
        after(700, () => setPulse(false));
      });
    },
    [after, clearTimers, isMobile, patch, tab],
  );

  const approve = () => {
    clearTimers();
    patch(tab, { phase: "done" });
  };

  const reset = () => {
    clearTimers();
    patch(tab, { ...EMPTY });
    setInput("");
    inputRef.current?.focus({ preventScroll: true });
  };

  const busy = ["sending", "extracting", "matching"].includes(state.phase);
  const showSkeleton = busy;
  const status = STATUS[state.phase];

  /* aria-live로 상태 변화를 알린다 (§8.1) */
  const liveMessage =
    state.phase === "idle"
      ? ""
      : state.phase === "nudge"
        ? "주문 문장을 알아보지 못했습니다. 아래 예시를 눌러보세요."
        : state.phase === "pending"
          ? `주문 ${state.rows.length}건이 정리되었습니다. 승인 대기 중입니다.`
          : state.phase === "done"
            ? "ERP 등록이 완료되었습니다."
            : "주문 문장을 처리하고 있습니다.";

  return (
    <section className={styles.section} id="demo">
      <div className={styles.head}>
        <div className="eyebrow" data-reveal="sm">
          직접 확인해보세요
        </div>
        <h2 className={styles.title} data-reveal>
          실제 주문 문장을 넣으면,
          <br />
          몇 초 안에 <span className={styles.titleAccent}>정리</span>됩니다.
        </h2>
      </div>

      {/* 탭 전환 자체는 크로스페이드 --d-base, 슬라이드 금지 (§6.3) */}
      <div className={styles.tabsWrap} data-reveal="sm">
        <div className={styles.tabs} role="tablist" aria-label="주문 접수 방식">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`${styles.tab} ${tab === t.id ? styles.tabActive : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`${styles.inputBar} ${ping ? styles.inputBarPing : ""}`}
        data-reveal="sm"
      >
        <input
          ref={inputRef}
          className={styles.input}
          value={input}
          placeholder={PLACEHOLDER}
          aria-label="주문 문장 입력"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") run(input);
          }}
        />
        <button className={styles.send} onClick={() => run(input)} aria-label="주문 문장 보내기">
          ↑
        </button>
      </div>

      {state.phase === "nudge" && (
        <div className={styles.nudge} role="status">
          주문 문장으로 읽지 못했습니다. 아래 예시처럼 품목과 수량을 함께 적어주세요.
        </div>
      )}

      <div className={styles.chips}>
        {EXAMPLES.map((example) => (
          <button
            key={example}
            className={`${styles.chip} ${state.phase === "nudge" ? styles.chipNudge : ""}`}
            onClick={() => run(example)}
          >
            {example}
          </button>
        ))}
      </div>

      <div className={styles.hint}>
        아래 예시를 눌러보시면 어떻게 정리되는지 바로 확인하실 수 있습니다 · 현재는 텍스트만
        지원합니다
      </div>

      <div className={styles.stage} ref={stageRef}>
        {/* --- 좌: 원문 --- */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={styles.panelTitle}>
              {tab === "kakao" ? "Vendor-UP 채널" : "받은 주문 원문"}
            </div>
          </div>

          {tab === "kakao" ? (
            <div className={styles.chatArea}>
              {state.text ? (
                <>
                  <div className={styles.chatAvatar}>A</div>
                  <div key={state.text} className={`${styles.chatBubble} ${styles.bubbleIn}`}>
                    <Tokens segments={state.segments} lit={state.litTokens} />
                  </div>
                </>
              ) : (
                <div className={styles.chatEmpty}>
                  거래처가 채널로 보낸 주문이 여기에 도착합니다.
                </div>
              )}
            </div>
          ) : (
            <div className={styles.box}>
              <div className={styles.sourceLabel}>원문</div>
              {state.text ? (
                <div key={state.text} className={`${styles.sourceText} ${styles.sourceEnter}`}>
                  <Tokens segments={state.segments} lit={state.litTokens} />
                </div>
              ) : (
                <div className={styles.idleNote}>
                  받은 주문을 그대로 붙여넣고 보내보세요. 품목과 수량을 뽑아 품목코드에 맞춥니다.
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- 우: 결과 --- */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={styles.panelTitle}>{status.title}</div>
            <div
              key={state.phase}
              className={`${styles.statusBadge} ${
                state.phase === "pending" ? styles.statusPending : ""
              } ${state.phase === "done" ? styles.statusDone : ""} ${
                state.phase === "pending" || state.phase === "done" ? styles.badgePop : ""
              }`}
            >
              {status.step}
            </div>
          </div>

          <div className={styles.box}>
            {showSkeleton ? (
              /* 스켈레톤 4행 시머 — linear 1.2s 루프, 행당 0.08s 스태거 */
              <div className={styles.skeletonRows} aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={styles.skeleton}
                    style={{
                      ["--sk-delay" as string]: `${i * 80}ms`,
                      width: `${100 - i * 9}%`,
                    }}
                  />
                ))}
              </div>
            ) : state.rows.length ? (
              <>
                <div className={styles.resultGrid}>
                  <div className={styles.rTh}>품목코드</div>
                  <div className={styles.rTh}>품목명</div>
                  <div className={`${styles.rTh} ${styles.rThRight}`}>수량</div>
                  <div className={styles.rRule} />

                  {state.rows.map((row, i) => {
                    const last = i === state.rows.length - 1;
                    const cell = `${styles.rCell} ${last ? styles.rCellLast : ""} ${styles.rowIn}`;
                    const delay = { ["--row-delay" as string]: `${i * T.rowStep}ms` };
                    return (
                      <div key={row.code} style={{ display: "contents" }}>
                        <div className={cell} style={delay}>
                          <span
                            className={`${styles.rCode} ${state.codesLit ? styles.rCodeLit : ""}`}
                          >
                            {row.code}
                          </span>
                        </div>
                        <div className={cell} style={delay}>
                          {row.name}
                        </div>
                        <div className={`${cell} ${styles.rQty}`} style={delay}>
                          {row.qty} <span className={styles.rUnit}>{row.unit}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* 카드가 아래로 성장하며 승인 바 노출 — 상단 엣지 고정 */}
                <div
                  className={`${styles.approveWrap} ${
                    state.phase === "pending" ? styles.approveOpen : ""
                  }`}
                >
                  <div className={styles.approveInner}>
                    <div className={styles.approveBar}>
                      <button className={styles.btnEdit}>수정</button>
                      <button
                        className={`${styles.btnApprove} ${
                          pulse && !reduced ? styles.approvePulse : ""
                        }`}
                        onClick={approve}
                      >
                        승인
                      </button>
                    </div>
                  </div>
                </div>

                {state.phase === "done" && (
                  <div className={styles.doneFoot}>
                    <span className={styles.doneCheck}>✓</span> 한솔식당 · 08-30 납품건으로 등록됨
                  </div>
                )}
              </>
            ) : (
              <div className={styles.idleNote}>
                주문 문장을 보내면 품목코드가 매겨진 주문서가 여기에 만들어집니다.
              </div>
            )}
          </div>

          {/* 컨페티·성공음 금지 (§6.2 done) */}
          {state.phase === "done" && (
            <button className={styles.retry} onClick={reset}>
              다시 해보기
            </button>
          )}
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {liveMessage}
      </div>
    </section>
  );
}

/** 원문 조각 렌더링 — hit 조각만 순차 점등된다 */
function Tokens({ segments, lit }: { segments: Segment[]; lit: number }) {
  let hitIndex = 0;
  return (
    <>
      {segments.map((seg, i) => {
        if (!seg.hit) return <span key={i}>{seg.text}</span>;
        hitIndex += 1;
        const on = hitIndex <= lit;
        return (
          <span key={i} className={`${styles.token} ${on ? styles.tokenLit : ""}`}>
            {seg.text}
          </span>
        );
      })}
    </>
  );
}
