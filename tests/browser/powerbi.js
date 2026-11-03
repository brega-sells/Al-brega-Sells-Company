/* Power BI next to Excel: a joined Power BI button beside every Excel export/import, the export dialog and .zip pack
   (UTF-8 CSV with BOM, typed Power Query script, read-me), the plain Excel button still downloads .xlsx,
   the import dialog opens the same file picker, CSV import in settings, CSV injection guard, English. */
const { open } = require('./harness');
const fs = require('fs'); const path = require('path');
const SHOTS = process.env.SHOTS || '';
const roles = { 'admin@test.ly': { role: 'admin', name: 'Admin' } };
const seed = require('../fixtures/seed.sample.json');
const coll = a => Object.fromEntries((Array.isArray(a) ? a : Object.values(a || {})).map((d, i) => [d.id || 'x' + i, d]));
const data = { contracts: coll(seed.contracts), needs: coll(seed.needs), batches: coll(seed.batches), roles, config: { main: { t1: 90, t2: 60, t3: 30 } }, tickets: { t1: { status: 'جديد', subject: 'x' } } };
// minimal stored-zip reader (bi.js writes method 0)
function unzip(buf) { let e = buf.length - 22; while (e >= 0 && buf.readUInt32LE(e) !== 0x06054b50) e--; const n = buf.readUInt16LE(e + 10); let p = buf.readUInt32LE(e + 16); const out = {};
  for (let i = 0; i < n; i++) { const cs = buf.readUInt32LE(p + 20), nl = buf.readUInt16LE(p + 28), xl = buf.readUInt16LE(p + 30), cl = buf.readUInt16LE(p + 32), lo = buf.readUInt32LE(p + 42); const name = buf.slice(p + 46, p + 46 + nl).toString('utf8');
    const lnl = buf.readUInt16LE(lo + 26), lxl = buf.readUInt16LE(lo + 28); out[name] = buf.slice(lo + 30 + lnl + lxl, lo + 30 + lnl + lxl + cs); p += 46 + nl + xl + cl; } return out; }
const out = {};
(async () => {
  { const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A' }, data, theme: process.env.THEME || 'light' });
    await page.evaluate(() => { const s = S.downloads.save; window.__saved = []; S.downloads.save = a => { window.__saved.push(a.filename); return s(a); }; });
    const last = () => page.evaluate(() => window.__saved[window.__saved.length - 1] || '');
    const views = ['contracts', 'needs', 'dir', 'ana', 'cs', 'org', 'duties'];
    out.buttons = {};
    for (const v of views) { await page.evaluate(v => go(v), v); await page.waitForTimeout(500);
      out.buttons[v] = await page.evaluate(() => { const g = [...document.querySelectorAll('#view .bi-grp')]; return g.length && g.every(x => x.children.length === 2 && /excel/i.test(x.children[0].textContent) && x.children[1].matches('.bi-btn[data-bi]')); }); }
    out.allViews = Object.values(out.buttons).every(Boolean);
    await page.evaluate(() => go('contracts')); await page.waitForTimeout(500);
    out.noDouble = await page.evaluate(() => { render(); return new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => r(document.querySelectorAll('#view [data-act="export-contracts"]').length === 1 && document.querySelectorAll('#view .bi-grp').length === 1)))); });
    // plain Excel still gives .xlsx
    await page.click('#view [data-act="export-contracts"]'); await page.waitForTimeout(300); out.excelStill = /\.xlsx$/.test(await last());
    // Power BI: dialog then zip
    await page.click('#view .bi-btn[data-bi="exp"]'); await page.waitForTimeout(300);
    out.dialog = await page.evaluate(() => { const d = document.getElementById('bi-dlg'); return !!d && d.open && d.querySelectorAll('.bi-tables li').length === 1 && /العقود/.test(d.textContent) && !!d.querySelector('[data-bi="zip"]') && !!d.querySelector('[data-bi="csv"]'); });
    out.dateTyped = await page.evaluate(() => !!document.querySelector('#bi-dlg .bi-ty-date'));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'powerbi-dialog-ar.png') });
    const [d1] = await Promise.all([page.waitForEvent('download'), page.click('#bi-dlg [data-bi="zip"]')]);
    out.zipName = /-PowerBI\.zip$/.test(await last());
    const z = unzip(fs.readFileSync(await d1.path())); const names = Object.keys(z);
    out.zipFiles = names.includes('العقود.csv') && names.includes('BregaPowerBI.pq') && names.some(n => /README/.test(n));
    const csv = z['العقود.csv'] ? z['العقود.csv'].toString('utf8') : '';
    const rows = await page.evaluate(() => S.contracts.length);
    out.csvBom = csv.charCodeAt(0) === 0xFEFF;
    out.csvRows = csv.trim().split('\r\n').length >= rows + 1; // quoted multi-line cells may add lines
    out.csvHeader = /رقم العقد/.test(csv.split('\r\n')[0]);
    const pq = z['BregaPowerBI.pq'] ? z['BregaPowerBI.pq'].toString('utf8') : '';
    out.pq = /Csv\.Document\(File\.Contents\(FolderPath & "العقود\.csv"\)/.test(pq) && /Encoding = 65001/.test(pq) && /type date/.test(pq) && /Table\.TransformColumnTypes/.test(pq);
    out.dialogClosed = await page.evaluate(() => !document.getElementById('bi-dlg').open);
    // after a Power BI export the next Excel click is Excel again
    await page.click('#view [data-act="export-contracts"]'); await page.waitForTimeout(300); out.excelAfter = /\.xlsx$/.test(await last());
    // CSV injection guard + types in the pack builder
    out.inject = await page.evaluate(() => { const p = __biPack([['t', [{ a: '=HYPERLINK("x")', b: -5, c: '2026-01-02', d: '-x', e: 'a,b' }]]], 'f.xlsx'); const c = p.csv[0];
      return c.includes(`"'=HYPERLINK(""x"")"`) && c.includes(',-5,') && c.includes("'-x") && c.includes('"a,b"') && p.tables[0].types.b === 'int' && p.tables[0].types.c === 'date'; });
    // settings: import counterpart + CSV import
    await page.evaluate(() => go('settings')); await page.waitForTimeout(500);
    out.importBtn = await page.evaluate(() => !!document.querySelector('#view label.btn + .bi-btn[data-bi="imp"]') && !!document.querySelector('#view [data-act="export-all"] + .bi-btn[data-bi="exp"]'));
    const chooser = page.waitForEvent('filechooser', { timeout: 4000 }).catch(() => null);
    await page.click('#view .bi-btn[data-bi="imp"]'); await page.waitForTimeout(200);
    out.importDialog = await page.evaluate(() => document.getElementById('bi-dlg').open && /Export data/.test(document.getElementById('bi-dlg').textContent));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'powerbi-import-ar.png') });
    await page.click('#bi-dlg [data-bi="pick"]'); out.picker = !!(await chooser);
    const c0 = await page.evaluate(() => S.contracts[0]);
    const body = '﻿' + 'رقم العقد,الشركة المتعاقدة,القيمة\r\n' + `${c0.no},"${c0.company}",123456\r\n` + 'PBI-NEW-1,"شركة تجربة, ليبيا",1000\r\n';
    await page.setInputFiles('#imp-file', { name: 'powerbi-export.csv', mimeType: 'text/csv', buffer: Buffer.from(body, 'utf8') }); await page.waitForTimeout(600);
    out.csvImport = await page.evaluate(() => /2 عقد \(1 جديد، 1 تحديث\)/.test(document.getElementById('imp-res').textContent));
    out.csvParse = await page.evaluate(() => JSON.stringify(__biParseCsv('a;b\r\n"x;y";"q""z"\n1;2')) === JSON.stringify([['a', 'b'], ['x;y', 'q"z'], ['1', '2']]));
    // SMS055 import counterpart
    await page.evaluate(() => go('sms055')); await page.waitForTimeout(500);
    out.smsImport = await page.evaluate(() => !!document.querySelector('#view [data-sm="import"] + .bi-btn[data-bi="imp"]'));
    // phone width: icon only, no overflow
    await page.setViewportSize({ width: 390, height: 800 }); await page.waitForTimeout(300);
    out.phone = await page.evaluate(() => getComputedStyle(document.querySelector('#view .bi-btn .bi-lbl')).display === 'none' && document.documentElement.scrollWidth <= 392);
    out.errors = errors.filter(e => !/favicon|ERR_|net::/.test(e));
    await browser.close(); }
  { const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A' }, data, lang: 'en', theme: 'dark' });
    await page.evaluate(() => go('contracts')); await page.waitForTimeout(500);
    out.english = await page.evaluate(() => { const b = document.querySelector('#view .bi-btn'); return !!b && b.title === 'Export to Power BI'; });
    await page.click('#view .bi-btn[data-bi="exp"]'); await page.waitForTimeout(300);
    out.englishDialog = await page.evaluate(() => /Export to Power BI/.test(document.getElementById('bi-dlg').textContent) && /Download Power BI pack/.test(document.getElementById('bi-dlg').textContent));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'powerbi-dialog-en-dark.png') });
    out.errorsEn = errors.filter(e => !/favicon|ERR_|net::/.test(e));
    await browser.close(); }
  // in-app analysis (Power BI style)
  { const evil = '<img src=x onerror="window.__xss=1">';
    const d2 = JSON.parse(JSON.stringify(data)); const ks = Object.keys(d2.contracts); d2.contracts[ks[0]].status = evil; d2.contracts[ks[0]].location = evil;
    const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A' }, data: d2, theme: process.env.THEME || 'light' });
    await page.evaluate(() => go('contracts')); await page.waitForTimeout(500);
    await page.click('#view .bi-btn[data-bi="exp"]'); await page.waitForTimeout(300);
    out.dashButton = await page.evaluate(() => !!document.querySelector('#bi-dlg [data-bi="dash"].primary'));
    await page.click('#bi-dlg [data-bi="dash"]'); await page.waitForTimeout(400);
    out.dashOpen = await page.evaluate(() => { const d = document.getElementById('bi-dash'); return !!d && d.open && !document.getElementById('bi-dlg').open; });
    out.dashKpis = await page.evaluate(() => document.querySelectorAll('#bi-dash .bd-kpi').length >= 4);
    out.dashVisuals = await page.evaluate(() => ['.bd-line', '.bd-donut path', '.bd-bars li', '.bd-sc', '.bd-table tbody tr'].every(s => document.querySelector('#bi-dash ' + s)) && document.querySelectorAll('#bi-dash .bd-card').length === 6);
    out.dashMeasure = await page.evaluate(() => document.querySelector('#bi-dash [data-bd="m"]').value === 'القيمة');
    const sumBefore = await page.evaluate(() => document.querySelector('#bi-dash .bd-kpi b').textContent);
    await page.click('#bi-dash .bd-bars li:nth-child(2)'); await page.waitForTimeout(150);
    out.crossFilter = await page.evaluate(() => !!document.querySelector('#bi-dash .bd-clear') && document.querySelectorAll('#bi-dash .bd-bars li.bd-dim').length >= 1);
    out.filterChangesKpi = await page.evaluate(b => document.querySelector('#bi-dash .bd-kpi b').textContent !== b, sumBefore);
    await page.click('#bi-dash .bd-clear'); await page.waitForTimeout(150);
    out.clear = await page.evaluate(() => !document.querySelector('#bi-dash .bd-clear'));
    await page.selectOption('#bi-dash [data-bd="m"]', '__count'); await page.waitForTimeout(150);
    out.countMeasure = await page.evaluate(() => /عدد السجلات/.test(document.querySelector('#bi-dash .bd-kpi span').textContent));
    const yb = await page.$$('#bi-dash [data-bd-year]'); if (yb.length > 1) { await yb[1].click(); await page.waitForTimeout(150); }
    out.yearSlicer = await page.evaluate(() => !!document.querySelector('#bi-dash [data-bd-year][aria-pressed="true"]:not([data-bd-year=""])'));
    await page.hover('#bi-dash .bd-bars li'); await page.waitForTimeout(100);
    out.tooltip = await page.evaluate(() => { const t = document.querySelector('#bi-dash .bd-tip'); return !t.hidden && t.textContent.length > 2; });
    await page.click('#bi-dash [data-bd-year=""]'); await page.waitForTimeout(100);
    out.dashXss = await page.evaluate(() => { const sel = document.querySelector('#bi-dash [data-bd="dim"]'); const o = [...sel.options].find(x => /الموقع/.test(x.value)); if (o) { sel.value = o.value; sel.dispatchEvent(new Event('change', { bubbles: true })); } return !window.__xss && !document.querySelector('#bi-dash img') && document.getElementById('bi-dash').textContent.includes('<img'); });
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'powerbi-analysis-ar.png') });
    await page.click('#bi-dash [data-bd="pack"]'); await page.waitForTimeout(200);
    out.dashToPack = await page.evaluate(() => !document.getElementById('bi-dash').open && document.getElementById('bi-dlg').open);
    await page.keyboard.press('Escape');
    // a screen without dates (needs) still analyses by category
    await page.evaluate(() => go('needs')); await page.waitForTimeout(400);
    await page.click('#view .bi-btn[data-bi="exp"]'); await page.waitForTimeout(200); await page.click('#bi-dlg [data-bi="dash"]'); await page.waitForTimeout(300);
    out.needsDash = await page.evaluate(() => document.querySelectorAll('#bi-dash .bd-card').length >= 3 && !!document.querySelector('#bi-dash .bd-donut path'));
    await page.setViewportSize({ width: 390, height: 800 }); await page.waitForTimeout(200);
    out.dashPhone = await page.evaluate(() => { const b = document.querySelector('#bi-dash .bd-body'); return b.scrollWidth <= b.clientWidth + 1; });
    out.errorsDash = errors.filter(e => !/favicon|ERR_|net::/.test(e));
    await browser.close(); }
  console.log(JSON.stringify(out, null, 1));
  const ok = Object.entries(out).every(([k, v]) => k === 'buttons' || (k === 'errors' || k === 'errorsEn' || k === 'errorsDash' ? v.length === 0 : v === true));
  console.log(ok ? 'POWERBI OK' : 'POWERBI FAIL'); process.exit(ok ? 0 : 1);
})();
