import styles from "./Footer.module.css";

const COLUMNS = [
  { title: "프로덕트", links: ["서비스 소개", "요금 안내", "도입 문의"] },
  { title: "고객 지원", links: ["도입 문의", "자주 묻는 질문", "카톡·문자 상담"] },
  { title: "약관·정책", links: ["서비스 이용약관", "개인정보처리방침", "데이터 보안 정책"] },
];

/* §4.11 진입 애니메이션 없음 — data-reveal을 붙이지 않는다.
   서버 컴포넌트로 두어 클라이언트 번들에도 실리지 않는다. */
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/kyton-logo-white.png"
            alt="KYTON — Korea Youth Technology"
            className={styles.logo}
          />
          <div className={styles.company}>카이톤(KYTON, Korea Youth Technology)</div>
        </div>

        <div className={styles.cols}>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className={styles.colTitle}>{col.title}</div>
              <div className={styles.colLinks}>
                {col.links.map((link) => (
                  <button key={link} className={styles.link}>
                    {link}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.rule} />

      <div className={styles.legal}>
        카이톤(KYTON, Korea Youth Technology) · 대표 : 성시훈 · 사업자등록번호 : 152-16-03084
        <br />
        주소 : 경기도 안산시 단원구 화랑로 402, 3층 (고잔동, 신원빌딩) · 이메일 :
        account@kyton.co.kr
        <br />© 2026 KYTON. All rights reserved.
      </div>
    </footer>
  );
}
