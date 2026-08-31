# 문의 접수 연결하기 (구글 시트 + 메일)

문의하기 / 무료로 시작하기 폼으로 들어온 내용을 **구글 시트에 쌓고, 동시에 메일로 알림**을 받는 설정입니다.
서비스 가입이나 결제 없이 구글 계정만 있으면 됩니다.

전체 10분 정도 걸립니다.

---

## 1단계 — 구글 시트 만들기

1. [sheets.new](https://sheets.new) 접속 → 빈 시트가 생깁니다
2. 시트 이름을 `Vendor-UP 문의 접수` 로 변경
3. **1행에 아래 제목들을 순서대로** 입력합니다 (A1부터 오른쪽으로)

```
접수시각	종류	업체명	담당자명	연락처	이메일	사업자번호	주문방식	유입경로	문의내용
```

> 붙여넣을 때 탭으로 구분되어 있어 A1 셀에 붙여넣으면 자동으로 열이 나뉩니다.

---

## 2단계 — Apps Script 붙여넣기

1. 그 시트에서 상단 메뉴 **확장 프로그램 → Apps Script** 클릭
2. 기본으로 있는 `function myFunction() {}` 코드를 **전부 지우고**, 아래 코드를 붙여넣습니다
3. 코드 맨 위 `ALERT_EMAIL` 값을 **알림 받을 메일 주소**로 바꿉니다

```javascript
/** 알림 받을 메일 주소 — 여러 명이면 쉼표로 구분 */
const ALERT_EMAIL = "account@kyton.co.kr, hhh@kyton.co.kr";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    /* 스팸 봇 차단 — website는 화면에 안 보이는 함정 칸이다.
       사람은 절대 채울 수 없으므로, 값이 있으면 봇으로 보고 조용히 버린다.
       (봇에게 실패를 알려주면 우회를 시도하므로 성공한 것처럼 응답한다) */
    if (data.website) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: true })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // 필수값이 없으면 연락 자체가 불가능하다
    if (!data.company || !data.name || !data.phone) {
      return ContentService.createTextOutput(
        JSON.stringify({ ok: false, error: "missing_fields" })
      ).setMimeType(ContentService.MimeType.JSON);
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    const when = new Date(data.submittedAt || new Date());
    const kind = data.type === "trial" ? "무료체험 신청" : "도입 문의";

    sheet.appendRow([
      Utilities.formatDate(when, "Asia/Seoul", "yyyy-MM-dd HH:mm:ss"),
      kind,
      data.company || "",
      data.name || "",
      data.phone || "",
      data.email || "",
      data.bizNo || "",
      data.channel || "",
      data.source || "",
      data.message || "",
    ]);

    // 알림 메일
    const lines = [
      "종류: " + kind,
      "업체명: " + (data.company || "-"),
      "담당자: " + (data.name || "-"),
      "연락처: " + (data.phone || "-"),
      "이메일: " + (data.email || "-"),
      "사업자번호: " + (data.bizNo || "-"),
      "주문방식: " + (data.channel || "-"),
      "유입경로: " + (data.source || "-"),
      "",
      "문의내용:",
      data.message || "(없음)",
    ];

    MailApp.sendEmail({
      to: ALERT_EMAIL,
      subject: "[Vendor-UP] " + kind + " · " + (data.company || "업체명 없음"),
      body: lines.join("\n"),
    });

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    // 실패해도 시트에는 남기려 시도한다
    console.error(err);
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. 상단의 **저장(💾)** 아이콘 클릭

---

## 3단계 — 웹 앱으로 배포하기

1. 오른쪽 위 파란 **배포 → 새 배포** 클릭
2. 톱니바퀴(⚙️) → **웹 앱** 선택
3. 아래처럼 설정합니다

| 항목 | 값 |
| --- | --- |
| 설명 | `문의 접수` (아무거나) |
| 다음 사용자로 실행 | **나(본인 계정)** |
| 액세스 권한이 있는 사용자 | **모든 사용자** |

> "모든 사용자"로 해야 방문자 브라우저가 호출할 수 있습니다. 반드시 이렇게 설정하세요.

4. **배포** 클릭 → 권한 승인 창이 뜹니다
   - "이 앱은 확인되지 않았습니다" 경고가 나오면 → **고급** → **(안전하지 않음) 이동** 클릭
   - 본인이 만든 스크립트라 정상입니다
5. 배포 완료 후 나오는 **웹 앱 URL을 복사**합니다
   (`https://script.google.com/macros/s/AKfy...../exec` 형태)

---

## 4단계 — 랜딩페이지에 주소 넣기

프로젝트 최상위 폴더에 **`.env.local`** 파일을 만들고 아래 한 줄을 넣습니다.

```
NEXT_PUBLIC_INQUIRY_WEBHOOK_URL=여기에_3단계에서_복사한_주소_붙여넣기
```

터미널에서 만들려면:

```bash
echo 'NEXT_PUBLIC_INQUIRY_WEBHOOK_URL=붙여넣기' > .env.local
```

> **`NEXT_PUBLIC_` 접두사가 꼭 필요합니다.** 이게 붙어야 브라우저에서 쓸 수 있습니다.
> 이 사이트는 서버가 없는 정적 배포라 브라우저가 구글로 직접 보내야 하기 때문입니다.

⚠️ **이 주소는 페이지 소스에 그대로 노출됩니다.** 숨길 수 없는 구조이며, 대신 함정 칸(honeypot)으로
봇을 걸러냅니다. 비밀번호가 아니라 "접수 창구 주소"라고 보시면 됩니다.

그다음 개발 서버를 **껐다가 다시 켭니다** (환경변수는 시작할 때만 읽습니다).

```bash
npm run dev
```

---

## 5단계 — 테스트

1. 랜딩페이지에서 **문의하기** 를 열고 아무 내용이나 넣어 제출
2. 구글 시트에 한 줄이 쌓이는지 확인
3. 설정한 메일로 알림이 오는지 확인

접수에 실패하면 화면에 빨간 안내가 뜹니다. 성공한 척하지 않습니다.

---

## 배포 담당자(시훈)에게

**정적 배포(`output: "export"` + S3/CloudFront) 그대로 두시면 됩니다.** 호스팅을 바꿀 필요 없습니다.

서버가 없는 환경이라, 브라우저가 구글 Apps Script로 **직접** 접수를 보내도록 구현했습니다.
`app/api/...` 같은 서버 경로는 쓰지 않습니다.

### 배포할 때 딱 하나만 확인해 주세요

빌드하는 환경에 아래 환경변수가 있어야 합니다.

```
NEXT_PUBLIC_INQUIRY_WEBHOOK_URL=<Apps Script /exec 주소>
```

- 이 값은 **빌드 시점에 JS 번들 안으로 들어갑니다.** 빌드할 때 없으면 폼이 동작하지 않습니다.
- 저장소에는 올라가 있지 않으니 현호에게 값을 받아서 `.env.local`에 넣거나, CI 환경변수로 등록해 주세요.
- 값이 없으면 방문자 화면에 "접수 중 문제가 생겼습니다 · 전화번호" 안내가 뜹니다.
  (성공한 척하지 않으므로 문의가 조용히 유실되지는 않습니다.)

### 빌드·확인

```bash
npm ci
npm run build          # out/ 폴더 생성
npx serve out          # 배포와 동일한 조건으로 로컬 확인
```

빌드 후 아래로 값이 잘 들어갔는지 확인할 수 있습니다.

```bash
grep -rl "script.google.com" out/_next/static/chunks/ | head -1
```

### 스팸 대비

웹훅 주소는 페이지 소스에 노출됩니다(정적 배포에서는 숨길 수 없는 구조).
대신 두 폼 모두 **함정 칸(honeypot)** 을 두었고, Apps Script가 그 칸이 채워진 요청을 버립니다.
문의가 급증하면 Apps Script 쪽에 IP·시간 기준 제한을 추가하면 됩니다.

---

## 환경변수 정리

| 이름 | 값 | 어디에 |
| --- | --- | --- |
| `NEXT_PUBLIC_INQUIRY_WEBHOOK_URL` | Apps Script 웹 앱 `/exec` 주소 | 로컬·빌드 환경 모두 |

`.env.local`은 `.gitignore`에 등록되어 저장소에 올라가지 않습니다.
배포 담당자에게는 별도로(메신저 등) 전달해 주세요.

---

## 자주 겪는 문제

| 증상 | 원인·해결 |
| --- | --- |
| 화면에 빨간 실패 안내가 뜬다 | `.env.local`에 `NEXT_PUBLIC_` 접두사가 붙었는지, 만든 뒤 서버를 재시작했는지 확인 |
| 배포한 사이트에서만 실패한다 | 빌드 환경에 `NEXT_PUBLIC_INQUIRY_WEBHOOK_URL`이 없었던 것. 넣고 다시 빌드·배포 |
| 시트엔 쌓이는데 메일이 안 온다 | `ALERT_EMAIL` 주소 오타 확인. 구글 무료 계정은 하루 메일 100통 제한 |
| 권한 승인 창이 계속 뜬다 | 3단계에서 "고급 → 이동"으로 승인해야 합니다 |
| 코드를 고쳤는데 반영이 안 된다 | Apps Script는 **배포 → 배포 관리 → 편집(✏️) → 버전: 새 버전 → 배포**를 해야 반영됩니다 |
