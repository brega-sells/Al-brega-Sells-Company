# Vendored libraries (pinned, served from this origin with Subresource Integrity)

| Library | Version | Licence | Source |
|---|---|---|---|
| Firebase JS SDK (compat bundles: app, auth, firestore) | 10.14.1 | Apache-2.0 | npm package `firebase` |
| pdf.js (`pdf.min.js`, `pdf.worker.min.js`) | 3.11.174 | Apache-2.0 | npm package `pdfjs-dist` |

To upgrade: copy the new files here, recompute `openssl dgst -sha384 -binary FILE | openssl base64 -A`, and update the `integrity` attributes in `index.html` and `attach.js`.
