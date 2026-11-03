/* ===== الحوكمة (governance: access review & register, access matrix, retention, legal hold, record history, approval stamp) =====
   Admin panels on the settings page plus small hooks used by other modules:
   - window.__stamp(a, upd, me): SHA-256 approval stamp written by duties.js when an assignment is approved; [data-dt-verify] recomputes it.
   - [data-rec-hist]: shows the change history that recSave() appends to a department record.
   - Legal hold on a record (set by the administrator in the record form) blocks deletion at the rules level until released. */
"use strict";
(function(){
const EN=()=>{if(window.I18N&&I18N.lang)return I18N.lang==='en';try{return localStorage.getItem('cm_lang')==='en'}catch(e){return false}};
const tr=(a,b)=>EN()&&b?b:a;
const me=()=>(window.__me&&window.__me())||null;
const FS=()=>window.__fs&&window.__fs();
const say=m=>{try{toast(m)}catch(e){}};
const isAdmin=()=>{const m=me();return !!m&&m.role==='admin'};
const uName=id=>{try{return (ORG_BY.get(id)||{}).title||id||''}catch(e){return id||''}};
const nowISO=()=>new Date().toISOString();
const csv=(rows,name)=>{if(!rows.length){say(tr('لا بيانات','No data'));return}const h=Object.keys(rows[0]);const q=s=>'"'+String(s==null?'':s).replace(/"/g,'""')+'"';const txt='﻿'+h.map(q).join(',')+'\n'+rows.map(r=>h.map(k=>q(r[k])).join(',')).join('\n');const b=new Blob([txt],{type:'text/csv;charset=utf-8'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},1500)};
async function sha256(s){const b=new TextEncoder().encode(s);const h=await crypto.subtle.digest('SHA-256',b);return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,'0')).join('')}

/* ---------- approval stamp ---------- */
const canon=(a,doneAt,by)=>JSON.stringify({id:a.id,title:a.title||'',fromUnit:a.fromUnit||'',toUnit:a.toUnit||'',duty:String(a.duty||''),createdBy:a.createdBy||'',doneAt:doneAt||'',by:by||''});
window.__stamp=async(a,upd,m)=>{const by=(m&&m.email)||'';const hash=await sha256(canon(a,upd.doneAt,by));return {alg:'SHA-256',hash,by,name:(m&&m.name)||'',at:upd.doneAt,ver:window.APP_VERSION||''}};
async function verifyStamp(id){const a=((window.__assignments&&window.__assignments())||[]).find(x=>x.id===id);if(!a||!a.stamp||!a.stamp.hash){say(tr('لا ختم على هذا التكليف','No stamp on this assignment'));return}
  const h=await sha256(canon(a,a.stamp.at,a.stamp.by));const ok=h===a.stamp.hash;
  modal(tr('التحقق من ختم الاعتماد','Approval stamp check'),`<div class="gv-verify ${ok?'ok':'bad'}"><b>${ok?'✓ '+esc(tr('الختم صحيح: بيانات التكليف لم تتغير منذ الاعتماد','Valid: the assignment has not changed since approval')):'✗ '+esc(tr('الختم لا يطابق: تغيّرت بيانات التكليف بعد الاعتماد','Mismatch: the assignment changed after approval'))}</b>
   <dl class="dl"><div><dt>${esc(tr('اعتمده','Approved by'))}</dt><dd>${esc(a.stamp.name||a.stamp.by||'')}</dd></div><div><dt>${esc(tr('في','At'))}</dt><dd class="num">${esc((a.stamp.at||'').slice(0,16).replace('T',' '))}</dd></div><div class="full"><dt>${esc(tr('البصمة','Digest'))}</dt><dd><code dir="ltr" style="word-break:break-all;font-size:11.5px">${esc(a.stamp.hash)}</code></dd></div></dl>
   <p class="muted" style="font-size:12.5px;margin:8px 0 0">${esc(tr('الختم بصمة SHA-256 لبيانات التكليف الأساسية وقت الاعتماد. أي تعديل لاحق على العنوان أو الجهتين أو المنشئ أو تاريخ الاعتماد يُبطل الختم.','The stamp is a SHA-256 digest of the core assignment data at approval time. Any later change to the title, departments, creator or approval date invalidates it.'))}</p></div>`,`<button class="btn primary" value="ok">${esc(tr('إغلاق','Close'))}</button>`)}
document.addEventListener('click',e=>{const v=e.target.closest('[data-dt-verify]');if(v){e.preventDefault();verifyStamp(v.dataset.dtVerify);return}
  const h=e.target.closest('[data-rec-hist]');if(h){e.preventDefault();e.stopPropagation();recHist(h.dataset.recHist)}});

/* ---------- record history ---------- */
const HK={title:['الموضوع','Subject'],type:['النوع','Type'],date:['التاريخ','Date'],ref:['رقم الإشارة','Reference'],status:['الحالة','Status'],notes:['الملاحظات','Notes'],duty:['المهمة','Duty'],attachments:['عدد المرفقات','Attachments'],hold:['الحجز القانوني','Legal hold']};
function recHist(id){const r=(S.records||[]).find(x=>x.id===id);if(!r)return;const h=(r.history||[]).slice().reverse();
  modal(tr('تاريخ التعديلات','Change history')+' — '+(r.title||''),`${r.hold?`<p class="gv-holdnote">🔒 ${esc(tr('حجز قانوني','Legal hold'))}: ${esc(r.hold.reason||'')} <small class="muted">· ${esc(r.hold.by||'')} · ${esc((r.hold.at||'').slice(0,10))}</small></p>`:''}
   ${h.length?`<ol class="gv-hist">${h.map(e=>`<li><div class="gv-hh"><b>${esc(e.name||e.by||'')}</b> <small class="num muted">${esc((e.ts||'').slice(0,16).replace('T',' '))}</small></div><ul>${(e.changes||[]).map(c=>`<li><b>${esc(tr(...(HK[c.k]||[c.k,c.k])))}</b>: <s dir="auto">${esc(c.from||'—')}</s> → <span dir="auto">${esc(c.to||'—')}</span></li>`).join('')}</ul></li>`).join('')}</ol>`:`<p class="muted">${esc(tr('لا تعديلات مسجلة بعد. يُسجَّل كل تعديل من الآن فصاعدًا.','No changes recorded yet; every edit from now on is recorded.'))}</p>`}
   <p class="muted" style="font-size:12px;margin:8px 0 0">${esc(tr('أُنشئ بواسطة','Created by'))} ${esc(r.by||r.createdBy||'')} · ${esc((r.createdAt||'').slice(0,10))}</p>`,`<button class="btn primary" value="ok">${esc(tr('إغلاق','Close'))}</button>`)}

/* ---------- access review ---------- */
const REVIEW_DAYS=90;const GV={roles:[],last:{},review:null,ret:null};
async function loadAccess(){const fs=FS();if(!fs)return;const qs=await fs.collection('roles').get();GV.roles=[];qs.forEach(d=>GV.roles.push(Object.assign({email:d.id},d.data())));
  GV.last={};try{const l=await fs.collection('log').orderBy('ts','desc').limit(500).get();l.forEach(d=>{const x=d.data();if(x.user&&!GV.last[x.user])GV.last[x.user]=x.ts})}catch(e){}
  try{const r=await fs.doc('config/access-review').get();GV.review=r.exists?r.data():null}catch(e){GV.review=null}}
const daysSince=iso=>iso?Math.floor((Date.now()-new Date(iso).getTime())/86400000):null;
function registerRows(){return GV.roles.slice().sort((a,b)=>(a.role>b.role?1:-1)||a.email.localeCompare(b.email)).map(u=>{const d=daysSince(GV.last[u.email]);return {'البريد':u.email,'الاسم':u.name||'','الصلاحية':(window.__roleAr||{})[u.role]||u.role,'الإدارة':u.unit?uName(u.unit):'','آخر نشاط':GV.last[u.email]?GV.last[u.email].slice(0,10):'','أيام منذ آخر نشاط':d==null?'':d,'ملاحظة':d==null?'لا نشاط مسجل':d>REVIEW_DAYS?'خامل: راجع الحاجة إلى الحساب':'' ,'آخر مراجعة صلاحيات':GV.review?GV.review.at.slice(0,10):''}})}
function accessPanel(){const rv=GV.review,dd=rv?daysSince(rv.at):null,over=dd==null||dd>REVIEW_DAYS;const rows=registerRows();const idle=rows.filter(r=>r['ملاحظة']).length;
  return `<div class="panel" id="gv-access"><h3 class="section-title">${esc(tr('مراجعة الصلاحيات الدورية','Periodic access review'))} <small>${esc(tr('كل 90 يومًا','every 90 days'))}</small></h3>
   <div class="gv-status ${over?'over':'ok'}">${over?'⚠ '+esc(rv?tr('مضى','It has been')+' '+dd+' '+tr('يومًا على آخر مراجعة','days since the last review'):tr('لم تُجرَ مراجعة صلاحيات بعد','No access review has been done yet')):'✓ '+esc(tr('آخر مراجعة','Last review')+' '+fd(rv.at.slice(0,10))+' · '+(rv.name||rv.by)+(rv.note?' · '+rv.note:''))}</div>
   <p class="muted" style="margin:8px 0;font-size:13px">${esc(tr('راجع القائمة مع رؤساء الإدارات: هل ما زال كل حساب لازمًا، وهل الصلاحية والإدارة صحيحتان؟ احذف ما لم يعد لازمًا من لوحة الصلاحيات أعلاه ثم اعتمد المراجعة.','Review the list with the heads of departments: is every account still needed and are the role and department right? Remove what is no longer needed in the roles panel, then confirm the review.'))}</p>
   <div class="tablewrap" style="max-height:340px;min-height:0"><table><thead><tr><th class="nosort">${esc(tr('الاسم','Name'))}</th><th class="nosort">${esc(tr('البريد','E-mail'))}</th><th class="nosort">${esc(tr('الصلاحية','Role'))}</th><th class="nosort">${esc(tr('الإدارة','Department'))}</th><th class="nosort">${esc(tr('آخر نشاط','Last activity'))}</th><th class="nosort"></th></tr></thead><tbody>${rows.map(r=>`<tr style="cursor:default"><td class="t-strong">${esc(r['الاسم'])}</td><td dir="ltr" style="text-align:right">${esc(r['البريد'])}</td><td>${esc(r['الصلاحية'])}</td><td>${esc(r['الإدارة'])}</td><td class="n">${esc(r['آخر نشاط']||'—')}</td><td>${r['ملاحظة']?`<span class="pill p-warn">${esc(tr('خامل','Idle'))}</span>`:''}</td></tr>`).join('')}</tbody></table></div>
   <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px"><input id="gv-note" placeholder="${esc(tr('ملاحظة المراجعة (اختياري)','Review note (optional)'))}" maxlength="200" style="flex:1;min-width:200px"><button type="button" class="btn primary" data-gv="confirm">${esc(tr('اعتماد المراجعة','Confirm review'))}</button><button type="button" class="btn" data-gv="register">${esc(tr('تصدير سجل الحسابات','Export account register'))}</button><button type="button" class="btn ghost" data-gv="matrix">${esc(tr('مصفوفة الصلاحيات','Access matrix'))}</button><span class="muted" style="font-size:12px">${rows.length} ${esc(tr('حساب','accounts'))}${idle?' · '+idle+' '+esc(tr('خامل','idle')):''}</span></div></div>`}
async function confirmReview(){const m=me(),fs=FS();if(!m||!fs)return;if(window.__reauth){const ok=await window.__reauth('access-review');if(!ok)return}
  const doc={at:nowISO(),by:m.email,name:m.name||'',note:(val('gv-note')||'').slice(0,200),accounts:GV.roles.length,idle:registerRows().filter(r=>r['ملاحظة']).length};
  try{await fs.doc('config/access-review').set(doc);await fs.collection('log').add({ts:doc.at,user:m.email,name:m.name||'',action:'اعتماد مراجعة الصلاحيات',col:'config',id:'access-review',summary:doc.accounts+' حساب'+(doc.note?' · '+doc.note:'')}).catch(()=>{});GV.review=doc;say(tr('اعتُمدت المراجعة','Review confirmed'));render()}catch(e){say(e.message||'')}}
const MATRIX=[['لوحة المؤشرات وتحليل البيانات','✓','✓','✓'],['العقود والاحتياجات والدفعات والمراسلات والجهات','قراءة','قراءة وكتابة','الكل'],['خدمة الزبائن وإشعارات البيع','قراءة','قراءة وكتابة','الكل'],['سجلات الإدارات','إدارتي فقط (قراءة)','إدارتي فقط (قراءة وكتابة)؛ الإدارة العامة والمجلس يقرؤون الكل','الكل'],['المرفقات','قراءة','رفع؛ حذف ما رفعته','الكل'],['مهام الإدارات (النص الرسمي)','قراءة','قراءة','تعديل'],['التكليفات','إدارتي (قراءة)','إدارتي: إصدار وتنفيذ ورفع للاعتماد؛ الاعتماد للجهة المُصدِرة','الكل'],['الاجتماعات','المدعو فقط','المدعو: محضر وقرارات وحضور؛ المنظّم: الكل','الكل'],['التقويم والإشعارات','ما يخصني','ما يخصني','ما يخصني'],['الإعدادات العامة','قراءة','قراءة','تعديل'],['الصلاحيات وسجل النشاط وصحة المنظومة','لا','لا','نعم (مع إعادة إدخال كلمة المرور)'],['الحجز القانوني على السجلات','لا','لا','نعم'],['حذف سجل محجوز قانونيًا','لا','لا','لا (يُرفع الحجز أولًا)']];
function matrix(){modal(tr('مصفوفة الصلاحيات','Access matrix'),`<p class="muted" style="margin:0 0 8px;font-size:12.5px">${esc(tr('مستخرجة من قواعد الأمان المنشورة؛ القواعد هي المرجع الملزم.','Derived from the published security rules; the rules are the binding reference.'))}</p><div class="tablewrap" style="max-height:60vh;min-height:0"><table class="gv-matrix"><thead><tr><th class="nosort">${esc(tr('الوحدة','Module'))}</th><th class="nosort">${esc(tr('قارئ','Viewer'))}</th><th class="nosort">${esc(tr('محرر','Editor'))}</th><th class="nosort">${esc(tr('مدير النظام','Admin'))}</th></tr></thead><tbody>${MATRIX.map(r=>`<tr style="cursor:default"><td class="t-strong">${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>`,`<button class="btn" type="button" data-gv="mcsv">${esc(tr('تصدير CSV','Export CSV'))}</button><button class="btn primary" value="ok">${esc(tr('إغلاق','Close'))}</button>`);
  dlg.querySelector('[data-gv="mcsv"]').onclick=()=>csv(MATRIX.map(r=>({'الوحدة':r[0],'قارئ':r[1],'محرر':r[2],'مدير النظام':r[3]})),'access-matrix.csv')}

/* ---------- retention ---------- */
const RET_DEF={tickets:5,records:10,contracts:10,meetings:10};
const RL={tickets:['طلبات الزبائن المغلقة','Closed customer requests'],records:['سجلات الإدارات المنجزة','Completed department records'],contracts:['العقود المنتهية','Expired contracts'],meetings:['الاجتماعات المغلقة','Closed meetings']};
async function loadRet(){const fs=FS();if(!fs)return;try{const d=await fs.doc('config/retention').get();GV.ret=Object.assign({},RET_DEF,d.exists?d.data():{})}catch(e){GV.ret=Object.assign({},RET_DEF)}}
function candidates(){const r=GV.ret||RET_DEF,lim=y=>new Date(Date.now()-y*365.25*86400000).toISOString().slice(0,10);const out=[];
  (S.tickets||[]).forEach(t=>{const d=(t.closedAt||'').slice(0,10);if(t.status==='مغلق'&&d&&d<lim(r.tickets))out.push({type:'tickets',id:t.id,t:(t.no?t.no+' — ':'')+(t.customer||''),d})});
  (S.records||[]).forEach(x=>{if(x.hold)return;if(x.status==='منجز'&&x.date&&x.date<lim(r.records))out.push({type:'records',id:x.id,t:x.title||'',d:x.date,u:uName(x.unit)})});
  if(typeof D!=='undefined'&&D.get)(S.contracts||[]).forEach(c=>{const dd=D.get(c.id);if(dd&&dd.effEnd&&dd.effEnd<lim(r.contracts))out.push({type:'contracts',id:c.id,t:(c.no||'')+' — '+(c.company||''),d:dd.effEnd})});
  ((window.__meetings&&window.__meetings())||[]).forEach(mt=>{if(mt.status==='closed'&&mt.date&&mt.date<lim(r.meetings))out.push({type:'meetings',id:mt.id,t:mt.title||'',d:mt.date})});
  return out}
function retPanel(){const r=GV.ret||RET_DEF;const c=candidates();const by={};c.forEach(x=>by[x.type]=(by[x.type]||0)+1);const held=(S.records||[]).filter(x=>x.hold).length;
  return `<div class="panel" id="gv-ret"><h3 class="section-title">${esc(tr('الاحتفاظ بالسجلات والحجز القانوني','Records retention & legal hold'))}</h3>
   <p class="muted" style="margin:0 0 8px;font-size:13px">${esc(tr('مدد الاحتفاظ بالسنوات بعد الإغلاق/الانتهاء. المنظومة لا تحذف شيئًا تلقائيًا: تعرض ما تجاوز مدته ليقرر مدير النظام بعد الرجوع إلى الجهة المختصة. السجلات المحجوزة قانونيًا مستثناة ولا يمكن حذفها حتى يُرفع الحجز من نموذج السجل.','Retention periods in years after closure/expiry. Nothing is deleted automatically: items past their period are listed for the administrator to decide. Records under legal hold are excluded and cannot be deleted until the hold is released from the record form.'))}</p>
   <div class="gv-ret">${Object.keys(RL).map(k=>`<label><span>${esc(tr(...RL[k]))}</span><input type="number" min="1" max="50" data-gv-ret="${k}" value="${Number(r[k])||RET_DEF[k]}"><small>${esc(tr('سنوات','years'))} · <b>${by[k]||0}</b> ${esc(tr('تجاوز المدة','past due'))}</small></label>`).join('')}</div>
   <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:10px"><button type="button" class="btn primary" data-gv="ret-save">${esc(tr('حفظ المدد','Save periods'))}</button><button type="button" class="btn" data-gv="ret-csv" ${c.length?'':'disabled'}>${esc(tr('تصدير ما تجاوز مدته','Export items past due'))} (${c.length})</button><span class="muted" style="font-size:12px">🔒 ${held} ${esc(tr('سجل تحت حجز قانوني','records under legal hold'))}</span></div></div>`}
async function retSave(){const fs=FS();if(!fs)return;const r={};document.querySelectorAll('[data-gv-ret]').forEach(i=>{r[i.dataset.gvRet]=Math.max(1,Math.min(50,Number(i.value)||RET_DEF[i.dataset.gvRet]))});try{await fs.doc('config/retention').set(r);GV.ret=Object.assign({},RET_DEF,r);say(tr('حُفظت مدد الاحتفاظ','Retention periods saved'));render()}catch(e){say(e.message||'')}}

/* ---------- settings wiring ---------- */
function bind(){const on=(k,f)=>{const b=document.querySelector(`[data-gv="${k}"]`);if(b)b.onclick=f};
  on('confirm',confirmReview);on('register',()=>csv(registerRows(),'account-register-'+TODAY_ISO+'.csv'));on('matrix',matrix);on('ret-save',retSave);
  on('ret-csv',()=>csv(candidates().map(x=>({'النوع':tr(...RL[x.type]),'العنوان':x.t,'التاريخ':x.d,'الإدارة':x.u||'','المعرف':x.id})),'retention-'+TODAY_ISO+'.csv'))}
let loading=false;
const __render=render;render=function(){__render();if(S.view==='settings'&&isAdmin()){const v=document.getElementById('view');if(!v||document.getElementById('gv-access'))return;
  if(GV.ret==null&&!loading){loading=true;Promise.all([loadAccess(),loadRet()]).catch(()=>{}).then(()=>{loading=false;if(S.view==='settings')render()});return}
  if(GV.ret!=null){v.insertAdjacentHTML('beforeend',accessPanel()+retPanel());bind()}}};
const css=document.createElement('style');css.textContent=`
.gv-status{border-radius:10px;padding:9px 12px;font-size:13.5px}.gv-status.over{background:var(--warn-soft);color:var(--warn)}.gv-status.ok{background:var(--ok-soft);color:var(--ok)}
.gv-ret{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:8px}.gv-ret label{display:flex;flex-direction:column;gap:4px;font-size:13px;background:var(--surface2);border-radius:10px;padding:8px 10px}.gv-ret input{width:90px}.gv-ret small{color:var(--muted)}
.gv-hist{margin:0;padding-inline-start:18px;display:flex;flex-direction:column;gap:8px;max-height:50vh;overflow:auto}.gv-hist ul{margin:2px 0 0;padding-inline-start:16px;font-size:13px}.gv-hist s{color:var(--muted)}.gv-hh small{margin-inline-start:6px}
.gv-holdnote{background:var(--crit-soft);color:var(--crit);border-radius:8px;padding:6px 10px;font-size:13px;margin:0 0 8px}
.gv-verify.ok b{color:var(--ok)}.gv-verify.bad b{color:var(--crit)}.gv-hold label{display:flex;gap:8px;align-items:center;font-size:13.5px}
.gv-matrix td{font-size:12.5px;vertical-align:top}`;document.head.appendChild(css);
})();
