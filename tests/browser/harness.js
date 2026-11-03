/* Shared Playwright harness: serves the repo, routes firebase CDN to the fake, injects data. */
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path');
const FAKE = fs.readFileSync(path.join(__dirname, 'fakefb.js'), 'utf8');
const BASE = process.env.BASE || 'http://127.0.0.1:8765/index.html';
const VER = (fs.readFileSync(path.join(__dirname, '..', '..', 'version.js'), 'utf8').match(/APP_VERSION='([^']+)'/) || [])[1] || '';

async function open({ user, data, fail = null, lang = 'ar', theme = 'light', extraInit = '' , onPopup, sw = false }) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, locale: lang === 'en' ? 'en-GB' : 'ar', serviceWorkers: sw ? 'allow' : 'block' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e && e.message || e)));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.addInitScript(({ user, data, fail, lang, theme, extraInit, ver }) => {
    try { localStorage.setItem('cm_lang', lang); localStorage.setItem('cm_theme', theme); localStorage.removeItem('cm_view'); if (ver) localStorage.setItem('cm_seen_ver', ver); } catch (e) {} // what's-new dialog is checked by pwa.js only
    window.__FAKE = { user, data, fail };
    window.__xss = 0;
    if (extraInit) { try { (0, eval)(extraInit); } catch (e) {} }
  }, { user, data, fail, lang, theme, extraInit, ver: VER });
  // generic first, specific last (Playwright matches routes in reverse registration order)
  await ctx.route(/vendor\/firebase\//, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: '/*noop*/' }));
  await ctx.route(/firebase-app-compat\.js/, r => r.fulfill({ status: 200, contentType: 'application/javascript', body: FAKE }));
  // the fake cannot carry the real SRI hash: serve index.html without integrity attributes
  await ctx.route(/\/index\.html(\?.*)?$/, async r => { const res = await r.fetch(); const body = (await res.text()).replace(/ integrity="[^"]+"/g, ''); r.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body }); });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '' }));
  if (onPopup) ctx.on('page', onPopup);
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(900);
  return { browser, ctx, page, errors };
}
module.exports = { open };
