/* Admin safety: Google-only admin sign-in switch, full JSON backup + reminder, backup file check; long tables load in pages */
const { open } = require('./harness');
const fs = require('fs'); const path = require('path'); const os = require('os');
const roles = { 'admin@test.ly': { role: 'admin', name: 'Admin' }, 'w@test.ly': { role: 'editor', name: 'W', unit: 'w' } };
const contracts = {}; for (let i = 1; i <= 250; i++) contracts['c' + i] = { no: 'T/' + i, company: 'Co ' + i, value: 10 };
const out = {}; let errs = [];
(async () => {
  // 1) Google admin: panels, reminder, backup download + record, enable the switch
  { const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A', providerData: [{ providerId: 'google.com' }] }, data: { roles, config: { main: {} }, contracts, records: { r1: { unit: 'w', title: 'R' } } } });
    await page.evaluate(() => go('home')); await page.waitForTimeout(900);
    out.reminderOnHome = await page.evaluate(() => !!document.getElementById('sf-note'));
    await page.evaluate(() => go('settings')); await page.waitForTimeout(900);
    out.panels = await page.evaluate(() => !!document.getElementById('sf-sec') && !!document.getElementById('sf-bk'));
    const dl = page.waitForEvent('download', { timeout: 8000 });
    await page.click('[data-sf="backup"]'); const d = await dl;
    out.backupName = /^brega-backup-\d{4}-\d{2}-\d{2}\.json$/.test(d.suggestedFilename());
    const file = path.join(os.tmpdir(), 'bk-test.json'); await d.saveAs(file);
    const j = JSON.parse(fs.readFileSync(file, 'utf8'));
    out.backupContent = j.app === 'brega-sales' && Object.keys(j.collections.contracts).length === 250 && !!j.collections.records.r1 && !!j.collections.roles['admin@test.ly'];
    await page.waitForTimeout(600);
    out.backupRecorded = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'config' && l[2] === 'backup' && l[3].docs > 250));
    out.backupLogged = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'log' && l[3].id === 'backup'));
    out.statusOk = await page.evaluate(() => !!document.querySelector('#sf-bk .sf-st.ok'));
    await page.setInputFiles('#sf-check', file); await page.waitForTimeout(400);
    out.checkShowsCounts = await page.evaluate(() => /نسخة سليمة/.test(document.getElementById('sf-res').textContent) && /250/.test(document.getElementById('sf-res').textContent));
    await page.click('[data-sf="sec-on"]'); await page.waitForTimeout(700);
    out.secReauthGoogle = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'reauth-popup'));
    out.secSaved = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'config' && l[2] === 'security' && l[3].adminGoogle === true && l[3].by === 'admin@test.ly'));
    out.secOkStatus = await page.evaluate(() => !!document.querySelector('#sf-sec .sf-st.ok'));
    // paging: 100 rows, then 200, then all 250
    await page.evaluate(() => go('contracts')); await page.waitForTimeout(500);
    const n = () => page.evaluate(() => document.querySelectorAll('#view tbody tr[data-open-c]').length);
    out.page1 = (await n()) === 100;
    await page.click('[data-pg="c"]'); await page.waitForTimeout(300); out.page2 = (await n()) === 200;
    await page.click('[data-pg-all="c"]'); await page.waitForTimeout(300); out.pageAll = (await n()) === 250 && !(await page.$('[data-pg="c"]'));
    await page.fill('#c-q', 'Co 1'); await page.waitForTimeout(600); out.pageReset = (await n()) <= 100;
    errs = errs.concat(errors); await browser.close(); }
  // 2) password admin while Google-only is on: warning, switch disabled
  { const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A', providerData: [{ providerId: 'password' }] }, data: { roles, config: { main: {}, security: { adminGoogle: true, by: 'admin@test.ly', at: '2026-11-04' }, backup: { at: new Date().toISOString(), by: 'admin@test.ly', docs: 5 } } } });
    await page.evaluate(() => go('contracts')); await page.waitForTimeout(900);
    out.weakWarning = await page.evaluate(() => { const e = document.getElementById('sf-note'); return !!e && /Google/.test(e.textContent); });
    await page.evaluate(() => go('settings')); await page.waitForTimeout(700);
    out.offDisabled = await page.evaluate(() => { const b = document.querySelector('[data-sf="sec-off"]'); return !!b && b.disabled; });
    out.adminGoogleFlag = await page.evaluate(() => window.__adminGoogle === true);
    errs = errs.concat(errors); await browser.close(); }
  // 3) editor: no panels
  { const { browser, page, errors } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data: { roles, config: { main: {} } } });
    await page.evaluate(() => go('settings')); await page.waitForTimeout(700);
    out.editorNoPanels = await page.evaluate(() => !document.getElementById('sf-sec') && !document.getElementById('sf-bk'));
    errs = errs.concat(errors); await browser.close(); }
  out.errors = errs;
  console.log(JSON.stringify(out, null, 1));
  const bad = Object.entries(out).filter(([k, v]) => k === 'errors' ? v.length : v !== true);
  if (bad.length) { console.log('FAIL', bad.map(b => b[0])); process.exit(1); }
  console.log('SAFETY OK');
})();
