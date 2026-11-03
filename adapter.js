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
const BRAND=`<div class="lg-brand"><div class="brand-mark" aria-hidden="true"><img src="icons/logo.webp" alt="شعار شركة البريقة لتسويق النفط"></div><div><h1>منظومة الإدارة العامة للمبيعات والشؤون التجارية</h1></div></div>`;
if(!cfg||!cfg.projectId||/YOUR_/.test(cfg.apiKey||'')){
  screen(`<div class="lg-card">${BRAND}<p style="margin:0">لم يُضبط الاتصال بقاعدة البيانات بعد.</p><p class="muted" style="margin:0;font-size:13px">افتح الملف <b dir="ltr">firebase-config.js</b> والصق فيه إعدادات مشروع Firebase كما في دليل التشغيل، ثم ارفع الملف من جديد.</p></div>`);
  window.appRuntime={use:async()=>null};return;
}
if(!window.firebase){screen(`<div class="lg-card">${BRAND}<p style="margin:0">تعذّر تحميل مكتبة Firebase. تأكد من اتصال الإنترنت ثم أعد تحميل الصفحة.</p></div>`);window.appRuntime={use:async()=>null};return}
FB=firebase.initializeApp(cfg);AUTH=firebase.auth();FS=firebase.firestore();
try{FS.enablePersistence({synchronizeTabs:true}).catch(()=>{})}catch(e){}
// writes resolve once saved on the device and sync when the connection returns (offline.js)
if(window.__sync)FS=window.__sync.wrap(FS);
const L={},DL={},CACHE={};
function snap(col){const m=CACHE[col]||new Map();const docs=[...m.entries()].map(([id,d])=>({id,exists:true,data:()=>d,metadata:{}}));return {docs,size:docs.length,empty:!docs.length,docChanges:()=>[],metadata:{}}}
function emitDoc(col,id){const d=(CACHE[col]||new Map()).get(id);(DL[col+'/'+id]||[]).forEach(f=>f({id,exists:!!d,data:()=>d,metadata:{}}))}
function emit(col){(L[col]||[]).forEach(f=>{try{f(snap(col))}catch(e){console.error(e)}});Object.keys(DL).forEach(p=>{if(p.split('/')[0]===col)emitDoc(col,p.split('/')[1])})}
const SUBS={};
function subscribe(col){if(SUBS[col])return;let q=FS.collection(col);
  if(col==='records'&&ME&&ME.role!=='admin'&&!['gm','board'].includes(ME.unit)){if(!ME.unit){SUBS[col]=()=>{};CACHE[col]=new Map();setTimeout(()=>emit(col),0);return}q=q.where('unit','==',ME.unit)}
  SUBS[col]=q.onSnapshot(qs=>{const m=new Map();qs.forEach(d=>m.set(d.id,d.data()));CACHE[col]=m;emit(col)},err=>{console.warn(col,err);if(err.code==='permission-denied'){(window.__denied||(window.__denied={}))[col]=1;if(col==='tickets'||col==='notices'){CACHE[col]=CACHE[col]||new Map();emit(col)}else setConn('لا تملك صلاحية قراءة البيانات')}})}
function setConn(txt,ok){const d=document.getElementById('conn-dot'),t=document.getElementById('conn-txt');if(!d)return;d.className='dot '+(ok?'on':'off');t.textContent=txt}
async function logAct(action,col,id,summary){try{await FS.collection('log').add({ts:new Date().toISOString(),user:ME.email,name:ME.name||'',action,col,id,summary:summary||''})}catch(e){}}
function summarize(col,d){if(!d)return'';if(col==='contracts')return (d.no||'')+' — '+(d.company||'');if(col==='needs')return d.company||'';if(col==='batches')return d.name||'';if(col==='extensions'||col==='letters')return 'عقد '+(d.contractNo||'');if(col==='config')return 'الإعدادات';if(col==='notices')return 'إشعار '+(d.no||'')+' — '+(d.customer||'');if(col==='tickets')return (d.no||'')+' — '+(d.customer||'')+' ('+(d.status||'')+')';return d.name||''}
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
window.appRuntime={use:async n=>{await ready;return {db,user,downloads}[n]||null}};
window.__me=()=>ME;window.__fs=()=>FS;window.__auth=()=>AUTH;window.__authErr=e=>authErr(e);
window.__seedIfEmpty=async function(file){if(!file)throw new Error('اختر ملف البيانات الأولية (JSON)');let s;try{s=JSON.parse(await file.text())}catch(e){throw new Error('ملف البيانات الأولية غير صالح')}if(!s||typeof s!=='object'||!Array.isArray(s.contracts))throw new Error('ملف البيانات الأولية غير صالح');let n=0;let batch=FS.batch(),k=0;
  for(const col of Object.keys(s)){for(const o of s[col]){const d=Object.assign({},o);const id=d.id;delete d.id;batch.set(FS.collection(col).doc(id),d);n++;k++;if(k>=400){await batch.commit();batch=FS.batch();k=0}}}
  if(k)await batch.commit();await logAct('استيراد','','','تحميل البيانات الأولية: '+n+' سجل');return n};
function authErr(e){const m={'auth/popup-blocked':'المتصفح منع النافذة المنبثقة، اسمح بها ثم أعد المحاولة','auth/unauthorized-domain':'هذا النطاق غير مصرّح له في Firebase (Authentication → Settings → Authorized domains)','auth/operation-not-allowed':'الدخول بحساب Google غير مفعّل بعد في Firebase (Authentication → Sign-in method)','auth/account-exists-with-different-credential':'هذا البريد مسجّل بطريقة دخول أخرى','auth/invalid-email':'البريد الإلكتروني غير صحيح','auth/user-not-found':'لا يوجد حساب بهذا البريد','auth/wrong-password':'كلمة المرور غير صحيحة','auth/invalid-credential':'البريد أو كلمة المرور غير صحيحة','auth/invalid-login-credentials':'البريد أو كلمة المرور غير صحيحة','auth/email-already-in-use':'هذا البريد مسجّل مسبقًا، سجّل الدخول','auth/weak-password':'كلمة المرور ضعيفة (6 أحرف على الأقل)','auth/too-many-requests':'محاولات كثيرة، انتظر قليلًا','auth/network-request-failed':'تعذّر الاتصال بالإنترنت','auth/unauthorized-domain':'هذا النطاق غير مُصرّح به في إعدادات Firebase (Authorized domains)','auth/operation-not-allowed':'تسجيل الدخول بالبريد غير مفعّل في Firebase'};return m[e.code]||(e.message||'حدث خطأ')}
const G_LOGO='<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z"/><path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.1C6.5 42.6 14.6 48 24 48z"/></svg>';
/* الدخول بحساب Google: Google مزوّد موثوق، فبريد Gmail يُعدّ مؤكدًا تلقائيًا ولا يحتاج رسالة تحقق. لو كان للبريد حساب بكلمة مرور فإن Firebase يربط الحسابين ويُبقي الصلاحية نفسها (الصلاحيات مفهرسة بالبريد). */
function googleProvider(){const p=new firebase.auth.GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});return p}
async function googleSignIn(m){if(m){m.style.color='';m.textContent=''}
  try{await AUTH.signInWithPopup(googleProvider())}
  catch(err){if(err&&(err.code==='auth/popup-blocked'||err.code==='auth/operation-not-supported-in-this-environment')){try{await AUTH.signInWithRedirect(googleProvider());return}catch(e2){err=e2}}
    if(err&&err.code==='auth/popup-closed-by-user')return;if(m)m.textContent=authErr(err)}}
function showLogin(mode){
  const reg=mode==='register';
  const o=screen(`<form class="lg-card" novalidate>${BRAND}
    ${reg?`<div class="field"><label for="lg-n">الاسم الكامل</label><input id="lg-n" autocomplete="name"></div>`:''}
    <div class="field"><label for="lg-u">البريد الإلكتروني</label><input id="lg-u" type="email" autocomplete="username" dir="ltr"></div>
    <div class="field"><label for="lg-p">كلمة المرور</label><input id="lg-p" type="password" autocomplete="${reg?'new-password':'current-password'}" dir="ltr"></div>
    <div class="lg-msg" role="alert"></div>
    <button class="btn primary" type="submit" style="justify-content:center;height:40px">${reg?'إنشاء الحساب':'دخول'}</button>
    <div class="lg-or"><span>أو</span></div>
    <button class="btn lg-google" type="button" id="lg-g">${G_LOGO} الدخول بحساب Google</button>
    <p class="lg-foot">${reg?'لديك حساب؟ <a href="#" id="lg-sw">سجّل الدخول</a>':'ليس لديك حساب؟ <a href="#" id="lg-sw">أنشئ حسابًا</a> · <a href="#" id="lg-reset">نسيت كلمة المرور</a>'}</p></form>`);
  o.querySelector('#lg-g').onclick=()=>googleSignIn(o.querySelector('.lg-msg'));
  o.querySelector('#lg-sw').onclick=e=>{e.preventDefault();showLogin(reg?'login':'register')};
  const rs=o.querySelector('#lg-reset');if(rs)rs.onclick=async e=>{e.preventDefault();const em=o.querySelector('#lg-u').value.trim().toLowerCase();const m=o.querySelector('.lg-msg');if(!em){m.textContent='اكتب بريدك الإلكتروني أولًا ثم اضغط «نسيت كلمة المرور»';return}try{await AUTH.sendPasswordResetEmail(em);m.style.color='var(--ok)';m.textContent='أُرسلت رسالة إعادة التعيين إلى بريدك'}catch(err){m.textContent=authErr(err)}};
  o.querySelector('form').addEventListener('submit',async e=>{e.preventDefault();const m=o.querySelector('.lg-msg');m.style.color='';m.textContent='';const b=e.target.querySelector('button');b.disabled=true;
    try{const em=o.querySelector('#lg-u').value.trim().toLowerCase(),pw=o.querySelector('#lg-p').value;if(!em||!pw){m.textContent='أدخل البريد وكلمة المرور';return}
      if(reg){const nm=o.querySelector('#lg-n').value.trim();if(!nm){m.textContent='أدخل اسمك';return}if(pw.length<8){m.textContent='كلمة المرور يجب ألا تقل عن 8 أحرف';return}const cr=await AUTH.createUserWithEmailAndPassword(em,pw);await cr.user.updateProfile({displayName:nm});try{await cr.user.sendEmailVerification()}catch(e2){}}
      else await AUTH.signInWithEmailAndPassword(em,pw)}
    catch(err){m.textContent=authErr(err)}finally{b.disabled=false}});
  try{if(sessionStorage.getItem('cm_idle')){sessionStorage.removeItem('cm_idle');const m=o.querySelector('.lg-msg');m.textContent='انتهت الجلسة بسبب عدم النشاط، سجّل الدخول من جديد.'}}catch(e){}
  setTimeout(()=>o.querySelector(reg?'#lg-n':'#lg-u').focus(),50);
}
function noRole(u){screen(`<div class="lg-card">${BRAND}<p style="margin:0">مرحبًا ${hx(u.displayName||u.email||'')}. حسابك <b dir="ltr">${hx(u.email)}</b> مسجّل، لكن لم تُمنح له صلاحية بعد.</p><p class="muted" style="margin:0;font-size:13px">اطلب من مدير النظام منح الصلاحية لبريدك من صفحة «الإعدادات ← المستخدمون». إذا كنت أول مستخدم (المدير)، أضف نفسك في مجموعة <b dir="ltr">roles</b> كما في دليل التشغيل. إن كانت لديك صلاحية من قبل، سجّل الخروج وادخل من جديد.</p><button class="btn" id="lg-retry">تحقق مرة أخرى</button><button class="btn ghost" id="lg-out">تسجيل الخروج</button></div>`);
  document.getElementById('lg-retry').onclick=()=>location.reload();document.getElementById('lg-out').onclick=()=>AUTH.signOut().then(()=>location.reload())}
function roleReadFailed(u,err){const code=hx((err&&err.code)||'unknown');const why=code==='permission-denied'?'رفضت قاعدة البيانات قراءة صلاحيتك لأن جلستك قديمة (من قبل تأكيد البريد). سجّل الخروج وادخل من جديد.':code==='unavailable'?'تعذّر الوصول إلى قاعدة البيانات. تحقق من اتصالك بالإنترنت ثم أعد المحاولة.':'حدث خطأ أثناء قراءة صلاحيتك. أعد المحاولة، وإن تكرر أبلغ مدير النظام بالرمز أدناه.';
  screen(`<div class="lg-card" id="lg-rolefail">${BRAND}<p style="margin:0">مرحبًا ${hx(u.displayName||u.email||'')}. لم نتمكن من قراءة صلاحية حسابك <b dir="ltr">${hx(u.email)}</b>.</p><p class="muted" style="margin:0;font-size:13px">${why}</p><p class="muted" style="margin:0;font-size:12px" dir="ltr">${code}</p><button class="btn" id="lg-retry">إعادة المحاولة</button><button class="btn ghost" id="lg-out">تسجيل الخروج</button></div>`);
  document.getElementById('lg-retry').onclick=()=>location.reload();document.getElementById('lg-out').onclick=()=>AUTH.signOut().then(()=>location.reload())}
const hx=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function needVerify(u,sent){const o=screen(`<div class="lg-card">${BRAND}<p style="margin:0">${sent?'أرسلنا رسالة تحقق':'يلزم تأكيد البريد'} إلى <b dir="ltr">${hx(u.email)}</b>. افتح الرابط الذي في الرسالة ثم اضغط «تحققت من بريدي».</p><p class="muted" style="margin:0;font-size:13px">حمايةً للمنظومة لا يُفتح الحساب إلا ببريد مؤكد. إن لم تصلك الرسالة راجع مجلد الرسائل غير المرغوبة أو أعد إرسالها.</p><div class="lg-msg" role="alert"></div><button class="btn lg-google" type="button" id="lg-vg">${G_LOGO} تأكيد البريد بحساب Google</button><button class="btn primary" id="lg-vok" style="justify-content:center;height:40px">تحققت من بريدي</button><button class="btn" id="lg-vre">إعادة إرسال رسالة التحقق</button><button class="btn ghost" id="lg-out">تسجيل الخروج</button></div>`);
  const m=o.querySelector('.lg-msg');
  o.querySelector('#lg-vok').onclick=async()=>{m.style.color='';m.textContent='';try{await u.reload();if(!AUTH.currentUser.emailVerified){m.textContent='لم يُؤكَّد البريد بعد. افتح الرابط الذي في الرسالة أولًا.';return}await AUTH.currentUser.getIdToken(true);location.reload()}catch(e){m.textContent=authErr(e)}};
  o.querySelector('#lg-vg').onclick=async()=>{await googleSignIn(m);const cu=AUTH.currentUser;if(cu){try{await cu.reload();if(cu.emailVerified){await cu.getIdToken(true);location.reload();return}}catch(e){}}};
  o.querySelector('#lg-vre').onclick=async()=>{m.style.color='';try{await u.sendEmailVerification();m.style.color='var(--ok)';m.textContent='أُرسلت الرسالة من جديد'}catch(e){m.textContent=authErr(e)}};
  o.querySelector('#lg-out').onclick=()=>AUTH.signOut().then(()=>location.reload());}
/* الجلسة الخاملة: خروج تلقائي بعد 30 دقيقة دون نشاط */
const IDLE_MS=30*60*1000;let idleT=null;function idleReset(){if(!ME)return;clearTimeout(idleT);idleT=setTimeout(idleOut,IDLE_MS)}
/* offline, signing out would lock the user out until the internet returns and strand unsynced work: wait for the connection and the sync first */
function idleOut(){const sy=window.__sync;if(sy&&(!navigator.onLine||sy.count()>0)){sy.idle().then(()=>{if(ME)idleOut()});return}try{sessionStorage.setItem('cm_idle','1')}catch(e){}AUTH.signOut().then(()=>location.reload())}
window.__safeSignOut=function(){const sy=window.__sync,n=sy?sy.count():0;
  if(n>0&&!confirm('لديك تعديلات محفوظة على هذا الجهاز لم تُرفع بعد إلى قاعدة البيانات. ستُرفع عند دخولك من جديد بالحساب نفسه وعلى الجهاز نفسه.\n\nهل تريد الخروج الآن؟'))return;
  if(!navigator.onLine&&!confirm('أنت غير متصل بالإنترنت. بعد الخروج لن تتمكن من الدخول مرة أخرى حتى يعود الاتصال.\n\nهل تريد الخروج الآن؟'))return;
  AUTH.signOut().then(()=>location.reload())};
['click','keydown','mousemove','touchstart','scroll','visibilitychange'].forEach(ev=>document.addEventListener(ev,idleReset,{passive:true}));
/* إعادة التحقق قبل الإجراءات الحساسة (منح الصلاحيات وإزالتها): كلمة المرور مرة أخرى إن مضى على الدخول أكثر من 5 دقائق */
let lastAuthAt=0;
window.__reauth=function(reason,force){const u=AUTH.currentUser;if(!u)return Promise.resolve(false);if(!force&&Date.now()-lastAuthAt<5*60*1000)return Promise.resolve(true);
  const hasPw=(u.providerData||[]).some(p=>p&&p.providerId==='password');
  if(!hasPw&&(u.providerData||[]).some(p=>p&&p.providerId==='google.com'))return u.reauthenticateWithPopup(googleProvider()).then(()=>{lastAuthAt=Date.now();return true}).catch(err=>{if(err&&err.code!=='auth/popup-closed-by-user')toast(authErr(err));return false});
  return new Promise(res=>{let d=document.getElementById('reauth');if(!d){d=document.createElement('dialog');d.id='reauth';document.body.appendChild(d)}
    d.innerHTML=`<form method="dialog" class="lg-card" style="width:min(380px,92vw);margin:0" novalidate><h3 style="margin:0">تأكيد الهوية</h3><p class="muted" style="margin:0;font-size:13px">${hx(reason||'هذا إجراء حساس، أدخل كلمة المرور للمتابعة.')}</p><div class="field"><label for="ra-p">كلمة المرور</label><input id="ra-p" type="password" autocomplete="current-password" dir="ltr"></div><div class="lg-msg" role="alert"></div><div style="display:flex;gap:8px"><button class="btn primary" type="submit" value="ok">متابعة</button><button class="btn ghost" type="button" id="ra-x">إلغاء</button></div></form>`;
    const f=d.querySelector('form'),m=d.querySelector('.lg-msg');let done=false;const fin=v=>{if(done)return;done=true;try{d.close()}catch(e){}res(v)};
    d.querySelector('#ra-x').onclick=()=>fin(false);d.addEventListener('close',()=>fin(false),{once:true});
    f.addEventListener('submit',async e=>{e.preventDefault();const pw=d.querySelector('#ra-p').value;if(!pw){m.textContent='أدخل كلمة المرور';return}try{await u.reauthenticateWithCredential(firebase.auth.EmailAuthProvider.credential(u.email,pw));lastAuthAt=Date.now();fin(true)}catch(err){m.textContent=authErr(err)}});
    d.showModal();setTimeout(()=>d.querySelector('#ra-p').focus(),30)})};
function userChip(){const box=document.querySelector('.top-actions');if(!box||!ME)return;let c=document.getElementById('who');if(!c){c=document.createElement('div');c.id='who';c.className='who';box.appendChild(c)}
  c.innerHTML='<span class="who-name"></span><span class="who-role"></span><button class="btn sm ghost" id="logout-btn">خروج</button>';c.querySelector('.who-name').textContent=ME.name||ME.email;c.querySelector('.who-role').textContent=ROLE_AR[ME.role];c.querySelector('#logout-btn').onclick=()=>window.__safeSignOut()}
AUTH.onAuthStateChanged(async u=>{
  if(!u){showLogin('login');return}
  if(!u.emailVerified){let sent=false;try{const t=Number(sessionStorage.getItem('cm_vsent')||0);if(Date.now()-t>60000){await u.sendEmailVerification();sessionStorage.setItem('cm_vsent',String(Date.now()));sent=true}}catch(e){}needVerify(u,sent);return}
  const email=(u.email||'').toLowerCase();
  // A session opened before the e-mail was confirmed still carries an ID token with email_verified=false for up to an hour,
  // so the rules refuse the role read. Refresh the token once and retry before concluding anything.
  let r=null,rerr=null;
  for(let i=0;i<2&&!r;i++){try{if(i&&!navigator.onLine)break;if(i)await u.getIdToken(true);r=await FS.collection('roles').doc(email).get()}catch(e){rerr=e;const c=e&&e.code||'';if(i===0&&c!=='permission-denied'&&c!=='unavailable'){break}}}
  const RK='cm_role_'+email;
  if(r&&r.exists){try{localStorage.setItem(RK,JSON.stringify(r.data()))}catch(e){}}
  // offline: open with the role this device last saw (the server rules still check every change when it syncs)
  if(!r&&!navigator.onLine){try{const c=JSON.parse(localStorage.getItem(RK)||'null');if(c&&c.role)r={exists:true,data:()=>c}}catch(e){}}
  if(!r){roleReadFailed(u,rerr);return}
  if(!r.exists||!ROLE_AR[r.data().role]){noRole(u);return}
  ME={email,name:r.data().name||u.displayName||email,role:r.data().role,unit:r.data().unit||''};
  try{lastAuthAt=Math.max(lastAuthAt,Date.parse(u.metadata&&u.metadata.lastSignInTime||0)||0)}catch(e){}
  hide();userChip();idleReset();setConn('متصل · الحفظ تلقائي ومشترك',true);readyResolve();
});
})();
