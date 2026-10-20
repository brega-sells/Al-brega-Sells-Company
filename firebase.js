/* ===== Firebase adapter: shared data in Firestore, sign-in with Firebase Authentication ===== */
(function(){
"use strict";
const ALL=['contracts','needs','batches','extensions','letters','companies','config'];
const ROLE_AR={admin:'مدير النظام',editor:'محرر',viewer:'مشاهد'};
window.__roleAr=ROLE_AR;
let ME=null,FB=null,FS=null,AUTH=null,readyResolve;const ready=new Promise(r=>readyResolve=r);
const cfg=window.FIREBASE_CONFIG;
function screen(html){let o=document.getElementById('login');if(!o){o=document.createElement('div');o.id='login';document.body.appendChild(o)}o.hidden=false;o.innerHTML=html;return o}
function hide(){const o=document.getElementById('login');if(o)o.hidden=true}
const BRAND=`<div class="lg-brand"><div class="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 2c2.6 3.6 5 6.6 5 10a5 5 0 0 1-10 0c0-2 .9-3.6 2.2-5.1.2 1.6 1 2.7 2.3 3.2C11 7.8 11.2 4.9 12 2Z" fill="#f08350"/><path d="M12 13.5c1 1.1 1.8 2 1.8 3.1a1.8 1.8 0 0 1-3.6 0c0-1.1.8-2 1.8-3.1Z" fill="#ffd9a8"/></svg></div><div><h1>منظومة الإدارة العامة للمبيعات والشؤون التجارية</h1><small>وزارة الصناعة والمعادن · شركة البريقة لتسويق النفط</small></div></div>`;
if(!cfg||!cfg.projectId||/YOUR_/.test(cfg.apiKey||'')){
  screen(`<div class="lg-card">${BRAND}<p style="margin:0">لم يُضبط الاتصال بقاعدة البيانات بعد.</p><p class="muted" style="margin:0;font-size:13px">افتح الملف <b dir="ltr">firebase-config.js</b> والصق فيه إعدادات مشروع Firebase كما في دليل التشغيل، ثم ارفع الملف من جديد.</p></div>`);
  window.claude={use:async()=>null};return;
}
if(!window.firebase){screen(`<div class="lg-card">${BRAND}<p style="margin:0">تعذّر تحميل مكتبة Firebase. تأكد من اتصال الإنترنت ثم أعد تحميل الصفحة.</p></div>`);window.claude={use:async()=>null};return}
FB=firebase.initializeApp(cfg);AUTH=firebase.auth();FS=firebase.firestore();
try{FS.enablePersistence({synchronizeTabs:true}).catch(()=>{})}catch(e){}
const L={},DL={},CACHE={};
function snap(col){const m=CACHE[col]||new Map();const docs=[...m.entries()].map(([id,d])=>({id,exists:true,data:()=>d,metadata:{}}));return {docs,size:docs.length,empty:!docs.length,docChanges:()=>[],metadata:{}}}
function emitDoc(col,id){const d=(CACHE[col]||new Map()).get(id);(DL[col+'/'+id]||[]).forEach(f=>f({id,exists:!!d,data:()=>d,metadata:{}}))}
function emit(col){(L[col]||[]).forEach(f=>{try{f(snap(col))}catch(e){console.error(e)}});Object.keys(DL).forEach(p=>{if(p.split('/')[0]===col)emitDoc(col,p.split('/')[1])})}
const SUBS={};
function subscribe(col){if(SUBS[col])return;SUBS[col]=FS.collection(col).onSnapshot(qs=>{const m=new Map();qs.forEach(d=>m.set(d.id,d.data()));CACHE[col]=m;emit(col)},err=>{console.warn(col,err);if(err.code==='permission-denied'){setConn('لا تملك صلاحية قراءة البيانات')}})}
function setConn(txt,ok){const d=document.getElementById('conn-dot'),t=document.getElementById('conn-txt');if(!d)return;d.className='dot '+(ok?'on':'off');t.textContent=txt}
async function logAct(action,col,id,summary){try{await FS.collection('log').add({ts:new Date().toISOString(),user:ME.email,name:ME.name||'',action,col,id,summary:summary||''})}catch(e){}}
function summarize(col,d){if(!d)return'';if(col==='contracts')return (d.no||'')+' — '+(d.company||'');if(col==='needs')return d.company||'';if(col==='batches')return d.name||'';if(col==='extensions'||col==='letters')return 'عقد '+(d.contractNo||'');if(col==='config')return 'الإعدادات';return d.name||''}
function werr(e){if(e&&e.code==='permission-denied')return {code:'invalid_argument',message:'لا تملك صلاحية الحفظ'};return {code:'unavailable',message:(e&&e.message)||'تعذّر الحفظ'}}
function ref(col,id){return {id,path:col+'/'+id,
  set:async d=>{const existed=(CACHE[col]||new Map()).has(id);try{await FS.collection(col).doc(id).set(JSON.parse(JSON.stringify(d)))}catch(e){throw werr(e)}logAct(existed?'تعديل':'إضافة',col,id,summarize(col,d))},
  update:async d=>{try{await FS.collection(col).doc(id).set(d,{merge:true})}catch(e){throw werr(e)}logAct('تعديل',col,id,summarize(col,d))},
  delete:async()=>{const old=(CACHE[col]||new Map()).get(id);try{await FS.collection(col).doc(id).delete()}catch(e){throw werr(e)}logAct('حذف',col,id,summarize(col,old))},
  get:async()=>{const d=(CACHE[col]||new Map()).get(id);return {id,exists:!!d,data:()=>d}},
  onSnapshot(n){subscribe(col);(DL[col+'/'+id]||(DL[col+'/'+id]=[])).push(n);if(CACHE[col])setTimeout(()=>emitDoc(col,id),0);return()=>{}}}}
const db={collection(col){return {path:col,doc:id=>ref(col,id||FS.collection(col).doc().id),onSnapshot(n){subscribe(col);(L[col]||(L[col]=[])).push(n);if(CACHE[col])setTimeout(()=>n(snap(col)),0);return()=>{}}}},doc(p){const [c,id]=p.split('/');return ref(c,id)}};
const user={can:async()=>!!ME&&ME.role!=='viewer',canEdit:async()=>!!ME&&ME.role==='admin',isOwner:async()=>!!ME&&ME.role==='admin',id:async()=>ME&&ME.email,me:async()=>ME};
const downloads={save:async({filename,data})=>{const blob=data instanceof Blob?data:new Blob([data]);const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},2000);return {status:'saved'}}};
window.claude={use:async n=>{await ready;return {db,user,downloads}[n]||null}};
window.__me=()=>ME;window.__fs=()=>FS;window.__auth=()=>AUTH;
window.__seedIfEmpty=async function(){const seedEl=document.getElementById('seed-data');if(!seedEl)return 0;const s=JSON.parse(seedEl.textContent);let n=0;let batch=FS.batch(),k=0;
  for(const col of Object.keys(s)){for(const o of s[col]){const d=Object.assign({},o);const id=d.id;delete d.id;batch.set(FS.collection(col).doc(id),d);n++;k++;if(k>=400){await batch.commit();batch=FS.batch();k=0}}}
  if(k)await batch.commit();await logAct('استيراد','','','تحميل البيانات الأولية: '+n+' سجل');return n};
function authErr(e){const m={'auth/invalid-email':'البريد الإلكتروني غير صحيح','auth/user-not-found':'لا يوجد حساب بهذا البريد','auth/wrong-password':'كلمة المرور غير صحيحة','auth/invalid-credential':'البريد أو كلمة المرور غير صحيحة','auth/invalid-login-credentials':'البريد أو كلمة المرور غير صحيحة','auth/email-already-in-use':'هذا البريد مسجّل مسبقًا، سجّل الدخول','auth/weak-password':'كلمة المرور ضعيفة (6 أحرف على الأقل)','auth/too-many-requests':'محاولات كثيرة، انتظر قليلًا','auth/network-request-failed':'تعذّر الاتصال بالإنترنت','auth/unauthorized-domain':'هذا النطاق غير مُصرّح به في إعدادات Firebase (Authorized domains)','auth/operation-not-allowed':'تسجيل الدخول بالبريد غير مفعّل في Firebase'};return m[e.code]||(e.message||'حدث خطأ')}
function showLogin(mode){
  const reg=mode==='register';
  const o=screen(`<form class="lg-card" novalidate>${BRAND}
    ${reg?`<div class="field"><label for="lg-n">الاسم الكامل</label><input id="lg-n" autocomplete="name"></div>`:''}
    <div class="field"><label for="lg-u">البريد الإلكتروني</label><input id="lg-u" type="email" autocomplete="username" dir="ltr"></div>
    <div class="field"><label for="lg-p">كلمة المرور</label><input id="lg-p" type="password" autocomplete="${reg?'new-password':'current-password'}" dir="ltr"></div>
    <div class="lg-msg" role="alert"></div>
    <button class="btn primary" type="submit" style="justify-content:center;height:40px">${reg?'إنشاء الحساب':'دخول'}</button>
    <p class="lg-foot">${reg?'لديك حساب؟ <a href="#" id="lg-sw">سجّل الدخول</a>':'ليس لديك حساب؟ <a href="#" id="lg-sw">أنشئ حسابًا</a> · <a href="#" id="lg-reset">نسيت كلمة المرور</a>'}</p></form>`);
  o.querySelector('#lg-sw').onclick=e=>{e.preventDefault();showLogin(reg?'login':'register')};
  const rs=o.querySelector('#lg-reset');if(rs)rs.onclick=async e=>{e.preventDefault();const em=o.querySelector('#lg-u').value.trim().toLowerCase();const m=o.querySelector('.lg-msg');if(!em){m.textContent='اكتب بريدك الإلكتروني أولًا ثم اضغط «نسيت كلمة المرور»';return}try{await AUTH.sendPasswordResetEmail(em);m.style.color='var(--ok)';m.textContent='أُرسلت رسالة إعادة التعيين إلى بريدك'}catch(err){m.textContent=authErr(err)}};
  o.querySelector('form').addEventListener('submit',async e=>{e.preventDefault();const m=o.querySelector('.lg-msg');m.style.color='';m.textContent='';const b=e.target.querySelector('button');b.disabled=true;
    try{const em=o.querySelector('#lg-u').value.trim().toLowerCase(),pw=o.querySelector('#lg-p').value;if(!em||!pw){m.textContent='أدخل البريد وكلمة المرور';return}
      if(reg){const nm=o.querySelector('#lg-n').value.trim();if(!nm){m.textContent='أدخل اسمك';return}const cr=await AUTH.createUserWithEmailAndPassword(em,pw);await cr.user.updateProfile({displayName:nm})}
      else await AUTH.signInWithEmailAndPassword(em,pw)}
    catch(err){m.textContent=authErr(err)}finally{b.disabled=false}});
  setTimeout(()=>o.querySelector(reg?'#lg-n':'#lg-u').focus(),50);
}
function noRole(u){screen(`<div class="lg-card">${BRAND}<p style="margin:0">مرحبًا ${u.displayName||u.email||''}. حسابك <b dir="ltr">${u.email}</b> مسجّل، لكن لم تُمنح له صلاحية بعد.</p><p class="muted" style="margin:0;font-size:13px">اطلب من مدير النظام منح الصلاحية لبريدك من صفحة «الإعدادات ← المستخدمون». إذا كنت أول مستخدم (المدير)، أضف نفسك في مجموعة <b dir="ltr">roles</b> كما في دليل التشغيل.</p><button class="btn" id="lg-retry">تحقق مرة أخرى</button><button class="btn ghost" id="lg-out">تسجيل الخروج</button></div>`);
  document.getElementById('lg-retry').onclick=()=>location.reload();document.getElementById('lg-out').onclick=()=>AUTH.signOut().then(()=>location.reload())}
function userChip(){const box=document.querySelector('.top-actions');if(!box||!ME)return;let c=document.getElementById('who');if(!c){c=document.createElement('div');c.id='who';c.className='who';box.appendChild(c)}
  c.innerHTML='<span class="who-name"></span><span class="who-role"></span><button class="btn sm ghost" id="logout-btn">خروج</button>';c.querySelector('.who-name').textContent=ME.name||ME.email;c.querySelector('.who-role').textContent=ROLE_AR[ME.role];c.querySelector('#logout-btn').onclick=()=>AUTH.signOut().then(()=>location.reload())}
AUTH.onAuthStateChanged(async u=>{
  if(!u){showLogin('login');return}
  const email=(u.email||'').toLowerCase();
  let r=null;try{r=await FS.collection('roles').doc(email).get()}catch(e){}
  if(!r||!r.exists||!ROLE_AR[r.data().role]){noRole(u);return}
  ME={email,name:r.data().name||u.displayName||email,role:r.data().role};
  hide();userChip();setConn('متصل · الحفظ تلقائي ومشترك',true);readyResolve();
});
})();
