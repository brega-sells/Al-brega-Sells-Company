/* ===== Cloud extras: banners, initial data load, roles (users), activity log ===== */
"use strict";
try{Object.assign(ARTICLES,JSON.parse(document.getElementById('articles-data').textContent))}catch(e){}
loadArticles=async function(){};
dbBanner=function(){
  const me=window.__me();
  if(S.dbState==='wait')return `<div class="banner info">جارٍ تحميل البيانات…</div>`;
  if(me&&me.role==='admin'&&S.loadedOnce&&!S.contracts.length&&!S.needs.length&&document.getElementById('seed-data'))return `<div class="banner info">قاعدة البيانات فارغة. <button class="btn primary sm" data-act="seed-now" style="margin-inline-start:8px">تحميل البيانات الأولية (39 عقدًا و393 منشأة)</button></div>`;
  if(!S.canWrite)return `<div class="banner info">حسابك بصلاحية «مشاهد»: يمكنك البحث والاطلاع والتصدير. لطلب صلاحية التعديل تواصل مع مدير النظام.</div>`;
  return '';
};
const __setConn=setConn;setConn=function(s){if(s==='ready')S.loadedOnce=true;__setConn(s)};
const __vs=viewSettings;
viewSettings=function(){const me=window.__me()||{};const admin=me.role==='admin';
  return __vs()+`<div class="grid2"><div class="panel"><h3 class="section-title">حسابي <small dir="ltr">${esc(me.email||'')}</small> <small>· ${esc(window.__roleAr[me.role]||'')}</small></h3>
   <p class="muted" style="margin:0 0 8px;font-size:13px">لتغيير كلمة المرور تُرسل رسالة إلى بريدك فيها رابط التغيير.</p><button class="btn" data-act="pw-reset">إرسال رابط تغيير كلمة المرور</button> <span id="pw-msg" style="font-size:12.5px"></span></div>
  ${admin?`<div class="panel"><h3 class="section-title">النسخ الاحتياطي</h3><p class="muted" style="margin:0 0 8px;font-size:13px">البيانات محفوظة في Firebase وتُنسخ تلقائيًا لديهم. وللاحتفاظ بنسخة لديك، صدّر «نسخة كاملة» من قسم التصدير أعلاه بشكل دوري.</p></div>`:''}</div>
  ${admin?`<div class="panel"><h3 class="section-title">المستخدمون والصلاحيات</h3>
   <p class="muted" style="margin:0 0 10px;font-size:13px">يُنشئ كل زميل حسابه بنفسه من شاشة الدخول (إنشاء حساب)، ثم تمنحه الصلاحية هنا ببريده الإلكتروني. <b>مدير النظام</b>: كل الصلاحيات · <b>محرر</b>: إضافة وتعديل وحذف · <b>مشاهد</b>: اطلاع وبحث وتصدير فقط.</p>
   <div id="users-box" class="muted">جارٍ التحميل…</div>
   <fieldset style="margin-top:14px"><legend>منح صلاحية أو تعديلها</legend>
    <div class="field"><label for="u-email">البريد الإلكتروني</label><input id="u-email" type="email" dir="ltr"></div>
    <div class="field"><label for="u-name">الاسم</label><input id="u-name"></div>
    <div class="field"><label for="u-role">الصلاحية</label><select id="u-role"><option value="editor">محرر</option><option value="viewer">مشاهد</option><option value="admin">مدير النظام</option></select></div>
    <div style="grid-column:1/-1;display:flex;gap:8px;align-items:center"><button class="btn primary" data-act="save-role">حفظ</button><span id="u-msg" style="font-size:12.5px"></span></div></fieldset></div>
  <div class="panel"><h3 class="section-title">سجل النشاط <small>آخر 200 عملية</small></h3><div id="log-box" class="muted">جارٍ التحميل…</div></div>`:''}`};
const __as=afterRender.settings;
afterRender.settings=()=>{__as();const me=window.__me()||{};if(me.role==='admin'){loadRoles();loadLog()}};
async function loadRoles(){const box=document.getElementById('users-box');if(!box)return;try{const qs=await window.__fs().collection('roles').get();const me=window.__me();const rows=[];qs.forEach(d=>rows.push(Object.assign({email:d.id},d.data())));
  box.innerHTML=`<div class="tablewrap" style="max-height:none;min-height:0"><table><thead><tr><th class="nosort">الاسم</th><th class="nosort">البريد</th><th class="nosort">الصلاحية</th><th class="nosort"></th></tr></thead><tbody>${rows.map(u=>`<tr style="cursor:default"><td class="t-strong">${esc(u.name||'')}</td><td dir="ltr" style="text-align:right">${esc(u.email)}</td><td><span class="pill ${u.role==='admin'?'p-fl':u.role==='editor'?'p-ok':'p-neutral'}">${esc(window.__roleAr[u.role]||u.role)}</span></td><td><button class="btn sm ghost" data-act="edit-role" data-e="${esc(u.email)}" data-n="${esc(u.name||'')}" data-r="${esc(u.role)}">${I.edit}تعديل</button>${u.email!==me.email?`<button class="btn sm danger" data-act="del-role" data-e="${esc(u.email)}">إزالة</button>`:''}</td></tr>`).join('')}</tbody></table></div>`}catch(e){box.textContent='تعذّر التحميل: '+(e.message||'')}}
async function loadLog(){const box=document.getElementById('log-box');if(!box)return;try{const qs=await window.__fs().collection('log').orderBy('ts','desc').limit(200).get();const colAr={contracts:'عقد',needs:'منشأة',batches:'دفعة',extensions:'تمديد',letters:'مراسلة',config:'إعدادات',roles:'مستخدم'};const rows=[];qs.forEach(d=>rows.push(d.data()));
  box.innerHTML=rows.length?`<div class="tablewrap" style="max-height:420px;min-height:0"><table><thead><tr><th class="nosort">الوقت</th><th class="nosort">المستخدم</th><th class="nosort">العملية</th><th class="nosort">النوع</th><th class="nosort">السجل</th></tr></thead><tbody>${rows.map(r=>`<tr style="cursor:default"><td class="n">${esc((r.ts||'').slice(0,16).replace('T',' '))}</td><td>${esc(r.name||r.user||'')}</td><td>${esc(r.action)}</td><td>${esc(colAr[r.col]||r.col||'')}</td><td>${esc(r.summary||'')}</td></tr>`).join('')}</tbody></table></div>`:'لا توجد عمليات بعد.'}catch(e){box.textContent='تعذّر التحميل: '+(e.message||'')}}
document.addEventListener('click',async e=>{const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act;const FS=window.__fs();
  if(act==='seed-now'){a.disabled=true;a.textContent='جارٍ التحميل…';try{const n=await window.__seedIfEmpty();toast('تم تحميل '+n+' سجل')}catch(err){toast('تعذّر التحميل: '+(err.message||''));a.disabled=false}}
  if(act==='pw-reset'){const m=document.getElementById('pw-msg');try{await window.__auth().sendPasswordResetEmail(window.__me().email);m.style.color='var(--ok)';m.textContent='أُرسلت الرسالة إلى بريدك'}catch(err){m.style.color='var(--crit)';m.textContent=err.message}}
  if(act==='edit-role'){document.getElementById('u-email').value=a.dataset.e;document.getElementById('u-name').value=a.dataset.n;document.getElementById('u-role').value=a.dataset.r;document.getElementById('u-name').focus()}
  if(act==='save-role'){const m=document.getElementById('u-msg');const em=val('u-email').toLowerCase();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){m.style.color='var(--crit)';m.textContent='أدخل بريدًا إلكترونيًا صحيحًا';return}
    try{await FS.collection('roles').doc(em).set({name:val('u-name'),role:document.getElementById('u-role').value});await FS.collection('log').add({ts:new Date().toISOString(),user:window.__me().email,name:window.__me().name,action:'منح صلاحية',col:'roles',id:em,summary:val('u-name')+' ('+window.__roleAr[document.getElementById('u-role').value]+')'});m.style.color='var(--ok)';m.textContent='تم الحفظ. يستطيع المستخدم الدخول الآن ببريده.';['u-email','u-name'].forEach(i=>document.getElementById(i).value='');loadRoles();loadLog()}catch(err){m.style.color='var(--crit)';m.textContent=err.message}}
  if(act==='del-role'){if(!a.classList.contains('armed')){a.classList.add('armed');a.textContent='تأكيد الإزالة';setTimeout(()=>{a.classList.remove('armed');a.textContent='إزالة'},4000);return}try{await FS.collection('roles').doc(a.dataset.e).delete();loadRoles()}catch(err){toast(err.message)}}
});
