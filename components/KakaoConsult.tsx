//* 페이지 우측 하단 내부 페이지 카카오톡 상담 버튼 추가 *//

import styles from "./KakaoConsult.module.css";

export default function KakaoConsult() {
  return (
    <a
      href="https://pf.kakao.com/_TBRrX"
      target="_blank"
      rel="noopener noreferrer"
      className={styles.floating}
      aria-label="카카오톡으로 Vendor-UP 상담하기"
    >
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.86 5.34 4.66 6.76L5.6 21l3.82-2.18c.83.16 1.69.24 2.58.24 5.52 0 10-3.58 10-8.06S17.52 3 12 3Z"
          />
        </svg>
      </span>

      <span className={styles.text}>카카오톡 상담</span>
    </a>
  );
}
