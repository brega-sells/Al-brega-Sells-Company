/* ===== الجودة والتشغيل (version & about, what's new, changelog, error boundary & error log, system health, app panel) =====
   Loaded last so its render() wrapper is the outermost: any error thrown while drawing a screen is caught here,
   shown as a friendly Arabic screen with a reference code, and recorded in Firestore `clientErrors` for the admin.
   Needs: version.js (APP_VERSION), releases.js (RELEASES), pwa.js (window.__pwa). */
"use strict";
(function(){
const EN=()=>{if(window.I18N&&I18N.lang)return I18N.lang==='en';try{return localStorage.getItem('cm_lang')==='en'}catch(e){return false}};
const tr=(a,b)=>EN()&&b?b:a;
const me=()=>(window.__me&&window.__me())||null;
const FS=()=>window.__fs&&window.__fs();
const say=m=>{try{toast(m)}catch(e){}};
const VER=window.APP_VERSION||'0.0.0',VDATE=window.APP_DATE||'';
const REL=window.RELEASES||[];
const TYPE_C={'جديد':'p-ok','تحسين':'p-info','إصلاح':'p-neutral','أمان':'p-warn'};
const TYPE_E={'جديد':'New','تحسين':'Improved','إصلاح':'Fixed','أمان':'Security'};

/* ---------- error log (clientErrors) ---------- */
const EL={n:0,win:0,last:new Map()};
function logError(err,where){try{
  const now=Date.now();if(now-EL.win>60000){EL.win=now;EL.n=0}if(EL.n>=5)return null;
  const msg=String(err&&err.message||err||'').slice(0,500);const key=where+'|'+msg;if(EL.last.get(key)&&now-EL.last.get(key)<300000)return null;EL.last.set(key,now);EL.n++;
  const ref='E-'+now.toString(36).toUpperCase().slice(-6);const m=me();
  const doc={ts:new Date().toISOString(),ref,msg,stack:String(err&&err.stack||'').slice(0,2000),screen:String(where||S.view||'').slice(0,60),ver:VER,ua:navigator.userAgent.slice(0,200),online:navigator.onLine,role:(m&&m.role)||'',lang:EN()?'en':'ar',user:(m&&m.email)||''};
  const fs=FS();if(fs&&m)fs.collection('clientErrors').add(doc).catch(()=>{});
  console.error('[brega '+ref+']',err);return ref}catch(e){return null}}
window.addEventListener('error',e=>{if(e&&e.message&&!/ResizeObserver|Script error/.test(e.message))logError(e.error||e.message,'window')});
window.addEventListener('unhandledrejection',e=>{const r=e&&e.reason;if(r&&r.code&&/permission-denied|unavailable|cancelled/.test(r.code))return;logError(r||'rejection','promise')});
window.__logError=logError;

/* ---------- error boundary around render ---------- */
function errorScreen(ref){const v=document.getElementById('view');if(!v)return;
  v.innerHTML=`<div class="panel q-err"><h2 style="margin:0 0 6px">${esc(tr('حدث خطأ غير متوقع','Something went wrong'))}</h2><p class="muted" style="margin:0 0 12px">${esc(tr('تعذّر عرض هذه الشاشة. أُبلغ مدير النظام تلقائيًا، ويمكنك إعادة المحاولة أو العودة إلى لوحة المؤشرات.','This screen could not be drawn. The administrator was notified automatically; you can retry or go back to the dashboard.'))}${ref?` <b dir="ltr">${esc(tr('الرقم المرجعي','Reference'))}: ${esc(ref)}</b>`:''}</p>
   <div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn primary" data-q="retry">${esc(tr('إعادة المحاولة','Retry'))}</button><button type="button" class="btn" data-q="home">${esc(tr('لوحة المؤشرات','Dashboard'))}</button><button type="button" class="btn ghost" data-q="note">${esc(tr('أرسل ملاحظة لمدير النظام','Send a note to the administrator'))}</button></div></div>`;
  v.querySelector('[data-q="retry"]').onclick=()=>render();v.querySelector('[data-q="home"]').onclick=()=>go('dash');
  v.querySelector('[data-q="note"]').onclick=()=>{modal(tr('ملاحظة عن الخطأ','Note about the error'),`<div class="field full"><label for="q-note">${esc(tr('ماذا كنت تفعل عندما ظهر الخطأ؟','What were you doing when the error appeared?'))}</label><textarea id="q-note" rows="4" maxlength="1000"></textarea></div>`,`<button class="btn primary" type="button" data-q="send">${esc(tr('إرسال','Send'))}</button>`);
    dlg.querySelector('[data-q="send"]').onclick=async()=>{const n=val('q-note');const fs=FS(),m=me();if(fs&&m&&n){try{await fs.collection('clientErrors').add({ts:new Date().toISOString(),ref:ref||'',msg:'note',stack:'',screen:String(S.view||''),ver:VER,ua:navigator.userAgent.slice(0,200),online:navigator.onLine,role:m.role||'',lang:EN()?'en':'ar',user:m.email,note:n.slice(0,1000)})}catch(e){}}dlg.close();say(tr('شكرًا، وصلت ملاحظتك','Thank you, your note was received'))}}}
const __render=render;render=function(){try{__render()}catch(e){const ref=logError(e,'render:'+S.view);errorScreen(ref)}};

/* ---------- version, about, what's new, changelog ---------- */
function relHtml(r,role){const hs=(r.highlights||[]).filter(h=>!h.roles||!h.roles.length||h.roles.includes(role));
  return `<div class="q-rel"><div class="q-relh"><b>${esc(tr('الإصدار','Version'))} ${esc(r.version)}</b><small>${esc(fd(r.date))}</small></div><ul>${hs.map(h=>`<li><span class="pill ${TYPE_C[h.type]||'p-neutral'}">${esc(tr(h.type,TYPE_E[h.type]))}</span><div><b>${esc(h.title)}</b><p>${esc(h.desc)}</p>${h.link&&VIEWS.some(v=>v.id===h.link)?`<button type="button" class="btn sm ghost" data-q-go="${esc(h.link)}">${esc(tr('افتح الشاشة','Open'))}</button>`:''}</div></li>`).join('')}</ul></div>`}
function bindGo(){dlg.querySelectorAll('[data-q-go]').forEach(b=>b.onclick=()=>{dlg.close();go(b.dataset.qGo)})}
function whatsNew(force){const m=me();const r=REL[0];if(!r)return;let seen='';try{seen=localStorage.getItem('cm_seen_ver')||''}catch(e){}
  if(!force&&(seen===VER||r.version!==VER))return;
  modal(tr('ما الجديد في الإصدار','What’s new in version')+' '+r.version,relHtml(r,m&&m.role),`<button class="btn ghost" type="button" data-q="log">${esc(tr('سجل التحديثات','All updates'))}</button><button class="btn primary" value="ok">${esc(tr('حسنًا','OK'))}</button>`);
  bindGo();dlg.querySelector('[data-q="log"]').onclick=()=>{dlg.close();changelog()};try{localStorage.setItem('cm_seen_ver',VER)}catch(e){}}
function changelog(){const m=me();modal(tr('سجل التحديثات','Update history'),`<div class="q-log">${REL.map(r=>relHtml(r,m&&m.role)).join('')}</div>`,`<button class="btn primary" value="ok">${esc(tr('إغلاق','Close'))}</button>`);bindGo()}
function about(){const sw=window.__pwa?window.__pwa.sw.state():'unsupported';const m=me()||{};
  modal(tr('عن المنظومة','About the system'),`<dl class="dl">
   <div><dt>${esc(tr('الإصدار','Version'))}</dt><dd dir="ltr">${esc(VER)} · ${esc(VDATE)}</dd></div>
   <div><dt>${esc(tr('الاستضافة','Hosting'))}</dt><dd>GitHub Pages + Firebase (Firestore, Authentication)</dd></div>
   <div><dt>${esc(tr('حسابك','Your account'))}</dt><dd dir="ltr">${esc(m.email||'')} · ${esc((window.__roleAr||{})[m.role]||'')}</dd></div>
   <div><dt>${esc(tr('التطبيق','App'))}</dt><dd>${esc(sw==='active'?tr('مثبّت للعمل دون اتصال','Offline-ready'):sw==='pending'?tr('يُهيَّأ للعمل دون اتصال','Preparing offline support'):tr('المتصفح لا يدعم العمل دون اتصال','Offline support not available in this browser'))}</dd></div>
   <div class="full"><dt>${esc(tr('الملكية','Owner'))}</dt><dd>${esc(tr('شركة البريقة لتسويق النفط · الإدارة العامة للمبيعات والشؤون التجارية','Brega Petroleum Marketing Co. · General Administration for Sales & Commercial Affairs'))}</dd></div></dl>`,
   `<button class="btn ghost" type="button" data-q="log">${esc(tr('سجل التحديثات','Update history'))}</button><button class="btn ghost" type="button" data-q="new">${esc(tr('ما الجديد','What’s new'))}</button><button class="btn primary" value="ok">${esc(tr('إغلاق','Close'))}</button>`);
  dlg.querySelector('[data-q="log"]').onclick=()=>{dlg.close();changelog()};dlg.querySelector('[data-q="new"]').onclick=()=>{dlg.close();whatsNew(true)}}
function footer(){const f=document.querySelector('.side-foot');if(!f||document.getElementById('q-ver'))return;const d=document.createElement('div');d.id='q-ver';d.innerHTML=`<button type="button" class="q-verbtn" id="about-btn" title="${esc(tr('عن المنظومة','About'))}">${esc(tr('الإصدار','Version'))} <span dir="ltr">${esc(VER)}</span> · ${esc(fd(VDATE))}</button>`;f.appendChild(d);d.querySelector('#about-btn').onclick=about}
window.__about=about;window.__whatsNew=()=>whatsNew(true);window.__changelog=changelog;

/* ---------- settings: app panel (everyone) + health panel (admin) ---------- */
function appPanel(){const p=window.__pwa;const can=p&&p.canInstall(),ios=p&&p.isIOS(),sa=p&&p.isStandalone();const sw=p?p.sw.state():'unsupported';
  return `<div class="panel" id="q-app"><h3 class="section-title">${esc(tr('التطبيق والتحديثات','App & updates'))} <small dir="ltr">v${esc(VER)}</small></h3>
   <p class="muted" style="margin:0 0 10px;font-size:13px">${esc(sa?tr('المنظومة مثبّتة على هذا الجهاز كتطبيق.','The system is installed on this device as an app.'):tr('ثبّت المنظومة على الهاتف أو الحاسوب لفتحها كتطبيق مستقل ولتظل الشاشات والبيانات الأخيرة متاحة عند انقطاع الإنترنت.','Install the system on your phone or computer to open it as an app and keep recent screens and data available offline.'))}</p>
   <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
    ${!sa&&can?`<button type="button" class="btn primary" data-q="install">${esc(tr('ثبّت التطبيق','Install the app'))}</button>`:''}
    ${!sa&&ios?`<span class="muted" style="font-size:12.5px">${esc(tr('على iPhone/iPad: زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».','On iPhone/iPad: Share, then “Add to Home Screen”.'))}</span>`:''}
    <button type="button" class="btn" data-q="upd">${esc(tr('التحقق من وجود تحديث','Check for updates'))}</button>
    <button type="button" class="btn ghost" data-q="new">${esc(tr('ما الجديد','What’s new'))}</button><button type="button" class="btn ghost" data-q="log">${esc(tr('سجل التحديثات','Update history'))}</button>
    <button type="button" class="btn ghost" data-q="reset" title="${esc(tr('يحذف النسخة المخزنة محليًا ويعيد التحميل؛ لا يمس البيانات','Clears the locally cached copy and reloads; data is not affected'))}">${esc(tr('إصلاح التطبيق','Repair the app'))}</button>
    <span class="muted" style="font-size:12px">${esc(tr('العمل دون اتصال','Offline'))}: ${esc(sw==='active'?tr('جاهز','ready'):sw==='pending'?tr('قيد التهيئة','preparing'):tr('غير مدعوم','unsupported'))}</span></div></div>`}
function bindApp(){const b=document.getElementById('q-app');if(!b)return;const p=window.__pwa;
  const on=(k,f)=>{const x=b.querySelector(`[data-q="${k}"]`);if(x)x.onclick=f};
  on('install',async()=>{const ok=await p.install();say(ok?tr('جارٍ التثبيت…','Installing…'):tr('أُلغي التثبيت','Install cancelled'));render()});
  on('upd',async()=>{if(!p){say(tr('غير متاح','Not available'));return}const w=await p.checkUpdate().catch(()=>false);say(w?tr('يتوفر تحديث، اضغط «تحديث الآن» في أسفل الشاشة','An update is ready: press “Update now” at the bottom'):tr('لديك أحدث إصدار','You have the latest version'))});
  on('new',()=>whatsNew(true));on('log',changelog);on('reset',()=>{if(confirm(tr('سيُعاد تحميل المنظومة بعد مسح النسخة المخزنة محليًا. المتابعة؟','The system will reload after clearing the local copy. Continue?')))p.reset()})}
function healthPanel(){return `<div class="panel" id="q-health"><h3 class="section-title">${esc(tr('صحة المنظومة','System health'))} <small>${esc(tr('آخر 24 ساعة','last 24 hours'))}</small></h3>
   <div class="q-kpis"><div><b id="qh-err">…</b><span>${esc(tr('بلاغ خطأ','error reports'))}</span></div><div><b id="qh-users">…</b><span>${esc(tr('مستخدم نشط','active users'))}</span></div><div><b>${esc(navigator.onLine?tr('متصل','online'):tr('غير متصل','offline'))}</b><span>${esc(tr('الاتصال','connection'))}</span></div><div><b dir="ltr">v${esc(VER)}</b><span>${esc(tr('الإصدار','version'))}</span></div></div>
   <div id="qh-box" class="muted" style="margin-top:10px">${esc(tr('جارٍ التحميل…','Loading…'))}</div>
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button type="button" class="btn sm" data-q="test">${esc(tr('تجربة بلاغ خطأ','Send a test error'))}</button><button type="button" class="btn sm ghost" data-q="purge">${esc(tr('حذف البلاغات الأقدم من 30 يومًا','Delete reports older than 30 days'))}</button><button type="button" class="btn sm ghost" data-q="csv">${esc(tr('تصدير CSV','Export CSV'))}</button></div></div>`}
let HROWS=[];
async function loadHealth(){const box=document.getElementById('qh-box');if(!box)return;const fs=FS();if(!fs){box.textContent=tr('قاعدة البيانات غير متصلة','Database not connected');return}
  try{const qs=await fs.collection('clientErrors').orderBy('ts','desc').limit(200).get();HROWS=[];qs.forEach(d=>HROWS.push(Object.assign({id:d.id},d.data())));
    const since=new Date(Date.now()-86400000).toISOString();const day=HROWS.filter(r=>r.ts>=since);
    document.getElementById('qh-err').textContent=String(day.filter(r=>r.msg!=='note').length);
    let lg=[];try{const l=await fs.collection('log').where('ts','>=',since).get();l.forEach(d=>lg.push(d.data()))}catch(e){}
    document.getElementById('qh-users').textContent=String(new Set(lg.map(x=>x.user)).size);
    const byScreen={};day.forEach(r=>{byScreen[r.screen||'?']=(byScreen[r.screen||'?']||0)+1});
    box.innerHTML=HROWS.length?`${Object.keys(byScreen).length?`<p style="margin:0 0 8px;font-size:13px">${esc(tr('حسب الشاشة','By screen'))}: ${Object.entries(byScreen).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<span class="pill p-neutral">${esc(k)} · ${v}</span>`).join(' ')}</p>`:''}
      <div class="tablewrap" style="max-height:360px;min-height:0"><table><thead><tr><th class="nosort">${esc(tr('الوقت','Time'))}</th><th class="nosort">${esc(tr('المرجع','Ref'))}</th><th class="nosort">${esc(tr('الشاشة','Screen'))}</th><th class="nosort">${esc(tr('الرسالة','Message'))}</th><th class="nosort">${esc(tr('الدور','Role'))}</th><th class="nosort">${esc(tr('الإصدار','Ver'))}</th></tr></thead><tbody>${HROWS.map(r=>`<tr style="cursor:default" title="${esc((r.stack||'').slice(0,600))}"><td class="n">${esc((r.ts||'').slice(0,16).replace('T',' '))}</td><td dir="ltr">${esc(r.ref||'')}</td><td>${esc(r.screen||'')}</td><td dir="auto">${esc(r.msg==='note'?'📝 '+(r.note||''):(r.msg||''))}</td><td>${esc(r.role||'')}</td><td dir="ltr">${esc(r.ver||'')}</td></tr>`).join('')}</tbody></table></div>`
      :`<div class="empty" style="padding:16px"><b>${esc(tr('لا بلاغات أخطاء','No error reports'))}</b>${esc(tr('ممتاز. أي خطأ غير متوقع في المتصفح سيُسجَّل هنا تلقائيًا.','Any unexpected browser error will be recorded here automatically.'))}</div>`}
  catch(e){box.textContent=tr('تعذّر التحميل: ','Could not load: ')+(e.message||'')}}
function bindHealth(){const b=document.getElementById('q-health');if(!b)return;const on=(k,f)=>{const x=b.querySelector(`[data-q="${k}"]`);if(x)x.onclick=f};
  on('test',()=>{setTimeout(()=>{throw new Error('Test error from the health panel')},0);say(tr('أُرسل بلاغ تجريبي، حدّث اللوحة بعد لحظات','Test report sent; refresh the panel in a moment'));setTimeout(loadHealth,1500)});
  on('purge',async()=>{const fs=FS();if(!fs)return;const lim=new Date(Date.now()-30*86400000).toISOString();let n=0;try{const qs=await fs.collection('clientErrors').where('ts','<',lim).limit(300).get();for(const d of qs.docs){await d.ref.delete();n++}}catch(e){say(e.message||'');return}say(tr('حُذف','Deleted')+' '+n);loadHealth()});
  on('csv',()=>{const h=['ts','ref','screen','msg','role','ver','user','online','ua','note'];const q=s=>'"'+String(s==null?'':s).replace(/"/g,'""')+'"';const csv='﻿'+h.join(',')+'\n'+HROWS.map(r=>h.map(k=>q(r[k])).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download='client-errors.csv';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},1500)})}
const __render2=render;render=function(){__render2();if(S.view==='settings'){const v=document.getElementById('view');const m=me();if(v&&m&&!document.getElementById('q-app')){v.insertAdjacentHTML('beforeend',appPanel());bindApp();if(m.role==='admin'){v.insertAdjacentHTML('beforeend',healthPanel());bindHealth();loadHealth()}}}footer()};

/* ---------- start ---------- */
(function wait(n){if(me()){footer();renderNav();setTimeout(()=>{if(!dlg.open)whatsNew(false)},900);return}if(n<120)setTimeout(()=>wait(n+1),500)})(0);
if(window.I18N&&I18N.add)I18N.add({'الإصدار':'Version'});
const css=document.createElement('style');css.textContent=`
.q-verbtn{all:unset;cursor:pointer;color:var(--side-muted);font-size:11.5px}.q-verbtn:hover{color:var(--side-ink);text-decoration:underline}
.q-err{max-width:640px;margin:40px auto;text-align:center}
.q-rel{margin-bottom:14px}.q-relh{display:flex;align-items:baseline;gap:10px;margin-bottom:6px}.q-relh small{color:var(--muted)}.q-rel ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.q-rel li{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start}.q-rel li p{margin:2px 0 4px;color:var(--muted);font-size:13px}.q-log{max-height:60vh;overflow:auto}
.q-kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}.q-kpis div{background:var(--surface2);border-radius:10px;padding:10px;display:flex;flex-direction:column;align-items:center}.q-kpis b{font-size:20px}.q-kpis span{font-size:12px;color:var(--muted)}`;document.head.appendChild(css);
})();
