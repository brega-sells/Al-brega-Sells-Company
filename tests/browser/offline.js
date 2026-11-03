/* Offline work and automatic sync (offline.js): writes resolve once saved on the device, pending counter + status chip,
   late server rejection is reported, offline reads use the device copy, sign-in offline with the role saved on the device. */
const { open } = require('./harness');
const roles = { 'w@test.ly': { role: 'editor', name: 'W', unit: 'w' } };
const data = { roles, config: { main: { t1: 90, t2: 60, t3: 30 } } };
// navigator.onLine under the test's control; __net(false|true) also fires the offline/online events
const NET = "window.__on=true;Object.defineProperty(Navigator.prototype,'onLine',{configurable:true,get:()=>window.__on!==false});window.__net=v=>{window.__on=v;window.dispatchEvent(new Event(v?'online':'offline'))};";
const out = {};
const wait = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  { const { browser, page, errors } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data, extraInit: NET });
    await page.waitForTimeout(800);
    out.wrapped = await page.evaluate(() => !!window.__fs().__ow);
    out.roleSaved = await page.evaluate(() => JSON.parse(localStorage.getItem('cm_role_w@test.ly') || '{}').role === 'editor');
    out.onlineLabel = await page.evaluate(() => /متصل · الحفظ/.test(document.getElementById('conn-txt').textContent));
    // go offline; the "server" holds every write as the real SDK does
    await page.evaluate(() => { window.__FAKE.hang = true; window.__net(false); });
    out.offlineBar = await page.evaluate(() => !!document.getElementById('net-bar'));
    out.offlineWriteResolves = await page.evaluate(async () => { const t = Date.now(); await window.__fs().collection('assignments').doc('o1').set({ title: 'x' }); return Date.now() - t < 500; });
    out.adapterWriteResolves = await page.evaluate(async () => { const db = await window.appRuntime.use('db'); const t = Date.now(); await db.collection('contracts').doc('c-off').set({ no: 'X-1', company: 'Off' }); return Date.now() - t < 500; });
    out.addReturnsRef = await page.evaluate(async () => { const r = await window.__fs().collection('log').add({ a: 1 }); return !!(r && r.id); });
    out.pending = await page.evaluate(() => window.__sync.count());
    out.chipPending = await page.evaluate(() => document.getElementById('conn-txt').textContent);
    out.chipOff = await page.evaluate(() => document.getElementById('conn-dot').classList.contains('off'));
    out.barCount = await page.evaluate(() => /بانتظار المزامنة/.test(document.getElementById('net-bar').textContent));
    out.cacheRead = await page.evaluate(async () => { await window.__fs().collection('roles').doc('w@test.ly').get(); return window.__FBLOG.some(l => l[0] === 'get-src' && l[3] === 'cache'); });
    // back online: the held writes reach the server, counter drops to zero, sync toast
    await page.evaluate(() => window.__net(true));
    out.syncingChip = await page.evaluate(() => document.getElementById('conn-dot').classList.contains('sync'));
    await page.evaluate(() => window.__fakeFlush()); await page.waitForTimeout(200);
    out.pendingAfter = await page.evaluate(() => window.__sync.count());
    out.synced = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'contracts' && l[2] === 'c-off'));
    out.syncToast = await page.evaluate(() => /تمت مزامنة/.test(document.getElementById('toast').textContent));
    out.chipOnline = await page.evaluate(() => document.getElementById('conn-dot').classList.contains('on'));
    // a change saved offline that the server later refuses is reported, not lost silently
    await page.evaluate(() => window.__net(false));
    await page.evaluate(() => window.__fs().collection('roles').doc('x@test.ly').set({ role: 'admin' }));
    await page.evaluate(() => { window.__net(true); return window.__fakeFlush('permission-denied'); }); await page.waitForTimeout(200);
    out.rejectToast = await page.evaluate(() => /رفضت قاعدة البيانات/.test(document.getElementById('toast').textContent));
    // on a slow but online connection a quick server error still reaches the caller
    out.quickRejectPropagates = await page.evaluate(async () => { const p = window.__fs().collection('a').doc('b').set({}); setTimeout(() => window.__fakeFlush('permission-denied'), 50); try { await p; return false } catch (e) { return e.code === 'permission-denied' } });
    // logging out with unsynced work asks first
    await page.evaluate(() => { window.__net(false); window.__fs().collection('a').doc('c').set({}); window.confirm = () => false; window.__safeSignOut(); });
    out.logoutGuard = await page.evaluate(() => !window.__FBLOG.some(l => l[0] === 'signOut'));
    out.errors = errors.filter(e => !/404|sw\.js|manifest|service worker/i.test(e));
    await browser.close(); }
  // opening the system with no internet: role read fails, the role saved on this device is used
  { const { browser, page, errors } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data, fail: { roles: { code: 'unavailable', n: 9 } },
      extraInit: NET + "window.__on=false;localStorage.setItem('cm_role_w@test.ly',JSON.stringify({role:'editor',name:'W',unit:'w'}))" });
    await page.waitForTimeout(900);
    out.offlineLogin = await page.evaluate(() => !!window.__me() && window.__me().role === 'editor' && !document.getElementById('lg-rolefail'));
    out.offlineLoginNoRefresh = await page.evaluate(() => !window.__FBLOG.some(l => l[0] === 'token-refresh'));
    out.offlineLoginErrors = errors.filter(e => !/404|sw\.js|manifest|service worker/i.test(e));
    await browser.close(); }
  // no saved role on this device: the clear failure screen, as before
  { const { browser, page } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data, fail: { roles: { code: 'unavailable', n: 9 } }, extraInit: NET + "window.__on=false;localStorage.removeItem('cm_role_w@test.ly')" });
    await page.waitForTimeout(900);
    out.noSavedRoleScreen = await page.evaluate(() => !!document.getElementById('lg-rolefail'));
    await browser.close(); }
  console.log(JSON.stringify(out, null, 1));
  const ok = out.wrapped && out.roleSaved && out.onlineLabel && out.offlineBar && out.offlineWriteResolves && out.adapterWriteResolves && out.addReturnsRef
    && out.pending >= 3 && /بانتظار المزامنة/.test(out.chipPending) && out.chipOff && out.barCount && out.cacheRead && out.syncingChip
    && out.pendingAfter === 0 && out.synced && out.syncToast && out.chipOnline && out.rejectToast && out.quickRejectPropagates && out.logoutGuard
    && !out.errors.length && out.offlineLogin && out.offlineLoginNoRefresh && !out.offlineLoginErrors.length && out.noSavedRoleScreen;
  console.log(ok ? 'OFFLINE OK' : 'OFFLINE FAIL'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
