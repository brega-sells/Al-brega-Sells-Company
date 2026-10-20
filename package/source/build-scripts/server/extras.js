/* ===== Server-only features: Excel via server, users, password, activity log, backup ===== */
"use strict";
async function readWorkbook(f){
  const r=await fetch('/api/xlsx/parse',{method:'POST',body:f,credentials:'same-origin',headers:{'Content-Type':'application/octet-stream'}});
  let j={};try{j=await r.json()}catch(e){}
  if(!r.ok)throw new Error(j.error||'تعذّرت قراءة الملف');
  return {SheetNames:j.sheetNames,rows:n=>j.sheets[n]||[]};
}
saveXlsx=async function(sheets,filename){
  try{toast('جارٍ تجهيز ملف Excel…');
    const r=await fetch('/api/xlsx',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({filename,sheets})});
    if(!r.ok)throw new Error();const blob=await r.blob();await S.downloads.save({filename,data:blob});toast('تم تنزيل الملف')}
  catch(e){toast('تعذّر تجهيز الملف')}
};
dbBanner=function(){
  if(S.dbState==='wait')return `<div class="banner info">جارٍ تحميل البيانات من الخادم…</div>`;
  if(!S.canWrite)return `<div class="banner info">حسابك بصلاحية «مشاهد»: يمكنك البحث والاطلاع والتصدير. لطلب صلاحية التعديل تواصل مع مدير النظام.</div>`;
  return '';
};
const __vs=viewSettings;
viewSettings=function(){
  const me=window.__me()||{};const admin=me.role==='admin';
  return __vs()+`
  <div class="grid2">
   <div class="panel"><h3 class="section-title">حسابي <small>${esc(me.name||'')} · ${esc(window.__roleAr[me.role]||'')}</small></h3>
    <div style="display:grid;gap:10px;max-width:420px">
     <div class="field"><label for="pw-old">كلمة المرور الحالية</label><input id="pw-old" type="password" dir="ltr" autocomplete="current-password"></div>
     <div class="field"><label for="pw-new">كلمة المرور الجديدة (8 أحرف على الأقل)</label><input id="pw-new" type="password" dir="ltr" autocomplete="new-password"></div>
     <div><button class="btn primary" data-act="change-pw">تغيير كلمة المرور</button> <span id="pw-msg" class="muted" style="font-size:12.5px"></span></div>
    </div>
   </div>
   ${admin?`<div class="panel"><h3 class="section-title">النسخ الاحتياطي</h3>
    <p class="muted" style="margin:0 0 8px">يحفظ الخادم نسخة احتياطية تلقائية كل يوم في مجلد <b dir="ltr">data/backups</b> (آخر 30 يومًا). ويمكنك تنزيل نسخة فورية من قاعدة البيانات كاملة.</p>
    <a class="btn" href="/api/backup">${I.down}تنزيل نسخة احتياطية الآن</a></div>`:''}
  </div>
  ${admin?`<div class="panel"><h3 class="section-title">المستخدمون والصلاحيات</h3>
    <p class="muted" style="margin:0 0 10px;font-size:13px"><b>مدير النظام</b>: كل الصلاحيات وإدارة المستخدمين · <b>محرر</b>: إضافة وتعديل وحذف السجلات · <b>مشاهد</b>: اطلاع وبحث وتصدير فقط.</p>
    <div id="users-box" class="muted">جارٍ التحميل…</div>
    <fieldset style="margin-top:14px"><legend>إضافة مستخدم أو تعديله</legend>
     <div class="field"><label for="u-name">الاسم الكامل</label><input id="u-name"></div>
     <div class="field"><label for="u-user">اسم المستخدم (إنجليزي)</label><input id="u-user" dir="ltr" placeholder="ahmed.ali"></div>
     <div class="field"><label for="u-role">الصلاحية</label><select id="u-role"><option value="editor">محرر</option><option value="viewer">مشاهد</option><option value="admin">مدير النظام</option></select></div>
     <div class="field"><label for="u-pass">كلمة المرور</label><input id="u-pass" dir="ltr" placeholder="اتركها فارغة عند تعديل مستخدم دون تغييرها"></div>
     <div style="grid-column:1/-1;display:flex;gap:8px;align-items:center"><button class="btn primary" data-act="save-user">حفظ المستخدم</button><button class="btn" data-act="gen-pass">توليد كلمة مرور</button><span id="u-msg" style="font-size:12.5px"></span></div>
    </fieldset></div>
   <div class="panel"><h3 class="section-title">سجل النشاط <small>آخر 200 عملية: من أضاف أو عدّل أو حذف، ومتى</small></h3><div id="log-box" class="muted">جارٍ التحميل…</div></div>`:''}`;
};
const __as=afterRender.settings;
afterRender.settings=()=>{__as();const me=window.__me()||{};if(me.role==='admin'){loadUsers();loadLog()}};
async function loadUsers(){const box=document.getElementById('users-box');if(!box)return;
  try{const us=await window.__api('GET','/api/users');const me=window.__me();
    box.innerHTML=`<div class="tablewrap" style="max-height:none;min-height:0"><table><thead><tr><th class="nosort">الاسم</th><th class="nosort">اسم المستخدم</th><th class="nosort">الصلاحية</th><th class="nosort">آخر دخول</th><th class="nosort"></th></tr></thead><tbody>${us.map(u=>`<tr style="cursor:default"><td class="t-strong">${esc(u.name)}</td><td dir="ltr" style="text-align:right">${esc(u.username)}</td><td><span class="pill ${u.role==='admin'?'p-fl':u.role==='editor'?'p-ok':'p-neutral'}">${esc(window.__roleAr[u.role])}</span></td><td class="n">${u.last_login?esc(u.last_login.replace('T',' ')):'—'}</td><td><button class="btn sm ghost" data-act="edit-user" data-u="${esc(u.username)}" data-n="${esc(u.name)}" data-r="${esc(u.role)}">${I.edit}تعديل</button>${u.username!==me.username?`<button class="btn sm danger" data-act="del-user" data-u="${esc(u.username)}">حذف</button>`:''}</td></tr>`).join('')}</tbody></table></div>`}
  catch(e){box.textContent=e.message||'تعذّر التحميل'}}
async function loadLog(){const box=document.getElementById('log-box');if(!box)return;
  try{const rows=await window.__api('GET','/api/log?limit=200');const colAr={contracts:'عقد',needs:'منشأة',batches:'دفعة',extensions:'تمديد',letters:'مراسلة',config:'إعدادات',users:'مستخدم',files:'ملف'};
    box.innerHTML=rows.length?`<div class="tablewrap" style="max-height:420px;min-height:0"><table><thead><tr><th class="nosort">الوقت</th><th class="nosort">المستخدم</th><th class="nosort">العملية</th><th class="nosort">النوع</th><th class="nosort">السجل</th></tr></thead><tbody>${rows.map(r=>`<tr style="cursor:default"><td class="n">${esc((r.ts||'').replace('T',' '))}</td><td dir="ltr" style="text-align:right">${esc(r.username)}</td><td>${esc(r.action)}</td><td>${esc(colAr[r.col]||r.col||'')}</td><td>${esc(r.summary||'')}</td></tr>`).join('')}</tbody></table></div>`:'لا توجد عمليات بعد.'}
  catch(e){box.textContent=e.message||'تعذّر التحميل'}}
document.addEventListener('click',async e=>{const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act;
  if(act==='change-pw'){const m=document.getElementById('pw-msg');try{await window.__api('POST','/api/password',{old:val('pw-old'),new:document.getElementById('pw-new').value});m.style.color='var(--ok)';m.textContent='تم تغيير كلمة المرور';document.getElementById('pw-old').value='';document.getElementById('pw-new').value=''}catch(err){m.style.color='var(--crit)';m.textContent=err.message}}
  if(act==='gen-pass'){const c='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';let p='';const r=crypto.getRandomValues(new Uint32Array(10));r.forEach(x=>p+=c[x%c.length]);document.getElementById('u-pass').value=p}
  if(act==='edit-user'){document.getElementById('u-user').value=a.dataset.u;document.getElementById('u-name').value=a.dataset.n;document.getElementById('u-role').value=a.dataset.r;document.getElementById('u-pass').value='';document.getElementById('u-name').focus()}
  if(act==='save-user'){const m=document.getElementById('u-msg');try{await window.__api('POST','/api/users',{username:val('u-user'),name:val('u-name'),role:document.getElementById('u-role').value,password:document.getElementById('u-pass').value});m.style.color='var(--ok)';const pw=document.getElementById('u-pass').value;m.textContent='تم الحفظ'+(pw?' — أبلغ المستخدم بكلمة المرور: '+pw:'');['u-user','u-name','u-pass'].forEach(i=>document.getElementById(i).value='');loadUsers();loadLog()}catch(err){m.style.color='var(--crit)';m.textContent=err.message}}
  if(act==='del-user'){if(!a.classList.contains('armed')){a.classList.add('armed');a.textContent='تأكيد الحذف';setTimeout(()=>{a.classList.remove('armed');a.textContent='حذف'},4000);return}
    try{await window.__api('DELETE','/api/users/'+encodeURIComponent(a.dataset.u));loadUsers();loadLog()}catch(err){toast(err.message)}}
});
