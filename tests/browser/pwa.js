/* Functional checks for the second batch: notifications bell, calendar, version/what's new, error boundary, health panel */
const { open } = require('./harness');
const today = new Date().toISOString().slice(0, 10);
const plus = n => new Date(Date.now() + n * 86400e3).toISOString().slice(0, 10);
const roles = { 'admin@test.ly': { role: 'admin', name: 'Admin' }, 'w@test.ly': { role: 'editor', name: 'W', unit: 'w' } };
const data = { roles, config: { main: { t1: 90, t2: 60, t3: 30 } },
  assignments: { a1: { title: 'Prepare report', fromUnit: 'gm', toUnit: 'w', status: 'new', createdBy: 'gm@test.ly', createdAt: today, due: plus(1), log: [{ ts: today, by: 'gm@test.ly', a: 'new' }] },
                 a2: { title: 'Late task', fromUnit: 'gm', toUnit: 'w', status: 'progress', createdBy: 'gm@test.ly', createdAt: today, due: plus(-3), log: [{ ts: today, by: 'gm@test.ly', a: 'new' }] } },
  meetings: { m1: { title: 'Weekly sync', units: ['gm', 'w'], organizer: 'gm', createdBy: 'gm@test.ly', date: plus(2), time: '10:00', status: 'open', agenda: [], decisions: [], rsvp: {} } } };
const out = {};
(async () => {
  // 1) department editor: bell shows the items it should, calendar renders, version footer present
  { const { browser, page, errors } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data, extraInit: "localStorage.removeItem('cm_seen_ver')" });
    await page.waitForTimeout(1200);
    out.whatsNewShown = await page.evaluate(() => { const d = document.getElementById('dlg'); return !!(d && d.open && /ما الجديد/.test(d.textContent)); });
    out.seenVerStored = await page.evaluate(() => localStorage.getItem('cm_seen_ver') === window.APP_VERSION);
    await page.evaluate(() => { try { dlg.close(); } catch (e) {} }); await page.waitForTimeout(200);
    out.bellMounted = await page.evaluate(() => !!document.getElementById('nt-btn'));
    out.badge = await page.evaluate(() => { const b = document.querySelector('#nt-btn .nt-badge'); return b && !b.hidden ? b.textContent : '0'; });
    await page.click('#nt-btn'); await page.waitForTimeout(300);
    out.panelTitles = await page.evaluate(() => [...document.querySelectorAll('#nt-panel .nt-it b')].map(b => b.textContent));
    // open the first item -> navigates to duties tasks
    await page.click('#nt-panel .nt-it'); await page.waitForTimeout(600);
    out.openedView = await page.evaluate(() => S.view);
    out.seenSaved = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'prefs' && l[2] === 'w@test.ly'));
    out.unreadAfterOpen = await page.evaluate(() => { const b = document.querySelector('#nt-btn .nt-badge'); return b && !b.hidden ? b.textContent : '0'; });
    // calendar
    await page.evaluate(() => go('calendar')); await page.waitForTimeout(500);
    out.calendarCells = await page.evaluate(() => document.querySelectorAll('.cal-c[data-cal-day]').length);
    out.calendarEvents = await page.evaluate(() => document.querySelectorAll('.cal-ev i').length);
    out.calendarNavItem = await page.evaluate(() => [...document.querySelectorAll('nav a,nav button,.nav a,.nav button,.side a,.side button')].some(a=>/التقويم/.test(a.textContent)));
    out.hijriShown = await page.evaluate(() => [...document.querySelectorAll('.cal-h')].some(h => h.textContent.trim().length > 0));
    out.versionFooter = await page.evaluate(() => (document.getElementById('q-ver') || {}).textContent || '');
    // settings page: app panel present, no admin health panel for an editor
    await page.evaluate(() => { try { dlg.close(); } catch (e) {} go('settings'); }); await page.waitForTimeout(500);
    out.appPanel = await page.evaluate(() => !!document.getElementById('q-app'));
    out.prefsPanel = await page.evaluate(() => !!document.getElementById('nt-prefs'));
    out.healthHiddenForEditor = await page.evaluate(() => !document.getElementById('q-health'));
    out.manifestLinked = await page.evaluate(() => !!document.querySelector('link[rel=manifest]'));
    out.wErrors = errors.filter(e => !/404|sw\.js|manifest|service worker/i.test(e));
    await browser.close(); }
  // 2) admin: health panel, error boundary writes a report and shows a friendly screen
  { const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A' }, data });
    await page.waitForTimeout(1000);
    await page.evaluate(() => { try { dlg.close(); } catch (e) {} go('settings'); }); await page.waitForTimeout(700);
    out.healthPanel = await page.evaluate(() => !!document.getElementById('q-health'));
    // break a view deliberately
    await page.evaluate(() => { window.__assignments = () => { throw new Error('boom test'); }; go('calendar'); }); await page.waitForTimeout(500);
    out.errorScreen = await page.evaluate(() => /حدث خطأ غير متوقع/.test(document.getElementById('view').textContent));
    out.errorRef = await page.evaluate(() => (document.getElementById('view').textContent.match(/E-[A-Z0-9]{6}/) || [])[0] || '');
    out.errorLogged = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'clientErrors' && /boom test/.test(l[3].msg)));
    await page.click('[data-q="home"]'); await page.waitForTimeout(400);
    out.recovered = await page.evaluate(() => S.view === 'dash' && !/حدث خطأ غير متوقع/.test(document.getElementById('view').textContent));
    out.adminErrors = errors.filter(e => !/404|sw\.js|manifest|service worker|boom test/i.test(e));
    await browser.close(); }
  // 3) service worker registers, caches the shell and does not reload the page on first install
  { const { browser, page } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data, sw: true });
    await page.waitForTimeout(2500);
    out.swActive = await page.evaluate(async () => { const r = await navigator.serviceWorker.getRegistration(); return !!(r && (r.active || r.waiting || r.installing)); });
    out.swCache = await page.evaluate(async () => { const ks = await caches.keys(); const k = ks.find(x => /^brega-/.test(x)); if (!k) return 0; return (await (await caches.open(k)).keys()).length; });
    out.noReloadOnInstall = await page.evaluate(() => !!(window.__me && window.__me()) && performance.getEntriesByType('navigation')[0].type !== 'reload');
    await browser.close(); }
  console.log(JSON.stringify(out, null, 1));
  const ok = out.bellMounted && out.whatsNewShown && out.seenVerStored && out.badge !== '0' && out.openedView === 'duties' && out.seenSaved && out.calendarCells >= 28 && out.calendarEvents >= 2 && out.calendarNavItem && out.versionFooter && out.appPanel && out.prefsPanel && out.healthHiddenForEditor && out.manifestLinked && out.healthPanel && out.errorScreen && out.errorRef && out.errorLogged && out.recovered && !out.wErrors.length && !out.adminErrors.length && out.swActive && out.swCache >= 5 && out.noReloadOnInstall;
  console.log(ok ? 'PWA/NOTIFY OK' : 'PWA/NOTIFY FAIL'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
