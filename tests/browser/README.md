# Browser tests (Playwright, no Firebase project needed)

`fakefb.js` replaces the Firebase compat SDK with an in-memory fake, so every screen runs against seeded data
without touching the real project. `harness.js` serves `index.html` from a local HTTP server and routes
`vendor/firebase/*` to the fake.

```
cd <repo root>
python3 -m http.server 8765 &
npm i -g playwright            # or use an existing Playwright + Chromium
node tests/browser/xss.js       # stored-XSS sweep: payload in every text field of every collection, every view/tab/drawer/print window
ROLE=w node tests/browser/xss.js
node tests/browser/auth.js      # e-mail verification gate, re-authentication before role changes, self-demotion guard, per-department records, idle sign-out
node tests/browser/pwa.js       # notifications bell, calendar, version footer + what’s new, error boundary + clientErrors report, admin health panel, service worker install (no reload on first install)
node tests/browser/govern.js  # access review with re-auth, account register CSV, access matrix, retention periods, legal hold + record history, SHA-256 approval stamp and tamper detection
node tests/browser/palette.js   # command palette (Ctrl+K), record search with Arabic-Indic digits, theme action, Alt+1, g-k chord, help dialog, no shortcuts while typing
```
`xss.js` prints `hits: []` when nothing rendered as HTML; `auth.js` prints a JSON object where every value must be `true` (or the expected list); `pwa.js` ends with `PWA/NOTIFY OK` and `palette.js` with `PALETTE OK`, `govern.js` with `GOVERN OK`.
