/* Checks for batch 5: external seed file, accessibility (skip link, live toast), numbered meeting decisions */
const { open } = require('./harness');
const today = new Date().toISOString().slice(0, 10);
const plus = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
const roles = { 'admin@test.ly': { role: 'admin', name: 'Admin' }, 'gm@test.ly': { role: 'editor', name: 'GM', unit: 'gm' } };
const out = {};
(async () => {
  // 1) admin on an empty database: seed banner, seed fetched from data/seed.json
  { const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A' }, data: { roles, config: { main: { t1: 90, t2: 60, t3: 30 } } } });
    await page.waitForTimeout(800);
    out.noInlineSeed = await page.evaluate(() => !document.getElementById('seed-data'));
    out.seedBanner = await page.evaluate(() => !!document.querySelector('[data-act="seed-now"]'));
    out.skipLink = await page.evaluate(() => { const a = document.querySelector('a.skip-link'); return !!a && a.getAttribute('href') === '#view' && document.getElementById('view').tabIndex === -1; });
    out.toastLive = await page.evaluate(() => { const t = document.getElementById('toast'); return t.getAttribute('role') === 'status' && t.getAttribute('aria-live') === 'polite'; });
    await page.click('[data-act="seed-now"]'); await page.waitForTimeout(2500);
    out.seedWrites = await page.evaluate(() => window.__FBLOG.filter(l => l[0] === 'set' && l[1] === 'contracts').length);
    out.adminErrors = errors.filter(e => !/404/.test(e));
    await browser.close(); }
  // 2) organizer adds decisions: sequential numbers YYYY/NNN, shown in the table
  { const data = { roles, config: { main: { t1: 90, t2: 60, t3: 30 } },
      meetings: { m1: { title: 'Board', units: ['gm', 'w'], organizer: 'gm', createdBy: 'gm@test.ly', date: plus(1), time: '10:00', status: 'scheduled', agenda: [], decisions: [], rsvp: {} },
                  m0: { title: 'Earlier', units: ['gm'], organizer: 'gm', createdBy: 'gm@test.ly', date: plus(-30), time: '10:00', status: 'closed', agenda: [], decisions: [{ no: plus(1).slice(0, 4) + '/001', t: 'old', unit: 'gm', done: true }], rsvp: {} } } };
    const { browser, page, errors } = await open({ user: { email: 'gm@test.ly', displayName: 'GM' }, data });
    await page.evaluate(() => go('meetings')); await page.waitForTimeout(600);
    await page.click('[data-mt-open="m1"]'); await page.waitForTimeout(500);
    await page.fill('#mt-dt', 'Approve the budget'); await page.click('[data-mt="add-dec"]'); await page.waitForTimeout(500);
    const yr = plus(1).slice(0, 4);
    out.decNumbered = await page.evaluate(() => { const l = window.__FBLOG.filter(x => x[1] === 'meetings' && x[2] === 'm1').pop(); const d = l && l[3].decisions; return d && d.length === 1 ? d[0].no : null; });
    out.decNumberOk = out.decNumbered === yr + '/002';
    await page.fill('#mt-dt', 'Second'); await page.click('[data-mt="add-dec"]'); await page.waitForTimeout(500);
    out.decSecond = await page.evaluate(() => { const l = window.__FBLOG.filter(x => x[1] === 'meetings' && x[2] === 'm1').pop(); const d = l && l[3].decisions; return d && d.length === 2 ? d[1].no : null; });
    out.decTable = await page.evaluate(yr => [...document.querySelectorAll('.drawer td.num')].some(td => td.textContent.trim() === yr + '/002'), yr);
    out.gmErrors = errors.filter(e => !/404/.test(e));
    await browser.close(); }
  console.log(JSON.stringify(out, null, 1));
  const ok = out.noInlineSeed && out.seedBanner && out.skipLink && out.toastLive && out.seedWrites > 0 && out.decNumberOk && out.decSecond === plus(1).slice(0, 4) + '/003' && out.decTable && !out.adminErrors.length && !out.gmErrors.length;
  console.log(ok ? 'POLISH OK' : 'POLISH FAIL'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
