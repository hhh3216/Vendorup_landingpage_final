import styles from "./Footer.module.css";
import ConsultBanner from "./ConsultBanner";

type FooterLink = { label: string; href?: string; special?: "consult" };

/* href가 있는 항목만 페이지 내 실제 섹션으로 연결한다.
   "카톡·문자 상담"은 연락 방법 배너(ConsultBanner)로 특별 처리하고,
   나머지 href 없는 항목(약관류)은 아직 만들어진 페이지가 없어 비활성으로 둔다. */
const COLUMNS: { title: string; links: FooterLink[] }[] = [
  {
    title: "프로덕트",
    links: [
      { label: "서비스 소개", href: "#solution" },
      { label: "요금 안내", href: "#pricing" },
      { label: "작동 원리", href: "#how-it-works" },
    ],
  },
  {
    title: "고객 지원",
    links: [
      { label: "도입 문의", href: "#apply" },
      { label: "자주 묻는 질문", href: "#faq" },
      { label: "카톡·문자 상담", special: "consult" as const },
    ],
  },
  {
    title: "약관·정책",
    links: [{ label: "서비스 이용약관" }, { label: "개인정보처리방침" }, { label: "데이터 보안 정책" }],
  },
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

          <a
            className={styles.social}
            href="https://www.instagram.com/vendor_up/"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Vendor-UP 인스타그램"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <rect
                x="2.5"
                y="2.5"
                width="19"
                height="19"
                rx="5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
            </svg>
            <span>@vendor_up</span>
          </a>
        </div>

        <div className={styles.cols}>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <div className={styles.colTitle}>{col.title}</div>
              <div className={styles.colLinks}>
                {col.links.map((link) => {
                  if (link.special === "consult") return <ConsultBanner key={link.label} />;
                  return link.href ? (
                    <a key={link.label} className={styles.link} href={link.href}>
                      {link.label}
                    </a>
                  ) : (
                    <span key={link.label} className={`${styles.link} ${styles.linkSoon}`}>
                      {link.label}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.rule} />

      <div className={styles.legal}>
        카이톤(KYTON, Korea Youth Technology) · 대표: 성시훈 · 사업자등록번호: 152-16-03084
        <br />
        주소: 경기도 안산시 단원구 화랑로 402, 3층 (고잔동, 신원빌딩) · 이메일:
        account@kyton.co.kr
        <br />
        연락처: <a href="tel:01029155311">010-2915-5311</a>
        <br />© 2026 KYTON. All rights reserved.
      </div>
    </footer>
  );
}
