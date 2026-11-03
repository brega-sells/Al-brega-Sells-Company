/* ===== العمل دون اتصال والمزامنة التلقائية (offline writes + sync status) =====
   Firestore keeps its own offline copy (enablePersistence) and queues every write on the device until the connection returns.
   The catch: a write's promise resolves only when the server confirms it, so any screen that awaits a save would spin forever
   while offline. wrap(FS) returns the same Firestore object with writes that resolve as soon as the change is saved on the device
   (immediately when offline, or after a short wait on a weak connection), reads that use the device copy when offline, and a
   counter of changes still waiting for the server. A write the server later rejects (e.g. permission) is reported, never lost silently.
   Loaded right after the Firestore SDK and before the Firebase adapter. */
"use strict";
(function(){
const EN=()=>{if(window.I18N&&I18N.lang)return I18N.lang==='en';try{return localStorage.getItem('cm_lang')==='en'}catch(e){return false}};
const tr=(a,b)=>EN()&&b?b:a;
const say=m=>{try{toast(m)}catch(e){console.log(m)}};
const ACK_WAIT=4000; // on a weak connection, stop waiting for the server after this and treat the change as saved on the device
let inflight=0,legacy=false,hadPending=false;const subs=[];
const online=()=>navigator.onLine!==false;
function changed(){const n=count();if(n>0)hadPending=true;
  if(n===0&&hadPending&&online()){hadPending=false;say(tr('تمت مزامنة كل التعديلات مع قاعدة البيانات','All changes are synced with the database'))}
  subs.forEach(f=>{try{f(state())}catch(e){}});paint()}
const count=()=>inflight+(legacy?1:0);
function state(){const n=count();return {online:online(),pending:n,inflight,legacy}}
const ar=n=>n===1?'تعديل واحد':n===2?'تعديلان':n<=10?n+' تعديلات':n+' تعديلًا';
function label(){const s=state();const n=s.inflight;
  if(!s.online){if(!s.pending)return tr('غير متصل · تابع العمل، تُحفظ التعديلات على الجهاز','Offline · keep working, changes are saved on this device');
    return n?tr(`غير متصل · ${ar(n)} على الجهاز بانتظار المزامنة`,`Offline · ${n} change(s) saved on this device, waiting to sync`):tr('غير متصل · توجد تعديلات محفوظة على الجهاز بانتظار المزامنة','Offline · changes saved on this device are waiting to sync')}
  if(s.pending)return n?tr(`جارٍ المزامنة · ${ar(n)} بانتظار تأكيد قاعدة البيانات`,`Syncing · ${n} change(s) waiting for the server`):tr('جارٍ مزامنة التعديلات المحفوظة على الجهاز','Syncing the changes saved on this device');
  return tr('متصل · الحفظ تلقائي ومشترك','Online · saved automatically and shared')}
/* the status chip in the sidebar: only once the app has finished its first load (setConn('ready') sets __syncReady) */
function paint(){if(!window.__syncReady)return;const d=document.getElementById('conn-dot'),t=document.getElementById('conn-txt');if(!d||!t)return;const s=state();
  d.className='dot '+(!s.online?'off':s.pending?'sync':'on');t.textContent=label();document.documentElement.dataset.sync=s.pending?'1':''}
function reject(e){const denied=e&&e.code==='permission-denied';
  say(denied?tr('رفضت قاعدة البيانات أحد التعديلات المحفوظة على الجهاز لأنك لا تملك صلاحيته، فلم يُحفظ.','The database refused one of the changes saved on this device (no permission), so it was not saved.')
    :tr('تعذّرت مزامنة أحد التعديلات: ','A change could not be synced: ')+((e&&e.message)||''));
  try{console.warn('sync rejected',e)}catch(x){}}
/* resolve early once the change is on the device; keep the original error behaviour while the server answers quickly */
function track(p){inflight++;changed();let settled=false;
  const fin=()=>{inflight=Math.max(0,inflight-1);changed()};
  p.then(fin,e=>{fin();if(settled)reject(e)});
  return new Promise((res,rej)=>{
    const early=()=>{if(settled)return;settled=true;res()};
    p.then(v=>{if(!settled){settled=true;res(v)}},e=>{if(!settled){settled=true;rej(e)}});
    if(!online())Promise.resolve().then(early);else setTimeout(early,ACK_WAIT);
    const off=()=>{window.removeEventListener('offline',off);early()};window.addEventListener('offline',off);p.then(()=>window.removeEventListener('offline',off),()=>window.removeEventListener('offline',off));
  })}
/* offline reads come straight from the device copy instead of waiting for the network to time out */
function smartGet(g,o){if(o||online())return g(o);return g({source:'cache'}).catch(()=>g())}
function wQuery(q){if(!q||q.__ow)return q;try{
  const g=q.get&&q.get.bind(q);if(g)q.get=o=>smartGet(g,o);
  ['where','orderBy','limit','limitToLast','startAt','startAfter','endAt','endBefore'].forEach(k=>{const f=q[k];if(typeof f==='function'){const b=f.bind(q);q[k]=(...a)=>wQuery(b(...a))}});
  q.__ow=1}catch(e){}return q}
function wDoc(r){if(!r||r.__ow)return r;try{
  const s=r.set.bind(r),u=r.update.bind(r),d=r.delete.bind(r),g=r.get.bind(r);
  r.set=(...a)=>track(s(...a));r.update=(...a)=>track(u(...a));r.delete=()=>track(d());r.get=o=>smartGet(g,o);
  if(typeof r.collection==='function'){const c=r.collection.bind(r);r.collection=p=>wCol(c(p))}
  r.__ow=1}catch(e){}return r}
function wCol(c){if(!c||c.__ow)return c;wQuery(c);c.__ow=0;try{
  const od=c.doc.bind(c);c.doc=(...a)=>wDoc(od(...a));
  c.add=data=>{const ref=c.doc();return ref.set(data).then(()=>ref)};
  c.__ow=1}catch(e){}return c}
function wrap(FS){if(!FS||FS.__ow)return FS;const raw=FS;
  // queued writes left from an earlier visit (the tab was closed while offline): count them until the server confirms
  try{if(typeof raw.waitForPendingWrites==='function'){let done=false;raw.waitForPendingWrites().then(()=>{done=true;if(legacy){legacy=false;changed()}},()=>{done=true;if(legacy){legacy=false;changed()}});setTimeout(()=>{if(!done){legacy=true;changed()}},1500)}}catch(e){}
  return new Proxy(raw,{get(t,k){
    if(k==='__ow')return true;if(k==='__raw')return raw;
    if(k==='collection')return p=>wCol(t.collection(p));
    if(k==='doc')return p=>wDoc(t.doc(p));
    if(k==='batch')return()=>{const b=t.batch();const cm=b.commit.bind(b);b.commit=()=>track(cm());return b};
    const v=t[k];return typeof v==='function'?v.bind(t):v}})}
window.addEventListener('online',changed);window.addEventListener('offline',changed);
window.__sync={ar,wrap,state,label,count,on:f=>{subs.push(f);return()=>{const i=subs.indexOf(f);if(i>=0)subs.splice(i,1)}},paint,
  /* resolves when nothing is waiting for the server (used before signing out, so unsynced work is not stranded) */
  idle:()=>new Promise(res=>{if(count()===0&&online())return res();const off=window.__sync.on(s=>{if(s.pending===0&&s.online){off();res()}})})};
})();
