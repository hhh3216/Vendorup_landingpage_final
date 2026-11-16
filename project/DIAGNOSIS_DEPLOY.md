# 밴더업 진단 — 배포 안내

정적 페이지 하나예요. 서버 코드 없이 폴더째 올리면 바로 열려요.
이 저장소에서는 `public/diagnosis/`에 있어서, 랜딩을 빌드(`npm run build`)하면 `out/diagnosis/`로 같이 나가요.

## 0. 지금 쓰는 수집 방법 — 구글 시트 (2026-11-16)

밴더업 API가 아직 없어서, 모든 클릭 기록은 **구글 시트**에 쌓아요. 문의 폼과 같은 방식이에요([INQUIRY_WEBHOOK_SETUP.md](INQUIRY_WEBHOOK_SETUP.md)).
문의 시트와는 **따로** 만들어요(문의 스크립트는 업체명·연락처가 없는 요청을 버려요).

1. [sheets.new](https://sheets.new)로 새 시트를 만들고 이름을 `Vendor-UP 진단 기록`으로 바꿔요. 제목 줄은 스크립트가 첫 기록 때 알아서 넣어요.
2. **확장 프로그램 → Apps Script**에서 기본 코드를 지우고 [diagnosis-apps-script.gs](diagnosis-apps-script.gs) 내용을 통째로 붙여넣고 저장해요.
   (맨 아래 `if (typeof module ...` 줄은 로컬 검사용이에요. 그대로 둬도 돼요.)
3. **배포 → 새 배포 → 웹 앱**: 실행 = **나**, 액세스 = **모든 사용자** → 배포 → 권한 승인(고급 → 이동).
4. 나온 `https://script.google.com/macros/s/…/exec` 주소를 `public/diagnosis/index.html`의 `CONFIG.API_URL`에 넣고 다시 빌드·배포해요.
5. 진단을 한 번 끝까지 해 보고 시트에 줄이 쌓이는지 봐요.

- 스크립트를 고치면 **배포 관리 → 편집 → 새 버전**으로 다시 배포해야 반영돼요.
- 스크립트는 정해진 이벤트(`vu_…`)와 형식에 맞는 `session`만 받고, 나머지는 조용히 버려요. `=`로 시작하는 값은 수식으로 실행되지 않게 글자로 넣어요.
- 스크립트를 고친 뒤 확인: `node project/diagnosis-apps-script.test.cjs` → `ok`
- 한계: 구글 시트는 칸 1천만 개(이 시트 기준 약 50만 줄, 방문 2만 명쯤), 동시 실행 30개까지예요. 그 전에 밴더업 API가 생기면 아래 4번 명세대로 만들고 `API_URL`만 바꾸면 돼요.

## 1. 올리기

- 이 폴더(`index.html`, `assets/`)를 그대로 `https://vendorup.kr/diagnosis/` 같은 경로에 올려 주세요.
- `assets/` 폴더는 `index.html`과 같은 위치에 있어야 해요(로고·글꼴을 상대 경로로 불러와요).
- 카카오톡·인스타 공유 미리보기가 잘 뜨려면 `index.html`의 `og:image`를 절대 주소로 바꿔 주세요.
  예: `https://vendorup.kr/diagnosis/assets/logo.png`

## 2. 설정값 (index.html 안 `CONFIG` 한 곳만 바꾸면 돼요)

```js
const CONFIG = {
  GA4_ID:   'G-XXXXXXXXXX',                    // GA4 측정 ID
  API_URL:  '/api/diagnosis/events',           // 밴더업 API 수집 주소, ''면 보내지 않음
  LINK_SUP: 'https://vendorup.kr/suppliers/',  // 공급업체 랜딩
  LINK_RES: '',                                // 자영업자 랜딩, 비어 있으면 https://vendorup.kr/
  UTM: {utm_source:'vendorup_diagnosis', utm_medium:'referral', utm_campaign:'diagnosis_2026'}
};
```

- `GA4_ID`가 `G-XXXXXXXXXX` 그대로면 GA4를 불러오지 않아요. 실제 ID를 넣는 순간 수집이 시작돼요.
- 자영업자 랜딩이 생기면 `LINK_RES`에 주소만 넣으면 돼요. "사요"와 "둘 다요"로 들어온 사람의 결과 버튼이 그 주소로 가요.

## 3. GA4에서 보는 법

| 알고 싶은 것 | GA4에서 보는 곳 |
|---|---|
| 진단 페이지 방문 수 | 보고서 → 페이지 및 화면 → `/diagnosis/` 페이지 조회 |
| 진단 시작 수 | 이벤트 `diagnosis_start` |
| 설문 완료 수 | 이벤트 `diagnosis_complete` |
| 진단 → 밴더업 랜딩 이동 수 | 이벤트 `landing_click` (매개변수 `destination`: suppliers / restaurant) |
| 랜딩에서 본 유입 | 랜딩 페이지 보고서에서 `utm_source = vendorup_diagnosis` 세션 |

설정 권장:
- 관리 → 이벤트에서 `diagnosis_complete`, `landing_click`을 **주요 이벤트(전환)** 로 표시
- 맞춤 측정기준 등록: `role`, `result_type`, `destination` (이벤트 범위)
- 진단 페이지와 랜딩이 **같은 GA4 속성**을 쓰면 "진단 → 랜딩 → 입점 문의"를 한 경로로 볼 수 있어요

GA4로 보내는 이벤트

| 이벤트 | 언제 | 매개변수 |
|---|---|---|
| `diagnosis_start` | 시작 버튼 | — |
| `diagnosis_role` | 입장 선택 | `role` (sup / res / both) |
| `diagnosis_complete` | 결과 도착 | `role`, `result_type`, `loss_manwon`, `hours` |
| `landing_click` | 결과의 랜딩 버튼 | `role`, `destination`, `link_url` |
| `result_share` | 결과 복사 | `role` |

## 4. 밴더업 API (모든 클릭)

- 방식: `POST {API_URL}`, 본문은 JSON 문자열, `Content-Type: text/plain`
  (다른 도메인이어도 사전 요청(preflight) 없이 가요. 서버에서 본문을 JSON으로 읽어 주세요. 다른 도메인이면 `Access-Control-Allow-Origin`만 열어 주세요)
- 응답: 아무거나(204 권장). 페이지는 응답을 기다리지 않아요.
- 개인정보는 보내지 않아요. `session`은 방문마다 새로 만드는 무작위 값이에요.

한 줄 예시
```json
{"event":"vu_answer","session":"vu-mwiss3ljdom1q","role":"res","at":"2026-11-16T05:02:57.051Z",
 "page":"/diagnosis/","utm_source":"instagram","referrer":"https://l.instagram.com/",
 "q":"r_multi","area":"res_order","value":2,"label":"딱 우리 얘기예요","index":2}
```

| event | 언제 | 추가 필드 |
|---|---|---|
| `vu_start` | 시작 | — |
| `vu_role` | 입장 선택 | `value` |
| `vu_view` | 질문 화면이 뜰 때 | `q`, `area`, `index`, `total` |
| `vu_answer` | 답 선택 | `q`, `area`, `value`, `label`, `index` |
| `vu_calc_open` | 손해 계산 열기 | — |
| `vu_result` | 결과 | `type`, `top`, `scores`, `hours`, `money_manwon`, `answers` |
| `vu_cta` | 랜딩 버튼 | `to`, `url`, `type` |
| `vu_share` | 결과 복사 | — |

모든 줄 공통: `event, session, role, at, page` + 들어온 링크의 `utm_source / utm_medium / utm_campaign / utm_content`, `referrer`

저장 표 예시
```sql
create table diagnosis_events (
  id bigserial primary key,
  session text, event text, role text, q text, label text,
  at timestamptz, utm_source text,
  payload jsonb,               -- 받은 JSON 통째로
  received_at timestamptz default now()
);
```

자주 쓸 조회
```sql
-- 질문별로 가장 많이 눌린 답
select q, label, count(*) from diagnosis_events where event='vu_answer' group by 1,2 order by 1,3 desc;
-- 어디서 그만두는지: 질문별 본 사람 vs 답한 사람
select q, count(*) filter (where event='vu_view') as viewed,
          count(*) filter (where event='vu_answer') as answered
from diagnosis_events group by q;
-- 시작 → 완료 → 랜딩 클릭
select count(distinct session) filter (where event='vu_start')  as started,
       count(distinct session) filter (where event='vu_result') as completed,
       count(distinct session) filter (where event='vu_cta')    as clicked
from diagnosis_events;
```
