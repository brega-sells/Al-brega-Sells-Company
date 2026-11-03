/* Home screen (app launcher): landing page, tiles, app search, apps button, crumb, back button, English, phone width */
const { open } = require('./harness');
const roles = { 'admin@test.ly': { role: 'admin', name: 'Admin' } };
const data = { roles, config: { main: { t1: 90, t2: 60, t3: 30 } }, tickets: { t1: { status: 'جديد', subject: 'x' } } };
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
    out.crumb = await page.evaluate(() => { const c = document.getElementById('app-crumb'); return !c.hidden && /كشوفات الاحتياجات/.test(c.textContent); });
    out.sideBack = await page.evaluate(() => getComputedStyle(document.querySelector('.side')).display !== 'none' && !document.body.classList.contains('on-home'));
    out.backShown = await page.evaluate(() => !document.getElementById('back-btn').hidden);
    await page.click('#apps-btn'); await page.waitForTimeout(400);
    out.appsBtn = await page.evaluate(() => S.view === 'home' && document.getElementById('apps-btn').getAttribute('aria-current') === 'true');
    await page.click('.hm-app[data-hm="meetings"]'); await page.waitForTimeout(500);
    out.tileOpens = await page.evaluate(() => S.view === 'meetings');
    await page.click('.side .brand'); await page.waitForTimeout(400);
    out.brandHome = await page.evaluate(() => S.view === 'home');
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
