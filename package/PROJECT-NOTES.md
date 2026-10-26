# منظومة الإدارة العامة للمبيعات والشؤون التجارية — ملف تعريف المشروع
## Contracts & Fuel-Needs System — project notes for Claude

**Owner:** m.elmzughi@gmail.com · **Built:** October 2026 · **Language of the UI:** Arabic (RTL)

Two organizations in one system:
- **شركة البريقة لتسويق النفط (Brega Petroleum Marketing Co.)** — register of fuel-sale contracts (diesel, LPG, heavy oil, marine fuel).
- **وزارة الصناعة والمعادن (Ministry of Industry and Minerals)** — batches ("دفعات") of field-visit sheets listing factories/entities and their approved monthly fuel needs for October 2026.

Published artifact (private to the owner's Claude account, data in its Artifact DB):
https://claude.ai/artifact/BPA6oYeVhhWDFh3So2qmHi

---

## 1. What is in this package

| Path | What it is |
|---|---|
| `source/index.html` | **Master source** of the UI (Claude artifact version; uses `window.claude.use('db')`, `user`, `assets`, `downloads`). All other versions are built from this file. |
| `source/articles.json` | Standard contract articles (15 diesel, 14 LPG) shown in the contract card. |
| `source/seed/initial-data.json` | **All data**: 5 batches, 39 contracts, 393 facilities (JSON, ids `b1..b5`, `c001..c039`, `n001..n393`). |
| `source/build-scripts/` | Python build scripts + JS adapters used to derive the three deployable versions. |
| `versions/standalone/منظومة-العقود-والاحتياجات.html` | **Single-file offline version.** Opens by double-click, data saved in the browser's localStorage, backup/restore as JSON from Settings. |
| `versions/server/ContractsSystem-Server.zip` | **Internal-server version.** Python 3.8+ standard library only (`server.py` + SQLite). Logins, roles (admin/editor/viewer), activity log, daily backups, PDF upload, Excel import/export done server-side. Guide: `Guide-AR.html` inside. |
| `versions/web/ContractsSystem-Web.zip` | **Public-internet version.** Page hosted on GitHub Pages, data + auth on Firebase (Firestore + Email/Password). Includes `firestore.rules`, `firebase-config.js` (placeholders), `README-AR.html`. |
| `guides/دليل-نشر-المنظومة-على-الإنترنت.pdf` | 10-page Arabic step-by-step guide: creating GitHub/Google accounts, Firebase setup, GitHub Pages deploy, first use, adding staff, troubleshooting. |
| `guides/Guide-AR.html` | Server-version install guide (Arabic). |
| `originals/` | The user's original inputs: `contracts-register.xlsx` and the three scanned PDFs. |

## 2. Features of the UI (all versions)
Dashboard (KPIs, expiry timeline, by type/batch/region), Brega contracts table (search, filters, sort, status/alerts computed), contract card (dates, progress bar, second-party data from the signed contract, extensions, letters, linked ministry sheet rows, standard articles), ministry needs table (per batch/section/region/fuel, totals footer), batches page, directory of entities (contracts + sheets merged by name), extensions & letters, settings (alert thresholds 90/60/30 days, lists, Excel export of everything, Excel import compatible with the old register), global search (`/` key), quick-add dialog, light/dark theme, phone layout.

Automatic name matching links a ministry facility to a Brega contract (`nameMatch()` in the source; 19 matches found). Duplicate contract numbers are flagged.

## 3. Data model (collections / documents)
- `contracts` — `no` (e.g. `ع.ت.د/609`), `company`, `location`, `type`, `subject`, `signDate`, `startDate`, `endDate` (ISO `YYYY-MM-DD`), `value`, `currency`, `qty` (text, e.g. `96468 لتر`), `dept`, `officer`, `special` (معلق / منتهٍ قبل موعده), `pdfPath`, `notes`, `party{rep, repTitle, legalRep, cr, crOffice, phone, address, auth, purpose, qtyText, basis, firstRep}`, `docInfo{signingText, signingCity, coverDate, firstAuth, payment, durationText, copies, articles, uncertain}`, `source`, `createdAt`, `updatedAt`.
  Computed at runtime (not stored): effective end (max of endDate and extensions), status (ساري / قريب الانتهاء / منتهٍ / لم يبدأ بعد / special), remaining days, alert (عاجل / خلال 60 يوم / خلال 90 يوم), duration months, extensions count.
- `needs` — `batch` (b1..b5), `page` (page in the scanned PDF), `seq` (row number in the sheet), `section`, `company`, `tradeName`, `project`, `activity`, `licensee`, `region`, `capacity`, `power`, `dieselGen`, `dieselOp`, `gas` (tons), `heavyOil`, `kerosene`, `projQty` (projects with unspecified fuel type), `bregaQty`, `visitDate`, `notes`, `extra{}`, `uncertain` (transcription doubt → shown as a "تدقيق" badge).
- `batches` — `name`, `order`, `ref` (الرقم الإشاري, e.g. `220-17-158`), `date`, `count` (announced count), `pages`, `summary`.
- `extensions` — `contractNo`, `decisionDate`, `newEnd`, `note`.
- `letters` — `contractNo`, `ref`, `date`, `note`.
- `companies` — optional manual directory entries (`name`, `phone`, `email`, `address`, `person`).
- `config/main` — `t1,t2,t3` alert days, `types[]`, `depts[]`, `specials[]`, `currencies[]`.

Batches (count matches the official letters): الأولى 166 (ref 220-17-158) · الثانية 60 (220-17-159) · الثالثة 57 (220-17-160) · الرابعة 80 (220-17-161) · الخامسة 30 (220-17-162). All letters dated 2026-10-01, signed د. مصطفى علي السمو; sheets approved by أ. الطيب محمد إمبيص.

## 4. Known data caveats (tell the user when relevant)
- Excel register values 100,000…1,000,000 and officers "مسؤول 1..10" look like placeholder data; kept as-is. Example rows marked "(مثال)" in the Excel were not imported.
- Contract 610: Excel sign date 2025-08-09 vs signed contract text "9 أغسطس 2026" (noted in contract notes).
- LPG contract 654: page 3 missing in both scans → contract term unknown. Quantity "60,000 طن شهرياً" as printed.
- Contract 667: first digit of number overwritten on cover (667 most likely, 867 possible).
- الدفعة الثالثة cover says September; the letter says October.
- Scanned page 76 (batch 3, seq 19–25) is blurry: diesel quantities uncertain.
- Housing/transport/administrative-centres project rows (batch 1) give a quantity without fuel type → stored in `projQty`.

## 5. How to modify the system
1. Edit `source/index.html` (master).
2. Re-publish the artifact with the Artifact tool (same URL above) — capabilities `{db:{}, user:{}, assets:{}, downloads:true}`.
3. Rebuild the other versions with the scripts in `source/build-scripts/` (each `build.py` reads the master and writes the derived file; paths inside may need adjusting to the new working directory):
   - standalone: embeds seed + articles, localStorage adapter (`local.js`), Excel in pure JS (`extras.js`).
   - server: `adapter.js` (REST sync against `server.py`) + `extras.js` (users, log, backup).
   - web: `firebase.js` adapter + `extras-cloud.js` (roles, log, seed button).
4. Data changes for the artifact go through the ArtifactData tool (collections above); for other versions, through their own storage.

## 6. Sharing options already explained to the user
- Artifact: share from the page's Share menu; colleagues need Claude accounts (Editor to edit, Viewer to read).
- Standalone HTML: no accounts, but data is per-device (exchange via JSON backup file).
- Server: one shared internal link, own logins; needs IT to run Python on a LAN machine.
- Web (GitHub Pages + Firebase): public link for any device, own logins; setup ~30–45 min via the PDF guide. The user has not yet connected GitHub to Claude, so publishing could not be done from the chat.

## 7. Organizational structure (الهيكل التنظيمي) — added October 2026
- Source: the user's 13-page scan «الإدارة العامة للمبيعات والشؤون التجارية» (board approval line still blank).
- Static data in the page code (`ORG_ROWS` in both `index.html` and `source/index.html`): 101 entries `[id, parentId, title, head, empNo, flags]`, flags `v` = vacant (شاغرة), `u` = unclear in the scan (shown as «تدقيق»). Type (إدارة/منسق/قسم/مكتب/وحدة/مشرف) is inferred from the title.
- Top-level ids: `board` → `gm` → `ca` (الشؤون التجارية والتحصيلات), `w` (المبيعات غ.ج), `e` (المبيعات و.ش), plus `gm-rep`, `gm-fo` directly under the GM.
- Permissions per unit are NOT defined yet: the user will send them. Attach them in `ORG_PERMS` keyed by unit id (the view already shows "الصلاحيات: لم تُحدَّد بعد" / count).
- Known doubts: emp. no. 507350 appears twice (عقيلة علي عقيلة and محمد فرج الترهوني); 40985 has 5 digits; page 8 of the scan is blurry (several names marked `u`).

## 8. Closed online meetings between departments (الاجتماعات المغلقة) — added October 2026
- Web (GitHub Pages + Firebase) version only. Code in `meetings.js` at the repo root, loaded by one script tag at the end of `index.html`; it adds the nav page `meetings` and wraps `render()`.
- Units that can meet: `board`, `gm`, `e`, `w`, `ca`, `gm-fo`, `gm-rep` (titles/heads from `ORG_ROWS`).
- Each user is linked to a unit by the admin (meetings page, bottom table) → field `unit` on `roles/<email>`.
- Collection `meetings`: `title, date, time, duration, organizer, units[] (organizer + invited), agenda[{t}], link, passcode, status (scheduled|live|closed|cancelled), rsvp{unit:{s,by,name,at}}, minutes, decisions[{t,unit,due,done,doneAt,doneBy}], createdBy, createdByName, createdAt, updatedAt, closedAt, closedBy, closedByName`.
- Privacy enforced in `firestore.rules` (root): read only by admin, creator, or users whose unit is in `units`. Invited viewers can only RSVP; invited editors edit minutes/decisions until closed, and decisions after close. Rules verified with the Firestore emulator (29 allow/deny cases).
- Join link: auto-generated private Jitsi room (`https://meet.jit.si/BregaSales-<random>`), replaceable by any https link (Google Meet, Teams, Zoom).
## 9. Bilingual UI, Arial bold, new logo — added October 2026 (web version, root `index.html`)
- Language switch button (English / العربية) in the top bar and on the login card; choice saved in `localStorage.cm_lang` (`ar` default). Arabic = RTL, English = LTR (`<html dir>` set before render; `[dir=ltr]` CSS overrides for drawer side, search icon, org-chart connectors, table alignment).
- How it works: the UI code stays in Arabic. In English mode `window.I18N` (script `#i18n`) translates text nodes and `placeholder/title/aria-label/data-tip` through a dictionary (exact match → numbers normalized as `{0}` → regex rules → segments split on ` · `, ` — `, `: `). User data (company names, people, regions inside free text) stays as entered. `<option>` without a value gets `value` = original Arabic so filters/forms keep working. `translate="no"` skips a subtree. `I18N.add({ar:en})` registers more strings (used by `meetings.js`).
- Source: `source/build-scripts/i18n/` — `i18n-engine.js`, `rules.js`, `dict1..4.py`, `build_i18n.py` (injects engine + dictionary + Arial-bold CSS + LTR CSS; re-runnable), `build_logo.py` (replaces sidebar/login logo and favicon with `source/logo-brega.png` / `favicon-brega.png`).
- When adding new UI strings, add their English to a dict file and re-run: `python3 build_logo.py ../../../../index.html && python3 build_i18n.py ../../../../index.html` (run on the pre-injection file, or just re-run build_i18n which replaces the old `#i18n` script).
- Font: Arial bold everywhere (`*{font-weight:700!important}`), fallbacks Arimo / Noto Sans Arabic from Google Fonts for devices without Arial.

## 8. تحليل البيانات وخدمة الزبائن — added October 2026
- Two sidebar items under «عام»: `ana` (تحليل البيانات) and `cs` (خدمة الزبائن). Code lives in `source/modules/analytics-cs.js` + `analytics-cs.css`; `source/modules/apply.py FILE...` injects them into a page (root `index.html` and `source/index.html`, already applied — the script refuses to apply twice).
- Analytics tabs: contracts, needs & fuel, sales opportunities (ministry facilities with no Brega contract, ranked by diesel need), customer-service stats, and a custom group-by/measure tool. Every chart bar can jump to the filtered list; each tab exports to Excel.
- Customer service: collection `tickets` — `no` (`YYYY/NNN`), `date`, `customer`, `contact`, `phone`, `contractNo`, `channel`, `type`, `priority` (عاجلة/مهمة/عادية → default due 2/5/10 days), `subject`, `details`, `assignee`, `dueDate`, `status` (جديد/قيد المعالجة/بانتظار الزبون/مغلق), `closedAt`, `resolution`, `history[{ts,by,status,note}]`.
  Customers = the directory (contracts + needs entities) plus manual records saved in the existing `companies` collection (`name, kind, person, phone, email, address, notes`).
- Firebase: `tickets` must be in the collection lists of `firestore.rules` (done in the repo file; the live rules must be re-published in the Firebase console). Until then the page shows an activation banner in خدمة الزبائن.
- «آلية إشعارات البيع» و«إشعارات البيع» (tabs `nm`, `nt` in خدمة الزبائن), from memo BPMC-GEN-COR-F03 (ref 424, 2026-10-12): code in `source/modules/notices.js`, injected by `apply_notices.py` (run after `apply.py`).
  Mechanism text is one document `config/notices` → `data["<region>|<segment>"] = {stages:[{desc,unit,docs,days,notes}×9], challenges, proposals, by, at}`; regions = the two regional sales managements, segments = القطاع العام/المستهلكون/شركات التوزيع/الطيران/السفن.
  Live notices: collection `notices` — `no, date, customer, segment, region, contractNo, agent, fuel, unit, qtyRequested, qtyAllocated, qtyNotice, qtyDispensed, depot, shipDate, payment, stage (1–9), status (جارٍ/مكتمل/موقوف), log[{ts,by,stage,note}], doneAt`. Added to `firestore.rules`.
- Update: meeting platform field `platform` (zoom default | meet | teams | whatsapp | jitsi) + `meetingId`; Zoom link built from the meeting ID when no link is pasted. Invitations can be sent on WhatsApp (wa.me with the invitation text); department WhatsApp numbers are in `config/meetings.whatsapp{unitId: number}`, edited by the admin on the meetings page. Automatic Zoom meeting creation (API) is not built yet: it needs a Zoom Server-to-Server OAuth app and a small backend to keep the secret.
