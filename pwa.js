/* ===== التطبيق القابل للتثبيت والعمل دون اتصال (PWA: service worker, update prompt, connection banner, install) ===== */
"use strict";
(function(){
const EN=()=>{if(window.I18N&&I18N.lang)return I18N.lang==='en';try{return localStorage.getItem('cm_lang')==='en'}catch(e){return false}};
const tr=(a,b)=>EN()&&b?b:a;
const say=m=>{try{toast(m)}catch(e){console.log(m)}};
const css=document.createElement('style');css.textContent=`
.pwa-bar{position:fixed;bottom:calc(64px + env(safe-area-inset-bottom,0px));left:50%;transform:translateX(-50%);background:var(--ink);color:var(--bg);padding:9px 14px;border-radius:10px;z-index:59;font-size:13px;box-shadow:var(--shadow);display:flex;gap:10px;align-items:center;max-width:min(92vw,560px)}
.pwa-bar.off{background:var(--warn);color:#fff}
html[data-offline="1"] #conn-dot{background:var(--warn)!important}
@media print{.pwa-bar{display:none}}`;document.head.appendChild(css);
let waiting=null;const PWA={userUpdated:false};
function showUpdate(reg){waiting=reg.waiting;if(!waiting)return;let b=document.getElementById('pwa-upd');if(!b){b=document.createElement('div');b.id='pwa-upd';b.className='pwa-bar';document.body.appendChild(b)}
  b.innerHTML=`<span>${tr('يتوفر إصدار جديد من المنظومة','A new version of the system is available')}</span><button class="btn sm primary" id="pwa-upd-btn">${tr('تحديث الآن','Update now')}</button>`;
  b.querySelector('#pwa-upd-btn').onclick=()=>{b.textContent=tr('جارٍ التحديث…','Updating…');PWA.userUpdated=true;try{waiting.postMessage('SKIP_WAITING')}catch(e){location.reload()}}}
const SW={reg:null,state:()=>!('serviceWorker' in navigator)?'unsupported':navigator.serviceWorker.controller?'active':'pending'};
if('serviceWorker' in navigator){
  window.addEventListener('load',async()=>{try{const reg=await navigator.serviceWorker.register('sw.js');SW.reg=reg;
    if(reg.waiting&&navigator.serviceWorker.controller)showUpdate(reg);
    reg.addEventListener('updatefound',()=>{const nw=reg.installing;if(!nw)return;nw.addEventListener('statechange',()=>{if(nw.state==='installed'&&navigator.serviceWorker.controller)showUpdate(reg)})});
    setInterval(()=>reg.update().catch(()=>{}),60*60*1000);
  }catch(e){console.warn('service worker',e)}});
  // reload only when an already-controlled page switches to a new worker (an update), never on the very first install
  const hadSW=!!navigator.serviceWorker.controller;let refreshing=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(refreshing||(!hadSW&&!PWA.userUpdated))return;refreshing=true;location.reload()});
}
/* connection awareness */
function conn(){const on=navigator.onLine;document.documentElement.dataset.offline=on?'':'1';let b=document.getElementById('net-bar');
  const sy=window.__sync&&window.__sync.state(),n=sy?sy.inflight:0,pend=sy?sy.pending:0;
  if(on){if(b)b.remove();if(conn.was===false)say(pend?tr('عاد الاتصال، تجري مزامنة التعديلات المحفوظة على الجهاز','Back online, syncing the changes saved on this device'):tr('عاد الاتصال بالإنترنت','Back online'))}
  else{if(!b){b=document.createElement('div');b.id='net-bar';b.className='pwa-bar off';b.setAttribute('role','status');document.body.appendChild(b)}
    b.textContent=tr('أنت غير متصل بالإنترنت. تابع العمل، تُحفظ التعديلات على هذا الجهاز وتُرفع تلقائيًا عند عودة الاتصال.','You are offline. Keep working; changes are saved on this device and upload automatically when the connection returns.')
      +(pend?' '+(n?tr(`(${window.__sync.ar(n)} بانتظار المزامنة)`,`(${n} waiting to sync)`):tr('(توجد تعديلات بانتظار المزامنة)','(changes waiting to sync)')):'')}
  conn.was=on}
window.addEventListener('online',conn);window.addEventListener('offline',conn);if(window.__sync)window.__sync.on(()=>{if(!navigator.onLine)conn()});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',conn);else conn();
/* install prompt (Android, desktop); iOS shows a hint instead */
let deferred=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;document.dispatchEvent(new CustomEvent('pwa-installable'))});
window.addEventListener('appinstalled',()=>{deferred=null;say(tr('ثُبّتت المنظومة على هذا الجهاز','The system is installed on this device'))});
window.__pwa={sw:SW,install:async()=>{if(!deferred)return false;deferred.prompt();const r=await deferred.userChoice;deferred=null;return r.outcome==='accepted'},
  canInstall:()=>!!deferred,isStandalone:()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true,isIOS:()=>/iPhone|iPad|iPod/.test(navigator.userAgent),
  checkUpdate:async()=>{if(!SW.reg)return false;await SW.reg.update();return !!SW.reg.waiting},
  reset:async()=>{try{const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)));const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.unregister()))}catch(e){}location.reload()}};
})();
