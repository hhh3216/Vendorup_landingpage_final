import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vendor-UP — 카톡·문자로 온 주문, 오늘도 수기 입력 하셨나요?",
  description:
    "카톡·문자로 들어온 주문을 Vendor-UP이 읽고, 품목과 수량을 뽑아 우리 회사 품목코드에 맞춰 ERP에 올립니다. 거래처는 하던 대로 주문하시면 됩니다.",
  openGraph: {
    title: "Vendor-UP — 주문 입력, 이제 확인만 하세요",
    description:
      "카톡·문자 주문을 AI가 읽고 품목코드에 맞춰 ERP에 등록합니다. 거래처는 하던 대로 주문하면 됩니다.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

/**
 * §8.1 `.js-anim` 루트 클래스 방식.
 * 기본 CSS는 최종 상태이고, 이 클래스가 붙었을 때만 진입 초기 상태가 적용된다.
 * <head>에서 동기 실행해 "보였다가 숨는" 깜빡임을 막는다.
 * JS가 실패하면 클래스가 붙지 않고, 모든 콘텐츠는 그대로 보인다.
 */
const JS_ANIM_BOOTSTRAP = `document.documentElement.classList.add('js-anim');`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script dangerouslySetInnerHTML={{ __html: JS_ANIM_BOOTSTRAP }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
