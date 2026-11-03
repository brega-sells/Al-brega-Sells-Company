/* Contracts list and drawer, needs (ministry statements), batches, directory.
   Classic script: shares the global scope with the other app files; load order is set in index.html. */
"use strict";
/* ============ Contracts view ============ */
function cUI(){return S.ui.c||(S.ui.c={q:'',st:'all',type:'',dept:'',sort:'no',dir:'asc'})}
function filteredContracts(){
  const u=cUI();const q=norm(u.q);const qn=normNo(u.q);
  let rows=S.contracts.map(c=>({c,d:D.get(c.id)}));
  if(q)rows=rows.filter(({c})=>{const hay=norm([c.no,c.company,c.location,c.type,c.subject,c.qty,c.dept,c.officer,c.notes,c.party&&c.party.rep,c.party&&c.party.cr].join(' '));return hay.includes(q)||normNo(c.no).includes(qn)});
  if(u.st&&u.st!=='all'){rows=rows.filter(({d})=>u.st==='active'?(d.status==='ساري'||d.status==='قريب الانتهاء'):u.st==='a30'?(d.alert==='عاجل'):u.st==='a90'?!!d.alert:u.st==='منتهٍ'?(d.status==='منتهٍ'||d.status==='منتهٍ قبل موعده'):d.status===u.st)}
  if(u.type)rows=rows.filter(({c})=>c.type===u.type);
  if(u.dept)rows=rows.filter(({c})=>(c.dept||'')===u.dept);
  if(u.loc)rows=rows.filter(({c})=>cleanRegion(c.location)===u.loc);
  const key={no:x=>parseInt((x.c.no||'').replace(/\D/g,''))||0,company:x=>x.c.company||'',location:x=>x.c.location||'',type:x=>x.c.type||'',sign:x=>x.c.signDate||'',start:x=>x.c.startDate||'',end:x=>x.d.effEnd||'',remain:x=>x.d.remain==null?1e9:x.d.remain,status:x=>x.d.status,value:x=>x.c.value||0,qty:x=>num(String(x.c.qty||'').replace(/[^\d.]/g,''))||0}[u.sort]||(x=>0);
  rows.sort((a,b)=>{const A=key(a),B=key(b);const r=typeof A==='number'?A-B:String(A).localeCompare(String(B),'ar');return u.dir==='asc'?r:-r});
  return rows;
}
function viewContracts(){
  const u=cUI();const all=S.contracts.map(c=>D.get(c.id));
  const c=s=>all.filter(d=>d.status===s).length;
  const chips=[['all','الكل',all.length],['active','سارية',all.filter(d=>d.status==='ساري'||d.status==='قريب الانتهاء').length],['قريب الانتهاء','قريب الانتهاء',c('قريب الانتهاء')],['a30','عاجل',all.filter(d=>d.alert==='عاجل').length],['لم يبدأ بعد','لم يبدأ بعد',c('لم يبدأ بعد')],['منتهٍ','منتهية',c('منتهٍ')+c('منتهٍ قبل موعده')],['معلق','معلقة',c('معلق')]];
  const types=uniq([...S.settings.types,...S.contracts.map(x=>x.type)]);const depts=uniq(S.contracts.map(x=>x.dept));const locs=uniq(S.contracts.map(x=>cleanRegion(x.location)));
  return `<div class="page-head"><div><h2>عقود شركة البريقة لتسويق النفط</h2><p>سجل العقود مع الحالة والمتبقي محسوبين تلقائيًا من تواريخ السريان وآخر تمديد.</p></div>
   <div class="toolbar">${S.canWrite?`<button class="btn primary" data-act="add-contract">${I.plus}عقد جديد</button>`:''}<button class="btn" data-act="export-contracts">${I.down}تصدير Excel</button></div></div>
  <div class="toolbar">
   <div class="grow">${I.search}<input type="search" id="c-q" value="${esc(u.q)}" placeholder="بحث برقم العقد، الشركة، الموقع، الكمية، الملاحظات…"></div>
   <select id="c-type" aria-label="نوع العقد"><option value="">كل الأنواع</option>${types.map(t=>`<option ${u.type===t?'selected':''}>${esc(t)}</option>`).join('')}</select>
   <select id="c-loc" aria-label="الموقع"><option value="">كل المواقع</option>${locs.map(t=>`<option ${u.loc===t?'selected':''}>${esc(t)}</option>`).join('')}</select>
   <select id="c-dept" aria-label="الإدارة"><option value="">كل الإدارات</option>${depts.map(t=>`<option ${u.dept===t?'selected':''}>${esc(t)}</option>`).join('')}</select>
  </div>
  <div class="chips" id="c-chips">${chips.map(([k,l,n])=>`<button class="chip" data-st="${esc(k)}" aria-pressed="${u.st===k}">${esc(l)}<span class="k">${n}</span></button>`).join('')}</div>
  <div id="c-table"></div>`;
}
function renderContractsTable(){
  const u=cUI();const rows=filteredContracts();
  const th=(k,l)=>`<th data-sort="${k}" class="${u.sort===k?u.dir:''}">${l}</th>`;
  const el=document.getElementById('c-table');if(!el)return;
  if(!S.contracts.length){el.innerHTML=`<div class="tablewrap"><div class="empty"><b>لا توجد عقود بعد</b>${S.dbState==='ready'?'أضف أول عقد بزر «عقد جديد» أو استورد ملف Excel من صفحة الإعدادات.':'ستظهر العقود هنا فور تحميلها.'}</div></div>`;return}
  el.innerHTML=`<div class="count-line">${rows.length} من ${S.contracts.length} عقد · إجمالي القيم المسجلة: ${fn(sumBy(rows,x=>x.c.value))} د.ل</div>
  <div class="tablewrap"><table><thead><tr>${th('no','رقم العقد')}${th('company','الشركة المتعاقدة')}${th('location','الموقع')}${th('type','نوع العقد')}${th('qty','الكمية')}${th('sign','التوقيع')}${th('start','بداية السريان')}${th('end','الانتهاء الفعلي')}${th('remain','المتبقي')}${th('status','الحالة')}<th class="nosort">التنبيه</th>${th('value','القيمة')}</tr></thead><tbody>
  ${rows.map(({c,d})=>`<tr data-open-c="${c.id}"><td class="t-strong">${esc(c.no)} ${DUP.has(c.id)?'<span class="tag dup">مكرر</span>':''}</td><td>${esc(c.company)}${MATCH.byContract.has(c.id)?' <span class="tag link" title="مدرجة في كشوفات وزارة الصناعة">بالكشف</span>':''}</td><td>${esc(c.location||'—')}</td><td>${esc(c.type||'—')}</td><td class="num">${esc(c.qty||'—')}</td><td class="n">${fd(c.signDate)}</td><td class="n">${fd(c.startDate)}</td><td class="n">${fd(d.effEnd)}${d.exts?` <span class="tag">+${d.exts}</span>`:''}</td><td class="n">${d.remain==null?'—':d.remain+' يوم'}</td><td>${statusPill(d.status)}</td><td>${alertPill(d.alert)}</td><td class="n">${c.value?fn(c.value):'—'}</td></tr>`).join('')}
  </tbody></table>${rows.length?'':'<div class="empty"><b>لا نتائج مطابقة</b>جرّب كلمة بحث أخرى أو أزل عوامل التصفية.</div>'}</div>`;
}
afterRender.contracts=()=>{
  renderContractsTable();const u=cUI();
  const q=document.getElementById('c-q');q.addEventListener('input',debounce(()=>{u.q=q.value;renderContractsTable()},120));
  ['type','dept','loc'].forEach(k=>document.getElementById('c-'+k).addEventListener('change',e=>{u[k]=e.target.value;renderContractsTable()}));
  document.getElementById('c-chips').addEventListener('click',e=>{const b=e.target.closest('[data-st]');if(!b)return;u.st=b.dataset.st;document.querySelectorAll('#c-chips .chip').forEach(x=>x.setAttribute('aria-pressed',x===b));renderContractsTable()});
  document.getElementById('c-table').addEventListener('click',e=>{const t=e.target.closest('th[data-sort]');if(!t)return;const k=t.dataset.sort;if(u.sort===k)u.dir=u.dir==='asc'?'desc':'asc';else{u.sort=k;u.dir='asc'}renderContractsTable()});
};

/* ============ Contract drawer ============ */
const ARTICLES={diesel:[],lpg:[]};
function openContract(id){
  const c=S.contracts.find(x=>x.id===id);if(!c)return;const d=derive(c);const p=c.party||{};
  const ex=extsFor(c),le=lettersFor(c),mn=MATCH.byContract.get(c.id)||[];
  const kind=/غاز/.test(c.type||'')?'lpg':'diesel';const arts=ARTICLES[kind]||[];
  const row=(l,v,full)=>`<div class="${full?'full':''}"><dt>${esc(l)}</dt><dd>${v==null||v===''?'—':v}</dd></div>`;
  drawer(`<div style="flex:1;min-width:0"><h3>${esc(c.company)}</h3><div class="sub"><b>${esc(c.no)}</b> · ${esc(c.type||'')} ${statusPill(d.status)} ${alertPill(d.alert)} ${DUP.has(c.id)?'<span class="tag dup">رقم مكرر</span>':''}</div></div>
   ${S.canWrite?`<button class="btn sm" data-act="edit-contract" data-id="${c.id}">${I.edit}تعديل</button>`:''}<button class="iconbtn" data-act="close-drawer" aria-label="إغلاق">${I.close}</button>`,
  `${d.progress!=null?`<div><div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--muted);margin-bottom:5px"><span>بداية ${fd(c.startDate)}</span><span>${d.remain!=null?(d.remain>=0?`متبقٍ ${d.remain} يوم`:`انتهى منذ ${-d.remain} يوم`):''}</span><span>نهاية ${fd(d.effEnd)}</span></div><div class="progress"><i style="width:${d.progress*100}%;${d.alert==='عاجل'?'background:var(--crit)':''}"></i></div></div>`:''}
   <div><h3 class="section-title">بيانات العقد</h3><dl class="dl">
    ${row('رقم العقد',esc(c.no))}${row('نوع العقد',esc(c.type))}
    ${row('موضوع العقد',esc(c.subject),true)}
    ${row('الموقع',esc(c.location))}${row('الكميات المتعاقد عليها',esc(c.qty))}
    ${row('تاريخ التوقيع',fd(c.signDate))}${row('بداية السريان',fd(c.startDate))}
    ${row('الانتهاء الأصلي',fd(c.endDate))}${row('الانتهاء الفعلي (بعد التمديد)',fd(d.effEnd))}
    ${row('المدة الأصلية',d.dur!=null?d.dur+' شهر':'')}${row('عدد التمديدات',d.exts)}
    ${row('القيمة',c.value?fn(c.value)+' '+esc(c.currency||''):'')}${row('الإدارة المختصة',esc(c.dept))}
    ${row('مسؤول المتابعة',esc(c.officer))}${row('حالة خاصة',esc(c.special))}
    ${row('ملاحظات وإجراءات',esc(c.notes),true)}
   </dl></div>
   <div><h3 class="section-title">الطرف الثاني (المتعاقد)</h3><dl class="dl">
    ${row('الاسم',esc(c.company),true)}
    ${p.legalRep?row('الممثل القانوني / صاحب الترخيص',esc(p.legalRep),true):''}
    ${row('المخول بالتوقيع',esc(p.rep))}${row('الصفة',esc(p.repTitle))}
    ${row('رقم السجل التجاري',esc(p.cr)+(p.crOffice?`<div class="muted" style="font-size:12px;font-weight:400">${esc(p.crOffice)}</div>`:''))}${row('الهاتف',esc(p.phone))}
    ${row('العنوان',esc(p.address),true)}
    ${row('سند التفويض / الهوية',esc(p.auth),true)}
    ${row('الغرض من الاستعمال',esc(p.purpose),true)}
    ${row('الكمية كما وردت بالعقد',esc(p.qtyText),true)}
    ${row('أساس تحديد الكمية',esc(p.basis),true)}
    ${row('ممثل الطرف الأول',esc(p.firstRep),true)}
   </dl></div>
   ${c.docInfo?`<div><h3 class="section-title">من نسخة العقد الموقعة</h3><dl class="dl">
    ${row('يوم ومكان التوقيع',esc([c.docInfo.signingText,c.docInfo.signingCity].filter(Boolean).join(' — ')),true)}
    ${row('تاريخ الغلاف',fd(c.docInfo.coverDate))}${row('عدد المواد / النسخ',esc([c.docInfo.articles,c.docInfo.copies].map(x=>x??'—').join(' مادة / ')+' نسخ'))}
    ${row('مدة العقد كما وردت',esc(c.docInfo.durationText),true)}
    ${row('طريقة الدفع',esc(c.docInfo.payment),true)}
    ${row('سند تفويض الطرف الأول',esc(c.docInfo.firstAuth),true)}
    ${c.docInfo.uncertain?row('ملاحظات التدقيق',`<span style="color:var(--warn)">${esc(c.docInfo.uncertain)}</span>`,true):''}
   </dl></div>`:''}
   ${mn.length?`<div><h3 class="section-title">في كشوفات وزارة الصناعة والمعادن <small>مطابقة تلقائية بالاسم</small></h3><div class="timeline">${mn.map(n=>`<div class="tl" data-open-n="${n.id}" style="cursor:pointer"><span class="d">${esc(batchName(n.batch))}</span><span style="flex:1">${esc(n.company)}<br><span class="muted" style="font-size:12.5px">ديزل مولدات ${fn(n.dieselGen)} · تشغيلية ${fn(n.dieselOp)} لتر${n.gas?` · غاز ${fn(n.gas)} طن`:''}${n.heavyOil?` · زيت ثقيل ${fn(n.heavyOil)}`:''}</span></span></div>`).join('')}</div></div>`:''}
   <div><h3 class="section-title">سجل التمديدات <small>${ex.length}</small>${S.canWrite?`<button class="btn sm ghost" data-act="add-ext" data-no="${esc(c.no)}" style="margin-inline-start:auto">${I.plus}تمديد</button>`:''}</h3>
    ${ex.length?`<div class="timeline">${ex.map(e=>`<div class="tl"><span class="d">${fd(e.newEnd)}</span><span style="flex:1">قرار بتاريخ ${fd(e.decisionDate)}${e.note?' — '+esc(e.note):''}${ATT.view(e.attachments,{compact:1})}</span>${S.canWrite?`<button class="iconbtn" data-act="edit-ext" data-id="${e.id}" aria-label="تعديل">${I.edit}</button>`:''}</div>`).join('')}</div>`:'<div class="muted">لا توجد تمديدات مسجلة.</div>'}</div>
   <div><h3 class="section-title">المراسلات <small>${le.length}</small>${S.canWrite?`<button class="btn sm ghost" data-act="add-letter" data-no="${esc(c.no)}" style="margin-inline-start:auto">${I.plus}مراسلة</button>`:''}</h3>
    ${le.length?`<div class="timeline">${le.map(e=>`<div class="tl"><span class="d">${fd(e.date)}</span><span style="flex:1"><b>${esc(e.ref||'')}</b> ${esc(e.note||'')}${ATT.view(e.attachments,{compact:1})}</span>${S.canWrite?`<button class="iconbtn" data-act="edit-letter" data-id="${e.id}" aria-label="تعديل">${I.edit}</button>`:''}</div>`).join('')}</div>`:'<div class="muted">لا توجد مراسلات مسجلة.</div>'}</div>
   <div><h3 class="section-title">ملف العقد والمرفقات</h3>
    ${c.pdfAssetId?`<a class="btn" href="${esc(c.pdfUrl||('/_blob/'+c.pdfAssetId))}" target="_blank" rel="noopener">${I.file}${esc(c.pdfName||'فتح ملف العقد')}</a>`:c.pdfPath?`<div class="muted">${esc(c.pdfPath)}</div>`:''}
    ${ATT.field('contracts:'+c.id,c.attachments,{readonly:!S.canWrite,empty:1,name:'عقد '+(c.no||''),onChange:list=>{const cur=S.contracts.find(x=>x.id===c.id)||c;return write('contracts',c.id,Object.assign(stripId(cur),{attachments:list}),false)}})}
   </div>
   ${arts.length?`<div><h3 class="section-title">البنود النموذجية لعقد ${kind==='lpg'?'بيع الغاز المسال':'بيع منتج الديزل'}</h3><div class="articles">${arts.map(a=>`<details><summary>المادة (${a.n}) — ${esc(a.title)}</summary><p>${esc(a.summary)}</p></details>`).join('')}</div></div>`:''}
   <div class="muted" style="font-size:12px">آخر تحديث: ${c.updatedAt?new Date(c.updatedAt).toLocaleString('en-GB'):'—'}</div>`);
}
function drawer(head,body){
  const r=document.getElementById('drawer-root');
  r.innerHTML=`<div class="scrim" data-act="close-drawer"></div><aside class="drawer" role="dialog" aria-modal="true"><div class="drawer-head">${head}</div><div class="drawer-body">${body}</div></aside>`;
  r.querySelector('.drawer-head button:last-child')?.focus();
}
function closeDrawer(){document.getElementById('drawer-root').innerHTML=''}

/* ============ Needs view ============ */
function nUI(){return S.ui.n||(S.ui.n={q:'',batch:'',region:'',fuel:'',link:'',act:'',sort:'batch',dir:'asc'})}
function filteredNeeds(){
  const u=nUI();const q=norm(u.q);let rows=S.needs.slice();
  if(q)rows=rows.filter(n=>norm([n.company,n.tradeName,n.project,n.section,n.activity,n.licensee,n.region,n.capacity,n.notes,batchName(n.batch)].join(' ')).includes(q));
  if(u.batch)rows=rows.filter(n=>n.batch===u.batch);
  if(u.region)rows=rows.filter(n=>cleanRegion(n.region)===u.region);
  if(u.act)rows=rows.filter(n=>(n.activity||'')===u.act);
  if(u.sec)rows=rows.filter(n=>(n.section||'')===u.sec);
  if(u.fuel==='diesel')rows=rows.filter(n=>(n.dieselGen||0)+(n.dieselOp||0)>0);
  if(u.fuel==='proj')rows=rows.filter(n=>n.projQty>0);
  if(u.fuel==='gas')rows=rows.filter(n=>n.gas>0);if(u.fuel==='ho')rows=rows.filter(n=>n.heavyOil>0);if(u.fuel==='ke')rows=rows.filter(n=>n.kerosene>0);
  if(u.link==='yes')rows=rows.filter(n=>MATCH.byNeed.has(n.id));if(u.link==='no')rows=rows.filter(n=>!MATCH.byNeed.has(n.id));
  const bo=id=>{const b=S.batches.find(x=>x.id===id);return b?b.order||0:999};
  const key={batch:n=>bo(n.batch)*10000+(n.seq||0),seq:n=>bo(n.batch)*10000+(n.seq||0),company:n=>n.company||'',activity:n=>n.activity||'',region:n=>n.region||'',dg:n=>n.dieselGen||0,do:n=>n.dieselOp||0,gas:n=>n.gas||0,ho:n=>n.heavyOil||0,ke:n=>n.kerosene||0,pq:n=>n.projQty||0,licensee:n=>n.licensee||''}[u.sort]||(n=>0);
  rows.sort((a,b)=>{const A=key(a),B=key(b);const r=typeof A==='number'?A-B:String(A).localeCompare(String(B),'ar');return u.dir==='asc'?r:-r});
  return rows;
}
function viewNeeds(){
  const u=nUI();const regs=uniq(S.needs.map(n=>cleanRegion(n.region)));const acts=uniq(S.needs.map(n=>n.activity));
  return `<div class="page-head"><div><h2>كشوفات احتياجات المصانع من الوقود</h2><p>المنشآت التي زارتها اللجنة العليا للزيارات الميدانية وحُددت احتياجاتها الفعلية لشهر أكتوبر 2026.</p></div>
   <div class="toolbar">${S.canWrite?`<button class="btn primary" data-act="add-need">${I.plus}منشأة جديدة</button>`:''}<button class="btn" data-act="export-needs">${I.down}تصدير Excel</button></div></div>
  <div class="toolbar">
   <div class="grow">${I.search}<input type="search" id="n-q" value="${esc(u.q)}" placeholder="بحث باسم المصنع، النشاط، صاحب الترخيص، المنطقة…"></div>
   <select id="n-batch" aria-label="الدفعة"><option value="">كل الدفعات</option>${batchesSorted().map(b=>`<option value="${b.id}" ${u.batch===b.id?'selected':''}>${esc(b.name)}</option>`).join('')}</select>
   <select id="n-region" aria-label="المنطقة"><option value="">كل المناطق</option>${regs.map(r=>`<option ${u.region===r?'selected':''}>${esc(r)}</option>`).join('')}</select>
   <select id="n-sec" aria-label="القسم"><option value="">كل الأقسام</option>${uniq(S.needs.map(n=>n.section)).map(r=>`<option ${u.sec===r?'selected':''}>${esc(r)}</option>`).join('')}</select>
   <select id="n-act" aria-label="النشاط"><option value="">كل الأنشطة</option>${acts.map(r=>`<option ${u.act===r?'selected':''}>${esc(r)}</option>`).join('')}</select>
  </div>
  <div class="chips" id="n-chips">
   ${[['','كل أنواع الوقود'],['diesel','ديزل'],['gas','غاز'],['ho','زيت ثقيل'],['ke','كيروسين'],['proj','كميات مشروعات']].map(([k,l])=>`<button class="chip" data-fuel="${k}" aria-pressed="${u.fuel===k}">${l}</button>`).join('')}
   <span style="width:12px"></span>
   ${[['','الكل'],['yes','لها عقد مع البريقة'],['no','بدون عقد']].map(([k,l])=>`<button class="chip" data-link="${k}" aria-pressed="${u.link===k}">${l}</button>`).join('')}
  </div>
  <div id="n-table"></div>`;
}
function renderNeedsTable(){
  const u=nUI();const rows=filteredNeeds();const el=document.getElementById('n-table');if(!el)return;
  const th=(k,l)=>`<th data-sort="${k}" class="${u.sort===k?u.dir:''}">${l}</th>`;
  if(!S.needs.length){el.innerHTML=`<div class="tablewrap"><div class="empty"><b>لا توجد منشآت بعد</b>${S.dbState==='ready'?'أضف منشأة أو استورد كشفًا من صفحة الإعدادات.':'ستظهر الكشوفات هنا فور تحميلها.'}</div></div>`;return}
  el.innerHTML=`<div class="count-line">${rows.length} من ${S.needs.length} منشأة</div>
  <div class="tablewrap"><table><thead><tr>${th('batch','الدفعة / ت')}${th('company','اسم الشركة / المصنع')}${th('activity','النشاط')}${th('licensee','صاحب الترخيص / المفوض')}${th('region','المنطقة')}<th class="nosort">الطاقة الإنتاجية</th><th class="nosort">الكهرباء</th>${th('dg','ديزل مولدات')}${th('do','ديزل تشغيلية')}${th('gas','غاز/طن')}${th('ho','زيت ثقيل')}${th('ke','كيروسين')}${th('pq','كمية مشروعات')}<th class="nosort">ملاحظات</th></tr></thead><tbody>
  ${rows.map(n=>`<tr data-open-n="${n.id}"><td><span class="tag">${esc(batchName(n.batch))}</span> <span class="t-muted num">${n.seq??''}</span>${n.uncertain?' <span class="pill p-warn" title="'+esc(n.uncertain)+'" style="padding:0 6px">تدقيق</span>':''}</td><td class="t-strong">${esc(n.company)}${n.project?`<div class="t-muted" style="font-weight:400;font-size:12px;max-width:320px;overflow:hidden;text-overflow:ellipsis">${esc(n.project)}</div>`:''}${MATCH.byNeed.has(n.id)?` <span class="tag link" title="${esc(MATCH.byNeed.get(n.id).no)}">عقد ${esc((MATCH.byNeed.get(n.id).no||'').replace(/[^\d]/g,''))}</span>`:''}</td><td>${esc(n.activity||'—')}</td><td>${esc(n.licensee||'—')}</td><td>${esc(n.region||'—')}</td><td class="num">${esc(n.capacity||'—')}</td><td>${esc(n.power||'—')}</td><td class="n">${fn(n.dieselGen)}</td><td class="n">${fn(n.dieselOp)}</td><td class="n">${fn(n.gas)}</td><td class="n">${fn(n.heavyOil)}</td><td class="n">${fn(n.kerosene)}</td><td class="n">${fn(n.projQty)}</td><td class="t-muted" style="max-width:220px;overflow:hidden;text-overflow:ellipsis">${esc(n.notes||'')}</td></tr>`).join('')}
  </tbody><tfoot><tr><td colspan="7">الإجمالي (${rows.length})</td><td class="n">${fn(sumBy(rows,n=>n.dieselGen))}</td><td class="n">${fn(sumBy(rows,n=>n.dieselOp))}</td><td class="n">${fn(sumBy(rows,n=>n.gas))}</td><td class="n">${fn(sumBy(rows,n=>n.heavyOil))}</td><td class="n">${fn(sumBy(rows,n=>n.kerosene))}</td><td class="n">${fn(sumBy(rows,n=>n.projQty))}</td><td></td></tr></tfoot></table>${rows.length?'':'<div class="empty"><b>لا نتائج مطابقة</b>غيّر كلمة البحث أو عوامل التصفية.</div>'}</div>`;
}
afterRender.needs=()=>{
  renderNeedsTable();const u=nUI();
  const q=document.getElementById('n-q');q.addEventListener('input',debounce(()=>{u.q=q.value;renderNeedsTable()},120));
  ['batch','region','act','sec'].forEach(k=>document.getElementById('n-'+k).addEventListener('change',e=>{u[k]=e.target.value;renderNeedsTable()}));
  document.getElementById('n-chips').addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;if('fuel'in b.dataset){u.fuel=b.dataset.fuel;document.querySelectorAll('#n-chips [data-fuel]').forEach(x=>x.setAttribute('aria-pressed',x===b))}else{u.link=b.dataset.link;document.querySelectorAll('#n-chips [data-link]').forEach(x=>x.setAttribute('aria-pressed',x===b))}renderNeedsTable()});
  document.getElementById('n-table').addEventListener('click',e=>{const t=e.target.closest('th[data-sort]');if(!t)return;const k=t.dataset.sort;if(u.sort===k)u.dir=u.dir==='asc'?'desc':'asc';else{u.sort=k;u.dir='asc'}renderNeedsTable()});
};
function openNeed(id){
  const n=S.needs.find(x=>x.id===id);if(!n)return;const b=batchOf(n);const m=MATCH.byNeed.get(n.id);
  const row=(l,v,full)=>`<div class="${full?'full':''}"><dt>${esc(l)}</dt><dd>${v==null||v===''?'—':v}</dd></div>`;
  const others=S.needs.filter(x=>x.id!==n.id&&nameMatch(x.company,n.company)>=0.62);
  const extra=n.extra&&typeof n.extra==='object'?Object.entries(n.extra).filter(([k,v])=>v!=null&&v!==''):[];
  drawer(`<div style="flex:1;min-width:0"><h3>${esc(n.company)}</h3><div class="sub"><span class="tag">${esc(b?b.name:'—')}</span> تسلسل ${n.seq??'—'} · ${esc(n.section||'')} ${n.region?'· '+esc(n.region):''}</div></div>
   ${S.canWrite?`<button class="btn sm" data-act="edit-need" data-id="${n.id}">${I.edit}تعديل</button>`:''}<button class="iconbtn" data-act="close-drawer" aria-label="إغلاق">${I.close}</button>`,
  `<div class="fuel-grid">
    <div class="fuel"><div class="l">ديزل مولدات</div><div class="v">${fn(n.dieselGen)}</div><div class="u">لتر/شهر</div></div>
    <div class="fuel"><div class="l">ديزل تشغيلية</div><div class="v">${fn(n.dieselOp)}</div><div class="u">لتر/شهر</div></div>
    <div class="fuel"><div class="l">غاز</div><div class="v">${fn(n.gas)}</div><div class="u">طن</div></div>
    <div class="fuel"><div class="l">زيت ثقيل</div><div class="v">${fn(n.heavyOil)}</div><div class="u">لتر</div></div>
    <div class="fuel"><div class="l">كيروسين</div><div class="v">${fn(n.kerosene)}</div><div class="u">لتر</div></div>
    ${n.projQty!=null?`<div class="fuel"><div class="l">الكمية الشهرية للمشروع</div><div class="v">${fn(n.projQty)}</div><div class="u">لتر</div></div>`:''}
   </div>
   <div><h3 class="section-title">بيانات المنشأة</h3><dl class="dl">
    ${row('اسم الشركة / المصنع',esc(n.company),true)}${n.tradeName?row('الاسم التجاري — الشكل القانوني',esc(n.tradeName),true):''}${n.project?row('اسم المشروع',esc(n.project),true):''}${row('القسم في الكشف',esc(n.section))}${row('نوع النشاط',esc(n.activity))}${row('صاحب الترخيص أو المفوض',esc(n.licensee))}
    ${row('المنطقة',esc(n.region))}${row('الطاقة الإنتاجية',esc(n.capacity))}${row('الطاقة الكهربائية',esc(n.power))}${row('رقم الصفحة في الكشف',n.page??'')}${n.visitDate?row('تاريخ الزيارة',esc(n.visitDate)):''}${n.projQty!=null||n.bregaQty!=null?row('الكمية حسب شركة البريقة',n.bregaQty!=null?fn(n.bregaQty):'لم تُحدد بعد'):''}
    ${row('ملاحظات',esc(n.notes),true)}
    ${extra.map(([k,v])=>row(k,esc(typeof v==='object'?JSON.stringify(v):v))).join('')}
    ${n.uncertain?row('ملاحظة تدقيق',`<span style="color:var(--warn)">${esc(n.uncertain)}</span>`,true):''}
   </dl></div>
   ${b?`<div><h3 class="section-title">الدفعة</h3><dl class="dl">${row('الدفعة',esc(b.name))}${row('الرقم الإشاري',esc(b.ref))}${row('التاريخ',fd(b.date))}${row('عدد المنشآت المعلن',b.count??'')}${row('ملخص',esc(b.summary),true)}</dl></div>`:''}
   <div><h3 class="section-title">العقد مع شركة البريقة</h3>${m?`<div class="tl" data-open-c="${m.id}" style="cursor:pointer"><span class="d">${esc(m.no)}</span><span style="flex:1">${esc(m.company)}<br><span class="muted" style="font-size:12.5px">${esc(m.type||'')} · الكمية ${esc(m.qty||'—')} · ${statusPill(derive(m).status)}</span></span></div>`:'<div class="muted">لم يُعثر على عقد مطابق بالاسم في سجل عقود البريقة.</div>'}</div>
   ${others.length?`<div><h3 class="section-title">ظهور المنشأة في دفعات أخرى</h3><div class="timeline">${others.map(o=>`<div class="tl" data-open-n="${o.id}" style="cursor:pointer"><span class="d">${esc(batchName(o.batch))}</span><span>${esc(o.company)} · ديزل ${fn((o.dieselGen||0)+(o.dieselOp||0))}</span></div>`).join('')}</div></div>`:''}`);
}

/* ============ Batches ============ */
function viewBatches(){
  const bs=batchesSorted();
  return `<div class="page-head"><div><h2>دفعات وزارة الصناعة والمعادن</h2><p>كل دفعة مُحالة بكتاب رسمي إلى وزير الدولة لشؤون رئيس الحكومة ومجلس الوزراء، مع كشف المنشآت المعتمدة.</p></div>
  <div class="toolbar">${S.canWrite?`<button class="btn primary" data-act="add-batch">${I.plus}دفعة جديدة</button>`:''}</div></div>
  ${bs.length?`<div class="batch-cards">${bs.map(b=>{const r=S.needs.filter(n=>n.batch===b.id);const diff=b.count!=null&&b.count!==r.length;return `<div class="bcard" data-batch="${b.id}">
    <h4>${esc(b.name)}</h4>
    <div class="meta">${b.ref?`<span>إشاري: <b class="num">${esc(b.ref)}</b></span>`:''}${b.date?`<span>بتاريخ ${fd(b.date)}</span>`:''}${b.pages?`<span>صفحات الملف: ${esc(b.pages)}</span>`:''}</div>
    <div class="nums"><span><b>${r.length}</b>منشأة مسجلة</span><span><b>${b.count??'—'}</b>العدد المعلن</span><span><b>${fn(sumBy(r,n=>(n.dieselGen||0)+(n.dieselOp||0)))}</b>لتر ديزل</span></div>
    ${diff?`<span class="pill p-warn">فرق بين المسجل والمعلن</span>`:''}
    <div class="muted" style="font-size:12.5px">${esc((b.summary||'').slice(0,180))}</div>
    <div style="display:flex;gap:6px;margin-top:auto"><button class="btn sm" data-act="batch-needs" data-id="${b.id}">عرض المنشآت</button>${S.canWrite?`<button class="btn sm ghost" data-act="edit-batch" data-id="${b.id}">${I.edit}تعديل</button>`:''}</div>
  </div>`}).join('')}</div>`:`<div class="panel empty"><b>لا توجد دفعات</b>أضف دفعة لتنظيم كشوفات المنشآت.</div>`}`;
}
afterRender.batches=()=>{};

/* ============ Directory ============ */
function viewDir(){return `<div class="page-head"><div><h2>دليل الجهات</h2><p>كل شركة أو مصنع ورد في عقود البريقة أو في كشوفات الوزارة، مجمّعًا في سجل واحد.</p></div>
  <div class="toolbar"><button class="btn" data-act="export-dir">${I.down}تصدير Excel</button></div></div>
  <div class="toolbar"><div class="grow">${I.search}<input type="search" id="d-q" value="${esc(S.ui.dq||'')}" placeholder="بحث باسم الجهة أو المنطقة أو المفوض…"></div>
  <select id="d-f"><option value="">الكل</option><option value="both" ${S.ui.df==='both'?'selected':''}>في العقود والكشوفات معًا</option><option value="c" ${S.ui.df==='c'?'selected':''}>عقود فقط</option><option value="n" ${S.ui.df==='n'?'selected':''}>كشوفات فقط</option></select></div>
  <div id="d-table"></div>`}
function buildDir(){
  const ents=[];
  S.contracts.forEach(c=>{const p=c.party||{};ents.push({name:c.company,region:c.location,person:p.rep||'',phone:p.phone||'',contracts:[c],needs:[]})});
  S.companies.forEach(co=>{ents.push({name:co.name,region:co.address||'',person:co.person||'',phone:co.phone||'',email:co.email||'',contracts:[],needs:[],manual:co})});
  S.needs.forEach(n=>{const m=MATCH.byNeed.get(n.id);let e=m?ents.find(x=>x.contracts.includes(m)):null;if(!e)e=ents.find(x=>nameMatch(x.name,n.company)>=0.62);if(e){e.needs.push(n);if(!e.person)e.person=n.licensee||'';if(!e.activity)e.activity=n.activity}else ents.push({name:n.company,region:n.region,person:n.licensee||'',activity:n.activity,contracts:[],needs:[n]})});
  // merge contracts with same name
  const out=[];ents.forEach(e=>{const t=out.find(o=>nameMatch(o.name,e.name)>=0.8);if(t){t.contracts.push(...e.contracts);t.needs.push(...e.needs);t.person=t.person||e.person;t.phone=t.phone||e.phone}else out.push(e)});
  return out.sort((a,b)=>(b.contracts.length+b.needs.length)-(a.contracts.length+a.needs.length)||a.name.localeCompare(b.name,'ar'));
}
function renderDir(){
  const el=document.getElementById('d-table');if(!el)return;let rows=buildDir();const q=norm(S.ui.dq||'');
  if(q)rows=rows.filter(e=>norm([e.name,e.region,e.person,e.activity].join(' ')).includes(q));
  if(S.ui.df==='both')rows=rows.filter(e=>e.contracts.length&&e.needs.length);if(S.ui.df==='c')rows=rows.filter(e=>e.contracts.length&&!e.needs.length);if(S.ui.df==='n')rows=rows.filter(e=>!e.contracts.length&&e.needs.length);
  el.innerHTML=`<div class="count-line">${rows.length} جهة</div><div class="tablewrap"><table><thead><tr><th class="nosort">الجهة</th><th class="nosort">المنطقة / الموقع</th><th class="nosort">النشاط</th><th class="nosort">المفوض / الممثل</th><th class="nosort">الهاتف</th><th class="nosort">العقود</th><th class="nosort">الكشوفات</th><th class="nosort">ديزل معتمد (لتر)</th></tr></thead><tbody>
  ${rows.map(e=>`<tr ${e.contracts[0]?`data-open-c="${e.contracts[0].id}"`:e.needs[0]?`data-open-n="${e.needs[0].id}"`:''}><td class="t-strong">${esc(e.name)}</td><td>${esc(e.region||'—')}</td><td>${esc(e.activity||'—')}</td><td>${esc(e.person||'—')}</td><td class="n">${esc(e.phone||'—')}</td><td>${e.contracts.map(c=>`<span class="tag link">${esc(c.no)}</span>`).join(' ')||'—'}</td><td>${e.needs.map(n=>`<span class="tag">${esc(batchName(n.batch))}</span>`).join(' ')||'—'}</td><td class="n">${e.needs.length?fn(sumBy(e.needs,n=>(n.dieselGen||0)+(n.dieselOp||0))):'—'}</td></tr>`).join('')}
  </tbody></table></div>`;
  S._dirRows=rows;
}
afterRender.dir=()=>{renderDir();const q=document.getElementById('d-q');q.addEventListener('input',debounce(()=>{S.ui.dq=q.value;renderDir()},150));document.getElementById('d-f').addEventListener('change',e=>{S.ui.df=e.target.value;renderDir()})};
