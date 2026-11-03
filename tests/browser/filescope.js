/* Attachments inherit their record's access: new uploads carry a scope (metadata before chunks),
   and an admin's first sign-in stamps a scope on legacy files from the record that references them. */
const { open } = require('./harness');
const path = require('path'); const fs = require('fs'); const os = require('os');
const roles = { 'admin@test.ly': { role: 'admin', name: 'Admin' }, 'w@test.ly': { role: 'editor', name: 'W', unit: 'w' } };
const out = {};
(async () => {
  // 1) legacy files get the scope of the record that references them; unreferenced files become admin/uploader only
  { const data = { roles, config: { main: { t1: 90, t2: 60, t3: 30 } },
      records: { r1: { unit: 'w', title: 'rec', attachments: [{ id: 'F1', name: 'a' }] } },
      meetings: { m1: { title: 'Board', units: ['w'], organizer: 'w', createdBy: 'w@test.ly', date: '2030-01-01', time: '10:00', status: 'scheduled', attachments: [{ id: 'F2', name: 'b' }], decisions: [], agenda: [], rsvp: {} } },
      contracts: { c1: { no: 'X/1', company: 'Test', attachments: [{ id: 'F3', name: 'c' }] } },
      files: { F1: { n: 1, name: 'a', byEmail: 'w@test.ly' }, F1_0: { d: 'x' }, F2: { n: 1, name: 'b', byEmail: 'w@test.ly' }, F3: { n: 1, name: 'c', byEmail: 'w@test.ly' }, F4: { n: 1, name: 'd', byEmail: 'w@test.ly' }, F5: { n: 1, name: 'e', byEmail: 'w@test.ly', scope: { k: 'all' } } } };
    const { browser, page, errors } = await open({ user: { email: 'admin@test.ly', displayName: 'A' }, data });
    await page.waitForTimeout(17000);
    const upd = await page.evaluate(() => Object.fromEntries(window.__FBLOG.filter(l => l[0] === 'update' && l[1] === 'files').map(l => [l[2], l[3].scope])));
    out.recordScope = JSON.stringify(upd.F1) === JSON.stringify({ k: 'units', u: ['w', 'gm', 'board'] });
    out.meetingScope = JSON.stringify(upd.F2) === JSON.stringify({ k: 'meeting', id: 'm1' });
    out.sharedScope = JSON.stringify(upd.F3) === JSON.stringify({ k: 'all' });
    out.orphanScope = JSON.stringify(upd.F4) === JSON.stringify({ k: 'units', u: [] });
    out.chunksUntouched = !('F1_0' in upd) && !('F5' in upd);
    out.flagSet = await page.evaluate(() => window.__FBLOG.some(l => l[0] === 'set' && l[1] === 'config' && l[2] === 'filesScope' && l[3].v === 1));
    out.adminErrors = errors.filter(e => !/404/.test(e));
    await browser.close(); }
  // 2) a new upload writes the metadata (with the field's scope) before its chunks
  { const { browser, page, errors } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data: { roles, config: { main: { t1: 90, t2: 60, t3: 30 } } } });
    await page.evaluate(() => { const d = document.createElement('div'); d.id = 'fs-host'; d.innerHTML = ATT.field('fs-test', [], { scope: { k: 'units', u: ['w', 'gm', 'board'] } }); document.body.appendChild(d); });
    const tmp = path.join(os.tmpdir(), 'fs-note.txt'); fs.writeFileSync(tmp, 'hello');
    const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.click('#fs-host [data-att-act="pick"]')]);
    await chooser.setFiles(tmp); await page.waitForTimeout(1500);
    const sets = await page.evaluate(() => window.__FBLOG.filter(l => l[0] === 'set' && l[1] === 'files').map(l => [l[2], l[3]]));
    const metaIdx = sets.findIndex(([id, d]) => !/_\d+$/.test(id)), chunkIdx = sets.findIndex(([id]) => /_\d+$/.test(id));
    out.metaFirst = metaIdx >= 0 && chunkIdx > metaIdx;
    out.uploadScope = metaIdx >= 0 && JSON.stringify(sets[metaIdx][1].scope) === JSON.stringify({ k: 'units', u: ['w', 'gm', 'board'] });
    out.noMigrationForEditor = await page.evaluate(() => !window.__FBLOG.some(l => l[1] === 'config' && l[2] === 'filesScope'));
    out.wErrors = errors.filter(e => !/404/.test(e));
    await browser.close(); }
  console.log(JSON.stringify(out, null, 1));
  const ok = Object.entries(out).every(([k, v]) => Array.isArray(v) ? v.length === 0 : v === true);
  console.log(ok ? 'FILESCOPE OK' : 'FILESCOPE FAIL'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
