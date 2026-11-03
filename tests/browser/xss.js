/* Stored-XSS pentest: every string field of every collection carries a payload; walk every view/tab/drawer/popup. */
const { open } = require('./harness');
const P = (tag) => `"'><img src=x data-p="${tag}" onerror="window.__xss=(window.__xss||0)+1">`;
const ME = process.env.ROLE==='w' ? 'w@test.ly' : 'admin@test.ly';
function doc(fields, tag) { const o = {}; for (const [k, v] of Object.entries(fields)) o[k] = v === 'S' ? P(tag + '.' + k) : v; return o; }
const data = {
  roles: { [ME]: { role: 'admin', name: P('role.name'), unit: 'gm' }, 'w@test.ly': { role: 'editor', name: P('role2'), unit: 'w' } },
  config: { main: { t1: 90, t2: 60, t3: 30, types: [P('cfg.type')], depts: [P('cfg.dept')], specials: [P('cfg.sp')], currencies: [P('cfg.cur')] }, notices: { data: { [P('nm.k')]: P('nm.v') }, note: P('nm.note') } },
  contracts: { c1: doc({ no: 'S', company: 'S', location: 'S', type: 'S', subject: 'S', signDate: '2026-01-01', startDate: '2026-01-01', endDate: '2027-01-01', value: 1000, currency: 'S', qty: 'S', dept: 'S', officer: 'S', special: '', pdfPath: 'S', notes: 'S', source: 'S', createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-01T00:00:00Z' }, 'c'),
    c2: Object.assign(doc({ no: 'S', company: 'S', location: 'S', type: 'S', subject: 'S', signDate: '2026-01-01', startDate: '2026-01-01', endDate: '2026-11-20', value: 5, currency: 'S', qty: 'S', dept: 'S', officer: 'S', special: 'S', notes: 'S' }, 'c2'), { party: doc({ rep: 'S', repTitle: 'S', legalRep: 'S', cr: 'S', crOffice: 'S', phone: 'S', address: 'S', auth: 'S', purpose: 'S', qtyText: 'S', basis: 'S', firstRep: 'S' }, 'party'), docInfo: doc({ signingText: 'S', signingCity: 'S', coverDate: 'S', firstAuth: 'S', payment: 'S', durationText: 'S', copies: 'S', articles: 'S', uncertain: 'S' }, 'di') }) },
  needs: { n1: doc({ batch: 'b1', page: 1, seq: 1, section: 'S', company: 'S', tradeName: 'S', project: 'S', activity: 'S', licensee: 'S', region: 'S', capacity: 'S', power: 'S', dieselGen: 10, dieselOp: 5, gas: 1, heavyOil: 0, kerosene: 0, projQty: 'S', bregaQty: 'S', visitDate: 'S', notes: 'S', uncertain: 'S' }, 'n') },
  batches: { b1: doc({ name: 'S', order: 1, ref: 'S', date: '2026-10-01', count: 1, pages: 'S', summary: 'S' }, 'b') },
  extensions: { e1: doc({ contractNo: 'S', decisionDate: '2026-02-01', newEnd: '2027-06-01', note: 'S' }, 'e') },
  letters: { l1: doc({ contractNo: 'S', ref: 'S', date: '2026-02-01', note: 'S' }, 'l') },
  companies: { k1: doc({ name: 'S', phone: 'S', email: 'S', address: 'S', person: 'S' }, 'k') },
  tickets: { t1: doc({ no: 'S', date: '2026-10-10', customer: 'S', contact: 'S', phone: 'S', channel: 'S', type: 'S', subject: 'S', details: 'S', priority: 'S', status: 'S', assignee: 'S', dueDate: '2026-12-01', resolution: 'S', contractNo: 'S', person: 'S', history: [doc({ at: '2026-10-10', by: 'S', note: 'S', status: 'S' }, 'th')] }, 't') },
  notices: { z1: doc({ no: 'S', date: '2026-10-10', customer: 'S', product: 'S', qty: 'S', unit: 'S', status: 'S', notes: 'S', contractNo: 'S', ref: 'S', region: 'S' }, 'z') },
  records: { r1: doc({ unit: 'w', duty: 0, title: 'S', type: 'S', date: '2026-10-10', ref: 'S', status: 'S', notes: 'S', by: 'S', createdBy: 'w@test.ly', attachments: [doc({ id: 'f1', name: 'S', type: 'S', size: 10, n: 1, by: 'S', at: '2026-10-10T00:00:00Z' }, 'att')] }, 'r') },
  files: { f1: doc({ name: 'S', type: 'application/pdf', size: 10, n: 1, by: 'S', byEmail: 'S', at: '2026-10-10T00:00:00Z' }, 'f'), f1_0: { d: 'JVBERi0=' } },
  meetings: { m1: doc({ title: 'S', agenda: 'S', units: ['gm', 'w'], organizer: 'gm', createdBy: ME, createdByName: 'S', status: 'open', date: '2026-11-10', time: '10:00', duration: 60, place: 'S', platform: 'S', link: 'S', meetingId: 'S', passcode: 'S', minutes: 'S', decisions: [doc({ text: 'S', owner: 'S', due: '2026-12-01', status: 'S' }, 'dec')], rsvp: { [ME]: doc({ v: 'S', name: 'S' }, 'rsvp') }, attachments: [] }, 'm') },
  duties: { 'w': doc({ lead: 'S', items: [doc({ t: 'S', x: 'S', u: true }, 'du')], src: doc({ kind: 'S', title: 'S', ref: 'S', date: 'S', note: 'S' }, 'dsrc'), by: 'S', updatedAt: '2026-11-01T00:00:00Z' }, 'd') },
  assignments: { a1: doc({ no: 'S', toUnit: 'w', fromUnit: 'gm', subUnit: '', dutyUnit: 'w', duty: 'S', title: 'S', details: 'S', assignee: 'S', priority: 'S', start: '2026-11-01', due: '2026-11-20', status: 'progress', progress: 40, createdBy: ME, createdByName: 'S', createdAt: '2026-11-01T00:00:00Z', updatedAt: '2026-11-02T00:00:00Z', attachments: [], log: [doc({ at: '2026-11-01T00:00:00Z', by: 'S', byName: 'S', act: 'S', note: 'S', status: 'S' }, 'log')] }, 'a') },
  log: { g1: doc({ ts: '2026-11-01T00:00:00Z', user: 'S', name: 'S', action: 'S', col: 'S', id: 'S', summary: 'S' }, 'g') },
};
(async () => {
  const hits = []; const popups = []; let nChecks=0, nPrints=0, nRows=0;
  const { browser, page, errors } = await open({ user: { email: ME, displayName: 'U' }, data, onPopup: async p => { try { await p.waitForLoadState(); const r = await p.evaluate(() => ({ x: window.__xss || 0, n: document.querySelectorAll('img[src="x"]').length, tags: [...document.querySelectorAll('img[src="x"]')].map(i => i.dataset.p) })); popups.push(r); } catch (e) {} finally { try { await p.close(); } catch (e) {} } } });
  const check = async (where) => { nChecks++; const r = await page.evaluate(() => ({ x: window.__xss || 0, n: document.querySelectorAll('img[src="x"]').length, tags: [...document.querySelectorAll('img[src="x"]')].map(i => i.dataset.p) })); if (r.n || r.x) hits.push({ where, ...r }); };
  const views = ['dash', 'ana', 'cs', 'contracts', 'ext', 'needs', 'batches', 'dir', 'org', 'settings', 'meetings', 'duties'];
  const ROWS='#view tbody tr, #view .mt-card, #view [data-dt-open], #view [data-dt-unit], #view [data-org-go], #view [data-org-focus], #view .dt-card, #view .xd-card';
  const PRINTS='#view [data-act*="print"],#view [data-act*="pdf"],#view [data-mt="print"],#view [data-dt-act="print-unit"],#view [data-dt-k="print-unit"],#view button:has-text("PDF")';
  const walk = async (v, label) => {
    await check(label);
    const rows = await page.$$(ROWS);
    for (let i = 0; i < Math.min(rows.length, 10); i++) { try { await rows[i].click({ timeout: 600 }); nRows++; await page.waitForTimeout(300); await check(label + '/row' + i);
      const prints = await page.$$(PRINTS + ',.drawer [data-act*="print"],.drawer [data-act*="pdf"],.drawer button:has-text("PDF"),dialog button:has-text("PDF")');
      for (let j = 0; j < Math.min(prints.length, 2); j++) { try { await prints[j].click({ timeout: 600 }); nPrints++; await page.waitForTimeout(500); } catch (e) {} }
      await page.evaluate(() => { try { closeDrawer() } catch (e) {} try { dlg.close() } catch (e) {} }); } catch (e) {} }
    const prints = await page.$$(PRINTS);
    for (let i = 0; i < Math.min(prints.length, 3); i++) { try { await prints[i].click({ timeout: 600 }); nPrints++; await page.waitForTimeout(500); } catch (e) {} }
  };
  for (const v of views) {
    await page.evaluate(v => go(v), v); await page.waitForTimeout(500); await walk(v, v);
    const tabs = await page.$$('#view [data-an-tab],#view [data-cs-tab],#view [data-dt-tab],#view [data-org-dash],#view [data-xd-m],#view [data-dt-vw],#view [data-dt-f],#view [role=tab]');
    for (let i = 0; i < Math.min(tabs.length, 14); i++) { try { await tabs[i].click({ timeout: 600 }); await page.waitForTimeout(300); await walk(v, v + '/tab' + i); } catch (e) {} }
  }
  // global search
  try { await page.fill('#gq', 'x'); await page.waitForTimeout(400); await check('gsearch'); } catch (e) {}
  console.log(JSON.stringify({ nChecks, nPrints, nRows, popupsSeen: popups.length, hits, popups: popups.filter(p => p.n || p.x), errors: errors.slice(0, 10) }, null, 1));
  await browser.close();
})();
