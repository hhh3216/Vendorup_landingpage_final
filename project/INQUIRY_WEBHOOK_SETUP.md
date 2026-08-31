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
const ALERT_EMAIL = "account@kyton.co.kr";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
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

> "모든 사용자"로 해야 랜딩페이지 서버가 호출할 수 있습니다.
> 이 주소를 아는 사람만 접근 가능하고, 주소는 코드에 노출되지 않습니다(4단계 참고).

4. **배포** 클릭 → 권한 승인 창이 뜹니다
   - "이 앱은 확인되지 않았습니다" 경고가 나오면 → **고급** → **(안전하지 않음) 이동** 클릭
   - 본인이 만든 스크립트라 정상입니다
5. 배포 완료 후 나오는 **웹 앱 URL을 복사**합니다
   (`https://script.google.com/macros/s/AKfy...../exec` 형태)

---

## 4단계 — 랜딩페이지에 주소 넣기

프로젝트 최상위 폴더에 **`.env.local`** 파일을 만들고 아래 한 줄을 넣습니다.

```
INQUIRY_WEBHOOK_URL=여기에_3단계에서_복사한_주소_붙여넣기
```

터미널에서 만들려면:

```bash
echo 'INQUIRY_WEBHOOK_URL=붙여넣기' > .env.local
```

> `.env.local`은 `.gitignore`에 등록되어 있어 깃허브에 올라가지 않습니다.
> 이 주소는 스팸 방지를 위해 공개하지 마세요.

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

## ⚠️ 배포 담당자에게 — 현재 호스팅으로는 접수가 되지 않습니다

**2026-09-01 확인 기준, `vendorup.kr`은 S3 + CloudFront 정적 호스팅입니다.**

```
$ curl -sI https://vendorup.kr/
server: AmazonS3
via: ... cloudfront.net (CloudFront)

$ curl -X POST https://vendorup.kr/api/inquiry
HTTP 403        ← 서버 경로가 없음
```

정적 호스팅은 HTML·CSS·JS 파일만 내려줄 뿐 **서버 코드를 실행하지 않습니다.**
그래서 이 접수 기능(`app/api/inquiry/route.ts`)이 실제 사이트에서는 동작하지 않습니다.

> 이 상태로 두면 방문자에게는 "접수되었습니다"가 뜨는데 아무 데도 기록이 남지 않습니다.
> **문의를 남긴 사장님이 오지 않을 연락을 기다리게 됩니다.** 배포 전에 아래 중 하나를 반드시 처리해 주세요.

### 방법 A — Next.js 서버가 도는 곳으로 옮기기 (권장)

Vercel, AWS Amplify(SSR 모드), Cloudflare Workers 등.
이 프로젝트는 Next.js App Router라 서버가 있는 환경이 원래 맞는 구성입니다.

Vercel 기준:
1. 깃허브 저장소 연결 → 자동 배포
2. **Settings → Environment Variables** 에 `INQUIRY_WEBHOOK_URL` 등록
   (값은 `.env.local`에 있는 Apps Script `/exec` 주소 — 저장소에는 올라가 있지 않으니 따로 전달받으세요)
3. `vendorup.kr` DNS를 Vercel로 변경

이렇게 하면 코드 수정 없이 그대로 동작하고, 웹훅 주소도 브라우저에 노출되지 않습니다.

### 방법 B — 정적 호스팅을 유지해야 한다면

브라우저에서 Apps Script `/exec` 주소를 **직접** 호출하도록 바꿔야 합니다.
`app/api/inquiry/route.ts`를 지우고, 두 폼의 `fetch("/api/inquiry", ...)`를 웹훅 주소 직접 호출로 교체합니다.

이때 감수해야 하는 것:

| 항목 | 내용 |
| --- | --- |
| 웹훅 주소 노출 | 페이지 소스에 그대로 박힙니다. 주소를 아는 사람은 누구나 시트에 행을 넣을 수 있어 스팸에 취약합니다 |
| 오류 감지 | Apps Script는 CORS 응답이 불안정해, 실패해도 성공처럼 보일 수 있습니다 |
| 스팸 대비 | Apps Script 쪽에 간단한 검증(허용 도메인 확인 등)을 추가하는 게 좋습니다 |

리드(문의) 유실 위험 때문에 **방법 A를 권합니다.**

---

## 환경변수 정리

| 이름 | 값 | 어디에 |
| --- | --- | --- |
| `INQUIRY_WEBHOOK_URL` | Apps Script 웹 앱 `/exec` 주소 | 로컬은 `.env.local`, 배포는 호스팅 설정 |

`.env.local`은 `.gitignore`에 등록되어 저장소에 올라가지 않습니다.
배포 담당자에게는 별도로(메신저 등) 전달해 주세요.

---

## 자주 겪는 문제

| 증상 | 원인·해결 |
| --- | --- |
| 화면에 빨간 실패 안내가 뜬다 | `.env.local`을 만든 뒤 개발 서버를 재시작했는지 확인 |
| 시트엔 쌓이는데 메일이 안 온다 | `ALERT_EMAIL` 주소 오타 확인. 구글 무료 계정은 하루 메일 100통 제한 |
| 권한 승인 창이 계속 뜬다 | 3단계에서 "고급 → 이동"으로 승인해야 합니다 |
| 코드를 고쳤는데 반영이 안 된다 | Apps Script는 **배포 → 배포 관리 → 편집(✏️) → 버전: 새 버전 → 배포**를 해야 반영됩니다 |
