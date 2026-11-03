/* Customer service: tickets, sales/fuel notices workflow and issued notices.
   Classic script: shares the global scope with the other app files; load order is set in index.html. */
"use strict";
/* ============ خدمة الزبائن ============ */
const TK_ST=['جديد','قيد المعالجة','بانتظار الزبون','مغلق'];
const TK_STC={'جديد':'p-info','قيد المعالجة':'p-warn','بانتظار الزبون':'p-neutral','مغلق':'p-ok'};
const TK_PRI=['عاجلة','مهمة','عادية'];const TK_SLA={'عاجلة':2,'مهمة':5,'عادية':10};
const TK_TYPES=['استفسار','طلب تزويد بالوقود','طلب تعاقد جديد','طلب تجديد أو تمديد عقد','شكوى','تأخر في التوريد','ملاحظة على الجودة أو الكمية','مطالبة مالية أو فواتير','أخرى'];
const TK_CH=['هاتف','زيارة للمقر','بريد إلكتروني','رسالة رسمية','واتساب','أخرى'];
const CU_KINDS=['شركة','مصنع','جهة عامة','فرد'];
function csUI(){return S.ui.cs||(S.ui.cs={tab:'tk',q:'',st:'',type:'',pri:'',as:'',cq:'',cf:''})}
function tkAge(t){const a=t.date;if(!a)return null;const b=t.status==='مغلق'?(t.closedAt||'').slice(0,10)||TODAY_ISO:TODAY_ISO;return Math.max(0,days(a,b))}
function tkLate(t){return t.status!=='مغلق'&&!!t.dueDate&&t.dueDate<TODAY_ISO}
function tkPill(s){return `<span class="pill ${TK_STC[s]||'p-neutral'}">${esc(s||'—')}</span>`}
function tkPri(p){return p==='عاجلة'?'<span class="pill p-crit">عاجلة</span>':p==='مهمة'?'<span class="pill p-warn">مهمة</span>':`<span class="muted">${esc(p||'عادية')}</span>`}
function tkNext(){const y=TODAY_ISO.slice(0,4);const n=Math.max(0,...S.tickets.filter(t=>(t.no||'').startsWith(y+'/')).map(t=>parseInt((t.no||'').split('/').pop())||0))+1;return y+'/'+String(n).padStart(3,'0')}
// يفتح البطاقة بعد وصول السجل المحفوظ من قاعدة البيانات
function whenReady(test,f,tries=40){if(test())f();else if(tries>0)setTimeout(()=>whenReady(test,f,tries-1),100)}
function csDenied(){return window.__denied&&window.__denied.tickets}
function csRulesBanner(){if(!csDenied())return '';
  return `<div class="banner" style="margin-bottom:12px"><b>بند خدمة الزبائن يحتاج تفعيلًا في Firebase.</b> قاعدة البيانات لا تسمح بعد بحفظ الطلبات. على مدير المنظومة فتح Firebase ← Firestore ← Rules واستبدال القواعد بمحتوى الملف <code>firestore.rules</code> المحدَّث (يضيف <code>tickets</code> إلى قائمة المجموعات) ثم الضغط على Publish.</div>`}
function csFiltered(){const u=csUI();const q=norm(u.q);let r=S.tickets.slice();
  if(u.st==='late')r=r.filter(tkLate);else if(u.st==='open')r=r.filter(t=>t.status!=='مغلق');else if(u.st)r=r.filter(t=>t.status===u.st);
  if(u.type)r=r.filter(t=>t.type===u.type);if(u.pri)r=r.filter(t=>t.priority===u.pri);if(u.as)r=r.filter(t=>(t.assignee||'')===u.as);
  if(q)r=r.filter(t=>norm([t.no,t.customer,t.phone,t.subject,t.details,t.contractNo,t.assignee,t.resolution].join(' ')).includes(q));
  const pr={'عاجلة':0,'مهمة':1,'عادية':2};
  return r.sort((a,b)=>(a.status==='مغلق')-(b.status==='مغلق')||(tkLate(b)-tkLate(a))||((pr[a.priority]??2)-(pr[b.priority]??2))||(b.date||'').localeCompare(a.date||'')||(b.no||'').localeCompare(a.no||''))}
function viewCs(){const u=csUI();const T=S.tickets;const open=T.filter(t=>t.status!=='مغلق');const mk=TODAY_ISO.slice(0,7);
  const closedM=T.filter(t=>t.status==='مغلق'&&(t.closedAt||'').startsWith(mk));const res=T.filter(t=>t.status==='مغلق').map(tkAge).filter(v=>v!=null);
  const chip=(k,l,n)=>`<button data-cs-st="${k}" aria-pressed="${u.st===k}">${l} <b class="num">${n}</b></button>`;
  return `<div class="page-head"><div><h2>خدمة الزبائن</h2><p>تسجيل طلبات الزبائن واستفساراتهم وشكاواهم، وإسنادها للجهة المسؤولة، ومتابعة حالتها حتى الإغلاق.</p></div>
   <div class="toolbar">${S.canWrite?`<button class="btn primary" data-act="tk-new">${I.plus}طلب / شكوى جديدة</button><button class="btn" data-act="cu-new">${I.plus}زبون جديد</button>`:''}<button class="btn" data-act="tk-export">${I.down}تصدير Excel</button></div></div>
  ${csRulesBanner()}
  <div class="kpis an-kpis">
   <button class="kpi" data-cs-st="open"><span class="l">طلبات مفتوحة</span><span class="v">${fn(open.length)}</span><span class="s">${open.filter(t=>t.status==='جديد').length} جديدة لم تُباشَر</span></button>
   <button class="kpi ${open.filter(tkLate).length?'crit':''}" data-cs-st="late"><span class="l">متأخرة عن موعدها</span><span class="v">${fn(open.filter(tkLate).length)}</span><span class="s">تجاوزت موعد الإنجاز</span></button>
   <button class="kpi ${open.some(t=>t.priority==='عاجلة')?'warn':''}" data-cs-pri="عاجلة"><span class="l">عاجلة مفتوحة</span><span class="v">${fn(open.filter(t=>t.priority==='عاجلة').length)}</span><span class="s">أولوية قصوى</span></button>
   <button class="kpi ok" data-cs-st="مغلق"><span class="l">أُغلقت هذا الشهر</span><span class="v">${fn(closedM.length)}</span><span class="s">من ${fn(T.filter(t=>t.status==='مغلق').length)} مغلقة إجمالًا</span></button>
   <div class="kpi" style="cursor:default"><span class="l">متوسط زمن المعالجة</span><span class="v">${res.length?(res.reduce((a,b)=>a+b,0)/res.length).toFixed(1):'—'}</span><span class="s">يومًا</span></div></div>
  <div class="tabs" role="tablist" style="margin-top:14px"><button role="tab" data-cs-tab="tk" aria-selected="${u.tab==='tk'}">الطلبات والشكاوى (${T.length})</button><button role="tab" data-cs-tab="cu" aria-selected="${u.tab==='cu'}">الزبائن</button><button role="tab" data-cs-tab="nm" aria-selected="${u.tab==='nm'}">آلية إشعارات البيع</button><button role="tab" data-cs-tab="nt" aria-selected="${u.tab==='nt'}">إشعارات البيع (${S.notices.length})</button></div>
  ${u.tab==='nm'?viewNm():u.tab==='nt'?`<div style="height:12px"></div>${viewNt()}`:u.tab==='cu'?`<div class="toolbar" style="margin-top:12px"><div class="grow">${I.search}<input type="search" id="cu-q" value="${esc(u.cq)}" placeholder="بحث باسم الزبون أو المنطقة أو الهاتف…"></div>
    <select id="cu-f"><option value="">كل الزبائن</option><option value="c" ${u.cf==='c'?'selected':''}>لهم عقود مع البريقة</option><option value="n" ${u.cf==='n'?'selected':''}>في الكشوفات بلا عقد</option><option value="t" ${u.cf==='t'?'selected':''}>لهم طلبات مفتوحة</option><option value="m" ${u.cf==='m'?'selected':''}>مسجّلون يدويًا</option></select></div><div id="cu-table"></div>`
  :`<div class="an-chips">${chip('','الكل',T.length)}${chip('open','المفتوحة',open.length)}${TK_ST.map(s=>chip(s,s,T.filter(t=>t.status===s).length)).join('')}${chip('late','المتأخرة',open.filter(tkLate).length)}</div>
   <div class="toolbar"><div class="grow">${I.search}<input type="search" id="tk-q" value="${esc(u.q)}" placeholder="بحث برقم الطلب أو الزبون أو الموضوع أو رقم العقد…"></div>
    <select id="tk-type"><option value="">كل الأنواع</option>${uniq([...TK_TYPES,...T.map(t=>t.type)]).map(t=>`<option ${u.type===t?'selected':''}>${esc(t)}</option>`).join('')}</select>
    <select id="tk-pri"><option value="">كل الأولويات</option>${TK_PRI.map(p=>`<option ${u.pri===p?'selected':''}>${p}</option>`).join('')}</select>
    <select id="tk-as"><option value="">كل الجهات المسؤولة</option>${uniq(T.map(t=>t.assignee)).map(a=>`<option ${u.as===a?'selected':''}>${esc(a)}</option>`).join('')}</select></div>
   <div id="tk-table"></div>`}`}
function renderTk(){const el=document.getElementById('tk-table');if(!el)return;const r=csFiltered();
  el.innerHTML=r.length?`<div class="count-line">${r.length} طلب</div><div class="tablewrap"><table><thead><tr><th class="nosort">الرقم</th><th class="nosort">التاريخ</th><th class="nosort">الزبون</th><th class="nosort">النوع</th><th class="nosort">الموضوع</th><th class="nosort">الأولوية</th><th class="nosort">الجهة المسؤولة</th><th class="nosort">موعد الإنجاز</th><th class="nosort">الحالة</th><th class="nosort">العمر</th></tr></thead><tbody>
  ${r.map(t=>`<tr data-tk="${t.id}"><td class="t-strong num">${esc(t.no||'—')}</td><td class="n">${fd(t.date)}</td><td>${esc(t.customer||'—')}</td><td>${esc(t.type||'—')}</td><td>${esc(t.subject||'—')}</td><td>${tkPri(t.priority)}</td><td>${esc(t.assignee||'—')}</td><td class="n">${t.dueDate?`<span style="${tkLate(t)?'color:var(--crit);font-weight:600':''}">${fd(t.dueDate)}</span>`:'—'}</td><td>${tkPill(t.status)}${tkLate(t)?' <span class="tag dup">متأخر</span>':''}</td><td class="n">${tkAge(t)??'—'} يوم</td></tr>`).join('')}</tbody></table></div>`
  :`<div class="empty"><b>${S.tickets.length?'لا نتائج':'لا توجد طلبات بعد'}</b>${S.tickets.length?'غيّر التصفية أو البحث.':'اضغط «طلب / شكوى جديدة» لتسجيل أول طلب.'}</div>`}
function csCustomers(){const ents=buildDir();
  // الزبائن المسجّلون يدويًا يُدمجون بالاسم، والطلبات تُربط بالاسم
  S.companies.forEach(co=>{const e=ents.find(x=>nameMatch(x.name,co.name)>=0.8||norm(x.name)===norm(co.name));if(e){e.manual=co;e.phone=co.phone||e.phone;e.person=co.person||e.person;e.email=co.email||e.email}});
  ents.forEach(e=>{e.tickets=S.tickets.filter(t=>norm(t.customer)===norm(e.name)||nameMatch(t.customer,e.name)>=0.8)});
  S.tickets.forEach(t=>{if(t.customer&&!ents.some(e=>e.tickets.includes(t))){let e=ents.find(x=>x.tkOnly&&norm(x.name)===norm(t.customer));if(!e){e={name:t.customer,phone:t.phone||'',contracts:[],needs:[],tickets:[],tkOnly:true};ents.push(e)}e.tickets.push(t)}});
  return ents}
function renderCu(){const el=document.getElementById('cu-table');if(!el)return;const u=csUI();const q=norm(u.cq);let r=csCustomers();
  if(q)r=r.filter(e=>norm([e.name,e.region,e.person,e.phone,e.activity].join(' ')).includes(q));
  if(u.cf==='c')r=r.filter(e=>e.contracts.length);if(u.cf==='n')r=r.filter(e=>!e.contracts.length&&e.needs.length);if(u.cf==='t')r=r.filter(e=>e.tickets.some(t=>t.status!=='مغلق'));if(u.cf==='m')r=r.filter(e=>e.manual);
  r.sort((a,b)=>b.tickets.filter(t=>t.status!=='مغلق').length-a.tickets.filter(t=>t.status!=='مغلق').length||b.tickets.length-a.tickets.length);
  S._cuRows=r;const lim=S.ui.cuAll?r.length:100;
  el.innerHTML=`<div class="count-line">${r.length} زبون</div><div class="tablewrap"><table><thead><tr><th class="nosort">الزبون</th><th class="nosort">المنطقة</th><th class="nosort">جهة الاتصال</th><th class="nosort">الهاتف</th><th class="nosort">العقود</th><th class="nosort">في الكشوفات</th><th class="nosort">الطلبات</th><th class="nosort">مفتوحة</th></tr></thead><tbody>
  ${r.slice(0,lim).map((e,i)=>{const o=e.tickets.filter(t=>t.status!=='مغلق').length;return `<tr data-cu="${i}"><td class="t-strong">${esc(e.name)}${e.manual?' <span class="tag">مسجّل</span>':''}</td><td>${esc(e.region||e.manual?.address||'—')}</td><td>${esc(e.person||'—')}</td><td class="n">${esc(e.phone||'—')}</td><td>${e.contracts.map(c=>`<span class="tag link">${esc(c.no)}</span>`).join(' ')||'—'}</td><td class="n">${e.needs.length||'—'}</td><td class="n">${e.tickets.length||'—'}</td><td>${o?`<span class="pill p-warn">${o}</span>`:'—'}</td></tr>`}).join('')}</tbody></table></div>
  ${r.length>lim?`<button class="btn sm" style="margin-top:10px" data-act="cu-all">عرض الكل (${r.length})</button>`:''}`}
afterRender.cs=()=>{const u=csUI();if(u.tab==='nm'||u.tab==='nt'){nmAfter();return}
  if(u.tab==='cu'){renderCu();const q=document.getElementById('cu-q');q.addEventListener('input',debounce(()=>{u.cq=q.value;renderCu()},150));document.getElementById('cu-f').addEventListener('change',e=>{u.cf=e.target.value;renderCu()});return}
  renderTk();const q=document.getElementById('tk-q');q.addEventListener('input',debounce(()=>{u.q=q.value;renderTk()},150));
  [['tk-type','type'],['tk-pri','pri'],['tk-as','as']].forEach(([id,k])=>document.getElementById(id).addEventListener('change',e=>{u[k]=e.target.value;renderTk()}))};
/* مرفقات السجل داخل لوحة التفاصيل: تُحفظ مباشرة عند الإضافة أو الحذف */
function attBox(col,r,name,title){return `<div><h3 class="section-title">${title||'المرفقات'}</h3>${ATT.field(col+':'+r.id,r.attachments,{readonly:!S.canWrite,name,onChange:list=>{const cur=(S[col]||[]).find(x=>x.id===r.id)||r;return write(col,r.id,Object.assign(stripId(cur),{attachments:list}),false)}})}</div>`}
function openTicket(id){const t=S.tickets.find(x=>x.id===id);if(!t)return;
  const row=(l,v,full)=>`<div class="${full?'full':''}"><dt>${esc(l)}</dt><dd>${v==null||v===''?'—':v}</dd></div>`;
  const c=t.contractNo?S.contracts.find(x=>normNo(x.no)===normNo(t.contractNo)):null;
  const hist=(t.history||[]).slice().sort((a,b)=>(b.ts||'').localeCompare(a.ts||''));
  drawer(`<div style="flex:1;min-width:0"><h3>${esc(t.subject||t.type||'طلب')}</h3><div class="sub"><span class="tag num">${esc(t.no||'')}</span>${tkPill(t.status)}${tkPri(t.priority)}${tkLate(t)?'<span class="tag dup">متأخر</span>':''}</div></div>
   ${S.canWrite?`<button class="btn sm" data-act="tk-edit" data-id="${t.id}">${I.edit}تعديل</button>`:''}<button class="iconbtn" data-act="close-drawer" aria-label="إغلاق">${I.close}</button>`,
  `${S.canWrite&&t.status!=='مغلق'?`<div class="panel tk-upd"><h3 class="section-title">تحديث الحالة</h3><div class="toolbar">
     <select id="tu-st">${TK_ST.map(s=>`<option ${s===(t.status==='جديد'?'قيد المعالجة':t.status)?'selected':''}>${s}</option>`).join('')}</select>
     <div class="grow" style="min-width:180px"><input id="tu-note" type="text" placeholder="ما الذي تم؟ (يُحفظ في سجل المتابعة، وعند الإغلاق يُعتبر الحل)" style="width:100%;height:36px;border:1px solid var(--line);border-radius:8px;padding-inline:10px;background:var(--surface)"></div>
     <button class="btn primary sm" data-act="tk-upd" data-id="${t.id}">حفظ التحديث</button></div><span id="tu-err" style="color:var(--crit);font-size:12.5px"></span></div>`:''}
   ${S.canWrite&&t.status==='مغلق'?`<div><button class="btn sm" data-act="tk-reopen" data-id="${t.id}">إعادة فتح الطلب</button></div>`:''}
   <div><h3 class="section-title">بيانات الطلب</h3><dl class="dl">
    ${row('الزبون',`<a href="#" data-cu-name="${esc(t.customer||'')}">${esc(t.customer||'')}</a>`,true)}${row('جهة الاتصال',esc(t.contact))}${row('الهاتف',esc(t.phone))}
    ${row('تاريخ الورود',fd(t.date))}${row('قناة الورود',esc(t.channel))}${row('نوع الطلب',esc(t.type))}${row('الجهة المسؤولة',esc(t.assignee))}
    ${row('موعد الإنجاز',t.dueDate?fd(t.dueDate):'')}${row('عمر الطلب',(tkAge(t)??'—')+' يوم')}
    ${c?row('العقد المرتبط',`<a href="#" data-open-c="${c.id}">${esc(c.no)} — ${esc(c.company)}</a>`,true):t.contractNo?row('رقم العقد',esc(t.contractNo)):''}
    ${row('التفاصيل',esc(t.details).replace(/\n/g,'<br>'),true)}
    ${t.status==='مغلق'?row('الحل / نتيجة المعالجة',esc(t.resolution),true)+row('تاريخ الإغلاق',fd(t.closedAt)):''}
   </dl></div>
   ${attBox('tickets',t,'طلب '+(t.no||''))}
   <div><h3 class="section-title">سجل المتابعة</h3>${hist.length?`<div class="tk-hist">${hist.map(h=>`<div class="tl"><span class="d num">${fd(h.ts)}</span><span style="flex:1">${h.status?tkPill(h.status)+' ':''}${esc(h.note||'')}<br><span class="muted" style="font-size:12px">${esc(h.by||'')}</span></span></div>`).join('')}</div>`:'<div class="muted">لا توجد تحديثات بعد.</div>'}</div>`)}
async function csMe(){try{const m=S.user&&S.user.me?await S.user.me():null;if(m)return m.name||m.email||'';const n=S.user&&S.user.name?await S.user.name():null;return n||''}catch(e){return ''}}
function tkForm(t,pre){const isNew=!t;t=t||Object.assign({date:TODAY_ISO,status:'جديد',priority:'عادية',channel:'هاتف',type:'استفسار'},pre||{});
  const custs=csCustomers().map(e=>e.name);const asg=uniq([...ORG.filter(o=>o.id!=='board').map(o=>o.title),...S.tickets.map(x=>x.assignee)]);
  modal(isNew?'تسجيل طلب / شكوى':'تعديل الطلب '+(t.no||''),`<fieldset><legend>الزبون</legend>
    ${F('t-cust','اسم الزبون (شركة / مصنع / جهة)',t.customer,{req:1,list:'dl-cust',full:1})}${F('t-contact','اسم المتصل / جهة الاتصال',t.contact)}${F('t-phone','الهاتف',t.phone,{type:'tel'})}${F('t-cno','رقم العقد (إن وجد)',t.contractNo,{list:'dl-no'})}</fieldset>
   <fieldset><legend>الطلب</legend>${F('t-date','تاريخ الورود',t.date,{type:'date',req:1})}${F('t-ch','قناة الورود',t.channel,{type:'select',options:uniq([...TK_CH,t.channel])})}${F('t-type','نوع الطلب',t.type,{type:'select',options:uniq([...TK_TYPES,t.type]),req:1})}
    ${F('t-pri','الأولوية',t.priority,{type:'select',options:TK_PRI})}${F('t-subj','الموضوع',t.subject,{req:1,full:1})}${F('t-det','التفاصيل',t.details,{type:'textarea',full:1})}</fieldset>
   <fieldset><legend>المعالجة</legend>${F('t-as','الجهة المسؤولة',t.assignee,{list:'dl-as'})}${F('t-due','موعد الإنجاز',t.dueDate,{type:'date',hint:'يُقترح تلقائيًا حسب الأولوية: عاجلة يومان، مهمة 5 أيام، عادية 10 أيام'})}${isNew?'':F('t-st','الحالة',t.status,{type:'select',options:TK_ST})}</fieldset>
   <fieldset><legend>المرفقات</legend>${ATT.formField('dlg',t.attachments,{name:t.no?'طلب '+t.no:t.customer})}</fieldset>
   ${dl('dl-cust',custs)}${dl('dl-no',S.contracts.map(c=>c.no))}${dl('dl-as',asg)}`,
  `<button type="submit" class="btn primary" data-act="tk-save" data-id="${t.id||''}">حفظ</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button>${!isNew&&S.canWrite?`<button type="button" class="btn danger" data-act="del" data-col="tickets" data-id="${t.id}" style="margin-inline-start:auto">حذف</button>`:''}<span id="f-err" style="color:var(--crit);font-size:12.5px;margin-inline-start:8px"></span>`);
  const due=document.getElementById('t-due'),pri=document.getElementById('t-pri'),dt=document.getElementById('t-date');let touched=!!t.dueDate;
  const sug=()=>{if(touched)return;const d=pd(dt.value)||today;const x=new Date(d);x.setDate(x.getDate()+(TK_SLA[pri.value]||10));due.value=iso(x)};
  due.addEventListener('input',()=>{touched=true});pri.addEventListener('change',sug);dt.addEventListener('change',sug);sug();
  document.getElementById('t-cust').addEventListener('change',e=>{const ent=csCustomers().find(x=>norm(x.name)===norm(e.target.value));if(!ent)return;const ph=document.getElementById('t-phone'),ct=document.getElementById('t-contact'),cn=document.getElementById('t-cno');
    if(!ph.value&&ent.phone)ph.value=ent.phone;if(!ct.value&&ent.person)ct.value=ent.person;if(!cn.value&&ent.contracts.length===1)cn.value=ent.contracts[0].no})}
async function tkSave(id){const old=id?S.tickets.find(x=>x.id===id):null;
  const o={customer:val('t-cust'),contact:val('t-contact'),phone:val('t-phone'),contractNo:val('t-cno'),date:val('t-date'),channel:val('t-ch'),type:val('t-type'),priority:val('t-pri')||'عادية',subject:val('t-subj'),details:val('t-det'),assignee:val('t-as'),dueDate:val('t-due')};
  if(!o.customer||!o.subject||!o.date||!o.type){document.getElementById('f-err').textContent='اسم الزبون والتاريخ والنوع والموضوع مطلوبة.';return}
  o.attachments=await ATT.val('dlg','f-err');const by=await csMe();const now=new Date().toISOString();
  if(old){const st=val('t-st')||old.status;Object.assign(o,{no:old.no,status:st,history:(old.history||[]).concat(st!==old.status?[{ts:now,by,status:st,note:'تغيير الحالة من نموذج التعديل'}]:[]),resolution:old.resolution||'',closedAt:st==='مغلق'?(old.closedAt||now):''})}
  else Object.assign(o,{no:tkNext(),status:'جديد',history:[{ts:now,by,status:'جديد',note:'تسجيل الطلب'}]});
  const nid=id||uid('t');await write('tickets',nid,o,!id);dlg.close();toast(old?'تم حفظ التعديل':'تم تسجيل الطلب رقم '+o.no);const v0=old&&old.updatedAt;whenReady(()=>{const x=S.tickets.find(t=>t.id===nid);return x&&x.updatedAt!==v0},()=>openTicket(nid))}
async function tkUpdate(id,st,note){const t=S.tickets.find(x=>x.id===id);if(!t)return;const by=await csMe();const now=new Date().toISOString();
  const o=Object.assign(stripId(t),{status:st,history:(t.history||[]).concat([{ts:now,by,status:st,note}])});
  if(st==='مغلق'){o.closedAt=now;o.resolution=note||t.resolution||''}else{delete o.closedAt}
  await write('tickets',id,o,false);toast(st==='مغلق'?'تم إغلاق الطلب':'تم حفظ التحديث');const n0=(t.history||[]).length;whenReady(()=>{const x=S.tickets.find(y=>y.id===id);return x&&(x.history||[]).length>n0},()=>openTicket(id))}
function openCustomer(name){const e=csCustomers().find(x=>norm(x.name)===norm(name));if(!e)return;const m=e.manual||{};
  const row=(l,v,full)=>`<div class="${full?'full':''}"><dt>${esc(l)}</dt><dd>${v==null||v===''?'—':v}</dd></div>`;
  drawer(`<div style="flex:1;min-width:0"><h3>${esc(e.name)}</h3><div class="sub">${e.contracts.length?`<span class="tag link">${e.contracts.length} عقد</span>`:''}${e.needs.length?`<span class="tag">${e.needs.length} منشأة في الكشوفات</span>`:''}${m.kind?`<span class="tag">${esc(m.kind)}</span>`:''}</div></div>
   ${S.canWrite?`<button class="btn sm" data-act="cu-edit" data-name="${esc(e.name)}">${I.edit}${e.manual?'تعديل البيانات':'إضافة بيانات اتصال'}</button>`:''}<button class="iconbtn" data-act="close-drawer" aria-label="إغلاق">${I.close}</button>`,
  `${S.canWrite?`<div><button class="btn primary sm" data-act="tk-new" data-name="${esc(e.name)}">${I.plus}طلب / شكوى لهذا الزبون</button></div>`:''}
   <div><h3 class="section-title">بيانات الاتصال</h3><dl class="dl">${row('جهة الاتصال',esc(e.person))}${row('الهاتف',esc(e.phone))}${row('البريد الإلكتروني',esc(e.email||m.email))}${row('العنوان / المنطقة',esc(m.address||e.region))}${e.activity?row('النشاط',esc(e.activity)):''}${m.notes?row('ملاحظات',esc(m.notes),true):''}</dl></div>
   ${e.contracts.length?`<div><h3 class="section-title">العقود مع البريقة</h3>${e.contracts.map(c=>{const d=D.get(c.id);return `<div class="tl" data-open-c="${c.id}" style="cursor:pointer;margin-bottom:6px"><span class="d">${esc(c.no)}</span><span style="flex:1">${esc(c.type||'')}<br><span class="muted" style="font-size:12.5px">ينتهي ${fd(d&&d.effEnd)}</span></span>${d?statusPill(d.status):''}</div>`}).join('')}</div>`:''}
   <div><h3 class="section-title">الطلبات والشكاوى (${e.tickets.length})</h3>${e.tickets.length?e.tickets.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(t=>`<div class="tl" data-tk="${t.id}" style="cursor:pointer;margin-bottom:6px"><span class="d num">${esc(t.no||'')}</span><span style="flex:1">${esc(t.subject||t.type||'')}<br><span class="muted" style="font-size:12.5px">${fd(t.date)} · ${esc(t.type||'')}</span></span>${tkPill(t.status)}</div>`).join(''):'<div class="muted">لا توجد طلبات مسجّلة لهذا الزبون.</div>'}</div>
   ${e.needs.length?`<div><h3 class="section-title">في كشوفات وزارة الصناعة</h3>${e.needs.map(n=>`<div class="tl" data-open-n="${n.id}" style="cursor:pointer;margin-bottom:6px"><span class="d">${esc(batchName(n.batch))}</span><span style="flex:1">${esc(n.activity||'')} · ${esc(cleanRegion(n.region)||'')}</span><span class="num">${fn(anDiesel(n)||null)} لتر</span></div>`).join('')}</div>`:''}`)}
function cuForm(name){const ent=name?csCustomers().find(x=>norm(x.name)===norm(name)):null;const co=(ent&&ent.manual)||{name:name||'',person:ent?.person||'',phone:ent?.phone||'',address:ent?.region||''};
  modal(co.id?'تعديل بيانات الزبون':'تسجيل زبون',`<fieldset><legend>بيانات الزبون</legend>${F('cu-name','اسم الزبون',co.name,{req:1,full:1})}${F('cu-kind','الصفة',co.kind,{type:'select',options:CU_KINDS})}${F('cu-person','جهة الاتصال / المفوض',co.person)}${F('cu-phone','الهاتف',co.phone,{type:'tel'})}${F('cu-email','البريد الإلكتروني',co.email,{type:'email'})}${F('cu-addr','العنوان / المنطقة',co.address)}${F('cu-notes','ملاحظات',co.notes,{type:'textarea',full:1})}</fieldset>`,
  `<button type="submit" class="btn primary" data-act="cu-save" data-id="${co.id||''}">حفظ</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button>${co.id?`<button type="button" class="btn danger" data-act="del" data-col="companies" data-id="${co.id}" style="margin-inline-start:auto">حذف</button>`:''}<span id="f-err" style="color:var(--crit);font-size:12.5px;margin-inline-start:8px"></span>`)}
async function cuSave(id){const o={name:val('cu-name'),kind:val('cu-kind'),person:val('cu-person'),phone:val('cu-phone'),email:val('cu-email'),address:val('cu-addr'),notes:val('cu-notes')};
  if(!o.name){document.getElementById('f-err').textContent='اسم الزبون مطلوب.';return}
  await write('companies',id||uid('co'),o,!id);dlg.close();toast('تم حفظ بيانات الزبون');whenReady(()=>S.companies.some(c=>c.name===o.name),()=>openCustomer(o.name))}
function tkExport(){const r=csFiltered();saveXlsx([['الطلبات',r.map(t=>({'الرقم':t.no||'','التاريخ':t.date||'','الزبون':t.customer||'','جهة الاتصال':t.contact||'','الهاتف':t.phone||'','رقم العقد':t.contractNo||'','القناة':t.channel||'','النوع':t.type||'','الأولوية':t.priority||'','الموضوع':t.subject||'','التفاصيل':t.details||'','الجهة المسؤولة':t.assignee||'','موعد الإنجاز':t.dueDate||'','الحالة':t.status||'','متأخر':tkLate(t)?'نعم':'','عمر الطلب (يوم)':tkAge(t)??'','تاريخ الإغلاق':(t.closedAt||'').slice(0,10),'الحل':t.resolution||''}))]],'طلبات-الزبائن-'+TODAY_ISO+'.xlsx')}
document.addEventListener('click',async e=>{
  const tb=e.target.closest('[data-cs-tab]');if(tb){csUI().tab=tb.dataset.csTab;render();return}
  const sc=e.target.closest('[data-cs-st]');if(sc){Object.assign(csUI(),{tab:'tk',st:sc.dataset.csSt,pri:''});render();return}
  const sp=e.target.closest('[data-cs-pri]');if(sp){Object.assign(csUI(),{tab:'tk',st:'open',pri:sp.dataset.csPri});render();return}
  const tr=e.target.closest('[data-tk]');if(tr){openTicket(tr.dataset.tk);return}
  const cr=e.target.closest('[data-cu]');if(cr&&S._cuRows){openCustomer(S._cuRows[+cr.dataset.cu].name);return}
  const cn=e.target.closest('[data-cu-name]');if(cn){e.preventDefault();openCustomer(cn.dataset.cuName);return}
  const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act,id=a.dataset.id;
  if(act==='tk-new'){if(!S.canWrite)return;if(dlg.open)dlg.close();tkForm(null,a.dataset.name?{customer:a.dataset.name}:null);if(a.dataset.name)document.getElementById('t-cust').dispatchEvent(new Event('change'))}
  else if(act==='tk-edit')tkForm(S.tickets.find(x=>x.id===id));
  else if(act==='cu-new'){if(dlg.open)dlg.close();cuForm()}
  else if(act==='cu-edit')cuForm(a.dataset.name);
  else if(act==='tk-export')tkExport();
  else if(act==='cu-all'){S.ui.cuAll=true;renderCu()}
  else if(act==='tk-save'||act==='cu-save'){e.preventDefault();if(!S.canWrite)return;a.disabled=true;try{await(act==='tk-save'?tkSave:cuSave)(id||null)}catch(err){const fe=document.getElementById('f-err');if(fe)fe.textContent=writeErr(err)}finally{a.disabled=false}}
  else if(act==='tk-upd'||act==='tk-reopen'){const st=act==='tk-reopen'?'قيد المعالجة':document.getElementById('tu-st').value;const note=act==='tk-reopen'?'إعادة فتح الطلب':val('tu-note');
    if(st==='مغلق'&&!note){document.getElementById('tu-err').textContent='اكتب الحل أو نتيجة المعالجة قبل الإغلاق.';return}
    a.disabled=true;try{await tkUpdate(id,st,note)}catch(err){toast(writeErr(err))}finally{a.disabled=false}}
});
/* English labels for the two modules (used by the language switch) */
if(window.I18N&&I18N.add){I18N.add({
 'تحليل البيانات':'Data analysis','خدمة الزبائن':'Customer service','قراءة تحليلية لعقود البريقة وكشوفات الاحتياجات وطلبات الزبائن، تتحدّث تلقائيًا مع كل تعديل في المنظومة.':'Analysis of Brega contracts, needs sheets and customer requests, updated automatically with every change in the system.',
 'تصدير التحليل Excel':'Export analysis to Excel','العقود':'Contracts','الاحتياجات والوقود':'Needs & fuel','الفرص البيعية':'Sales opportunities','تحليل مخصّص':'Custom analysis',
 'نوع العقد':'Contract type','كل الأنواع':'All types','التوقيع من':'Signed from','إلى':'To','الدفعة':'Batch','كل الدفعات':'All batches','المنطقة':'Region','كل المناطق':'All regions','مسح التصفية':'Clear filters',
 'لا توجد بيانات ضمن التصفية الحالية':'No data for the current filters','لا توجد عقود':'No contracts','لا توجد منشآت':'No facilities','ضمن التصفية الحالية.':'for the current filters.',
 'عدد العقود':'Contracts','{0} سارية الآن':'{0} active now','نسبة العقود السارية':'Active contracts share','{0} منتهية':'{0} expired','القيمة الإجمالية':'Total value','دينار ليبي':'LYD','{0} بعملة أخرى':'{0} in another currency',
 'متوسط قيمة العقد':'Average contract value','متوسط مدة العقد':'Average contract term','شهرًا':'months','تنتهي خلال {0} يومًا':'Expiring within {0} days','تحتاج متابعة للتجديد':'Need renewal follow-up',
 '{0} مليون':'{0}M','{0} ألف':'{0}K','حالة العقود':'Contract status','اضغط على جزء لفتح العقود':'click a segment to open the contracts','ساري':'Active','قريب الانتهاء':'Expiring soon','منتهٍ':'Expired','لم يبدأ بعد':'Not started','معلق / غير محدد':'Suspended / unspecified',
 'عدد العقود حسب النوع':'Contracts by type','اضغط للتصفية':'click to filter','قيمة العقود حسب النوع':'Contract value by type','العقود الموقّعة شهريًا':'Contracts signed per month','آخر 12 شهرًا':'last 12 months',
 'العقود التي تنتهي في الأرباع القادمة':'Contracts expiring in the coming quarters','حسب الإدارة المختصة':'By department','حسب الموقع':'By location','أعلى 10':'top 10','أعلى 12':'top 12','أعلى 25':'top 25',
 'أكبر 10 زبائن حسب قيمة العقود':'Top 10 customers by contract value','توزيع مدد العقود':'Contract term distribution','أقل من 6 أشهر':'Under 6 months','6–12 شهرًا':'6–12 months','1–2 سنة':'1–2 years','أكثر من سنتين':'Over 2 years',
 'عدد المنشآت':'Facilities','{0} منطقة':'{0} regions','إجمالي الديزل الشهري':'Monthly diesel total','لتر/شهر':'liters/month','متوسط الديزل للمنشأة':'Average diesel per facility','لتر/شهر للمنشآت المستهلكة':'liters/month for consuming facilities',
 'الغاز':'Gas','الزيت الثقيل':'Heavy oil','منشآت مرتبطة بعقد':'Facilities with a contract','{0} من {1}':'{0} of {1}','الكميات المعتمدة حسب نوع الوقود':'Approved quantities by fuel type','ديزل مولدات':'Diesel (generators)','ديزل تشغيلية':'Diesel (operations)','زيت ثقيل':'Heavy oil','كيروسين':'Kerosene','مشاريع (نوع الوقود غير محدد)':'Projects (fuel type unspecified)',
 'الديزل حسب الدفعة':'Diesel by batch','اضغط لفتح الدفعة':'click to open the batch','الديزل حسب المنطقة':'Diesel by region','عدد المنشآت حسب المنطقة':'Facilities by region','الديزل حسب نوع النشاط':'Diesel by activity',
 'المنشآت حسب حجم الاستهلاك الشهري للديزل':'Facilities by monthly diesel consumption','حتى 5 آلاف':'Up to 5K','5–20 ألف':'5K–20K','20–50 ألف':'20K–50K','50–100 ألف':'50K–100K','أكثر من 100 ألف':'Over 100K',
 'أكبر 10 منشآت استهلاكًا للديزل':'Top 10 diesel-consuming facilities','اضغط لفتح بطاقة المنشأة':'click to open the facility card',
 'منشآت معتمدة في كشوفات وزارة الصناعة ولا يوجد لها عقد مسجّل مع شركة البريقة: فرص تعاقد مباشرة، مرتّبة حسب حجم احتياجها الشهري.':'Facilities approved in the Ministry of Industry sheets with no contract registered with Brega: direct contracting opportunities, ranked by monthly need.',
 'منشآت بلا عقد':'Facilities without a contract','من {0} منشأة في الكشوفات':'of {0} facilities in the sheets','ديزل غير متعاقد عليه':'Uncontracted diesel','نسبتها من إجمالي الديزل':'Share of total diesel','من الاحتياج المعتمد':'of the approved need','غاز غير متعاقد عليه':'Uncontracted gas',
 'الديزل غير المتعاقد عليه حسب المنطقة':'Uncontracted diesel by region','حسب نوع النشاط':'By activity','قائمة الفرص':'Opportunity list','تصدير القائمة':'Export list','المنشأة':'Facility','النشاط':'Activity','صاحب الترخيص / المفوض':'Licensee / representative',
 'ديزل لتر/شهر':'Diesel L/month','غاز طن':'Gas (tons)','عرض كل الفرص ({0})':'Show all opportunities ({0})','لا توجد فرص':'No opportunities','كل المنشآت ضمن التصفية مرتبطة بعقود.':'All facilities in the filter have contracts.',
 'لا توجد طلبات زبائن بعد':'No customer requests yet','سجّل الطلبات والشكاوى من بند «خدمة الزبائن» وستظهر تحليلاتها هنا.':'Record requests and complaints in Customer service and their analysis will appear here.','فتح خدمة الزبائن':'Open customer service',
 'إجمالي الطلبات':'Total requests','{0} مفتوحة':'{0} open','متأخرة عن موعدها':'Overdue','طلبات مفتوحة تجاوزت موعد الإنجاز':'Open requests past their due date','متوسط زمن المعالجة':'Average handling time','يومًا للطلبات المغلقة':'days for closed requests',
 'الإنجاز في الموعد':'Closed on time','{0} من {1} مغلقة':'{0} of {1} closed','الشكاوى':'Complaints','حالة الطلبات':'Request status','اضغط لفتح القائمة':'click to open the list','الطلبات الواردة والمغلقة شهريًا':'Requests received and closed per month','واردة':'Received','مغلقة':'Closed',
 'حسب نوع الطلب':'By request type','حسب قناة الورود':'By channel','حسب الأولوية':'By priority','متوسط أيام المعالجة حسب النوع':'Average handling days by type','الطلبات المفتوحة حسب الجهة المسؤولة':'Open requests by responsible unit','أكثر الزبائن تواصلًا':'Most active customers',
 'اختر ما تريد تحليله':'Choose what to analyse','البيانات':'Data','التجميع حسب':'Group by','المقياس':'Measure','تصدير النتيجة':'Export result','الجدول':'Table','{0} مجموعة':'{0} groups','عدد السجلات':'Records','النسبة':'Share','الإجمالي':'Total',
 'عقود البريقة':'Brega contracts','كشوفات الاحتياجات':'Needs sheets','طلبات الزبائن':'Customer requests','الحالة':'Status','الإدارة المختصة':'Department','الموقع':'Location','الشركة المتعاقدة':'Contracting company','المسؤول':'Officer','العملة':'Currency','سنة التوقيع':'Signing year','شهر التوقيع':'Signing month','تنبيه الانتهاء':'Expiry alert','لا يوجد':'None',
 'مجموع القيمة':'Total value','متوسط القيمة':'Average value','متوسط المدة (شهر)':'Average term (months)','عدد التمديدات':'Extensions','القسم في الكشف':'Sheet section','الارتباط بعقد':'Contract link','مرتبطة بعقد':'With contract','بلا عقد':'No contract',
 'ديزل إجمالي (لتر/شهر)':'Total diesel (L/month)','غاز (طن)':'Gas (tons)','نوع الطلب':'Request type','قناة الورود':'Channel','الأولوية':'Priority','الجهة المسؤولة':'Responsible unit','الزبون':'Customer','شهر الورود':'Month received','الالتزام بالموعد':'Timeliness','متأخر':'Overdue','ضمن الموعد':'On time','عدد الطلبات':'Requests','متوسط أيام المعالجة':'Average handling days',
 'جديد':'New','قيد المعالجة':'In progress','بانتظار الزبون':'Waiting for customer','مغلق':'Closed','عاجلة':'Urgent','مهمة':'High','عادية':'Normal',
 'استفسار':'Inquiry','طلب تزويد بالوقود':'Fuel supply request','طلب تعاقد جديد':'New contract request','طلب تجديد أو تمديد عقد':'Contract renewal / extension','شكوى':'Complaint','تأخر في التوريد':'Delivery delay','ملاحظة على الجودة أو الكمية':'Quality or quantity issue','مطالبة مالية أو فواتير':'Billing / financial claim','أخرى':'Other',
 'هاتف':'Phone','زيارة للمقر':'Office visit','بريد إلكتروني':'Email','رسالة رسمية':'Official letter','واتساب':'WhatsApp','شركة':'Company','مصنع':'Factory','جهة عامة':'Public body','فرد':'Individual',
 'تسجيل طلبات الزبائن واستفساراتهم وشكاواهم، وإسنادها للجهة المسؤولة، ومتابعة حالتها حتى الإغلاق.':'Record customer requests, inquiries and complaints, assign them to the responsible unit, and track them until closed.',
 'طلب / شكوى جديدة':'New request / complaint','زبون جديد':'New customer','تصدير Excel':'Export Excel','بند خدمة الزبائن يحتاج تفعيلًا في Firebase.':'Customer service needs to be enabled in Firebase.',
 'قاعدة البيانات لا تسمح بعد بحفظ الطلبات. على مدير المنظومة فتح Firebase ← Firestore ← Rules واستبدال القواعد بمحتوى الملف':'The database does not allow saving requests yet. The administrator should open Firebase → Firestore → Rules and replace the rules with the updated file','المحدَّث (يضيف':'(it adds','إلى قائمة المجموعات) ثم الضغط على Publish.':'to the collection list) then press Publish.',
 'طلبات مفتوحة':'Open requests','{0} جديدة لم تُباشَر':'{0} new, not started','تجاوزت موعد الإنجاز':'Past due date','عاجلة مفتوحة':'Open urgent','أولوية قصوى':'Top priority','أُغلقت هذا الشهر':'Closed this month','من {0} مغلقة إجمالًا':'of {0} closed in total','يومًا':'days',
 'الطلبات والشكاوى ({0})':'Requests & complaints ({0})','الزبائن':'Customers','بحث باسم الزبون أو المنطقة أو الهاتف…':'Search by customer, region or phone…','كل الزبائن':'All customers','لهم عقود مع البريقة':'With Brega contracts','في الكشوفات بلا عقد':'In sheets without contract','لهم طلبات مفتوحة':'With open requests','مسجّلون يدويًا':'Added manually',
 'الكل':'All','المفتوحة':'Open','المتأخرة':'Overdue','بحث برقم الطلب أو الزبون أو الموضوع أو رقم العقد…':'Search by request no., customer, subject or contract no.…','كل الأولويات':'All priorities','كل الجهات المسؤولة':'All responsible units',
 '{0} طلب':'{0} requests','الرقم':'No.','التاريخ':'Date','النوع':'Type','الموضوع':'Subject','موعد الإنجاز':'Due date','العمر':'Age','{0} يوم':'{0} days','لا نتائج':'No results','غيّر التصفية أو البحث.':'Change the filter or search.','لا توجد طلبات بعد':'No requests yet','اضغط «طلب / شكوى جديدة» لتسجيل أول طلب.':'Press "New request / complaint" to record the first one.',
 '{0} زبون':'{0} customers','جهة الاتصال':'Contact','الهاتف':'Phone','في الكشوفات':'In sheets','الطلبات':'Requests','مفتوحة':'Open','مسجّل':'Registered','عرض الكل ({0})':'Show all ({0})',
 'تحديث الحالة':'Update status','ما الذي تم؟ (يُحفظ في سجل المتابعة، وعند الإغلاق يُعتبر الحل)':'What was done? (saved in the follow-up log; when closing it is the resolution)','حفظ التحديث':'Save update','إعادة فتح الطلب':'Reopen request','بيانات الطلب':'Request details','تاريخ الورود':'Date received','عمر الطلب':'Request age','العقد المرتبط':'Linked contract','رقم العقد':'Contract no.','التفاصيل':'Details',
 'الحل / نتيجة المعالجة':'Resolution','تاريخ الإغلاق':'Closed on','سجل المتابعة':'Follow-up log','لا توجد تحديثات بعد.':'No updates yet.','تسجيل الطلب':'Request recorded','تغيير الحالة من نموذج التعديل':'Status changed from the edit form',
 'تسجيل طلب / شكوى':'New request / complaint','تعديل الطلب {0}':'Edit request {0}','اسم الزبون (شركة / مصنع / جهة)':'Customer name (company / factory / body)','اسم المتصل / جهة الاتصال':'Caller / contact','رقم العقد (إن وجد)':'Contract no. (if any)','الطلب':'Request','المعالجة':'Handling',
 'يُقترح تلقائيًا حسب الأولوية: عاجلة يومان، مهمة 5 أيام، عادية 10 أيام':'Suggested from priority: urgent 2 days, high 5 days, normal 10 days','اسم الزبون والتاريخ والنوع والموضوع مطلوبة.':'Customer, date, type and subject are required.','اكتب الحل أو نتيجة المعالجة قبل الإغلاق.':'Write the resolution before closing.',
 'تم حفظ التعديل':'Changes saved','تم تسجيل الطلب رقم {0}':'Request {0} recorded','تم تسجيل الطلب رقم {0}/{1}':'Request {0}/{1} recorded','تم إغلاق الطلب':'Request closed','تم حفظ التحديث':'Update saved','تم حفظ بيانات الزبون':'Customer saved',
 'تعديل البيانات':'Edit details','إضافة بيانات اتصال':'Add contact details','طلب / شكوى لهذا الزبون':'Request / complaint for this customer','بيانات الاتصال':'Contact details','البريد الإلكتروني':'Email','العنوان / المنطقة':'Address / region','ملاحظات':'Notes','العقود مع البريقة':'Contracts with Brega','ينتهي {0}':'Ends {0}',
 'الطلبات والشكاوى':'Requests & complaints','لا توجد طلبات مسجّلة لهذا الزبون.':'No requests recorded for this customer.','في كشوفات وزارة الصناعة':'In the Ministry of Industry sheets','{0} منشأة في الكشوفات':'{0} facilities in the sheets','{0} لتر':'{0} L',
 'تسجيل زبون':'New customer','تعديل بيانات الزبون':'Edit customer','بيانات الزبون':'Customer details','اسم الزبون':'Customer name','الصفة':'Kind','جهة الاتصال / المفوض':'Contact / representative','اسم الزبون مطلوب.':'Customer name is required.','غير محدد':'Unspecified'});
 I18N.rule(/^ر(\d) (\d{4})$/,m=>'Q'+m[1]+' '+m[2]);I18N.rule(/^الربع (\d) من (\d{4})$/,m=>'Q'+m[1]+' '+m[2]);
 I18N.rule(/^(\d+) (طلب)$/,m=>m[1]+' requests');I18N.rule(/^(\d+) (زبون)$/,m=>m[1]+' customers');}

/* ============ آلية مراحل إصدار إشعارات البيع وتزويد الوقود (ضمن خدمة الزبائن) ============
   مرجعها المراسلة الداخلية BPMC-GEN-COR-F03 (إشاري 424 بتاريخ 2026/10/12).
   - توثيق الآلية: مستند واحد config/notices، مفتاحه «المنطقة|الفئة» ← {stages:[{desc,unit,docs,days,notes}×9], challenges, proposals}
   - سجل الإشعارات الفعلية: مجموعة notices، كل إشعار يتنقّل عبر المراحل التسع مع سجل لكل انتقال. */
const NM_STAGES=[
 ['استقبال طلب الزبون','آلية استقبال الطلب من الزبون، والشروط والوثائق المطلوبة لقبوله.'],
 ['التدقيق والتحقق من البيانات','إجراءات التدقيق والتحقق من صحة بيانات الزبائن والمندوبين والمفوضين باستلام الوقود.'],
 ['إنشاء الإشعار وتوثيقه','خطوات إنشاء الإشعار وتوثيقه، وآلية التنسيق بين الوحدات المختصة.'],
 ['ترتيبات الشحن والتعبئة','ترتيبات شحن وتعبئة الوقود والجدولة الزمنية.'],
 ['استلام الزبون وإغلاق الطلب','إجراءات استلام الزبون للطلب، والوثائق النهائية لإغلاق الطلب والاستلام.'],
 ['مطابقة الكميات مع المخصصات','مدى مطابقة الكميات المطلوبة مع المخصصات المعتمدة قبل إصدار الإشعارات.'],
 ['التنسيق مع المستودعات ونقاط التوزيع','آلية التنسيق بين الجهة المصدرة للإشعار والمستودعات ونقاط التوزيع.'],
 ['التحقق من الكميات المصروفة','آلية التحقق من الكميات المصروفة فعليًا ومطابقتها مع الكميات الواردة بإشعار البيع.'],
 ['الإجراءات المالية والسداد','الإجراءات المالية الخاصة بالطلب، وإصدار إذن الدفع (السداد) ومتى يتم.']];
const NM_SEG=['القطاع العام','المستهلكون','شركات التوزيع','الطيران','السفن'];
const NM_REG=['المنطقتان الغربية والجنوبية','المنطقتان الوسطى والشرقية'];
const NT_ST=['جارٍ','مكتمل','موقوف'];const NT_STC={'جارٍ':'p-info','مكتمل':'p-ok','موقوف':'p-crit'};
const NT_PAY=['لم يُصدر إذن الدفع','صدر إذن الدفع','تم السداد'];
function nmUI(){const u=csUI();if(!u.nreg)u.nreg=NM_REG[0];if(!u.nseg)u.nseg=NM_SEG[0];return u}
function nmData(){return (S.nm&&S.nm.data)||{}}
function nmKey(r,s){return r+'|'+s}
function nmGet(r,s){const d=nmData()[nmKey(r,s)]||{};const st=(d.stages||[]).slice();while(st.length<9)st.push({});return {stages:st.map(x=>x||{}),challenges:d.challenges||'',proposals:d.proposals||'',by:d.by||'',at:d.at||''}}
function nmDone(x){return !!(x&&(x.desc||'').trim())}
function nmCount(r,s){return nmGet(r,s).stages.filter(nmDone).length}
async function nmSave(r,s,patch){const all=JSON.parse(JSON.stringify(nmData()));const cur=nmGet(r,s);const by=await csMe();
  all[nmKey(r,s)]=Object.assign({},cur,patch,{by,at:new Date().toISOString()});
  await S.db.doc('config/notices').set({data:all,updatedAt:new Date().toISOString()});S.nm={data:all}}
function viewNm(){const u=nmUI();const g=nmGet(u.nreg,u.nseg);const done=g.stages.filter(nmDone).length;
  const tot=NM_REG.reduce((a,r)=>a+NM_SEG.reduce((b,s)=>b+nmCount(r,s),0),0),max=NM_REG.length*NM_SEG.length*9;
  return `<div class="nm-memo panel"><div><b>طلب إفادة تفصيلية بآلية ومراحل إصدار إشعارات البيع وتزويد الوقود</b><br><span class="muted">مراسلة داخلية</span> <span class="num" translate="no">BPMC-GEN-COR-F03</span> · <span class="muted">إشاري 424 بتاريخ ${fd('2026-10-12')}</span><br><span class="muted">من مدير عام المبيعات والشؤون التجارية إلى مديري إدارة المبيعات بالمناطق.</span></div>
    <div class="nm-prog"><span>اكتمال التوثيق في كل المناطق والفئات</span><span class="an-track" style="flex:1"><span class="an-fill" style="width:${tot*100/max}%"></span></span><b class="num">${Math.round(tot*100/max)}%</b></div></div>
  <div class="nm-sel"><label class="an-f">المنطقة<select id="nm-reg">${NM_REG.map(r=>`<option ${u.nreg===r?'selected':''}>${r}</option>`).join('')}</select></label>
   <div class="an-chips" style="margin:0">${NM_SEG.map(s=>`<button data-nm-seg="${s}" aria-pressed="${u.nseg===s}">${s} <b class="num">${nmCount(u.nreg,s)}/9</b></button>`).join('')}</div></div>
  <div class="nm-head"><h3>${esc(u.nseg)} <small class="muted">— ${esc(u.nreg)}</small></h3><span class="pill ${done===9?'p-ok':done?'p-warn':'p-neutral'}">وُثّقت ${done} من 9 مراحل</span>${g.at?`<span class="muted" style="font-size:12px">آخر تحديث ${fd(g.at)} · ${esc(g.by)}</span>`:''}
   <span style="margin-inline-start:auto;display:flex;gap:6px"><button class="btn sm" data-act="nm-export">${I.down}تصدير الإفادة Excel</button><button class="btn sm" data-act="nm-print">طباعة</button></span></div>
  <ol class="nm-steps">${NM_STAGES.map(([t,q],i)=>{const x=g.stages[i];const ok=nmDone(x);return `<li class="nm-step${ok?' ok':''}"><span class="nm-n num">${i+1}</span><div class="nm-c">
    <div class="nm-t"><b>${t}</b>${ok?'<span class="pill p-ok">موثّقة</span>':'<span class="pill p-neutral">بانتظار التوثيق</span>'}${S.canWrite?`<button class="btn sm ghost" data-act="nm-edit" data-i="${i}">${I.edit}${ok?'تعديل':'توثيق المرحلة'}</button>`:''}</div>
    <p class="muted nm-q">${q}</p>
    ${ok||x.unit||x.docs||x.days?`<dl class="nm-dl">${x.desc?`<div class="full"><dt>الإجراء المتّبع</dt><dd>${esc(x.desc).replace(/\n/g,'<br>')}</dd></div>`:''}${x.unit?`<div><dt>الجهة / الوحدة المسؤولة</dt><dd>${esc(x.unit)}</dd></div>`:''}${x.days?`<div><dt>المدة المستهدفة</dt><dd>${esc(x.days)} يوم عمل</dd></div>`:''}${x.docs?`<div class="full"><dt>الوثائق والمستندات</dt><dd>${esc(x.docs).replace(/\n/g,'<br>')}</dd></div>`:''}${x.notes?`<div class="full"><dt>ملاحظات وعقبات المرحلة</dt><dd>${esc(x.notes).replace(/\n/g,'<br>')}</dd></div>`:''}</dl>`:''}
   </div></li>`}).join('')}</ol>
  <div class="an-grid" style="margin-top:14px">
   <section class="panel"><h3 class="section-title" style="justify-content:space-between">التحديات والعقبات المسببة للتأخير ${S.canWrite?`<button class="btn sm ghost" data-act="nm-cp" data-k="challenges">${I.edit}تعديل</button>`:''}</h3>${g.challenges?`<div class="nm-txt">${esc(g.challenges).replace(/\n/g,'<br>')}</div>`:'<div class="muted">لم تُسجَّل بعد. اذكر أي تحديات أو عقبات تتسبب في تأخير الدورة لهذه الفئة.</div>'}</section>
   <section class="panel"><h3 class="section-title" style="justify-content:space-between">مقترحات تسريع الإجراءات وتحسين الخدمة ${S.canWrite?`<button class="btn sm ghost" data-act="nm-cp" data-k="proposals">${I.edit}تعديل</button>`:''}</h3>${g.proposals?`<div class="nm-txt">${esc(g.proposals).replace(/\n/g,'<br>')}</div>`:'<div class="muted">لم تُسجَّل بعد. أضف المقترحات التي من شأنها تسريع الإجراءات وتحسين جودة الخدمة.</div>'}</section>
   <section class="panel an-wide"><h3 class="section-title">مصفوفة الاكتمال <small>كل المناطق والفئات · اضغط على خانة للانتقال إليها</small></h3><div class="tablewrap"><table class="nm-mx"><thead><tr><th class="nosort">المنطقة</th><th class="nosort">الفئة</th>${NM_STAGES.map((s,i)=>`<th class="nosort" title="${esc(s[0])}">${i+1}</th>`).join('')}<th class="nosort">المجموع</th></tr></thead><tbody>
    ${NM_REG.map(r=>NM_SEG.map(s=>{const gg=nmGet(r,s);return `<tr data-nm-go="${esc(r+'|'+s)}" ${r===u.nreg&&s===u.nseg?'class="sel"':''}><td>${esc(r)}</td><td class="t-strong">${esc(s)}</td>${gg.stages.map((x,i)=>`<td class="nm-cell" data-tip="${esc(NM_STAGES[i][0]+': '+(nmDone(x)?'موثّقة':'بانتظار التوثيق'))}">${nmDone(x)?'<span class="nm-dot ok"></span>':'<span class="nm-dot"></span>'}</td>`).join('')}<td class="n">${gg.stages.filter(nmDone).length}/9</td></tr>`}).join('')).join('')}</tbody></table></div></section>
  </div>`}
function nmEdit(i){const u=nmUI();const x=nmGet(u.nreg,u.nseg).stages[i];
  modal(`المرحلة ${i+1}: ${NM_STAGES[i][0]}`,`<p class="muted" style="margin:0 0 10px">${NM_STAGES[i][1]} — ${esc(u.nseg)} · ${esc(u.nreg)}</p><fieldset><legend>توثيق المرحلة</legend>
   ${F('nm-desc','الإجراء المتّبع (الخطوات بالتسلسل)',x.desc,{type:'textarea',full:1,req:1})}${F('nm-unit','الجهة / الوحدة المسؤولة',x.unit,{list:'dl-nmu'})}${F('nm-days','المدة المستهدفة (أيام عمل)',x.days,{type:'number'})}
   ${F('nm-docs','الوثائق والمستندات المطلوبة',x.docs,{type:'textarea',full:1})}${F('nm-notes','ملاحظات وعقبات في هذه المرحلة',x.notes,{type:'textarea',full:1})}</fieldset>${dl('dl-nmu',ORG.filter(o=>o.id!=='board').map(o=>o.title))}`,
  `<button type="submit" class="btn primary" data-act="nm-save" data-i="${i}">حفظ</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button><span id="f-err" style="color:var(--crit);font-size:12.5px;margin-inline-start:8px"></span>`)}
function nmCp(k){const u=nmUI();const g=nmGet(u.nreg,u.nseg);
  modal(k==='challenges'?'التحديات والعقبات':'المقترحات',`<p class="muted" style="margin:0 0 10px">${esc(u.nseg)} · ${esc(u.nreg)}</p><fieldset>${F('nm-cp',k==='challenges'?'التحديات أو العقبات التي تتسبب في تأخير الدورة':'المقترحات لتسريع الإجراءات وتحسين جودة الخدمة',g[k],{type:'textarea',full:1})}</fieldset>`,
  `<button type="submit" class="btn primary" data-act="nm-cp-save" data-k="${k}">حفظ</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button><span id="f-err" style="color:var(--crit);font-size:12.5px;margin-inline-start:8px"></span>`)}
function nmExport(){const rows=[],cp=[];NM_REG.forEach(r=>NM_SEG.forEach(s=>{const g=nmGet(r,s);g.stages.forEach((x,i)=>rows.push({'المنطقة':r,'الفئة':s,'المرحلة':i+1,'عنوان المرحلة':NM_STAGES[i][0],'الإجراء المتبع':x.desc||'','الجهة المسؤولة':x.unit||'','المدة المستهدفة (أيام)':x.days||'','الوثائق والمستندات':x.docs||'','ملاحظات وعقبات':x.notes||''}));cp.push({'المنطقة':r,'الفئة':s,'التحديات والعقبات':g.challenges,'المقترحات':g.proposals,'آخر تحديث':(g.at||'').slice(0,10),'بواسطة':g.by})}));
  saveXlsx([['مراحل الإصدار',rows],['التحديات والمقترحات',cp]],'آلية-إشعارات-البيع-'+TODAY_ISO+'.xlsx')}
function nmPrint(){const u=nmUI();const g=nmGet(u.nreg,u.nseg);const w=window.open('','_blank');if(!w){toast('اسمح بالنوافذ المنبثقة للطباعة');return}
  const b=s=>esc(s||'—').replace(/\n/g,'<br>');
  w.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>إفادة آلية إصدار إشعارات البيع</title><style>body{font-family:Arial,Tahoma,sans-serif;margin:28px;color:#111;font-size:13px}h1{font-size:18px;margin:0 0 4px}h2{font-size:15px;margin:18px 0 6px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #999;padding:6px 8px;vertical-align:top;text-align:right}th{background:#eee}.m{color:#555}</style></head><body>
   <h1>إفادة بآلية ومراحل إصدار إشعارات البيع وتزويد الوقود</h1><div class="m">ردًا على المراسلة BPMC-GEN-COR-F03 (إشاري 424 بتاريخ 2026/10/12) · ${esc(u.nreg)} · فئة: ${esc(u.nseg)} · ${fd(TODAY_ISO)}</div>
   <table style="margin-top:14px"><thead><tr><th>#</th><th>المرحلة</th><th>الإجراء المتبع</th><th>الجهة المسؤولة</th><th>الوثائق</th><th>المدة</th><th>ملاحظات</th></tr></thead><tbody>
   ${g.stages.map((x,i)=>`<tr><td>${i+1}</td><td><b>${NM_STAGES[i][0]}</b></td><td>${b(x.desc)}</td><td>${b(x.unit)}</td><td>${b(x.docs)}</td><td>${x.days?esc(x.days)+' يوم':'—'}</td><td>${b(x.notes)}</td></tr>`).join('')}</tbody></table>
   <h2>التحديات والعقبات</h2><div>${b(g.challenges)}</div><h2>المقترحات</h2><div>${b(g.proposals)}</div></body></html>`);w.document.close();w.focus();setTimeout(()=>w.print(),300)}

/* ---- سجل الإشعارات الفعلية ---- */
function ntDiff(n){const a=num(n.qtyNotice),b=num(n.qtyDispensed);return a!=null&&b!=null?b-a:null}
function ntOverAlloc(n){const a=num(n.qtyAllocated),b=num(n.qtyNotice);return a!=null&&b!=null&&b>a}
function ntAge(n){return n.date?Math.max(0,days(n.date,n.status==='مكتمل'&&n.doneAt?n.doneAt.slice(0,10):TODAY_ISO)):null}
function ntNext(){const y=TODAY_ISO.slice(0,4);const k=Math.max(0,...S.notices.filter(t=>(t.no||'').startsWith(y+'/')).map(t=>parseInt((t.no||'').split('/').pop())||0))+1;return y+'/'+String(k).padStart(3,'0')}
function ntFiltered(){const u=csUI();const q=norm(u.nq||'');let r=S.notices.slice();
  if(u.nst)r=r.filter(n=>n.status===u.nst);if(u.nsg)r=r.filter(n=>n.segment===u.nsg);if(u.nstg)r=r.filter(n=>String(n.stage)===u.nstg&&n.status!=='مكتمل');
  if(q)r=r.filter(n=>norm([n.no,n.customer,n.fuel,n.depot,n.contractNo,n.region].join(' ')).includes(q));
  return r.sort((a,b)=>(a.status==='مكتمل')-(b.status==='مكتمل')||(b.date||'').localeCompare(a.date||'')||(b.no||'').localeCompare(a.no||''))}
function viewNt(){const u=csUI();const N=S.notices;const run=N.filter(n=>n.status==='جارٍ');
  const byStage=NM_STAGES.map((s,i)=>({l:(i+1)+'. '+s[0],full:s[0],v:run.filter(n=>+n.stage===i+1).length,go:null}));
  const mis=N.filter(n=>{const d=ntDiff(n);return d!=null&&Math.abs(d)>0}).length,over=N.filter(ntOverAlloc).length;
  const done=N.filter(n=>n.status==='مكتمل').map(ntAge).filter(v=>v!=null);
  return `<div class="kpis an-kpis">${anKpi('إشعارات جارية',fn(run.length),`${N.length} إشعار مسجّل`)}${anKpi('مكتملة',fn(N.filter(n=>n.status==='مكتمل').length),done.length?`متوسط الدورة ${(done.reduce((a,b)=>a+b,0)/done.length).toFixed(1)} يوم`:'','ok')}
   ${anKpi('تتجاوز المخصص المعتمد',fn(over),'كمية الإشعار أكبر من المخصص',over?'crit':'')}${anKpi('فرق بين المصروف والإشعار',fn(mis),'تحتاج تحقق ومطابقة',mis?'warn':'')}${anKpi('بانتظار السداد',fn(N.filter(n=>n.status!=='موقوف'&&n.payment!=='تم السداد').length),'لم يكتمل السداد')}</div>
  ${run.length?`<section class="panel" style="margin-bottom:14px"><h3 class="section-title">الإشعارات الجارية حسب المرحلة <small>اضغط للتصفية</small></h3><div class="an-bars">${byStage.map((r,i)=>{const mx=Math.max(1,...byStage.map(x=>x.v));return `<div class="an-row go nt-stage-row" data-stg="${i+1}" role="button" tabindex="0" data-tip="${esc(r.full+': '+r.v)}"><span class="an-lbl">${esc(r.l)}</span><span class="an-track"><span class="an-fill" style="width:${r.v?Math.max(1.5,r.v*100/mx):0}%"></span></span><span class="an-val num">${r.v}</span></div>`}).join('')}</div></section>`:''}
  <div class="toolbar"><div class="grow">${I.search}<input type="search" id="nt-q" value="${esc(u.nq||'')}" placeholder="بحث برقم الإشعار أو الزبون أو المستودع أو رقم العقد…"></div>
   <select id="nt-st"><option value="">كل الحالات</option>${NT_ST.map(s=>`<option ${u.nst===s?'selected':''}>${s}</option>`).join('')}</select>
   <select id="nt-sg"><option value="">كل الفئات</option>${NM_SEG.map(s=>`<option ${u.nsg===s?'selected':''}>${s}</option>`).join('')}</select>
   <select id="nt-stg"><option value="">كل المراحل</option>${NM_STAGES.map((s,i)=>`<option value="${i+1}" ${u.nstg===String(i+1)?'selected':''}>${i+1}. ${s[0]}</option>`).join('')}</select>
   ${S.canWrite?`<button class="btn primary sm" data-act="nt-new">${I.plus}إشعار بيع جديد</button>`:''}<button class="btn sm" data-act="nt-export">${I.down}تصدير</button></div>
  <div id="nt-table"></div>`}
function renderNt(){const el=document.getElementById('nt-table');if(!el)return;const r=ntFiltered();
  el.innerHTML=r.length?`<div class="count-line">${r.length} إشعار</div><div class="tablewrap"><table><thead><tr><th class="nosort">الرقم</th><th class="nosort">التاريخ</th><th class="nosort">الزبون</th><th class="nosort">الفئة</th><th class="nosort">الوقود</th><th class="nosort">كمية الإشعار</th><th class="nosort">المصروف</th><th class="nosort">المرحلة الحالية</th><th class="nosort">السداد</th><th class="nosort">الحالة</th></tr></thead><tbody>
  ${r.map(n=>{const d=ntDiff(n);return `<tr data-nt="${n.id}"><td class="t-strong num">${esc(n.no||'')}</td><td class="n">${fd(n.date)}</td><td>${esc(n.customer||'—')}</td><td>${esc(n.segment||'—')}</td><td>${esc(n.fuel||'—')}</td><td class="n">${fn(num(n.qtyNotice))}${ntOverAlloc(n)?' <span class="tag dup">فوق المخصص</span>':''}</td><td class="n">${fn(num(n.qtyDispensed))}${d?` <span class="tag dup">${d>0?'+':''}${fn(d)}</span>`:''}</td>
   <td><div class="nm-mini" data-tip="${esc((n.stage||1)+'. '+NM_STAGES[(n.stage||1)-1][0])}">${NM_STAGES.map((s,i)=>`<i class="${i+1<(n.stage||1)||n.status==='مكتمل'?'d':i+1===(n.stage||1)?'c':''}"></i>`).join('')}</div><small class="muted">${n.status==='مكتمل'?'اكتملت المراحل':esc(NM_STAGES[(n.stage||1)-1][0])}</small></td>
   <td>${esc(n.payment||'—')}</td><td><span class="pill ${NT_STC[n.status]||'p-neutral'}">${esc(n.status||'')}</span></td></tr>`}).join('')}</tbody></table></div>`
  :`<div class="empty"><b>${S.notices.length?'لا نتائج':'لا توجد إشعارات بيع بعد'}</b>${S.notices.length?'غيّر التصفية أو البحث.':'سجّل إشعار البيع من «إشعار بيع جديد» وتابعه عبر المراحل التسع حتى السداد.'}</div>`}
function ntForm(n){const isNew=!n;n=n||{date:TODAY_ISO,segment:NM_SEG[0],region:NM_REG[0],stage:1,status:'جارٍ',payment:NT_PAY[0],fuel:'ديزل'};
  modal(isNew?'إشعار بيع جديد':'تعديل الإشعار '+(n.no||''),`<fieldset><legend>الزبون والطلب</legend>${F('n-cust','الزبون',n.customer,{req:1,list:'dl-ncust',full:1})}${F('n-seg','الفئة',n.segment,{type:'select',options:NM_SEG})}${F('n-reg','المنطقة',n.region,{type:'select',options:NM_REG})}${F('n-cno','رقم العقد',n.contractNo,{list:'dl-no'})}${F('n-date','تاريخ تقديم الطلب',n.date,{type:'date',req:1})}${F('n-agent','المندوب / المفوض بالاستلام',n.agent)}</fieldset>
   <fieldset><legend>الكميات</legend>${F('n-fuel','نوع الوقود',n.fuel,{list:'dl-fuel'})}${F('n-qr','الكمية المطلوبة',n.qtyRequested,{type:'number'})}${F('n-qa','المخصص المعتمد',n.qtyAllocated,{type:'number'})}${F('n-qn','كمية الإشعار',n.qtyNotice,{type:'number'})}${F('n-qd','الكمية المصروفة فعليًا',n.qtyDispensed,{type:'number'})}${F('n-unit','الوحدة',n.unit||'لتر',{list:'dl-u'})}</fieldset>
   <fieldset><legend>التنفيذ</legend>${F('n-depot','المستودع / نقطة التوزيع',n.depot)}${F('n-ship','موعد الشحن / التعبئة',n.shipDate,{type:'date'})}${F('n-pay','السداد',n.payment,{type:'select',options:NT_PAY})}${isNew?'':F('n-st','الحالة',n.status,{type:'select',options:NT_ST})}${F('n-notes','ملاحظات',n.notes,{type:'textarea',full:1})}</fieldset>
   <fieldset><legend>المرفقات</legend>${ATT.formField('dlg',n.attachments,{name:n.no?'إشعار '+n.no:n.customer})}</fieldset>
   ${dl('dl-ncust',csCustomers().map(e=>e.name))}${dl('dl-no',S.contracts.map(c=>c.no))}${dl('dl-fuel',['ديزل','بنزين','غاز مسال','زيت ثقيل','كيروسين','وقود طائرات','وقود سفن'])}${dl('dl-u',['لتر','طن','متر مكعب'])}`,
  `<button type="submit" class="btn primary" data-act="nt-save" data-id="${n.id||''}">حفظ</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button>${!isNew?`<button type="button" class="btn danger" data-act="del" data-col="notices" data-id="${n.id}" style="margin-inline-start:auto">حذف</button>`:''}<span id="f-err" style="color:var(--crit);font-size:12.5px;margin-inline-start:8px"></span>`)}
async function ntSave(id){const old=id?S.notices.find(x=>x.id===id):null;
  const o={customer:val('n-cust'),segment:val('n-seg'),region:val('n-reg'),contractNo:val('n-cno'),date:val('n-date'),agent:val('n-agent'),fuel:val('n-fuel'),qtyRequested:num(val('n-qr')),qtyAllocated:num(val('n-qa')),qtyNotice:num(val('n-qn')),qtyDispensed:num(val('n-qd')),unit:val('n-unit'),depot:val('n-depot'),shipDate:val('n-ship'),payment:val('n-pay'),notes:val('n-notes')};
  if(!o.customer||!o.date){document.getElementById('f-err').textContent='اسم الزبون وتاريخ الطلب مطلوبان.';return}
  o.attachments=await ATT.val('dlg','f-err');const by=await csMe(),now=new Date().toISOString();
  if(old)Object.assign(o,{no:old.no,stage:old.stage||1,status:val('n-st')||old.status,log:old.log||[],doneAt:old.doneAt||''});else Object.assign(o,{no:ntNext(),stage:1,status:'جارٍ',log:[{ts:now,by,stage:1,note:'تسجيل الطلب'}]});
  const nid=id||uid('n');await write('notices',nid,o,!id);dlg.close();toast(old?'تم حفظ التعديل':'تم تسجيل الإشعار رقم '+o.no);const v0=old&&old.updatedAt;whenReady(()=>{const x=S.notices.find(t=>t.id===nid);return x&&x.updatedAt!==v0},()=>openNotice(nid))}
function openNotice(id){const n=S.notices.find(x=>x.id===id);if(!n)return;const st=n.stage||1;const row=(l,v,full)=>`<div class="${full?'full':''}"><dt>${esc(l)}</dt><dd>${v==null||v===''?'—':v}</dd></div>`;
  const g=nmGet(n.region||NM_REG[0],n.segment||NM_SEG[0]).stages;const d=ntDiff(n);const u=esc(n.unit||'');
  drawer(`<div style="flex:1;min-width:0"><h3>إشعار بيع ${esc(n.no||'')}</h3><div class="sub">${esc(n.customer||'')} · <span class="pill ${NT_STC[n.status]||'p-neutral'}">${esc(n.status||'')}</span>${ntOverAlloc(n)?'<span class="tag dup">فوق المخصص</span>':''}</div></div>
   ${S.canWrite?`<button class="btn sm" data-act="nt-edit" data-id="${n.id}">${I.edit}تعديل</button>`:''}<button class="iconbtn" data-act="close-drawer" aria-label="إغلاق">${I.close}</button>`,
  `<ol class="nm-track">${NM_STAGES.map((s,i)=>{const k=i+1;const cls=n.status==='مكتمل'||k<st?'d':k===st?'c':'';const lg=(n.log||[]).filter(l=>+l.stage===k).pop();return `<li class="${cls}"><span class="num">${k}</span><div><b>${s[0]}</b>${lg?`<small class="muted">${fd(lg.ts)} · ${esc(lg.by||'')}${lg.note?' — '+esc(lg.note):''}</small>`:''}${k===st&&n.status==='جارٍ'&&g[i]&&g[i].unit?`<small class="muted">المسؤول حسب الآلية: ${esc(g[i].unit)}${g[i].days?` · المدة المستهدفة ${esc(g[i].days)} يوم`:''}</small>`:''}</div></li>`}).join('')}</ol>
   ${S.canWrite&&n.status==='جارٍ'?`<div class="panel tk-upd"><h3 class="section-title">المرحلة الحالية: ${st}. ${NM_STAGES[st-1][0]}</h3><div class="toolbar"><div class="grow" style="min-width:180px"><input id="nt-note" type="text" placeholder="ملاحظة على إنجاز المرحلة (اختياري)" style="width:100%;height:36px;border:1px solid var(--line);border-radius:8px;padding-inline:10px;background:var(--surface)"></div>
     <button class="btn primary sm" data-act="nt-adv" data-id="${n.id}">${st<9?'إنجاز المرحلة والانتقال للتالية':'إنجاز آخر مرحلة وإغلاق الإشعار'}</button>${st>1?`<button class="btn sm ghost" data-act="nt-back" data-id="${n.id}">رجوع مرحلة</button>`:''}<button class="btn sm ghost" data-act="nt-hold" data-id="${n.id}">إيقاف</button></div></div>`:''}
   ${S.canWrite&&n.status==='موقوف'?`<div><button class="btn sm" data-act="nt-resume" data-id="${n.id}">استئناف الإشعار</button></div>`:''}
   <div><h3 class="section-title">بيانات الإشعار</h3><dl class="dl">${row('الزبون',esc(n.customer),true)}${row('الفئة',esc(n.segment))}${row('المنطقة',esc(n.region))}${row('رقم العقد',esc(n.contractNo))}${row('المندوب / المفوض',esc(n.agent))}${row('تاريخ الطلب',fd(n.date))}${row('عمر الإشعار',(ntAge(n)??'—')+' يوم')}
    ${row('نوع الوقود',esc(n.fuel))}${row('الكمية المطلوبة',n.qtyRequested!=null?fn(n.qtyRequested)+' '+u:'')}${row('المخصص المعتمد',n.qtyAllocated!=null?fn(n.qtyAllocated)+' '+u:'')}${row('كمية الإشعار',n.qtyNotice!=null?fn(n.qtyNotice)+' '+u:'')}${row('المصروف فعليًا',n.qtyDispensed!=null?fn(n.qtyDispensed)+' '+u+(d?` <span class="tag dup">فرق ${d>0?'+':''}${fn(d)}</span>`:''):'')}
    ${row('المستودع / نقطة التوزيع',esc(n.depot))}${row('موعد الشحن',n.shipDate?fd(n.shipDate):'')}${row('السداد',esc(n.payment))}${row('ملاحظات',esc(n.notes).replace(/\n/g,'<br>'),true)}</dl></div>
   ${attBox('notices',n,'إشعار '+(n.no||''))}`)}
async function ntMove(id,dir,status){const n=S.notices.find(x=>x.id===id);if(!n)return;const by=await csMe(),now=new Date().toISOString();const note=val('nt-note');let st=n.stage||1;const o=stripId(n);o.log=(n.log||[]).slice();
  if(status){o.status=status;o.log.push({ts:now,by,stage:st,note:status==='موقوف'?'إيقاف الإشعار'+(note?': '+note:''):'استئناف الإشعار'})}
  else if(dir>0){o.log.push({ts:now,by,stage:st,note:note||'أُنجزت المرحلة'});if(st>=9){o.status='مكتمل';o.doneAt=now}else o.stage=st+1}
  else{o.stage=Math.max(1,st-1);o.log.push({ts:now,by,stage:o.stage,note:'إرجاع إلى هذه المرحلة'+(note?': '+note:'')})}
  await write('notices',id,o,false);toast(o.status==='مكتمل'?'اكتملت مراحل الإشعار':'تم التحديث');const n0=(n.log||[]).length;whenReady(()=>{const x=S.notices.find(y=>y.id===id);return x&&(x.log||[]).length>n0},()=>openNotice(id))}
function ntExport(){saveXlsx([['إشعارات البيع',ntFiltered().map(n=>({'الرقم':n.no||'','التاريخ':n.date||'','الزبون':n.customer||'','الفئة':n.segment||'','المنطقة':n.region||'','رقم العقد':n.contractNo||'','المندوب':n.agent||'','الوقود':n.fuel||'','الوحدة':n.unit||'','الكمية المطلوبة':n.qtyRequested??'','المخصص':n.qtyAllocated??'','كمية الإشعار':n.qtyNotice??'','المصروف':n.qtyDispensed??'','الفرق':ntDiff(n)??'','المستودع':n.depot||'','المرحلة':n.status==='مكتمل'?'مكتمل':(n.stage||1)+'. '+NM_STAGES[(n.stage||1)-1][0],'السداد':n.payment||'','الحالة':n.status||'','عمر الإشعار (يوم)':ntAge(n)??''}))]],'إشعارات-البيع-'+TODAY_ISO+'.xlsx')}
function nmAfter(){const u=csUI();
  if(u.tab==='nm'){const r=document.getElementById('nm-reg');if(r)r.addEventListener('change',e=>{u.nreg=e.target.value;render()});return}
  renderNt();const q=document.getElementById('nt-q');q.addEventListener('input',debounce(()=>{u.nq=q.value;renderNt()},150));
  [['nt-st','nst'],['nt-sg','nsg'],['nt-stg','nstg']].forEach(([id,k])=>document.getElementById(id).addEventListener('change',e=>{u[k]=e.target.value;renderNt()}))}
document.addEventListener('click',async e=>{
  const sg=e.target.closest('[data-nm-seg]');if(sg){nmUI().nseg=sg.dataset.nmSeg;render();return}
  const gm=e.target.closest('[data-nm-go]');if(gm){const [r,s]=gm.dataset.nmGo.split('|');Object.assign(nmUI(),{nreg:r,nseg:s});render();window.scrollTo(0,0);return}
  const nr=e.target.closest('tr[data-nt]');if(nr){openNotice(nr.dataset.nt);return}
  const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act,id=a.dataset.id;
  if(act==='nm-edit'){nmEdit(+a.dataset.i);return}if(act==='nm-cp'){nmCp(a.dataset.k);return}if(act==='nm-export'){nmExport();return}if(act==='nm-print'){nmPrint();return}
  if(act==='nt-new'){if(dlg.open)dlg.close();ntForm();return}if(act==='nt-edit'){ntForm(S.notices.find(x=>x.id===id));return}if(act==='nt-export'){ntExport();return}
  if(['nm-save','nm-cp-save','nt-save'].includes(act)){e.preventDefault();if(!S.canWrite)return;a.disabled=true;const u=nmUI();
    try{if(act==='nm-save'){const i=+a.dataset.i;const x={desc:val('nm-desc'),unit:val('nm-unit'),days:val('nm-days'),docs:val('nm-docs'),notes:val('nm-notes')};if(!x.desc){document.getElementById('f-err').textContent='اكتب الإجراء المتّبع في هذه المرحلة.';return}
        const st=nmGet(u.nreg,u.nseg).stages;st[i]=x;await nmSave(u.nreg,u.nseg,{stages:st});dlg.close();toast('تم حفظ المرحلة '+(i+1));render()}
      else if(act==='nm-cp-save'){await nmSave(u.nreg,u.nseg,{[a.dataset.k]:val('nm-cp')});dlg.close();toast('تم الحفظ');render()}
      else await ntSave(id||null)}catch(err){const fe=document.getElementById('f-err');if(fe)fe.textContent=writeErr(err)}finally{a.disabled=false}return}
  if(['nt-adv','nt-back','nt-hold','nt-resume'].includes(act)){a.disabled=true;try{await ntMove(id,act==='nt-adv'?1:-1,act==='nt-hold'?'موقوف':act==='nt-resume'?'جارٍ':null)}catch(err){toast(writeErr(err))}finally{a.disabled=false}}});
document.addEventListener('click',e=>{const r=e.target.closest('.nt-stage-row');if(r){csUI().nstg=r.dataset.stg;const f=document.getElementById('nt-stg');if(f)f.value=r.dataset.stg;renderNt()}});
if(window.I18N&&I18N.add){I18N.add({
 'آلية إشعارات البيع':'Sales notice mechanism','طلب إفادة تفصيلية بآلية ومراحل إصدار إشعارات البيع وتزويد الوقود':'Request for a detailed account of the mechanism and stages for issuing sales notices and fuel supply','إشاري {0} بتاريخ {1}/{2}/{3}':'Ref. {0} dated {1}/{2}/{3}','من مدير عام المبيعات والشؤون التجارية إلى مديري إدارة المبيعات بالمناطق.':'From the General Manager of Sales & Commercial Affairs to the regional sales managers.','إشعارات البيع':'Sales notices','مرجع البند:':'Reference:','مراسلة داخلية':'Internal memo','إشاري':'Ref.','بتاريخ':'dated',
 'من مدير عام المبيعات والشؤون التجارية إلى مديري إدارة المبيعات بالمناطق، بشأن «طلب إفادة تفصيلية بآلية ومراحل إصدار إشعارات البيع وتزويد الوقود».':'from the General Manager of Sales & Commercial Affairs to the regional sales managers, requesting a detailed account of the stages for issuing sales notices and fuel supply.',
 'اكتمال التوثيق في كل المناطق والفئات':'Documentation progress across all regions and segments','المنطقة':'Region','المنطقتان الغربية والجنوبية':'Western & Southern regions','المنطقتان الوسطى والشرقية':'Central & Eastern regions',
 'القطاع العام':'Public sector','المستهلكون':'Consumers','شركات التوزيع':'Distribution companies','الطيران':'Aviation','السفن':'Ships',
 'وُثّقت {0} من {1} مراحل':'{0} of {1} stages documented','آخر تحديث {0}/{1}/{2}':'Last updated {0}/{1}/{2}','تصدير الإفادة Excel':'Export reply to Excel','طباعة':'Print',
 'استقبال طلب الزبون':'Receiving the customer request','التدقيق والتحقق من البيانات':'Checking and verifying data','إنشاء الإشعار وتوثيقه':'Creating and documenting the notice','ترتيبات الشحن والتعبئة':'Shipping and loading arrangements','استلام الزبون وإغلاق الطلب':'Customer receipt and closing the request','مطابقة الكميات مع المخصصات':'Matching quantities with allocations','التنسيق مع المستودعات ونقاط التوزيع':'Coordination with depots and distribution points','التحقق من الكميات المصروفة':'Verifying dispensed quantities','الإجراءات المالية والسداد':'Financial procedures and payment',
 'آلية استقبال الطلب من الزبون، والشروط والوثائق المطلوبة لقبوله.':'How the customer request is received, and the conditions and documents required to accept it.','إجراءات التدقيق والتحقق من صحة بيانات الزبائن والمندوبين والمفوضين باستلام الوقود.':'Procedures to check and verify the data of customers, delegates and persons authorized to receive fuel.','خطوات إنشاء الإشعار وتوثيقه، وآلية التنسيق بين الوحدات المختصة.':'Steps to create and document the notice, and coordination between the units concerned.','ترتيبات شحن وتعبئة الوقود والجدولة الزمنية.':'Fuel shipping and loading arrangements and scheduling.','إجراءات استلام الزبون للطلب، والوثائق النهائية لإغلاق الطلب والاستلام.':'Customer receipt procedures, and the final documents to close the request.','مدى مطابقة الكميات المطلوبة مع المخصصات المعتمدة قبل إصدار الإشعارات.':'How requested quantities are matched with approved allocations before notices are issued.','آلية التنسيق بين الجهة المصدرة للإشعار والمستودعات ونقاط التوزيع.':'Coordination between the issuing body and the depots and distribution points.','آلية التحقق من الكميات المصروفة فعليًا ومطابقتها مع الكميات الواردة بإشعار البيع.':'How quantities actually dispensed are verified against the sales notice.','الإجراءات المالية الخاصة بالطلب، وإصدار إذن الدفع (السداد) ومتى يتم.':'Financial procedures for the request, and when the payment authorization is issued.',
 'موثّقة':'Documented','بانتظار التوثيق':'Pending','توثيق المرحلة':'Document stage','تعديل':'Edit','الإجراء المتّبع':'Procedure','الجهة / الوحدة المسؤولة':'Responsible unit','المدة المستهدفة':'Target time','{0} يوم عمل':'{0} working days','الوثائق والمستندات':'Documents','ملاحظات وعقبات المرحلة':'Stage notes & obstacles',
 'التحديات والعقبات المسببة للتأخير':'Challenges and obstacles causing delay','مقترحات تسريع الإجراءات وتحسين الخدمة':'Proposals to speed up procedures and improve service','لم تُسجَّل بعد. اذكر أي تحديات أو عقبات تتسبب في تأخير الدورة لهذه الفئة.':'Not recorded yet. List any challenges or obstacles that delay the cycle for this segment.','لم تُسجَّل بعد. أضف المقترحات التي من شأنها تسريع الإجراءات وتحسين جودة الخدمة.':'Not recorded yet. Add proposals that would speed up procedures and improve service quality.',
 'مصفوفة الاكتمال':'Completion matrix','كل المناطق والفئات · اضغط على خانة للانتقال إليها':'all regions and segments · click a row to open it','الفئة':'Segment','المجموع':'Total',
 'المرحلة {0}':'Stage {0}','توثيق المرحلة':'Document stage','الإجراء المتّبع (الخطوات بالتسلسل)':'Procedure (steps in order)','المدة المستهدفة (أيام عمل)':'Target time (working days)','الوثائق والمستندات المطلوبة':'Required documents','ملاحظات وعقبات في هذه المرحلة':'Notes and obstacles at this stage','اكتب الإجراء المتّبع في هذه المرحلة.':'Write the procedure for this stage.','تم حفظ المرحلة {0}':'Stage {0} saved','تم الحفظ':'Saved',
 'التحديات والعقبات':'Challenges and obstacles','المقترحات':'Proposals','التحديات أو العقبات التي تتسبب في تأخير الدورة':'Challenges or obstacles that delay the cycle','المقترحات لتسريع الإجراءات وتحسين جودة الخدمة':'Proposals to speed up procedures and improve service quality',
 'إشعارات جارية':'Notices in progress','{0} إشعار مسجّل':'{0} notices recorded','مكتملة':'Completed','متوسط الدورة {0} يوم':'Average cycle {0} days','تتجاوز المخصص المعتمد':'Above approved allocation','كمية الإشعار أكبر من المخصص':'Notice quantity exceeds allocation','فرق بين المصروف والإشعار':'Dispensed ≠ notice','تحتاج تحقق ومطابقة':'Need verification','بانتظار السداد':'Awaiting payment','لم يكتمل السداد':'Payment not completed',
 'الإشعارات الجارية حسب المرحلة':'Notices in progress by stage','{0} إشعار':'{0} notices','بحث برقم الإشعار أو الزبون أو المستودع أو رقم العقد…':'Search by notice no., customer, depot or contract no.…','كل الحالات':'All statuses','كل الفئات':'All segments','كل المراحل':'All stages','إشعار بيع جديد':'New sales notice','تصدير':'Export',
 'الوقود':'Fuel','كمية الإشعار':'Notice quantity','المصروف':'Dispensed','المرحلة الحالية':'Current stage','السداد':'Payment','فوق المخصص':'Above allocation','اكتملت المراحل':'All stages done',
 'لا توجد إشعارات بيع بعد':'No sales notices yet','سجّل إشعار البيع من «إشعار بيع جديد» وتابعه عبر المراحل التسع حتى السداد.':'Record a notice with "New sales notice" and follow it through the nine stages until payment.',
 'جارٍ':'In progress','مكتمل':'Completed','موقوف':'On hold','لم يُصدر إذن الدفع':'Payment authorization not issued','صدر إذن الدفع':'Payment authorization issued','تم السداد':'Paid',
 'الزبون والطلب':'Customer and request','الزبون':'Customer','تاريخ تقديم الطلب':'Request date','المندوب / المفوض بالاستلام':'Delegate / authorized receiver','الكميات':'Quantities','نوع الوقود':'Fuel type','الكمية المطلوبة':'Requested quantity','المخصص المعتمد':'Approved allocation','الكمية المصروفة فعليًا':'Quantity actually dispensed','الوحدة':'Unit','التنفيذ':'Execution','المستودع / نقطة التوزيع':'Depot / distribution point','موعد الشحن / التعبئة':'Shipping / loading date','اسم الزبون وتاريخ الطلب مطلوبان.':'Customer and request date are required.',
 'إشعار بيع {0}/{1}':'Sales notice {0}/{1}','تعديل الإشعار {0}/{1}':'Edit notice {0}/{1}','تم تسجيل الإشعار رقم {0}/{1}':'Notice {0}/{1} recorded','المسؤول حسب الآلية':'Responsible per mechanism','المرحلة الحالية':'Current stage','ملاحظة على إنجاز المرحلة (اختياري)':'Note on completing the stage (optional)','إنجاز المرحلة والانتقال للتالية':'Complete stage and move on','إنجاز آخر مرحلة وإغلاق الإشعار':'Complete last stage and close','رجوع مرحلة':'Back one stage','إيقاف':'Hold','استئناف الإشعار':'Resume notice',
 'بيانات الإشعار':'Notice details','المندوب / المفوض':'Delegate / authorized','تاريخ الطلب':'Request date','عمر الإشعار':'Notice age','المصروف فعليًا':'Dispensed','موعد الشحن':'Shipping date','اكتملت مراحل الإشعار':'Notice completed','تم التحديث':'Updated','تسجيل الطلب':'Request recorded','أُنجزت المرحلة':'Stage completed','ديزل':'Diesel','لتر':'liters','طن':'tons'});
 I18N.rule(/^المرحلة الحالية: (\d)\. (.+)$/,m=>'Current stage: '+m[1]+'. '+(I18N.tr(m[2])||m[2]).trim());I18N.rule(/^(\d)\. (.+)$/,m=>{const x=I18N.tr(m[2]);return x==null?null:m[1]+'. '+x.trim()});I18N.rule(/^المرحلة (\d+): (.+)$/,m=>'Stage '+m[1]+': '+(I18N.tr(m[2])||m[2]).trim());
 I18N.rule(/^فرق (.+)$/,m=>'Diff '+m[1]);}
