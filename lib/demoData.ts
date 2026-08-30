/* =============================================================
   §6 라이브 데모 — 사전 정의 예시 기반 시뮬레이션
   -------------------------------------------------------------
   기획 확정사항: **실제 AI 연동 없음.** 어뷰징·비용·응답지연 리스크 제거.
   여기 있는 사전(dictionary)과 파서가 "AI가 읽었다"를 대신한다.

   UX 방식: ANIMATION_SPEC §6의 미확정 항목 (A) 자유 입력 허용 + 실패 시 예시 유도
   로 구현했다 (미확정 시 A + 폴백이 문서상 기본값).

   ⚠️ 품목코드는 시안의 데모 카드 값을 그대로 쓴 **목업 값**이다.
      실제 품목 마스터가 정해지면 ITEMS의 code만 교체하면 된다.
   ============================================================= */

export type DemoRow = {
  code: string;
  name: string;
  qty: string;
  unit: string;
};

type ItemDef = {
  /** 거래처가 부르는 이름들 — 첫 번째가 대표 표기 */
  aliases: string[];
  code: string;
  /** 이 품목에서 자연스러운 단위 */
  defaultUnit: string;
};

const ITEMS: ItemDef[] = [
  { aliases: ["청상추", "상추"], code: "VG-0142", defaultUnit: "박스" },
  { aliases: ["대파", "파"], code: "VG-0311", defaultUnit: "단" },
  { aliases: ["계란", "달걀"], code: "EG-0027", defaultUnit: "판" },
  { aliases: ["양파"], code: "VG-0203", defaultUnit: "망" },
];

const UNITS = ["박스", "단", "판", "망", "개", "kg", "봉", "묶음"];

/** 원문 하이라이트용 조각. hit=true 인 조각에 배경이 순차 점등된다. */
export type Segment = { text: string; hit: boolean };

export type ParseResult =
  | { ok: true; rows: DemoRow[]; segments: Segment[] }
  | { ok: false };

/** "어제랑 똑같이" 류 — 이전 주문 이력으로 해석한다 */
const REPEAT_PATTERNS = ["어제", "저번", "지난번", "똑같", "동일하게", "같은거", "같은 거"];

const PREVIOUS_ORDER: DemoRow[] = [
  { code: "VG-0142", name: "청상추", qty: "2", unit: "박스" },
  { code: "VG-0311", name: "대파", qty: "5", unit: "단" },
  { code: "EG-0027", name: "계란", qty: "15", unit: "판" },
];

/** 시안의 예시 칩 3개 */
export const EXAMPLES = [
  "내일 청상추 2박스, 대파 5단 부탁드려요",
  "오늘 어제꺼랑 똑같이요",
  "계란 15판이랑 양파 3망요",
];

export const PLACEHOLDER = "예) 내일 청상추 2박스, 대파 5단, 계란 15판 부탁드려요";

function findItem(token: string): ItemDef | undefined {
  return ITEMS.find((item) => item.aliases.some((alias) => token.includes(alias)));
}

/**
 * 주문 문장에서 `품목 + 수량 + 단위` 덩어리를 찾아낸다.
 * 매칭된 덩어리는 하이라이트 조각으로, 나머지는 평문 조각으로 쪼갠다.
 */
export function parseOrder(input: string): ParseResult {
  const text = input.trim();
  if (!text) return { ok: false };

  const aliasGroup = ITEMS.flatMap((i) => i.aliases)
    .sort((a, b) => b.length - a.length) // 긴 별칭 우선 (청상추 > 상추)
    .join("|");
  const unitGroup = UNITS.join("|");

  // 품목 … 수량 … 단위 (사이에 조사·공백 허용)
  const re = new RegExp(`(${aliasGroup})\\s*[은는이가도\\s]*\\s*(\\d+)\\s*(${unitGroup})?`, "g");

  const rows: DemoRow[] = [];
  const segments: Segment[] = [];
  const seen = new Set<string>();
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    const item = findItem(match[1]);
    if (!item) continue;
    if (seen.has(item.code)) continue;
    seen.add(item.code);

    if (match.index > cursor) {
      segments.push({ text: text.slice(cursor, match.index), hit: false });
    }
    segments.push({ text: match[0], hit: true });
    cursor = match.index + match[0].length;

    rows.push({
      code: item.code,
      name: item.aliases[0],
      qty: match[2],
      unit: match[3] || item.defaultUnit,
    });
  }

  if (rows.length) {
    if (cursor < text.length) segments.push({ text: text.slice(cursor), hit: false });
    return { ok: true, rows, segments };
  }

  // 수량 없이 "어제랑 똑같이" 류 — 이전 주문 이력으로 해석
  if (REPEAT_PATTERNS.some((p) => text.includes(p))) {
    const hitIndex = REPEAT_PATTERNS.map((p) => text.indexOf(p)).find((i) => i >= 0) ?? -1;
    if (hitIndex >= 0) {
      const pattern = REPEAT_PATTERNS.find((p) => text.includes(p))!;
      const end = hitIndex + pattern.length;
      return {
        ok: true,
        rows: PREVIOUS_ORDER,
        segments: [
          { text: text.slice(0, hitIndex), hit: false },
          { text: text.slice(hitIndex, end), hit: true },
          { text: text.slice(end), hit: false },
        ].filter((s) => s.text.length > 0),
      };
    }
  }

  return { ok: false };
}
