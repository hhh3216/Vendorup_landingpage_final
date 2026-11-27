/** 밴더업 운영 법인 정보 — 2026-11-27 확정. 앱의 사업자 정보와 같은 값이다. */
export const OPERATOR = {
  serviceName: "밴더업(Vendor-UP)",
  companyName: "주식회사 카이톤(KYTON Inc.)",
  ceo: "성시훈",
  bizNo: "627-87-03948",
  mailOrderNo: "제2026-경기안산-2268호",
  mailOrderAuthority: "경기도 안산시",
  address: "경기도 안산시 단원구 화랑로 402, 3층 305-12호(고잔동, 신원빌딩)",
  email: "account@kyton.co.kr",
  phones: [
    { label: "010-4888-2915", tel: "01048882915" },
    { label: "010-2915-5312", tel: "01029155312" },
  ],
  hours: "08:00~익일 02:00",
  kakaoChatUrl: "https://pf.kakao.com/_TBRrX/chat",
} as const;

/** 기존 도입 문의 창구의 끝자리 오기를 바로잡고, 표시 번호와 연결 번호를 일치시킨다. */
export const INQUIRY_PHONE = OPERATOR.phones[1];
