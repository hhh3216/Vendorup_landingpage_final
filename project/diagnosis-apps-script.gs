/* =============================================================
   밴더업 진단 이벤트 수집 — 구글 시트용 Apps Script
   -------------------------------------------------------------
   진단 페이지(/diagnosis/)가 클릭마다 한 줄씩 보내는 기록을 시트에 쌓는다.
   설정 방법: project/DIAGNOSIS_DEPLOY.md "0. 지금 쓰는 수집 방법" 참고.

   ponytail: 구글 시트는 동시 실행 30개·시트 1천만 칸이 한계.
   방문이 하루 수천 명을 넘거나 밴더업 API가 생기면 CONFIG.API_URL만 바꿔 옮긴다.
   ============================================================= */

const EVENTS = ['vu_start', 'vu_role', 'vu_view', 'vu_answer', 'vu_calc_open', 'vu_result', 'vu_cta', 'vu_share'];

const HEADER = ['received_at', 'at', 'session', 'event', 'role', 'q', 'area', 'value', 'label',
  'type', 'to', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'referrer', 'page', 'payload'];

const MAX_BODY = 8000; // 결과 한 줄도 2천 자 안팎. 이보다 크면 정상 요청이 아니다.

/** 시트에 넣을 한 줄. 이상한 요청이면 null. */
function toRow(body, now) {
  if (!body || body.length > MAX_BODY) return null;
  let d;
  try { d = JSON.parse(body); } catch (e) { return null; }
  if (!d || EVENTS.indexOf(d.event) < 0) return null;
  if (typeof d.session !== 'string' || !/^vu-[a-z0-9]{4,30}$/.test(d.session)) return null;

  const cell = (v) => {
    if (v === undefined || v === null) return '';
    let s = typeof v === 'object' ? JSON.stringify(v) : String(v);
    s = s.slice(0, 500);
    // =, +, -, @ 로 시작하면 시트가 수식으로 실행한다 → 글자로 고정
    return /^[=+\-@]/.test(s) ? "'" + s : s;
  };
  return [now.toISOString(), d.at, d.session, d.event, d.role, d.q, d.area, d.value, d.label,
    d.type, d.to, d.utm_source, d.utm_medium, d.utm_campaign, d.utm_content, d.referrer, d.page]
    .map(cell)
    .concat([body]); // 받은 JSON 통째로. '{'로 시작해 수식이 될 일이 없다.
}

function doPost(e) {
  const row = toRow(e && e.postData && e.postData.contents, new Date());
  if (row) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADER);
    sheet.appendRow(row);
  }
  // 페이지는 응답을 읽지 않는다. 거른 요청도 같은 응답을 준다.
  return ContentService.createTextOutput('');
}

if (typeof module !== 'undefined') module.exports = { toRow, HEADER };
