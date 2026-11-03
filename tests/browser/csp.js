/* Content-Security-Policy: no inline scripts allowed, and walking every screen raises no CSP violation. */
const { open } = require('./harness');
const seed = require('../fixtures/seed.sample.json');
const coll = a => Object.fromEntries(a.map((d, i) => [d.id || 'x' + i, d]));
const roles = { 'admin@test.ly': { role: 'admin', name: 'Admin' } };
const data = { contracts: coll(seed.contracts), needs: coll(seed.needs), batches: coll(seed.batches), roles, config: { main: { t1: 90, t2: 60, t3: 30 } } };
const out = {};
(async () => {
  const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A' }, data,
    extraInit: "window.__csp=[];document.addEventListener('securitypolicyviolation',e=>window.__csp.push(e.violatedDirective+' '+(e.blockedURI||'inline')))" });
  out.noInlineScriptPolicy = await page.evaluate(() => { const m = document.querySelector('meta[http-equiv="Content-Security-Policy"]').content; const s = (m.match(/script-src([^;]*)/) || [])[1] || ''; return !!s && !/unsafe-inline|unsafe-eval/.test(s); });
  out.noInlineScripts = await page.evaluate(() => [...document.scripts].every(s => s.src || s.type === 'application/json'));
  out.logoFile = await page.evaluate(() => { const i = document.querySelector('.side .brand-mark img'); return !!i && /icons\/logo\.webp$/.test(i.src) && i.complete && i.naturalWidth > 0; });
  out.htmlSmall = await page.evaluate(async () => (await (await fetch('index.html')).text()).length < 40000);
  out.views = await page.evaluate(async () => { const ids = VIEWS.map(v => v.id); for (const id of ids) { try { go(id); } catch (e) {} await new Promise(r => setTimeout(r, 120)); } return ids.length; });
  out.violations = await page.evaluate(() => window.__csp);
  out.errors = errors.filter(e => !/404/.test(e));
  await browser.close();
  console.log(JSON.stringify(out, null, 1));
  const ok = out.noInlineScriptPolicy && out.noInlineScripts && out.logoFile && out.htmlSmall && out.views > 10 && !out.violations.length && !out.errors.length;
  console.log(ok ? 'CSP OK' : 'CSP FAIL'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
