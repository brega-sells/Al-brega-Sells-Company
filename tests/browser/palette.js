/* Functional checks for the command palette, shortcuts and help */
const { open } = require('./harness');
const roles = { 'w@test.ly': { role: 'editor', name: 'W', unit: 'w' } };
const data = { roles, config: { main: { t1: 90, t2: 60, t3: 30 } },
  contracts: { c1: { no: 'ع.ت.د/609', company: 'شركة الحديد والصلب', type: 'ديزل', location: 'مصراتة', startDate: '2026-01-01', endDate: '2026-12-31' } },
  tickets: { t1: { no: 'CS-1', customer: 'مصنع الأنابيب', subject: 'تأخر توريد', status: 'مفتوح', dueDate: '2026-12-01' } } };
const out = {};
(async () => {
  const { browser, page, errors } = await open({ user: { email: 'w@test.ly', displayName: 'W' }, data });
  await page.waitForTimeout(900);
  out.buttons = await page.evaluate(() => !!document.getElementById('cp-btn') && !!document.getElementById('help-btn'));
  // Ctrl+K opens the palette with screens listed
  await page.keyboard.press('Control+k'); await page.waitForTimeout(250);
  out.opened = await page.evaluate(() => { const d = document.getElementById('cp'); return !!(d && d.open); });
  out.hasScreens = await page.evaluate(() => [...document.querySelectorAll('#cp .cp-it .cp-t')].some(t => /التقويم|لوحة المؤشرات/.test(t.textContent)));
  // typing a contract number (with Arabic-Indic digits and without the prefix) finds it
  await page.fill('#cp-q', '٦٠٩'); await page.waitForTimeout(150);
  out.contractFound = await page.evaluate(() => [...document.querySelectorAll('#cp .cp-it .cp-t')].some(t => /609/.test(t.textContent)));
  await page.keyboard.press('Enter'); await page.waitForTimeout(500);
  out.contractOpened = await page.evaluate(() => S.view === 'contracts' && /شركة الحديد والصلب/.test((document.getElementById('drawer-root') || {}).textContent || document.body.textContent));
  // search by customer name opens the customer-service screen
  await page.keyboard.press('Escape'); await page.waitForTimeout(100);
  await page.keyboard.press('Control+k'); await page.fill('#cp-q', 'الانابيب'); await page.waitForTimeout(150);
  out.ticketFound = await page.evaluate(() => [...document.querySelectorAll('#cp .cp-it .cp-t')].some(t => /مصنع الأنابيب/.test(t.textContent)));
  await page.keyboard.press('Escape'); await page.waitForTimeout(100);
  // action: toggle theme through the palette
  const before = await page.evaluate(() => document.documentElement.dataset.theme || 'light');
  await page.keyboard.press('Control+k'); await page.fill('#cp-q', 'المظهر'); await page.waitForTimeout(150); await page.keyboard.press('Enter'); await page.waitForTimeout(200);
  out.themeToggled = await page.evaluate(b => (document.documentElement.dataset.theme || 'light') !== b, before);
  // Alt+1 jumps to the first menu item; g then k opens the calendar; ? opens help
  await page.evaluate(() => go('settings')); await page.keyboard.press('Alt+1'); await page.waitForTimeout(200);
  out.alt1 = await page.evaluate(() => S.view === VIEWS.filter(v => v.nav !== false)[0].id);
  await page.keyboard.press('g'); await page.keyboard.press('k'); await page.waitForTimeout(200);
  out.gk = await page.evaluate(() => S.view === 'calendar');
  await page.keyboard.press('Shift+?'); await page.waitForTimeout(250);
  out.help = await page.evaluate(() => { const d = document.getElementById('dlg'); return !!(d && d.open && /الاختصارات/.test(d.textContent) && /السبت أول الأسبوع/.test(d.textContent)); });
  await page.evaluate(() => dlg.close());
  // shortcuts do not fire while typing in a field
  await page.evaluate(() => go('contracts')); await page.waitForTimeout(200);
  await page.focus('#gq'); await page.keyboard.type('g'); await page.keyboard.type('k'); await page.waitForTimeout(150);
  out.noShortcutWhileTyping = await page.evaluate(() => S.view === 'contracts');
  out.errors = errors.filter(e => !/404/.test(e));
  await browser.close();
  console.log(JSON.stringify(out, null, 1));
  const ok = out.buttons && out.opened && out.hasScreens && out.contractFound && out.contractOpened && out.ticketFound && out.themeToggled && out.alt1 && out.gk && out.help && out.noShortcutWhileTyping && !out.errors.length;
  console.log(ok ? 'PALETTE OK' : 'PALETTE FAIL'); process.exit(ok ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
