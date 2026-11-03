/* Home screen (app launcher): landing page, tiles, app search, apps button, crumb, back button, English, phone width */
const { open } = require('./harness');
const roles = { 'admin@test.ly': { role: 'admin', name: 'Admin' } };
const seed = require('../fixtures/seed.sample.json');
const coll = a => Object.fromEntries((Array.isArray(a) ? a : Object.values(a || {})).map((d, i) => [d.id || 'x' + i, d]));
const data = { contracts: coll(seed.contracts), needs: coll(seed.needs), batches: coll(seed.batches), roles, config: { main: { t1: 90, t2: 60, t3: 30 } }, tickets: { t1: { status: 'جديد', subject: 'x' } } };
const out = {};
(async () => {
  { const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A' }, data, theme: 'dark' });
    out.landsHome = await page.evaluate(() => S.view === 'home' && document.body.classList.contains('on-home') && !!document.querySelector('.hm-grid'));
    out.sideHidden = await page.evaluate(() => getComputedStyle(document.querySelector('.side')).display === 'none');
    out.tiles = await page.evaluate(() => document.querySelectorAll('.hm-app').length);
    out.missing = await page.evaluate(() => VIEWS.filter(v => v.id !== 'home' && !document.querySelector(`.hm-app[data-hm="${v.id}"]`)).map(v => v.id));
    out.backHiddenHome = await page.evaluate(() => document.getElementById('back-btn').hidden);
    out.badge = await page.evaluate(() => (document.querySelector('.hm-app[data-hm="cs"] .hm-badge') || {}).textContent === '1');
    await page.fill('#hm-q', 'عقود'); await page.waitForTimeout(150);
    out.searchFilters = await page.evaluate(() => { const v = [...document.querySelectorAll('.hm-app')].filter(b => !b.hidden).map(b => b.dataset.hm); return v.includes('contracts') && !v.includes('meetings'); });
    await page.fill('#hm-q', 'zzzz'); await page.waitForTimeout(150);
    out.noMatch = await page.evaluate(() => !document.getElementById('hm-none').hidden);
    await page.fill('#hm-q', 'كشوفات'); await page.press('#hm-q', 'Enter'); await page.waitForTimeout(500);
    out.enterOpens = await page.evaluate(() => S.view === 'needs');
    out.crumb = await page.evaluate(() => { const c = document.getElementById('app-crumb'); return !c.hidden && /العقود والاحتياجات/.test(c.textContent); });
    out.navbar = await page.evaluate(() => document.querySelector('header.top').classList.contains('o-nav') && !document.body.classList.contains('on-home'));
    out.appMenu = await page.evaluate(() => { const b = [...document.querySelectorAll('#o-menu button')]; return b.length >= 4 && b.find(x => x.getAttribute('aria-current') === 'true').dataset.hm === 'needs'; });
    out.controlPanel = await page.evaluate(() => { const cp = document.querySelector('#view .o-cp'); return !!cp && !!cp.querySelector('.o-bc [data-hm="home"]') && !!cp.querySelector('#n-q'); });
    out.backShown = await page.evaluate(() => !document.getElementById('back-btn').hidden);
    await page.click('#o-menu [data-hm="contracts"]'); await page.waitForTimeout(500);
    out.menuOpens = await page.evaluate(() => S.view === 'contracts');
    await page.click('[data-o-mode="kanban"]'); await page.waitForTimeout(400);
    out.kanban = await page.evaluate(() => document.querySelectorAll('.o-kanban .o-card').length === document.querySelectorAll('#c-table tbody tr').length && document.querySelector('#c-table .tablewrap').classList.contains('o-kb-hide'));
    await page.fill('#c-q', 'الزلط'); await page.waitForTimeout(500);
    out.kanbanFollowsFilter = await page.evaluate(() => { const n = document.querySelectorAll('.o-kanban .o-card').length; return n > 0 && n === document.querySelectorAll('#c-table tbody tr').length; });
    await page.click('.o-kanban .o-card'); await page.waitForTimeout(500);
    out.cardOpensForm = await page.evaluate(() => !!document.querySelector('.drawer.o-form .o-sheet') && !!document.querySelector('.o-stages [aria-current="step"]') && !!document.querySelector('.o-form-bc'));
    await page.click('.o-form-bc [data-act="close-drawer"]'); await page.waitForTimeout(300);
    out.formBreadcrumbCloses = await page.evaluate(() => !document.querySelector('.drawer'));
    await page.fill('#c-q', ''); await page.click('[data-o-mode="list"]'); await page.waitForTimeout(300);
    out.listBack = await page.evaluate(() => !document.querySelector('.o-kanban') && !document.querySelector('.tablewrap.o-kb-hide'));
    await page.click('#apps-btn'); await page.waitForTimeout(400);
    out.appsBtn = await page.evaluate(() => S.view === 'home' && document.getElementById('apps-btn').getAttribute('aria-current') === 'true');
    await page.click('.hm-app[data-hm="meetings"]'); await page.waitForTimeout(500);
    out.tileOpens = await page.evaluate(() => S.view === 'meetings');
    out.alt1Dash = await page.evaluate(() => VIEWS.filter(v => v.nav !== false)[0].id === 'dash');
    await page.setViewportSize({ width: 390, height: 844 }); await page.waitForTimeout(300);
    out.phoneNoHScroll = await page.evaluate(() => document.documentElement.scrollWidth <= 391);
    out.errors = errors;
    await browser.close(); }
  { const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A' }, data, lang: 'en' });
    out.english = await page.evaluate(() => /Find an app/.test(document.getElementById('hm-q').placeholder) && /Good (morning|evening)/.test(document.getElementById('hm-h').textContent));
    out.enErrors = errors;
    await browser.close(); }
  console.log(JSON.stringify(out, null, 1));
  const ok = Object.entries(out).every(([k, v]) => Array.isArray(v) ? v.length === 0 : k === 'tiles' ? v >= 14 : v === true);
  if (!ok) { console.log('HOME FAILED'); process.exit(1); }
  console.log('HOME OK');
})();
