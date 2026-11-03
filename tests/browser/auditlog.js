/* Activity log that cannot be skipped: shared-collection writes go out in one batch with their log entry (_log),
   deletes use an entry id derived from the document's current _log, and every entry carries server time. */
const { open } = require('./harness');
const roles = { 'w@test.ly': { role: 'editor', name: 'W', unit: 'w' } };
const out = {};
(async () => {
  const data = { roles, config: { main: { t1: 90, t2: 60, t3: 30 } }, contracts: { c1: { no: 'A/1', company: 'Old', _log: 'L0' } } };
  const { browser, page, errors } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data });
  await page.waitForTimeout(600);
  const r = await page.evaluate(async () => {
    const db = await appRuntime.use('db'); const L = () => window.__FBLOG.slice();
    const n0 = L().length; await db.collection('contracts').doc('c9').set({ no: 'X/9', company: 'Test' });
    const a = L().slice(n0);
    const n1 = L().length; await db.collection('contracts').doc('c1').update({ company: 'New' });
    const b = L().slice(n1);
    const n2 = L().length; await db.collection('contracts').doc('c1').delete();
    const c = L().slice(n2);
    return { a, b, c };
  });
  const docA = r.a.find(l => l[1] === 'contracts' && l[2] === 'c9'), logA = r.a.find(l => l[1] === 'log');
  out.createLinked = !!docA && !!logA && docA[3]._log === logA[2] && logA[3].col === 'contracts' && logA[3].id === 'c9' && logA[3].user === 'w@test.ly' && logA[3].action === 'إضافة' && !!logA[3].at;
  const docB = r.b.find(l => l[1] === 'contracts' && l[2] === 'c1'), logB = r.b.find(l => l[1] === 'log');
  out.updateLinked = !!docB && !!logB && docB[3]._log === logB[2] && docB[3].company === 'New' && logB[3].action === 'تعديل';
  const del = r.c.find(l => l[0] === 'delete' && l[1] === 'contracts'), logC = r.c.find(l => l[1] === 'log');
  out.deleteDerived = !!del && !!logC && logC[2] === 'del-contracts-c1-' + docB[3]._log && logC[3].action === 'حذف';
  out.errors = errors.filter(e => !/404/.test(e));
  await browser.close();
  console.log(JSON.stringify(out, null, 1));
  const ok = Object.entries(out).every(([k, v]) => Array.isArray(v) ? v.length === 0 : v === true);
  console.log(ok ? 'AUDITLOG OK' : 'AUDITLOG FAIL'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
