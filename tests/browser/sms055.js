/* SMS055 dashboard: import an Excel export shaped like the real report (text dates "8/31/2026 0:00"), save it in parts,
   KPIs match the file, replacing an overlapping file, previous-period comparison, customer detail, export, permissions, English. */
const { open } = require('./harness');
const fs = require('fs'); const path = require('path');
const SHOTS = process.env.SHOTS || '';
const roles = { 'ca@test.ly': { role: 'editor', name: 'CA', unit: 'ca' }, 'w@test.ly': { role: 'editor', name: 'W', unit: 'w' } };
const data = { roles, config: { main: { t1: 90, t2: 60, t3: 30 } } };
// a sample workbook built in the page with the system's own xlsx writer; header names exactly as in SMS055_Report-1
const MAKE = `(function(){
  const P=[['16291','غاز البترول المسال','اسطوانة','87',1.25],['33500','بنزين 95','لتر','1',0.15],['44347','وقود الديزل','لتر','1',0.14]];
  const C=[];for(let i=0;i<40;i++)C.push([String(110019+i*37),'محطة وقود '+['النور','الأمل','الوحدة','السلام','الفجر','البركة','الريان','الهدى'][i%8]+' '+(i+1)]);
  window.__smsBook=(months,seed)=>{let s=seed||7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;const rows=[];
    months.forEach(([y,m,nd,drop])=>{for(let d=1;d<=nd;d++){C.forEach((c,ci)=>{if(drop&&ci<drop)return;if(rnd()<.55)return;const p=P[ci%3===0?0:ci%3===1?1:2];
      const q=Math.round((p[0]==='16291'?20+rnd()*400:3000+rnd()*300000));const v=Math.round(q*p[4]*100)/100;const ret=rnd()<.03;
      rows.push({'التاريخ':m+'/'+d+'/'+y+' 0:00','رقم العميل':c[0],'اسم الزبون':c[1],'رقم المنتج':p[0],'اسم المنتج':p[1],'PACK_CD':p[3],'وحدة القياس':p[2],'النوع':'CH','الكمية':q,'القيمة':v,'الكمية المسترجعة':ret?Math.round(q*.1):'','القيمة المسترجعة':ret?Math.round(v*10)/100:''})})}});
    return rows};
  window.__smsXlsx=async rows=>{const b=buildXlsx([['SMS055_Report-1',rows]]);const u8=new Uint8Array(await b.arrayBuffer());let s='';for(let i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s)};
})()`;
async function upload(page, months, name, seed) {
  const r = await page.evaluate(async ({ months, seed }) => { const rows = __smsBook(months, seed); const net = rows.reduce((a, r) => a + (+r['القيمة'] || 0) - (+r['القيمة المسترجعة'] || 0), 0); return { b64: await __smsXlsx(rows), n: rows.length, net }; }, { months, seed });
  await page.setInputFiles('#sm-file', { name, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from(r.b64, 'base64') });
  await page.waitForTimeout(900); return r;
}
const out = {};
(async () => {
  { const { browser, page, errors } = await open({ user: { email: 'ca@test.ly', displayName: 'CA' }, data, theme: process.env.THEME || 'light' });
    await page.evaluate(MAKE);
    await page.evaluate(() => go('sms055')); await page.waitForTimeout(700);
    out.emptyState = await page.evaluate(() => !!document.querySelector('.sm-empty [data-sm="import"]'));
    // July (all customers) + August (the first 6 customers stop buying)
    const f1 = await upload(page, [[2026, 7, 31, 0], [2026, 8, 31, 6]], 'SMS055_Report-1.xlsx', 11);
    out.preview = await page.evaluate(() => dlg.open && /2026\/07\/01 – 2026\/08\/31/.test(dlg.textContent) && document.querySelectorAll('.sm-cols-map .ok').length === 12);
    out.previewRows = await page.evaluate(n => dlg.textContent.includes(n.toLocaleString('en-US')) || dlg.textContent.includes(new Intl.NumberFormat('ar-LY').format(n)) || dlg.textContent.includes(String(n)), f1.n);
    await page.click('[data-sm="save"]'); await page.waitForTimeout(1200);
    out.savedBatch = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'sms055' && l[3].kind === 'batch' && l[3].from === '2026-07-01' && l[3].to === '2026-08-31' && l[3].createdBy === 'ca@test.ly'));
    out.savedParts = await page.evaluate(() => { const b = window.__FBLOG.find(l => l[0] === 'set' && l[1] === 'sms055' && l[3].kind === 'batch'); const p = window.__FBLOG.filter(l => l[0] === 'set' && l[1] === 'sms055' && l[3].kind === 'part'); return !!b && p.length === b[3].parts && p.every(x => x[2] === x[3].batch + '_p' + x[3].n && x[3].d.length < 900000); });
    out.logged = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'log' && l[3].action === 'استيراد SMS055'));
    out.rowsLoaded = await page.evaluate(n => window.__sms.rows.length === n, f1.n);
    out.netMatches = await page.evaluate(net => { const r = window.__sms.rows; const v = r.reduce((a, x) => a + x.v - x.rv, 0); return Math.abs(v - net) < 0.01; }, f1.net);
    out.dashboard = await page.evaluate(() => document.querySelectorAll('.an-kpis .kpi').length === 6 && document.querySelectorAll('.sm-col').length > 0 && document.querySelectorAll('.sm-pc').length === 3 && document.querySelectorAll('.sm-tbl tbody tr').length === 25);
    // latest month: August vs July, 6 customers stopped
    await page.click('[data-sm-pre="month"]'); await page.waitForTimeout(500);
    out.monthDaily = await page.evaluate(() => document.querySelectorAll('.sm-col').length === 31);
    out.lostCustomers = await page.evaluate(() => /6 زبون اشتروا في الفترة السابقة/.test(document.querySelector('.sm-ins').textContent));
    out.delta = await page.evaluate(() => !!document.querySelector('.sm-hero .sm-delta'));
    if (SHOTS) { await page.screenshot({ path: path.join(SHOTS, 'sms055-dashboard-' + (process.env.THEME || 'light') + '.png'), fullPage: true }); }
    // product filter + search + customer detail
    await page.selectOption('#sm-prod', '16291'); await page.waitForTimeout(400);
    out.productFilter = await page.evaluate(() => document.querySelectorAll('.sm-pc').length === 1);
    await page.fill('#sm-q', 'النور'); await page.waitForTimeout(600);
    out.search = await page.evaluate(() => [...document.querySelectorAll('.sm-tbl tbody tr')].every(tr => /النور/.test(tr.textContent)));
    await page.click('.sm-tbl tbody tr[data-sm-cust]'); await page.waitForTimeout(300);
    out.custDialog = await page.evaluate(() => dlg.open && /حسب المنتج/.test(dlg.textContent));
    await page.evaluate(() => dlg.close());
    await page.click('[data-sm="clear"]'); await page.waitForTimeout(300);
    const dl = page.waitForEvent('download', { timeout: 5000 }).then(d => d.suggestedFilename()).catch(() => '');
    await page.click('[data-sm="export"]'); const fnm = await dl; out.exportFile = /^SMS055-analysis-.*\.xlsx$/.test(fnm) || fnm;
    // a corrected August file replaces the overlapping saved file
    const f2 = await upload(page, [[2026, 8, 31, 0]], 'SMS055_Report-aug.xlsx', 5);
    out.overlapWarn = await page.evaluate(() => !!document.getElementById('sm-replace'));
    await page.click('[data-sm="save"]'); await page.waitForTimeout(1200);
    out.replaced = await page.evaluate(() => window.__sms.batches.length === 1 && window.__sms.batches[0].file === 'SMS055_Report-aug.xlsx' && window.__FBLOG.some(l => l[0] === 'delete' && l[1] === 'sms055'));
    out.rowsAfterReplace = await page.evaluate(n => window.__sms.rows.length === n, f2.n);
    await page.click('[data-sm="files"]'); await page.waitForTimeout(300);
    out.filesDialog = await page.evaluate(() => dlg.open && document.querySelectorAll('[data-sm-del]').length === 1);
    await page.evaluate(() => dlg.close());
    // the department page in the org dashboard shows the summary card
    await page.evaluate(() => go('org', { om: 'dash', of: 'ca' })); await page.waitForTimeout(600);
    out.orgCard = await page.evaluate(() => !!document.querySelector('#view [data-org-go="sms055"]'));
    out.orgTask = await page.evaluate(() => ORG_TASKS.ca.includes('sms055'));
    // a file without the SMS055 columns is refused with a clear message
    await page.evaluate(() => go('sms055')); await page.waitForTimeout(400);
    await page.setInputFiles('#sm-file', { name: 'other.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b,c\n1,2,3\n') }); await page.waitForTimeout(500);
    out.badFile = await page.evaluate(() => dlg.open && /لم نجد أعمدة/.test(dlg.textContent));
    await page.evaluate(() => dlg.close());
    // the same report saved as CSV with d/m/yyyy dates
    await page.setInputFiles('#sm-file', { name: 'sms.csv', mimeType: 'text/csv', buffer: Buffer.from('﻿التاريخ,رقم العميل,اسم الزبون,رقم المنتج,اسم المنتج,وحدة القياس,النوع,الكمية,القيمة,الكمية المسترجعة,القيمة المسترجعة\n31/08/2026,1,"زبون، أ",33500,بنزين,لتر,CH,"1,000",150,,\n30/08/2026,2,زبون ب,33500,بنزين,لتر,CH,500,75,10,1.5\n') }); await page.waitForTimeout(600);
    out.csv = await page.evaluate(() => dlg.open && /2026\/08\/30 – 2026\/08\/31/.test(dlg.textContent));
    await page.click('[data-sm="view-local"]'); await page.waitForTimeout(400);
    out.localView = await page.evaluate(() => !!window.__sms.local && window.__sms.local.rows.length === 2 && window.__sms.local.rows[0].q === 1000 && window.__sms.local.rows[0].cn === 'زبون، أ' && /عرض مؤقت/.test(document.getElementById('view').textContent));
    out.errors = errors.filter(e => !/404/.test(e));
    await browser.close(); }
  // an editor of another department can analyse a file but not save it
  { const { browser, page, errors } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data });
    await page.evaluate(MAKE); await page.evaluate(() => go('sms055')); await page.waitForTimeout(700);
    await upload(page, [[2026, 8, 10, 0]], 'x.xlsx', 3);
    out.otherNoSave = await page.evaluate(() => dlg.open && !dlg.querySelector('[data-sm="save"]') && !!dlg.querySelector('[data-sm="view-local"]'));
    out.otherErrors = errors.filter(e => !/404/.test(e));
    await browser.close(); }
  // English
  { const { browser, page, errors } = await open({ user: { email: 'ca@test.ly', displayName: 'CA' }, data, lang: 'en' });
    await page.evaluate(MAKE); await page.evaluate(() => go('sms055')); await page.waitForTimeout(700);
    await upload(page, [[2026, 8, 31, 0]], 'SMS055_Report-1.xlsx', 9); await page.click('[data-sm="save"]'); await page.waitForTimeout(1200);
    out.english = await page.evaluate(() => /SMS055 sales dashboard/.test(document.getElementById('view').textContent) && /Net sales/.test(document.getElementById('view').textContent));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'sms055-dashboard-en.png'), fullPage: true });
    out.enErrors = errors.filter(e => !/404/.test(e));
    await browser.close(); }
  console.log(JSON.stringify(out, null, 1));
  const ok = Object.entries(out).every(([k, v]) => Array.isArray(v) ? v.length === 0 : v === true);
  console.log(ok ? 'SMS055 OK' : 'SMS055 FAILED'); process.exit(ok ? 0 : 1);
})();
