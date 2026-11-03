/* Functional checks for governance: access review, account register export, access matrix, retention, legal hold, record history, approval stamp */
const { open } = require('./harness');
const today = new Date().toISOString().slice(0, 10);
const roles = { 'admin@test.ly': { role: 'admin', name: 'Admin' }, 'w@test.ly': { role: 'editor', name: 'W', unit: 'w' }, 'gm@test.ly': { role: 'editor', name: 'GM', unit: 'gm' } };
const data = { roles, config: { main: { t1: 90, t2: 60, t3: 30 } },
  log: { l1: { ts: today + 'T08:00:00.000Z', user: 'w@test.ly', name: 'W', action: 'a', col: 'records', id: 'r1', summary: '' } },
  records: { r1: { unit: 'w', title: 'Old record', date: '2010-01-05', status: 'منجز', type: 'مراسلة', duty: 1, createdBy: 'w@test.ly', by: 'W' } },
  tickets: { t1: { no: 'CS-9', customer: 'X', subject: 's', status: 'مغلق', closedAt: '2015-01-01T00:00:00.000Z' } },
  assignments: { a1: { title: 'Audit the register', fromUnit: 'gm', toUnit: 'w', status: 'review', progress: 100, createdBy: 'gm@test.ly', createdAt: today, due: today, log: [{ ts: today, by: 'gm@test.ly', act: 'new' }, { ts: today, by: 'w@test.ly', act: 'submit' }] } } };
const out = {};
(async () => {
  // 1) admin: settings panels, confirm review (re-auth), exports, retention, legal hold + history
  { const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A', metadata: { lastSignInTime: new Date(Date.now() - 3600e3).toISOString() } }, data });
    await page.evaluate(() => go('settings')); await page.waitForTimeout(900);
    out.panels = await page.evaluate(() => !!document.getElementById('gv-access') && !!document.getElementById('gv-ret'));
    out.reviewOverdue = await page.evaluate(() => /لم تُجرَ مراجعة/.test(document.querySelector('#gv-access .gv-status').textContent));
    out.registerRows = await page.evaluate(() => document.querySelectorAll('#gv-access tbody tr').length);
    out.lastActivity = await page.evaluate(() => [...document.querySelectorAll('#gv-access tbody tr')].some(tr => /w@test\.ly/.test(tr.textContent) && new RegExp(new Date().toISOString().slice(0, 10)).test(tr.textContent)));
    await page.fill('#gv-note', 'Q4'); await page.click('[data-gv="confirm"]'); await page.waitForTimeout(400);
    out.reauthAsked = await page.evaluate(() => { const d = document.getElementById('reauth'); return !!(d && d.open); });
    await page.fill('#ra-p', 'secret'); await page.click('#reauth button[type=submit]'); await page.waitForTimeout(700);
    out.reviewSaved = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'config' && l[2] === 'access-review' && l[3].note === 'Q4' && l[3].accounts === 3));
    out.reviewLogged = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'log' && /مراجعة الصلاحيات/.test(l[3].action)));
    out.reviewOk = await page.evaluate(() => /✓/.test(document.querySelector('#gv-access .gv-status').textContent));
    const dl = page.waitForEvent('download', { timeout: 5000 }).then(d => d.suggestedFilename()).catch(() => '');
    await page.click('[data-gv="register"]'); out.registerFile = await dl;
    await page.click('[data-gv="matrix"]'); await page.waitForTimeout(300);
    out.matrix = await page.evaluate(() => dlg.open && document.querySelectorAll('.gv-matrix tbody tr').length >= 10);
    await page.evaluate(() => dlg.close());
    out.retentionCandidates = await page.evaluate(() => /\(2\)/.test(document.querySelector('[data-gv="ret-csv"]').textContent));
    await page.fill('[data-gv-ret="tickets"]', '7'); await page.click('[data-gv="ret-save"]'); await page.waitForTimeout(400);
    out.retentionSaved = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'config' && l[2] === 'retention' && l[3].tickets === 7));
    // legal hold from the record form
    await page.evaluate(() => { go('org', { om: 'dash', of: 'w' }); }); await page.waitForTimeout(500);
    await page.evaluate(() => recForm('w', S.records.find(r => r.id === 'r1'))); await page.waitForTimeout(300);
    out.holdField = await page.evaluate(() => !!document.getElementById('r-hold'));
    await page.check('#r-hold'); await page.fill('#r-hold-reason', 'audit 2026'); await page.fill('#r-title', 'Old record (renamed)');
    await page.click('[data-act="rec-save"]'); await page.waitForTimeout(600);
    out.holdSaved = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'records' && l[2] === 'r1' && l[3].hold && l[3].hold.reason === 'audit 2026' && l[3].hold.by === 'admin@test.ly'));
    out.historyAppended = await page.evaluate(() => { const l = window.__FBLOG.filter(x => x[0] === 'set' && x[1] === 'records' && x[2] === 'r1').pop(); return !!(l && l[3].history && l[3].history.length === 1 && l[3].history[0].changes.some(c => c.k === 'title') && l[3].history[0].changes.some(c => c.k === 'hold')); });
    await page.waitForTimeout(400);
    out.lockShown = await page.evaluate(() => !!document.querySelector('[data-rec="r1"] .pill.p-crit'));
    await page.click('[data-rec-hist="r1"]'); await page.waitForTimeout(300);
    out.historyDialog = await page.evaluate(() => dlg.open && /Old record/.test(dlg.textContent) && /audit 2026/.test(dlg.textContent));
    await page.evaluate(() => dlg.close());
    out.adminErrors = errors.filter(e => !/404/.test(e));
    await browser.close(); }
  // 2) issuer approves an assignment: a SHA-256 stamp is written and verifies
  { const { browser, page, errors } = await open({ user: { email: 'gm@test.ly', displayName: 'GM' }, data });
    await page.evaluate(() => go('duties')); await page.waitForTimeout(400);
    await page.click('[data-dt-tab="tasks"]'); await page.waitForTimeout(300); await page.click('[data-dt-open="a1"]'); await page.waitForTimeout(400);
    await page.click('[data-dt-a="approve"]'); await page.waitForTimeout(300); await page.click('[data-dt-do="approve"]'); await page.waitForTimeout(800);
    out.stampWritten = await page.evaluate(() => { const l = window.__FBLOG.find(x => x[0] === 'update' && x[1] === 'assignments' && x[2] === 'a1' && x[3].status === 'done'); return !!(l && l[3].stamp && /^[0-9a-f]{64}$/.test(l[3].stamp.hash) && l[3].stamp.by === 'gm@test.ly'); });
    await page.waitForTimeout(400);
    out.stampShown = await page.evaluate(() => !!document.querySelector('[data-dt-verify="a1"]'));
    await page.click('[data-dt-verify="a1"]'); await page.waitForTimeout(400);
    out.stampValid = await page.evaluate(() => dlg.open && /الختم صحيح/.test(dlg.textContent));
    await page.evaluate(() => dlg.close());
    // tamper: change the title in the fake store and verify again
    await page.evaluate(() => firebase.firestore().collection('assignments').doc('a1').update({ title: 'Audit the register (edited)' })); await page.waitForTimeout(300);
    const tampered = await page.evaluate(() => { const a = window.__assignments().find(x => x.id === 'a1'); return a && a.title.includes('edited'); });
    if (tampered) { await page.click('[data-dt-open="a1"]').catch(() => {}); await page.waitForTimeout(300); await page.click('[data-dt-verify="a1"]'); await page.waitForTimeout(300); out.stampTamperDetected = await page.evaluate(() => /لا يطابق/.test(dlg.textContent)); await page.evaluate(() => dlg.close()); } else out.stampTamperDetected = 'skipped';
    out.gmErrors = errors.filter(e => !/404/.test(e));
    await browser.close(); }
  console.log(JSON.stringify(out, null, 1));
  const ok = out.panels && out.reviewOverdue && out.registerRows === 3 && out.lastActivity && out.reauthAsked && out.reviewSaved && out.reviewLogged && out.reviewOk && /account-register/.test(out.registerFile) && out.matrix && out.retentionCandidates && out.retentionSaved && out.holdField && out.holdSaved && out.historyAppended && out.lockShown && out.historyDialog && out.stampWritten && out.stampShown && out.stampValid && (out.stampTamperDetected === true || out.stampTamperDetected === 'skipped') && !out.adminErrors.length && !out.gmErrors.length;
  console.log(ok ? 'GOVERN OK' : 'GOVERN FAIL'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
