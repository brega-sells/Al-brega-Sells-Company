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
