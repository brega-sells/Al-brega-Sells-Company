/* Functional checks for the authentication hardening */
const { open } = require('./harness');
const roles = { 'admin@test.ly': { role: 'admin', name: 'Admin' }, 'w@test.ly': { role: 'editor', name: 'W', unit: 'w' } };
const data = { roles, config: { main: { t1: 90, t2: 60, t3: 30 } }, records: { r1: { unit: 'w', title: 'mine', date: '2026-10-10', duty: 0, createdBy: 'w@test.ly' }, r2: { unit: 'e', title: 'theirs', date: '2026-10-10', duty: 0, createdBy: 'e@test.ly' } } };
const out = {};
(async () => {
  // 1) unverified e-mail is stopped before any data is read
  { const { browser, page } = await open({ user: { email: 'admin@test.ly', displayName: 'A', emailVerified: false }, data });
    out.verifyScreen = await page.evaluate(() => !!document.querySelector('#lg-vok') && !!document.querySelector('#lg-vre'));
    out.verifySent = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'verify'));
    out.verifyNoData = await page.evaluate(() => !window.__me || !window.__me());
    await browser.close(); }
  // 2) admin: role grant asks for the password again; self-demotion refused
  { const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A', metadata: { lastSignInTime: new Date(Date.now() - 3600e3).toISOString() } }, data });
    await page.evaluate(() => go('settings')); await page.waitForTimeout(500);
    await page.fill('#u-email', 'new@test.ly'); await page.fill('#u-name', 'N'); await page.selectOption('#u-role', 'editor');
    await page.click('[data-act="save-role"]'); await page.waitForTimeout(400);
    out.reauthDialog = await page.evaluate(() => { const d = document.getElementById('reauth'); return !!(d && d.open); });
    await page.fill('#ra-p', 'secret'); await page.click('#reauth button[type=submit]'); await page.waitForTimeout(500);
    out.roleSaved = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'roles' && l[2] === 'new@test.ly' && l[3].role === 'editor'));
    out.reauthLogged = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'reauth'));
    // second sensitive action within 5 minutes: no second prompt
    await page.fill('#u-email', 'new2@test.ly'); await page.fill('#u-name', 'N2'); await page.selectOption('#u-role', 'viewer');
    await page.click('[data-act="save-role"]'); await page.waitForTimeout(400);
    out.noSecondPrompt = await page.evaluate(() => { const d = document.getElementById('reauth'); return !(d && d.open); });
    // self demotion
    await page.fill('#u-email', 'admin@test.ly'); await page.fill('#u-name', 'A'); await page.selectOption('#u-role', 'viewer');
    await page.click('[data-act="save-role"]'); await page.waitForTimeout(300);
    out.selfDemoteBlocked = await page.evaluate(() => /لا يمكنك تخفيض/.test(document.getElementById('u-msg').textContent) && !window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'roles' && l[2] === 'admin@test.ly'));
    out.adminRecords = await page.evaluate(() => (S.records || []).map(r => r.unit).sort().join(','));
    out.adminErrors = errors.filter(e => !/404/.test(e));
    await browser.close(); }
  // 3) department editor only receives own records; idle timeout signs out
  { const { browser, page, errors } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data });
    await page.waitForTimeout(500);
    out.wRecords = await page.evaluate(() => (S.records || []).map(r => r.unit + ':' + r.title).join(','));
    out.wUnitOnMe = await page.evaluate(() => window.__me().unit);
    // idle: fake the timer by overriding setTimeout delay? simpler: dispatch and fast-forward with the clock API
    await page.clock.install({ time: Date.now() });
    await page.mouse.move(10, 10); // resets the idle timer
    await page.clock.runFor(31 * 60 * 1000);
    await page.waitForTimeout(1200);
    out.idleSignedOut = await page.evaluate(() => sessionStorage.getItem('fake_signout') === '1');
    out.wErrors = errors.filter(e => !/404/.test(e));
    await browser.close(); }
  console.log(JSON.stringify(out, null, 1));
})();
