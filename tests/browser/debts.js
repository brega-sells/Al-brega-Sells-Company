/* Debts dashboard: imports synthetic workbooks shaped like the monthly «مديونية كاملة» statement (summary sheet with
   غ / ش categories and sector subtotals, foreign currency, region sheets with customer accounts) and the fuel value
   statement; checks the saved parts, totals against the stated grand total, KPIs (DSO, collection rate), estimated
   FIFO aging over three months, continuity between statements, follow-up priorities, account detail, export,
   replacing a month, refusal of a wrong file, another department, English + dark. */
const { open } = require('./harness');
const path = require('path');
const SHOTS = process.env.SHOTS || '';
const roles = { 'ca@test.ly': { role: 'editor', name: 'CA', unit: 'ca' }, 'w@test.ly': { role: 'editor', name: 'W', unit: 'w' } };
const data = { roles, config: { main: { t1: 90, t2: 60, t3: 30 } } };

/* entities: [name, region, sector, opening (June), monthly withdrawals, monthly collections] */
const CATS = [['شركة الكهرباء', 'W', 'الممولة من وزارة المالية', 1000000, 100000, 0], ['شركة الكهرباء', 'E', 'الممولة من وزارة المالية', 500000, 50000, 0],
  ['شركات التوزيع', 'W', 'شركات توزيع', 300000, 80000, 80000], ['شركات التوزيع', 'E', 'شركات توزيع', 200000, 40000, 60000]];
const CUST = [['160725', 'ليبيا للنفط المشتركة', 'W', 'شركات التوزيع', 200000, 50000, 50000], ['161500', 'شرارة ذهبية طرابلس', 'W', 'شركات التوزيع', 100000, 30000, 30000],
  ['262013', 'شركة الشرارة الذهبية', 'E', 'شركات التوزيع', 200000, 40000, 60000], ['167053', 'حسابات بدون حركة', 'W', 'حسابات قديمة', 90000, 0, 0]];
const MONTHS = [['2026-05-31', '2026-06-30'], ['2026-06-30', '2026-07-31'], ['2026-07-31', '2026-08-31']];
const bal = (e, m, wi, ci, oi) => { const o = e[oi] + (e[wi] - e[ci]) * m; return [o, e[wi], e[ci], o + e[wi] - e[ci]]; };
function ledger(m, bump) {
  const [prev, asOf] = MONTHS[m]; const S = [];
  const head = ['اسم الزبون', 'الرصيد في', prev, 'المسحوبات', 'التسويات المدينة', 'التحصيلات', 'التسويات الدائنة', 'الرصيد في', asOf];
  S.push([], ['', '', 'إدارة الشؤون التجارية والتحصيلات\nملخص أرصدة حسابات المدينون التجاريون', '', '', '', '', 'رقم الوثيقة', 'BPMC-FIN-TOC-F38'], ['اولا : ديون حسابات بالعملة المحلية'], ['كما هي في دفاترنا الرئيسية ليوم', '', '', '', '', asOf], head, ['', 'مدين', 'دائن', '', '', '', '', 'مدين', 'دائن']);
  const T = [0, 0, 0, 0]; let g = [0, 0, 0, 0];
  CATS.forEach((e, i) => { const [o, w, c, cb] = bal(e, m, 4, 5, 3); const w2 = w + (bump && i === 0 ? bump : 0), cb2 = cb + (bump && i === 0 ? bump : 0);
    S.push([e[0] + (e[1] === 'W' ? ' غ' : ' ش'), o, i === 2 ? -1500 : 0, w2, 0, -c, 0, cb2, i === 2 ? -1500 : 0]); g = [g[0] + o, g[1] + w2, g[2] + c, g[3] + cb2];
    if (i % 2) { S.push([' ' + e[2] + ' ', g[0], i === 3 ? -1500 : 0, g[1], 0, -g[2], 0, g[3], i === 3 ? -1500 : 0]); T.forEach((_, k) => T[k] += g[k]); g = [0, 0, 0, 0]; } });
  S.push(['اجمالي  ديون حسابات بالعملة المحلية', T[0], -3000, T[1], 0, -T[2], 0, T[3], -3000]);
  S.push([], ['ثانيا : ديون حسابات بالعملة الأجنبية'], ['البيان', 'الرصيد في', prev, 'المسحوبات', 'التسويات المدينة', 'التحصيلات', 'التسويات الدائنة', 'الرصيد في', asOf], ['', 'حسابات مدينة', 'حسابات دائنة', '', '', '', '', 'حسابات مدينة', 'حسابات دائنة'],
    ['تزويد السفن غ', 1000, 0, 500, 0, -400, 0, 1100, 0], ['تزويد السفن ش', 2000, 0, 0, 0, 0, 0, 2000, 0], ['إجمالي المنطقتين', 3000, 0, 500, 0, -400, 0, 3100, 0], ['اجمالي ديون حسابات بالعملة الأجنبية', 3000, 0, 500, 0, -400, 0, 3100, 0]);
  const region = (rg, title) => { const R = [[], ['', '', 'إدارة الشؤون التجارية والتحصيلات\nحسابات العملة المحلية ' + title]]; let sec = '';
    CUST.filter(c => c[2] === rg).forEach(c => { if (c[3] !== sec) { sec = c[3]; R.push(['ديون حسابات ' + sec + ' " ' + title + ' "'], ['اسم الزبون', 'رقم الحساب', 'الرصيد في', prev, 'المسحوبات ', 'التسويات المدينة', 'التحصيلات والتسوية الدائنة', '', 'الرصيد في', asOf], ['', '', 'مدين', '', '', '', '', '', 'مدين ']); }
      const [o, w, cl, cb] = bal(c, m, 5, 6, 4); R.push([c[1], c[0], o, '0.00', w, 0, -cl, '', cb, 0]); });
    R.push(['إجمالي حسابات المنطقة', '', 1, '', 1, 1, 1, '', 1], ['اعداد:-', 'فلان']); return R; };
  return [['ملخص المحلية والأجنبية', S], ['المنطقة الغربية', region('W', 'المنطقة الغربية')], ['المنطقة الشرقية', region('E', 'المنطقة الشرقية')]];
}
function fuel() { const S = [[], ['', '', 'نموذج تقرير المحروقات'], ['بيان بقيمة المحروقات عن شهر اغسطس لسنة 2026 م وفق كمية المحروقات للجهات الممولة من الدولة'],
  ['نوع المنتوج', 'اسم الزبون', 'الكمية بالطن', 'الكمية باللتر', 'الكمية بالعدد', 'قيمة المبيعات النقدية', 'قيمة المبيعات الآجلة', 'اجمالي قيمة المبيعات', 'حصة البريقة الجهات الممولة', 'حصة المؤسسة  النقدية والاجلة', 'حصة المؤسسة الجهات الممولة', 'حصة النهر  الجهات الممولة'],
  [' الديزل', 'الكهرباء', 100, 120000, 0, 0, 150000, 150000, 60000, 0, 60000, 30000], ['المجموع', '', 100, 120000, 0, 0, 150000, 150000, 60000, 0, 60000, 30000],
  ['بيان بقيمة المحروقات عن شهر اغسطس لسنة 2026 م وفق كمية المحروقات لباقي الزبائن الغير ممولة'],
  ['نوع المنتوج', 'اسم الزبون', 'الكمية بالطن', 'الكمية باللتر', 'الكمية بالعدد', 'قيمة المبيعات النقدية', 'قيمة المبيعات الآجلة', 'اجمالي قيمة المبيعات', 'حصة البريقة  النقدية والاجلة ', 'حصة المؤسسة  النقدية والاجلة', 'حصة المؤسسة الجهات الممولة', 'حصة النهر النقدية والاجلة '],
  ['بنزين', 'شركات التوزيع', 400, 540000, 0, 50000, 30000, 80000, 60000, 10000, 0, 10000], ['الإجمالي العام', '', '', '', '', 50000, 180000, 230000]];
  return [['اغسطس', S]]; }
const MAKE = `window.__dbXlsx=async(sheets)=>{const L=i=>{let s='';i++;while(i){const r=(i-1)%26;s=String.fromCharCode(65+r)+s;i=Math.floor((i-1)/26)}return s};
  const b=buildXlsx(sheets.map(([n,rows])=>[n,rows.map(r=>{const o={};for(let i=0;i<10;i++)o[L(i)]='';r.forEach((v,i)=>o[L(i)]=v);return o})]));
  const u8=new Uint8Array(await b.arrayBuffer());let s='';for(let i=0;i<u8.length;i+=8192)s+=String.fromCharCode.apply(null,u8.subarray(i,i+8192));return btoa(s)};`;
async function upload(page, sheets, name) {
  const b64 = await page.evaluate(s => __dbXlsx(s), sheets);
  await page.setInputFiles('#db-file', { name, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', buffer: Buffer.from(b64, 'base64') });
  await page.waitForTimeout(900);
}
const out = {};
const txt = (page, sel) => page.evaluate(s => (document.querySelector(s) || {}).textContent || '', sel);
(async () => {
  { const { browser, page, errors } = await open({ user: { email: 'ca@test.ly', displayName: 'CA' }, data, theme: process.env.THEME || 'light' });
    await page.evaluate(MAKE); await page.evaluate(() => go('debts')); await page.waitForTimeout(600);
    out.emptyState = await page.evaluate(() => !!document.querySelector('.sm-empty [data-dbt="import"]'));
    out.powerBiNext = await page.evaluate(() => !!document.querySelector('#view [data-dbt="import"] + .bi-btn[data-bi="imp"]'));
    // August statement
    await upload(page, ledger(2), 'مديونية كاملة 8-2026.xlsx');
    const dlg = await txt(page, '#dlg');
    out.review = /مراجعة الملف/.test(dlg) && /كما في 2026\/08\/31/.test(dlg) && /✓ مجموع الفئات/.test(dlg);
    out.parsed = await page.evaluate(() => { const P = window.__debts.ST.pending[0]; return P.T === 'ledger' && P.asOf === '2026-08-31' && P.prev === '2026-07-31' && P.cats.filter(c => c.cur === 'L').length === 4 && P.cats.filter(c => c.cur === 'F').length === 2
      && new Set(P.cats.filter(c => c.cur === 'L').map(c => c.g)).size === 2 && P.cats.filter(c => c.rg === 'W').length === 3 && P.custs.length === 4 && P.custs.find(c => c.a === '262013').rg === 'E' && P.custs.find(c => c.a === '167053').sec === 'حسابات قديمة'; });
    await page.click('#dlg [data-dbt="save"]'); await page.waitForTimeout(1500);
    out.savedBatch = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'debts_report' && l[3].kind === 'batch' && l[3].sheet === 'ledger' && l[3].from === '2026-08-01' && l[3].to === '2026-08-31' && l[3].parts === 1));
    out.savedPart = await page.evaluate(() => { const p = window.__FBLOG.find(l => l[0] === 'set' && l[1] === 'debts_report' && l[3].kind === 'part'); return !!p && JSON.parse(p[3].d).cats.length === 6; });
    out.logged = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'log' && /^استيراد كشف الديون/.test(l[3].action)));
    // closing Aug: 1.3M + 0.65M + 0.3M + 0.14M = 2,390,000 ; withdrawals 270,000 ; collections 140,000
    out.hero = /^2\.4 مليون$/.test(await txt(page, '.sm-hero-v b'));
    const kpis = await page.evaluate(() => [...document.querySelectorAll('#view .an-kpis .kpi')].map(k => k.textContent));
    out.kpis = kpis.length >= 8;
    out.dso = kpis.some(k => /DSO/.test(k) && /274 يوم/.test(k)); // 2,390,000 / 270,000 × 31
    out.collectionRate = kpis.some(k => /نسبة التحصيل = التحصيلات ÷ المسحوبات = 51.9%/.test(k));
    out.reading = await page.evaluate(() => document.querySelectorAll('#view .sm-ins li').length >= 8);
    out.statedOk = await page.evaluate(() => [...document.querySelectorAll('#view .sm-ins li')].some(l => /يطابق «إجمالي ديون الحسابات»/.test(l.textContent)));
    out.dormant = await page.evaluate(() => [...document.querySelectorAll('#view .sm-ins li')].some(l => /<b>1<\/b> حسابًا عليها رصيد مدين/.test(l.innerHTML)));
    out.oneMonthAging = await page.evaluate(() => { const s = [...document.querySelectorAll('#view .an-grid > section')].find(x => /أعمار الديون/.test(x.textContent)); return !!s && s.querySelectorAll('.sm-legend span').length === 2 && /أكثر من 30 يومًا/.test(s.textContent); });
    out.priorities = await page.evaluate(() => { const s = [...document.querySelectorAll('#view .an-grid > section')].find(x => /أولويات المتابعة/.test(x.textContent)); return !!s && s.querySelectorAll('tr[data-db-acct]').length === 4 && /مراجعة الحساب القديم/.test(s.textContent); });
    // June and July statements → three months: four aging buckets and the continuity check holds
    await upload(page, ledger(0), 'مديونية كاملة 6-2026.xlsx'); out.noOverlap = await page.evaluate(() => !document.getElementById('db-replace'));
    await page.click('#dlg [data-dbt="save"]'); await page.waitForTimeout(1200);
    await upload(page, ledger(1), 'مديونية كاملة 7-2026.xlsx'); await page.click('#dlg [data-dbt="save"]'); await page.waitForTimeout(1200);
    out.latestShown = await page.evaluate(() => document.getElementById('db-at').value === '2026-08-31' && document.querySelectorAll('#db-at option').length === 3);
    out.aging3 = await page.evaluate(() => { const s = [...document.querySelectorAll('#view .an-grid > section')].find(x => /أعمار الديون/.test(x.textContent)); const L = [...s.querySelectorAll('.sm-legend span')].map(x => x.textContent);
      // FIFO: 0–30 = 270k drawn in Aug, 31–60 = 270k (July), 61–90 = 270k (June), rest = 2.39M − 0.81M = 1.58M
      return L.length === 4 && /0–30/.test(L[0]) && /270 ألف/.test(L[0]) && /61–90/.test(L[2]) && /أكثر من 90 يومًا/.test(L[3]) && /1\.6 مليون/.test(L[3]); });
    out.continuity = await page.evaluate(() => ![...document.querySelectorAll('#view .sm-ins li')].some(l => /لا يطابق الرصيد الختامي/.test(l.textContent)) && [...document.querySelectorAll('#view .sm-ins li')].some(l => /مقارنة بكشف يوليو 2026/.test(l.textContent)));
    out.trend = await page.evaluate(() => document.querySelectorAll('#view .sm-col').length === 4);
    // account detail with history
    await page.click('#view tr[data-db-acct]'); await page.waitForTimeout(300);
    out.detail = await page.evaluate(() => document.getElementById('dlg').open && /حسب الكشف الشهري/.test(document.getElementById('dlg').textContent) && document.querySelectorAll('#dlg tbody tr').length === 3);
    await page.click('#dlg [data-act="close-dlg"]'); await page.waitForTimeout(200);
    // filters: east region only
    await page.selectOption('#db-rg', 'E'); await page.waitForTimeout(400);
    out.regionFilter = /790 ألف/.test(await txt(page, '.sm-hero-v b')); // electricity E 650k + distribution E 140k
    await page.click('#view [data-dbt="clear"]'); await page.waitForTimeout(300);
    // foreign currency
    await page.selectOption('#db-cur', 'F'); await page.waitForTimeout(400);
    out.foreign = /3,100|3100/.test(await txt(page, '.sm-hero-v b')) && /عملة أجنبية/.test(await txt(page, '.sm-hero-v span'));
    await page.selectOption('#db-cur', 'L'); await page.waitForTimeout(300);
    // export
    const dl = page.waitForEvent('download').then(d => d.suggestedFilename());
    await page.click('#view [data-dbt="export"]'); out.exportFile = /^Debts-analysis-2026-08-31\.xlsx$/.test(await dl);
    // fuel statement of August → reconciliation line
    await upload(page, fuel(), 'نسخة معدلة شهر08-2026.xlsx');
    out.fuelReview = /بيان قيمة المحروقات/.test(await txt(page, '#dlg')) && /✓ مجموع الصفوف/.test(await txt(page, '#dlg'));
    await page.click('#dlg [data-dbt="save"]'); await page.waitForTimeout(1200);
    out.fuelSaved = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'debts_report' && l[3].kind === 'batch' && l[3].sheet === 'fuel' && l[3].value === 230000));
    out.fuelCheck = await page.evaluate(() => [...document.querySelectorAll('#view .sm-ins li')].some(l => /مطابقة مع «بيان قيمة المحروقات»/.test(l.textContent)));
    out.fuelPanel = await page.evaluate(() => [...document.querySelectorAll('#view .an-grid > section')].some(x => /بيان قيمة المحروقات — أغسطس 2026/.test(x.textContent)));
    // a corrected August statement replaces the saved one
    await upload(page, ledger(2, 5000), 'مديونية كاملة 8-2026 معدلة.xlsx');
    out.overlapWarn = await page.evaluate(() => !!document.getElementById('db-replace') && document.getElementById('db-replace').checked);
    await page.click('#dlg [data-dbt="save"]'); await page.waitForTimeout(1500);
    out.replaced = await page.evaluate(() => window.__debts.ST.batches.filter(b => b.sheet === 'ledger').length === 3 && window.__debts.ST.batches.some(b => /معدلة/.test(b.file)) && window.__FBLOG.some(l => l[0] === 'delete' && l[1] === 'debts_report'));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'debts-dashboard-' + (process.env.THEME || 'light') + '.png'), fullPage: true });
    // a wrong file is refused
    await upload(page, [['Sheet1', [['التاريخ', 'الكمية', 'المنتج'], ['2026-08-01', 5, 'بنزين']]]], 'other.xlsx');
    out.refused = /تعذّر الاستيراد/.test(await txt(page, '#dlg')) && /لم نتعرّف على الملف/.test(await txt(page, '#dlg'));
    await page.click('#dlg [data-act="close-dlg"]'); await page.waitForTimeout(200);
    // placement
    out.orgTask = await page.evaluate(() => ORG_TASKS.ca.includes('debts') && VIEWS.some(v => v.id === 'debts' && v.group === 'مهام إدارة الشؤون التجارية والتحصيلات'));
    await page.evaluate(() => go('org')); await page.waitForTimeout(600);
    out.orgCard = await page.evaluate(() => !!document.querySelector('#view [data-org-go="debts"]'));
    await page.evaluate(() => go('home')); await page.waitForTimeout(600);
    out.homeTile = await page.evaluate(() => !!document.querySelector('.hm-app[data-hm="debts"]'));
    out.errors = errors.filter(e => !/favicon|manifest|fonts/.test(e));
    await browser.close(); }
  // another department: cannot save, can view locally
  { const { browser, page } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data, theme: 'light' });
    await page.evaluate(MAKE); await page.evaluate(() => go('debts')); await page.waitForTimeout(700);
    await upload(page, ledger(2), 'debts.xlsx');
    out.otherNoSave = await page.evaluate(() => !document.querySelector('#dlg [data-dbt="save"]') && !!document.querySelector('#dlg [data-dbt="view-local"]'));
    await page.click('#dlg [data-dbt="view-local"]'); await page.waitForTimeout(500);
    out.otherLocal = await page.evaluate(() => !!document.querySelector('#view .banner.info') && document.querySelectorAll('#view .an-kpis .kpi').length >= 6);
    await browser.close(); }
  // English + dark
  { const { browser, page, errors } = await open({ user: { email: 'ca@test.ly', displayName: 'CA' }, data, lang: 'en', theme: 'dark' });
    await page.evaluate(MAKE); await page.evaluate(() => go('debts')); await page.waitForTimeout(700);
    await upload(page, ledger(2), 'debts-8-2026.xlsx'); await page.click('#dlg [data-dbt="save"]'); await page.waitForTimeout(1200);
    out.english = await page.evaluate(() => { const t = document.getElementById('view').textContent; return /Debts dashboard/.test(t) && /Days sales outstanding/.test(t) && /Import Excel file/.test(t) && /Debt aging \(estimated\)/.test(t); });
    out.englishMenu = await page.evaluate(() => { const b = document.querySelector('#o-menu button[data-hm="debts"]'); return !!b && /Debts/.test(b.textContent); });
    out.englishErrors = errors.filter(e => !/favicon|manifest|fonts/.test(e));
    if (SHOTS) await page.screenshot({ path: path.join(SHOTS, 'debts-dashboard-en-dark.png'), fullPage: true });
    await browser.close(); }
  console.log(JSON.stringify(out, null, 1));
  const ok = Object.values(out).every(v => Array.isArray(v) ? v.length === 0 : v === true);
  console.log(ok ? 'DEBTS OK' : 'DEBTS FAILED'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
