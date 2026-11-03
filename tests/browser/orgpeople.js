/* Org people: names and staff numbers are not in the public code; they load from config/orgPeople after sign-in */
const { open } = require('./harness');
const fs = require('fs'); const path = require('path');
const roles = { 'admin@test.ly': { role: 'admin', name: 'Admin' }, 'w@test.ly': { role: 'editor', name: 'W', unit: 'w' } };
const people = { v: 1, people: { gm: { head: 'Test GM Person', empNo: '900001' }, 'gm-fo': { head: 'Test Office Head', empNo: '900002' } }, holder: { 'gm-fo': 'Test Office Head' }, updatedAt: '2026-11-03T00:00:00.000Z', by: 'admin@test.ly' };
const out = {}; let errs = [];
(async () => {
  // code carries no names or staff numbers
  const org = fs.readFileSync(path.join(__dirname, '..', '..', 'org.js'), 'utf8');
  const rows = org.slice(org.indexOf('const ORG_ROWS=['), org.indexOf('const ORG_TYPES'));
  out.rowsHaveNoPeople = rows.split('\n').filter(l => /^\s*\[/.test(l)).every(l => { const m = l.match(/'[^']*'|null/g) || []; return m.length <= 4 && !/\d{5,}/.test(l); });
  out.dutiesNoHolder = !/holder:'/.test(fs.readFileSync(path.join(__dirname, '..', '..', 'duties-data.js'), 'utf8'));
  // 1) editor with the document: names show on the chart, the dashboard and the job card
  { const { browser, page, errors } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data: { roles, config: { main: {}, orgPeople: people } } });
    await page.evaluate(() => go('org', { om: 'chart' })); await page.waitForTimeout(700);
    out.chartName = await page.evaluate(() => [...document.querySelectorAll('.oc-name')].some(e => e.textContent === 'Test GM Person'));
    out.state = await page.evaluate(() => window.__orgPeople().state + ':' + window.__orgPeople().count);
    out.noNote = await page.evaluate(() => !document.getElementById('op-note'));
    out.search = await page.evaluate(() => ORG.filter(o => norm([o.title, o.head, o.empNo].join(' ')).includes('900002')).length === 1);
    await page.evaluate(() => go('duties')); await page.waitForTimeout(500); await page.evaluate(() => { const b = document.querySelector('[data-dt-unit="gm-fo"]') || document.querySelector('[data-dt-unit="gm"]'); if (b) b.click(); }); await page.waitForTimeout(500); out.jobHolderUnit = await page.evaluate(() => !!document.querySelector('.dt-job'));
    out.jobHolder = await page.evaluate(() => { const v = document.getElementById('view').textContent; return /Test Office Head/.test(v); });
    errs = errs.concat(errors); await browser.close(); }
  // 2) no document yet: titles only, a note on the org page, no errors
  { const { browser, page, errors } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data: { roles, config: { main: {} } } });
    await page.evaluate(() => go('org', { om: 'chart' })); await page.waitForTimeout(700);
    out.missingNote = await page.evaluate(() => !!document.getElementById('op-note'));
    out.missingNoNames = await page.evaluate(() => ORG.every(o => !o.head && !o.empNo));
    errs = errs.concat(errors); await browser.close(); }
  // 3) admin imports a JSON file from settings; unknown ids are dropped
  { const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A' }, data: { roles, config: { main: {} } } });
    await page.evaluate(() => go('settings')); await page.waitForTimeout(800);
    out.panel = await page.evaluate(() => !!document.getElementById('op-panel'));
    const tmp = path.join(require('os').tmpdir(), 'op-test.json');
    fs.writeFileSync(tmp, JSON.stringify({ people: { board: { head: 'Imported Board', empNo: 123456 }, nosuch: { head: 'x' } }, holder: {} }));
    await page.setInputFiles('#op-file', tmp); await page.waitForTimeout(800);
    out.imported = await page.evaluate(() => { const l = window.__FBLOG.filter(x => x[0] === 'set' && x[1] === 'config' && x[2] === 'orgPeople').pop(); return !!l && l[3].people.board.head === 'Imported Board' && l[3].people.board.empNo === '123456' && !l[3].people.nosuch && l[3].by === 'admin@test.ly'; });
    out.importLogged = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'log' && l[3].id === 'orgPeople'));
    out.applied = await page.evaluate(() => ORG_BY.get('board').head === 'Imported Board');
    errs = errs.concat(errors); await browser.close(); }
  out.errors = errs;
  console.log(JSON.stringify(out, null, 1));
  const bad = Object.entries(out).filter(([k, v]) => k === 'errors' ? v.length : v !== true && !(k === 'state' && v === 'ok:2'));
  if (bad.length) { console.log('FAIL', bad.map(b => b[0])); process.exit(1); }
  console.log('PASS orgpeople');
})();
