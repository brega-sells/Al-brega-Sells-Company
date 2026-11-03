/* Meeting notifications: in-app bell for every invited department, «أبلغ المعنيين» dialog (WhatsApp, e-mail, .ics), cancellation notice */
const { open } = require('./harness');
const fs = require('fs');
const plus = n => new Date(Date.now() + n * 86400e3).toISOString().slice(0, 10);
const ago = n => new Date(Date.now() - n * 86400e3).toISOString();
const roles = { 'admin@test.ly': { role: 'admin', name: 'Admin' }, 'gm@test.ly': { role: 'editor', name: 'GM', unit: 'gm' },
  'w@test.ly': { role: 'editor', name: 'W', unit: 'w' }, 'e@test.ly': { role: 'editor', name: 'E', unit: 'e' } };
const config = { main: { t1: 90, t2: 60, t3: 30 }, meetings: { whatsapp: { w: '218911111111' }, emails: { w: 'w@test.ly, w2@test.ly', e: 'e@test.ly', gm: 'gm@test.ly' } } };
const base = { agenda: [], decisions: [], rsvp: {}, minutes: '' };
const data = { roles, config, meetings: {
  far: Object.assign({ title: 'Far planning', units: ['gm', 'w'], organizer: 'gm', createdBy: 'gm@test.ly', createdAt: ago(1), date: plus(20), time: '11:00', status: 'scheduled' }, base),
  moved: Object.assign({ title: 'Moved review', units: ['gm', 'w'], organizer: 'gm', createdBy: 'gm@test.ly', createdAt: ago(5), date: plus(3), time: '09:00', status: 'scheduled', notice: { k: 'changed', at: ago(0.1) } }, base),
  gone: Object.assign({ title: 'Gone meeting', units: ['gm', 'w'], organizer: 'gm', createdBy: 'gm@test.ly', createdAt: ago(5), date: plus(2), time: '09:00', status: 'cancelled', notice: { k: 'cancelled', at: ago(0.1) } }, base),
  old: Object.assign({ title: 'Old invite', units: ['gm', 'w'], organizer: 'gm', createdBy: 'gm@test.ly', createdAt: ago(40), date: plus(30), time: '09:00', status: 'scheduled' }, base),
  own: Object.assign({ title: 'My own', units: ['w', 'gm'], organizer: 'w', createdBy: 'w@test.ly', createdAt: ago(0.1), date: plus(10), time: '09:00', status: 'scheduled' }, base),
  other: Object.assign({ title: 'Not mine', units: ['gm', 'e'], organizer: 'gm', createdBy: 'gm@test.ly', createdAt: ago(0.1), date: plus(10), time: '09:00', status: 'scheduled' }, base) } };
const out = {};
(async () => {
  // 1) invitee: the bell lists the new / changed / cancelled meetings of its department, not old, own or other departments' meetings
  { const { browser, page, errors } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data });
    await page.waitForTimeout(1200);
    await page.evaluate(() => { try { dlg.close(); } catch (e) {} });
    await page.click('#nt-btn'); await page.waitForTimeout(300);
    const items = await page.evaluate(() => [...document.querySelectorAll('#nt-panel .nt-it')].map(b => b.textContent));
    out.inviteFar = items.some(t => /دعوة لاجتماع جديد/.test(t) && /Far planning/.test(t) && /أكّد حضور إدارتك/.test(t));
    out.inviteMoved = items.some(t => /تغيّر موعد اجتماع/.test(t) && /Moved review/.test(t));
    out.inviteGone = items.some(t => /أُلغي اجتماع/.test(t) && /Gone meeting/.test(t));
    out.noOld = !items.some(t => /Old invite/.test(t));
    out.noOwn = !items.some(t => /دعوة/.test(t) && /My own/.test(t));
    out.noOther = !items.some(t => /Not mine/.test(t));
    await page.evaluate(() => [...document.querySelectorAll('#nt-panel .nt-it')].find(b => /Far planning/.test(b.textContent)).click()); await page.waitForTimeout(700);
    out.openedMeeting = await page.evaluate(() => S.view === 'meetings' && !!document.querySelector('.drawer[data-mt="far"]'));
    out.inviteeCalendarBtn = await page.evaluate(() => !!document.querySelector('.drawer [data-mt="ics"]') && !document.getElementById('mt-notify'));
    out.wErrors = errors.filter(e => !/404|sw\.js|manifest|service worker/i.test(e));
    await browser.close(); }
  // 2) organizer: creates a meeting, the doc carries the notice, the dialog offers WhatsApp, e-mail (bcc, not self) and .ics
  { const { browser, page, errors } = await open({ user: { email: 'gm@test.ly', displayName: 'GM' }, data });
    await page.waitForTimeout(1200);
    await page.evaluate(() => { try { dlg.close(); } catch (e) {} go('meetings'); }); await page.waitForTimeout(600);
    await page.evaluate(() => document.querySelector('[data-mt="new"]').click()); await page.waitForTimeout(300);
    await page.fill('#mt-title', 'Sales plan Q4'); await page.fill('#mt-date', plus(6)); await page.fill('#mt-time', '10:30');
    await page.check('input[name=mt-inv][value=w]'); await page.check('input[name=mt-inv][value=e]');
    await page.fill('#mt-mid', '123456789');
    await page.click('[data-mt="save"]'); await page.waitForTimeout(700);
    const doc = await page.evaluate(() => { const l = window.__FBLOG.filter(x => x[1] === 'meetings' && x[3] && x[3].title === 'Sales plan Q4').pop(); return l && l[3]; });
    out.noticeNew = !!(doc && doc.notice && doc.notice.k === 'new' && doc.notice.at);
    out.dialog = await page.evaluate(() => dlg.open && /أبلغ المعنيين/.test(dlg.textContent) && /وصل إشعار بالاجتماع داخل المنظومة/.test(dlg.textContent));
    out.waDirect = await page.evaluate(() => [...dlg.querySelectorAll('a[href^="https://wa.me/218911111111"]')].length === 1);
    const mail = await page.evaluate(() => (dlg.querySelector('a[href^="mailto:"]') || {}).href || '');
    out.mailBcc = ((mail.match(/bcc=([^&]*)/) || [])[1] || '').split(',').sort().join(',') === 'e%40test.ly,w%40test.ly,w2%40test.ly' && !/gm%40test/.test(mail) && /subject=/.test(mail);
    out.mailBody = /Sales%20plan%20Q4/.test(mail) || /Sales plan Q4/.test(decodeURIComponent(mail));
    const [dl] = await Promise.all([page.waitForEvent('download'), page.evaluate(() => dlg.querySelector('[data-mt="ics"]').click())]);
    const ics = fs.readFileSync(await dl.path(), 'utf8');
    out.ics = /BEGIN:VEVENT/.test(ics) && /SUMMARY:Sales plan Q4/.test(ics) && /DTSTART:\d{8}T\d{6}Z/.test(ics) && /TRIGGER:-PT30M/.test(ics) && /zoom\.us\/j\/123456789/.test(ics);
    // mark the WhatsApp message to «w» as sent (link click is not followed in the test)
    await page.evaluate(() => { const a = dlg.querySelector('a[href^="https://wa.me/218911111111"]'); a.addEventListener('click', e => e.preventDefault(), { once: true }); a.click(); }); await page.waitForTimeout(400);
    out.sentLogged = await page.evaluate(() => window.__FBLOG.some(l => l[1] === 'meetings' && l[3] && (l[3]['sent.wa.w'] || (l[3].sent && l[3].sent.wa && l[3].sent.wa.w))));
    await page.evaluate(() => dlg.querySelector('[data-mt="notify-done"]').click()); await page.waitForTimeout(500);
    out.drawerPanel = await page.evaluate(() => !!document.querySelector('.drawer #mt-notify'));
    // reschedule -> notice changed; cancel -> notice cancelled
    await page.evaluate(() => document.querySelector('.drawer [data-mt="edit"]').click()); await page.waitForTimeout(300);
    await page.fill('#mt-time', '12:00'); await page.click('[data-mt="save"]'); await page.waitForTimeout(600);
    const doc2 = await page.evaluate(() => { const l = window.__FBLOG.filter(x => x[1] === 'meetings' && x[3] && x[3].title === 'Sales plan Q4').pop(); return l && l[3]; });
    out.noticeChanged = !!(doc2 && doc2.notice && doc2.notice.k === 'changed');
    out.dialogChanged = await page.evaluate(() => dlg.open && /عُدّل الاجتماع/.test(dlg.textContent));
    await page.evaluate(() => dlg.querySelector('[data-mt="notify-done"]').click()); await page.waitForTimeout(400);
    await page.evaluate(() => { const b = document.querySelector('.drawer [data-mt="cancel"]'); b.click(); b.click(); }); await page.waitForTimeout(600);
    out.noticeCancelled = await page.evaluate(() => window.__FBLOG.some(l => l[1] === 'meetings' && l[3] && l[3].status === 'cancelled' && l[3].notice && l[3].notice.k === 'cancelled'));
    out.dialogCancelled = await page.evaluate(() => dlg.open && /أُلغي الاجتماع/.test(dlg.textContent) && /وصل إشعار الإلغاء/.test(dlg.textContent));
    out.gmErrors = errors.filter(e => !/404|sw\.js|manifest|service worker/i.test(e));
    await browser.close(); }
  // 3) admin: e-mail fields per department are saved with the WhatsApp numbers
  { const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A' }, data });
    await page.waitForTimeout(1200);
    await page.evaluate(() => { try { dlg.close(); } catch (e) {} go('meetings'); }); await page.waitForTimeout(900);
    out.emailField = await page.evaluate(() => (document.getElementById('mt-em-w') || {}).value === 'w@test.ly, w2@test.ly');
    await page.fill('#mt-em-ca', 'ca@test.ly; bad-address'); await page.click('[data-mt="save-wa"]'); await page.waitForTimeout(400);
    out.emailSaved = await page.evaluate(() => { const l = window.__FBLOG.filter(x => x[1] === 'config' && x[2] === 'meetings').pop(); return !!(l && l[3].emails && l[3].emails.ca === 'ca@test.ly' && l[3].whatsapp.w === '218911111111'); });
    out.adminErrors = errors.filter(e => !/404|sw\.js|manifest|service worker/i.test(e));
    await browser.close(); }
  console.log(JSON.stringify(out, null, 1));
  const bad = Object.entries(out).filter(([k, v]) => Array.isArray(v) ? v.length : v !== true);
  if (bad.length) { console.log('FAILED', bad.map(b => b[0]).join(', ')); process.exit(1); }
  console.log('MEETNOTIFY OK');
})().catch(e => { console.error(e); process.exit(1); });
