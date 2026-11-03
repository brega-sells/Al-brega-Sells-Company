/* Service worker: makes the system installable and keeps the app shell available offline.
   Data is not cached here; Firestore keeps its own offline cache and syncs writes when the connection returns.
   Strategy: app files network-first (so updates arrive) with cache fallback; vendored libraries and icons cache-first. */
importScripts('version.js');
const CACHE='brega-'+self.APP_VERSION;
const SHELL=['./','index.html','attach.js','meetings.js','duties-data.js','duties.js','version.js','releases.js','pwa.js','notify.js','govern.js','palette.js','quality.js',
  'manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png',
  'vendor/firebase/firebase-app-compat.js','vendor/firebase/firebase-auth-compat.js','vendor/firebase/firebase-firestore-compat.js',
  'vendor/pdfjs/pdf.min.js','vendor/pdfjs/pdf.worker.min.js'];
const STATIC=/\/(vendor|icons)\//;
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('brega-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const url=new URL(req.url);if(url.origin!==self.location.origin)return;
  if(STATIC.test(url.pathname)){e.respondWith(caches.match(req).then(r=>r||fetch(req).then(res=>{if(res.ok)caches.open(CACHE).then(c=>c.put(req,res.clone()));return res})));return}
  e.respondWith(fetch(req).then(res=>{if(res.ok&&(req.mode==='navigate'||/\.(js|html|webmanifest|json)$/.test(url.pathname)||url.pathname.endsWith('/')))caches.open(CACHE).then(c=>c.put(req,res.clone()));return res})
    .catch(()=>caches.match(req).then(r=>r||(req.mode==='navigate'?caches.match('index.html'):undefined))));
});
