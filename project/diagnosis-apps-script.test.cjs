// node project/diagnosis-apps-script.test.cjs
const fs = require('fs'), vm = require('vm'), assert = require('assert');
const m = { exports: {} };
vm.runInNewContext(fs.readFileSync(__dirname + '/diagnosis-apps-script.gs', 'utf8'), { module: m });
const { toRow, HEADER } = m.exports;
const now = new Date('2026-11-16T00:00:00Z');

const ok = JSON.stringify({ event: 'vu_answer', session: 'vu-mwiss3ljdom1q', role: 'res', q: 'r_multi', value: 2, label: '=HYPERLINK("x")', answers: { a: 1 } });
const row = toRow(ok, now);
assert.strictEqual(row.length, HEADER.length);
assert.strictEqual(row[3], 'vu_answer');
assert.strictEqual(row[7], '2');
assert.strictEqual(row[8], '\'=HYPERLINK("x")'); // 수식 실행 막힘
assert.strictEqual(row[row.length - 1], ok);     // payload 통째로

assert.strictEqual(toRow('not json', now), null);
assert.strictEqual(toRow(JSON.stringify({ event: 'hack', session: 'vu-abcd1' }), now), null);
assert.strictEqual(toRow(JSON.stringify({ event: 'vu_start', session: 'x' }), now), null);
assert.strictEqual(toRow('x'.repeat(9000), now), null);
assert.strictEqual(toRow(undefined, now), null);
console.log('ok');
