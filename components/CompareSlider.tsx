"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./CompareSlider.module.css";

const ORDER_TEXT = `안녕하세요~ A매장입니다
내일 주문 넣을게요

양파 10kg 2박스
계란 15판
대파 5단이요
청상추 2박스도 같이 부탁드려요

세금계산서 발행도 부탁드립니다

감사합니다`;

const ROWS = [
  { code: "VG-0142", name: "양파", spec: "10kg", qty: "2", unit: "박스" },
  { code: "EG-0031", name: "계란", spec: "대란 30구", qty: "15", unit: "판" },
  { code: "VG-0088", name: "대파", spec: "1단", qty: "5", unit: "단" },
  { code: "VG-0210", name: "청상추", spec: "2kg", qty: "2", unit: "박스" },
];

export default function CompareSlider() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50); // 시안은 50% 지점 정지 상태
  const dragging = useRef(false);
  const touched = useRef(false);

  /* 좁은 화면에서는 50%에 두면 우측(정리된 주문서)이 수량 열만 남아 잘린다.
     결과가 이 비교의 결론이므로 모바일 초기값만 왼쪽으로 당겨 결과를 넓게 보여준다.
     사용자가 한 번이라도 손잡이를 움직이면 그 위치를 그대로 존중한다. */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      if (!touched.current) setPos(mq.matches ? 30 : 50);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const setFromClientX = useCallback((clientX: number) => {
    const el = wrapRef.current;
    if (!el) return;
    touched.current = true;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(4, Math.min(96, pct)));
  }, []);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      setFromClientX(e.clientX);
    };
    const up = () => {
      dragging.current = false;
    };

    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [setFromClientX]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    touched.current = true;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setPos((p) => Math.max(4, p - step));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setPos((p) => Math.min(96, p + step));
    } else if (e.key === "Home") {
      e.preventDefault();
      setPos(4);
    } else if (e.key === "End") {
      e.preventDefault();
      setPos(96);
    }
  };

  const cell = (extra?: string, last?: boolean) =>
    `${styles.td} ${last ? styles.tdLast : ""} ${extra ?? ""}`;

  return (
    <>
      <div
        className={styles.wrap}
        ref={wrapRef}
        style={{ ["--pos" as string]: `${pos}%` }}
        onPointerDown={(e) => {
          dragging.current = true;
          setFromClientX(e.clientX);
        }}
      >
        {/* 지금 · 카톡 원문 */}
        <div className={`${styles.layer} ${styles.before}`}>
          <div className={styles.beforeInner}>
            <div className={styles.avatar}>A</div>
            <div className={styles.bubble}>{ORDER_TEXT}</div>
          </div>
        </div>

        {/* 도입 후 · 정형화된 주문 */}
        <div className={`${styles.layer} ${styles.after}`}>
          <div className={styles.afterInner}>
            <div className={styles.erpCard}>
              <div className={styles.erpHead}>
                <div className={styles.erpStore}>A매장</div>
                <div className={styles.erpDate}>2026. 8. 29. 배송</div>
              </div>

              <div className={styles.erpGrid}>
                <div className={`${styles.th} ${styles.thCode}`}>품목코드</div>
                <div className={styles.th}>품목명</div>
                <div className={`${styles.th} ${styles.hideNarrow}`}>규격</div>
                <div className={`${styles.th} ${styles.thRight}`}>수량</div>
                <div className={`${styles.th} ${styles.thRight} ${styles.hideNarrow}`}>단위</div>
                <div className={styles.rule} />

                {ROWS.map((row, i) => {
                  const last = i === ROWS.length - 1;
                  return (
                    <div key={row.code} style={{ display: "contents" }}>
                      <div className={cell(undefined, last)}>
                        <span className={styles.code}>{row.code}</span>
                      </div>
                      <div className={cell(styles.name, last)}>{row.name}</div>
                      <div className={cell(`${styles.spec} ${styles.hideNarrow}`, last)}>
                        {row.spec}
                      </div>
                      <div className={cell(styles.qty, last)}>{row.qty}</div>
                      <div className={cell(`${styles.unit} ${styles.hideNarrow}`, last)}>
                        {row.unit}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.erpFoot}>세금계산서 발행 요청</div>
            </div>
          </div>
        </div>

        <div className={styles.tagBefore}>지금 · 카톡 원문</div>
        <div className={styles.tagAfter}>도입 후 · 정형화된 주문</div>

        <div
          className={styles.handle}
          role="slider"
          tabIndex={0}
          aria-label="카톡 원문과 정리된 주문서 비교"
          aria-valuemin={4}
          aria-valuemax={96}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`정리된 주문서가 ${Math.round(pos)}% 지점부터 보입니다`}
          onKeyDown={onKeyDown}
        >
          <div className={styles.grip} aria-hidden="true">
            <span>‹</span>
            <span>›</span>
          </div>
        </div>
      </div>

      <div className={styles.hint}>
        가운데 손잡이를 좌우로 끌어보세요. 왼쪽이 지금 받는 카톡 원문, 오른쪽이 Vendor-UP이 정리한
        주문서입니다.
      </div>
    </>
  );
}
