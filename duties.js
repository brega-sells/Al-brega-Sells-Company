/* ===== مركز مهام الإدارات والتكليفات (Department duties centre & assignments) =====
   Loaded after meetings.js. Adds the page `duties` with four tabs:
     guide   – every department's duties, its source document, sub-units and job card
     tasks   – assignments (تكليفات) linked to a duty, tracked from issue to approval
     kpi     – performance indicators per department
     access  – roles and permissions (التخويلات)
   Data:
     window.DUTY_BOOK (duties-data.js)  – duties received after Board decision 160
     Firestore duties/<unitId>          – duties added or corrected by an admin from the UI (override the book)
     Firestore assignments/<id>         – fromUnit, toUnit, subUnit, duty, title, details, priority, start, due,
                                          assignee, status (new|progress|review|done|hold), progress 0-100,
                                          log[{ts,by,name,unit,act,note,progress}], attachments[], createdBy, createdAt, updatedAt, doneAt
   Visibility (enforced in firestore.rules, mirrored here): admin, general administration (gm) and the board member
   see every assignment; any other user sees only assignments issued by or to their own department. */
"use strict";
(function(){
const EN=()=>{if(window.I18N&&I18N.lang)return I18N.lang==='en';try{return localStorage.getItem('cm_lang')==='en'}catch(e){return false}};
const tr=(ar,en)=>EN()&&en?en:ar;
const me=()=>(window.__me&&window.__me())||null;
const FS=()=>window.__fs&&window.__fs();
const isAdmin=()=>(me()||{}).role==='admin';
const canWrite=()=>{const m=me();return !!m&&m.role!=='viewer'};
const nowISO=()=>new Date().toISOString();
const ROLE_L={admin:['مدير النظام','Administrator'],editor:['محرر','Editor'],viewer:['مشاهد','Viewer']};

/* ---------- departments ---------- */
const MAIN=['gm','w','e','ca','gm-fo','gm-rep'];
const SHORT={board:['عضو مجلس الإدارة','Board member'],gm:['الإدارة العامة','General Administration'],e:['المبيعات و.ش','Sales (Central & East)'],w:['المبيعات غ.ج','Sales (West & South)'],
 ca:['الشؤون التجارية والتحصيلات','Commercial Affairs & Collections'],'gm-fo':['مكتب متابعة المبيعات','Sales Follow-up Office'],'gm-rep':['قسم المتابعة والتقارير','Follow-up & Reports Section']};
const uShort=id=>{const s=SHORT[id];return s?tr(s[0],s[1]):((ORG_BY.get(id)||{}).title||id||'—')};
const uTitle=id=>(ORG_BY.get(id)||{}).title||uShort(id);
const deptOf=id=>{if(!id)return '';const p=orgPath(id).map(o=>o.id);const i=p.indexOf('gm');if(i<0)return id;return p[i+1]&&MAIN.includes(p[i+1])?p[i+1]:'gm'};
const typeL=o=>(ORG_TYPES.find(t=>t.k===o.type)||{}).l||'';

/* ---------- duties: book + admin overrides merged into ORG_DUTIES ---------- */
const BASE={};Object.keys(ORG_DUTIES).forEach(k=>BASE[k]=ORG_DUTIES[k]);
const BASE_ORDER=ORG_DUTY_ORDER.slice();
const SRC_KIND={decree:['قرار مجلس الإدارة','Board decision'],job:['بطاقة وصف وظيفي','Job description form'],memo:['مذكرة داخلية','Internal memo'],other:['وثيقة','Document']};
const DECREE_SRC={kind:'decree',title:'قرار مجلس الإدارة رقم ('+ORG_DECREE.no+') لسنة '+ORG_DECREE.year+'م',en:'Board decision No. ('+ORG_DECREE.no+') of '+ORG_DECREE.year,date:ORG_DECREE.date,ref:ORG_DECREE.ref};
const META={};      // unit -> {src, leadEn, items:[{tag,txt,tagEn,txtEn,u}], purpose, job, parent, legacy, admin}
const OVR={};       // unit -> Firestore duties doc
function bookEntries(){const out=[];(window.DUTY_BOOK||[]).forEach(b=>{if(!b||!ORG_BY.get(b.unit))return;out.push(b);
  Object.keys(b.subs||{}).forEach(s=>{if(ORG_BY.get(s))out.push(Object.assign({unit:s,src:b.src,parent:b.unit},b.subs[s]))})});return out}
function fromDoc(id,d){return {unit:id,admin:true,src:Object.assign({kind:'other'},d.src||{}),lead:d.lead||'',leadEn:d.leadEn||'',
  items:(d.items||[]).map(x=>[x.t||'',x.x||'',x.te||'',x.xe||'',x.u?'u':'']).filter(x=>x[1]),by:d.byName||d.by||'',at:d.at||''}}
function rebuild(){
  Object.keys(ORG_DUTIES).forEach(k=>{if(!BASE[k])delete ORG_DUTIES[k]});Object.keys(BASE).forEach(k=>ORG_DUTIES[k]=BASE[k]);
  Object.keys(META).forEach(k=>delete META[k]);
  BASE_ORDER.forEach(id=>META[id]={src:DECREE_SRC,items:BASE[id].items.map(x=>({tag:x[0],txt:x[1]}))});
  const dict={};
  const put=b=>{const items=(b.items||[]).map(x=>({tag:x[0],txt:x[1],tagEn:x[2]||'',txtEn:x[3]||'',u:x[4]==='u'}));if(!items.length)return;
    ORG_DUTIES[b.unit]={lead:b.lead||'',items:items.map(x=>[x.tag,x.txt])};
    META[b.unit]=Object.assign({},{src:b.src||{kind:'other'},leadEn:b.leadEn||'',items,purpose:b.purpose||null,job:b.job||null,parent:b.parent||'',legacy:b.legacy||null,admin:!!b.admin,by:b.by||'',at:b.at||''});
    if(b.lead&&b.leadEn)dict[b.lead]=b.leadEn;items.forEach(x=>{if(x.tagEn)dict[x.tag]=x.tagEn;if(x.txtEn)dict[x.txt]=x.txtEn});
    if(b.src&&b.src.title&&b.src.en)dict[b.src.title]=b.src.en};
  bookEntries().forEach(put);Object.keys(OVR).forEach(id=>{if(ORG_BY.get(id))put(fromDoc(id,OVR[id]))});
  if(window.I18N&&I18N.add)I18N.add(dict);
  const ids=Object.keys(ORG_DUTIES).filter(id=>ORG_BY.get(id));
  const pos=new Map(ORG.map((o,i)=>[o.id,i]));
  const rank=id=>{const d=deptOf(id);return [id==='gm'?-1:MAIN.indexOf(d),orgPath(id).length,pos.get(id)||0]};
  ids.sort((a,b)=>{const A=rank(a),B=rank(b);return A[0]-B[0]||A[1]-B[1]||A[2]-B[2]});
  ORG_DUTY_ORDER.length=0;ids.forEach(id=>ORG_DUTY_ORDER.push(id));
}
rebuild();
const dutiesOf=id=>(META[id]&&META[id].items)||[];
const srcOf=id=>(META[id]||{}).src||null;
const srcLabel=s=>s?(tr(s.title,s.en)||tr(...(SRC_KIND[s.kind]||SRC_KIND.other))):'';

/* records saved under the old numbering (system pages) are shown under the matching duty */
(function(){let recs=S.records||[];
  const fix=r=>{const m=META[r.unit];if(r.dv||!m||!m.legacy||!ORG_TASKS[r.unit])return r;const k=ORG_TASKS[r.unit][Number(r.duty)-1];const n=m.legacy[k];return n?Object.assign({},r,{duty:String(n),dv:2}):r};
  Object.defineProperty(S,'records',{configurable:true,enumerable:true,get(){return recs},set(v){recs=(v||[]).map(fix)}});S.records=recs;
  const w0=write;write=function(col,id,obj){if(col==='records'&&obj&&typeof obj==='object')obj.dv=2;return w0.apply(this,arguments)};})();

/* ---------- live data ---------- */
const DT={list:new Map(),unit:'',loaded:false,err:'',subs:[],roles:null,rulesOk:null,
  ui:{tab:'guide',unit:'',q:'',f:'open',scope:'all',u:'',vw:'list',kq:''}};
S.dt=DT;
const myU=()=>DT.unit;
const seesAll=()=>isAdmin()||myU()==='gm'||myU()==='board';
const canIssue=()=>canWrite()&&targets().length>0;
function targets(){return isAdmin()||myU()==='gm'?MAIN.slice():myU()&&myU()!=='board'?[myU()]:[]}
const issuerSide=a=>canWrite()&&(isAdmin()||myU()==='gm'||myU()===a.fromUnit);
const doerSide=a=>canWrite()&&myU()===a.toUnit;
const visible=a=>seesAll()||a.fromUnit===myU()||a.toUnit===myU();

function apply(qs,tag){
  qs.docChanges().forEach(ch=>{const id=ch.doc.id;if(ch.type==='removed'){const o=DT.list.get(id);if(o){o._t.delete(tag);if(!o._t.size)DT.list.delete(id)}}
    else{const prev=DT.list.get(id);const t=prev?prev._t:new Set();t.add(tag);DT.list.set(id,Object.assign({id,_t:t},ch.doc.data()))}});
  DT.loaded=true;DT.err='';refresh();
}
async function start(){
  await window.appRuntime.use('db');const m=me();if(!m||!FS())return;
  try{const r=await FS().collection('roles').doc(m.email).get();DT.unit=(r.exists&&r.data().unit)||''}catch(e){}
  DT.subs.forEach(u=>u());DT.subs=[];
  DT.subs.push(FS().collection('duties').onSnapshot(qs=>{Object.keys(OVR).forEach(k=>delete OVR[k]);qs.forEach(d=>OVR[d.id]=d.data());rebuild();refresh()},()=>{}));
  const col=FS().collection('assignments');
  const onErr=e=>{console.warn('assignments',e);DT.loaded=true;DT.err=e.code||e.message;if(e.code==='permission-denied')DT.rulesOk=false;refresh()};
  if(seesAll())DT.subs.push(col.onSnapshot(qs=>{DT.rulesOk=true;apply(qs,'all')},onErr));
  else if(DT.unit){DT.subs.push(col.where('fromUnit','==',DT.unit).onSnapshot(qs=>{DT.rulesOk=true;apply(qs,'from')},onErr));
    DT.subs.push(col.where('toUnit','==',DT.unit).onSnapshot(qs=>apply(qs,'to'),onErr))}
  else DT.loaded=true;
  refresh();
  try{if(localStorage.getItem('cm_view')==='duties'&&S.view!=='duties')go('duties')}catch(e){}
}
const refresh=debounce(()=>{renderNav();const ae=document.activeElement,typing=ae&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName);
  if((S.view==='duties'||S.view==='dash')&&!dlg.open&&!typing)keepScroll(render);
  if(DT.open&&document.querySelector('.drawer[data-dt]')&&!dlg.open&&!typing){if(DT.list.has(DT.open))openTask(DT.open,true);else closeDrawer()}},120);
function keepScroll(f){const y=window.scrollY;f();window.scrollTo(0,y)}

/* ---------- derived ---------- */
const STATUS={new:['جديد','New','p-info'],progress:['قيد التنفيذ','In progress','p-warn'],review:['بانتظار الاعتماد','Awaiting approval','p-fl'],done:['منجز ومعتمد','Done & approved','p-ok'],hold:['متوقف','On hold','p-neutral']};
const PRIO={high:['عاجل','Urgent','p-crit'],normal:['عادي','Normal','p-neutral'],low:['منخفض','Low','p-neutral']};
const isOpen=a=>a.status!=='done';
const isLate=a=>isOpen(a)&&a.due&&a.due<TODAY_ISO;
const daysLeft=a=>a.due?days(TODAY_ISO,a.due):null;
const pill=(m,k)=>{const x=m[k]||m.new||Object.values(m)[0];return `<span class="pill ${x[2]}">${esc(tr(x[0],x[1]))}</span>`};
function dueTxt(a){if(!a.due)return '<span class="muted">—</span>';if(!isOpen(a))return `<span class="num">${fd(a.due)}</span>`;const d=daysLeft(a);
  return `<span class="num">${fd(a.due)}</span><small class="dt-due ${d<0?'crit':d<=3?'warn':''}">${d<0?tr(`متأخر ${-d} يوم`,`${-d}d overdue`):d===0?tr('اليوم','today'):tr(`بعد ${d} يوم`,`in ${d}d`)}</small>`}
const dutyRef=a=>{const u=a.dutyUnit||a.toUnit,n=Number(a.duty);const it=dutiesOf(u)[n-1];return it?{u,n,it}:null};
const dutyTag=it=>tr(it.tag,it.tagEn);
const dutyTxt=it=>tr(it.txt,it.txtEn);
function all(){return [...DT.list.values()].filter(visible)}
function stats(list){const open=list.filter(isOpen),late=open.filter(isLate),done=list.filter(a=>a.status==='done');
  const onTime=done.filter(a=>!a.due||(a.doneAt||'').slice(0,10)<=a.due).length;
  const cyc=done.filter(a=>a.doneAt&&a.createdAt).map(a=>Math.max(0,days(a.createdAt.slice(0,10),a.doneAt.slice(0,10))));
  return {n:list.length,open:open.length,late:late.length,done:done.length,review:list.filter(a=>a.status==='review').length,
    prog:list.filter(a=>a.status==='progress').length,neu:list.filter(a=>a.status==='new').length,hold:list.filter(a=>a.status==='hold').length,
    rate:list.length?Math.round(done.length/list.length*100):0,onTime:done.length?Math.round(onTime/done.length*100):null,
    cycle:cyc.length?Math.round(cyc.reduce((s,x)=>s+x,0)/cyc.length):null}}
function unitTree(id){return [id,...orgAll(id).map(o=>o.id)]}
/* units counted under a department card: the general administration counts only its own duties */
const deptUnits=id=>id==='gm'?['gm']:unitTree(id);
function coverage(id){const units=deptUnits(id).filter(u=>dutiesOf(u).length);let tot=0,hit=0;
  units.forEach(u=>{const ds=dutiesOf(u);tot+=ds.length;ds.forEach((_,i)=>{const n=String(i+1);
    if((S.records||[]).some(r=>r.unit===u&&String(r.duty)===n)||all().some(a=>(a.dutyUnit||a.toUnit)===u&&String(a.duty)===n))hit++})});
  return {tot,hit,pct:tot?Math.round(hit/tot*100):0}}
function deptList(id){return all().filter(a=>deptOf(a.toUnit)===id)}

/* ---------- navigation ---------- */
I.duty='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 3v3h6V3"/><path d="m8.5 12 2 2 4-4M8.5 17h7"/></svg>';
const DI={shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z"/><path d="m9 12 2 2 4-4"/></svg>',
 print:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v7H8z"/></svg>',
 send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12 20 4l-6 16-3-7z"/><path d="m11 13 9-9"/></svg>',
 doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
 user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
 board:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="13" rx="1.5"/></svg>',
 list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>'};
if(window.I18N&&I18N.add)I18N.add({'مهام الإدارات':'Department duties'});
const oIdx=VIEWS.findIndex(v=>v.id==='org');
VIEWS.splice(oIdx<0?VIEWS.length:oIdx+1,0,{id:'duties',label:'مهام الإدارات',icon:'duty',group:'مشترك',
  count:()=>{const u=myU();const n=all().filter(a=>isOpen(a)&&(u?a.toUnit===u:true)).length;return n||''}});
const __render=render;
render=function(){
  if(S.view==='duties'){recompute();document.getElementById('view').innerHTML=dbBanner()+viewDuties();after();return}
  __render();
  if(S.view==='dash'){const h=document.querySelector('#view .xd-head');if(h)h.insertAdjacentHTML('beforebegin',dashPanel())}
};
const __vod=viewOrgDuties;
viewOrgDuties=function(el){__vod(el);
  el.querySelectorAll('section.od-sec[id^="od-"]').forEach(sec=>{const id=sec.id.slice(3),m=META[id];if(!m)return;
    const lead=sec.querySelector('.od-lead');
    if(lead&&m.src&&m.src.kind!=='decree')lead.insertAdjacentHTML('beforebegin',`<div class="dt-srcline">${DI.doc}<span>${esc(tr('المصدر','Source'))}: <b>${esc(srcLabel(m.src))}</b></span><button type="button" class="btn sm ghost" data-dt-go="${esc(id)}">${esc(tr('صفحة الإدارة في مركز المهام','Open in duties centre'))}</button></div>`);
    sec.querySelectorAll('.od-list>li').forEach(li=>{const n=Number((li.querySelector('.od-n')||{}).textContent);const it=m.items[n-1];
      if(it&&it.u){const p=li.querySelector('p');if(p)p.insertAdjacentHTML('beforeend',` <span class="pill p-warn" data-tip="${esc(tr('قراءة غير مؤكدة من المستند الممسوح، تحتاج تدقيقًا','Unclear in the scan, please verify'))}">${esc(tr('تدقيق','Verify'))}</span>`)}})})};
const __odp=orgDutiesPanel;
orgDutiesPanel=function(id){const h=__odp(id),s=srcOf(id);if(!h||!s||s.kind==='decree')return h;return h.replace(/<small>قرار مجلس الإدارة[^<]*<\/small>/,`<small>${esc(srcLabel(s))}</small>`)};

/* ---------- page ---------- */
const TABS=[['guide','دليل المهام','Duties guide'],['tasks','التكليفات والمتابعة','Assignments'],['kpi','مؤشرات الأداء','Performance'],['access','التخويلات والصلاحيات','Access & permissions']];
function viewDuties(){
  const u=DT.ui,L=all(),st=stats(L),cov=MAIN.map(coverage),dT=cov.reduce((s,c)=>s+c.tot,0),dH=cov.reduce((s,c)=>s+c.hit,0);
  const withD=unitTree('gm').filter(id=>dutiesOf(id).length).length,units=unitTree('gm').filter(id=>{const o=ORG_BY.get(id);return o&&['dept','coord','office','section','gm'].includes(o.type)}).length;
  const myOpen=myU()?L.filter(a=>isOpen(a)&&a.toUnit===myU()).length:st.open;
  const myReview=L.filter(a=>a.status==='review'&&issuerSide(a)).length;
  const hk=(l,v,s,act,c='')=>`<button type="button" class="xd-hk ${c}" ${act}><span class="l">${l}</span><b class="num">${v}</b><span class="s">${s}</span></button>`;
  return `<section class="xd-hero dt-hero">
   <div class="xd-hero-main">
    <span class="xd-eyebrow">${esc(tr('مركز مهام الإدارات','Department duties centre'))}</span>
    <h2>${esc(tr('مهام الإدارات والتكليفات','Department duties & assignments'))}</h2>
    <p class="xd-sub">${esc(tr('كل اختصاص موثّق بمصدره، وكل تكليف مربوط بمهمة ويُتابَع حتى الاعتماد.','Every duty traced to its source document; every assignment linked to a duty and tracked until approved.'))}</p>
    <p class="xd-date">${myU()?esc(tr('إدارتك','Your department'))+': <b>'+esc(uTitle(myU()))+'</b>':isAdmin()?esc(tr('مدير النظام: ترى كل الإدارات','Administrator: you see every department')):esc(tr('حسابك غير مربوط بإدارة بعد','Your account is not linked to a department yet'))}</p>
    <div class="xd-hero-gauge" data-dt-tab="kpi">${xdRing(dT?Math.round(dH/dT*100):0,84)}<b class="num">${dT?Math.round(dH/dT*100):0}%</b><span>${esc(tr('تغطية المهام بالعمل','Duties with activity'))}<small>${dH} ${esc(tr('من','of'))} ${dT} ${esc(tr('مهمة عليها تكليف أو سجل','duties have an assignment or record'))}</small></span></div>
   </div>
   <div class="xd-hks">
    ${hk(esc(tr('مهام واختصاصات موثّقة','Documented duties')),ORG_DUTY_ORDER.reduce((n,id)=>n+dutiesOf(id).length,0),esc(tr(`لـ ${withD} جهة`,`for ${withD} units`)),'data-dt-tab="guide"')}
    ${hk(esc(tr('جهات حُدِّدت مهامها','Units with duties')),`${withD}<small class="dt-of">/${units}</small>`,esc(tr('بانتظار وثائق البقية','awaiting the rest')),'data-dt-tab="guide" data-dt-cov="1"')}
    ${hk(esc(tr(myU()?'تكليفات مفتوحة لإدارتك':'تكليفات مفتوحة','Open assignments')),myOpen,esc(tr(`الإجمالي ${st.n}`,`Total ${st.n}`)),'data-dt-tab="tasks" data-dt-f="open"')}
    ${hk(esc(tr('متأخرة عن موعدها','Overdue')),st.late,esc(st.late?tr('تحتاج متابعة','need follow-up'):tr('لا تأخير','none')),'data-dt-tab="tasks" data-dt-f="late"',st.late?'crit':'')}
    ${hk(esc(tr('بانتظار اعتمادك','Awaiting your approval')),myReview,esc(tr('أنجزتها الإدارات','completed by departments')),'data-dt-tab="tasks" data-dt-f="review"',myReview?'warn':'')}
    ${hk(esc(tr('نسبة الإنجاز','Completion rate')),st.rate+'%',esc(st.onTime==null?tr('لا تكليفات منجزة بعد','nothing completed yet'):tr(`في الموعد ${st.onTime}%`,`on time ${st.onTime}%`)),'data-dt-tab="kpi"')}
   </div></section>
  ${DT.err&&DT.err!=='failed-precondition'?`<div class="banner">${esc(tr('تعذّر تحميل التكليفات','Could not load assignments'))} (${esc(DT.err)}). ${isAdmin()?esc(tr('انشر ملف القواعد الجديد firestore.rules في لوحة Firebase (Firestore ← Rules ← Publish).','Publish the new firestore.rules in the Firebase console (Firestore → Rules → Publish).')):''}</div>`:''}
  ${!isAdmin()&&!myU()?`<div class="banner info">${esc(tr('حسابك غير مربوط بأي إدارة، لذلك لا تظهر لك التكليفات. اطلب من مدير النظام ربط بريدك بإدارتك.','Your account is not linked to a department, so no assignments are shown. Ask the administrator to link it.'))}</div>`:''}
  <div class="dt-tabs" role="tablist">${TABS.map(([k,a,e])=>`<button role="tab" data-dt-tab="${k}" aria-selected="${u.tab===k}">${esc(tr(a,e))}${k==='tasks'&&st.open?` <span class="num dt-tc">${st.open}</span>`:''}</button>`).join('')}</div>
  <div id="dt-body">${u.tab==='tasks'?viewTasks():u.tab==='kpi'?viewKpi():u.tab==='access'?viewAccess():u.unit&&ORG_BY.get(u.unit)?viewUnit(u.unit):viewGuide()}</div>`;
}

/* ----- guide ----- */
function viewGuide(){
  const q=norm(DT.ui.kq||'');
  const cards=MAIN.map(id=>{const o=ORG_BY.get(id);if(!o)return '';const c=coverage(id),L=deptList(id),s=stats(L),src=srcOf(id),subs=unitTree(id).filter(x=>x!==id&&dutiesOf(x).length);
    if(q&&!norm([o.title,o.head,...unitTree(id).flatMap(x=>dutiesOf(x).map(d=>d.tag+' '+d.txt))].join(' ')).includes(q))return '';
    const st=s.late?['crit',tr('! تكليفات متأخرة','! Overdue')]:s.review?['warn',tr('بانتظار اعتماد','Awaiting approval')]:['ok',tr('✓ منتظمة','✓ On track')];
    return `<article class="xd-card dt-card t-${o.type}" data-dt-unit="${id}" tabindex="0">
     <header><div class="xd-ct"><span class="xd-type">${esc(tr(typeL(o),''))||esc(typeL(o))}</span><h4>${esc(o.title)}</h4><p>${o.vacant?esc(tr('شاغرة','Vacant')):esc(o.head)}</p>
      ${src?`<span class="dt-src s-${esc(src.kind)}">${DI.doc}${esc(tr(...(SRC_KIND[src.kind]||SRC_KIND.other)))}</span>`:''}</div>
      <div class="xd-cg" data-tip="${esc(tr('مهام عليها تكليف أو سجل','Duties with activity'))}">${xdRing(c.pct,62)}<b class="num">${c.pct}%</b></div></header>
     <div class="xd-core"><div class="xd-m"><b class="num">${dutiesOf(id).length}</b><span>${esc(tr('مهمة','duties'))}</span></div>
      <div class="xd-m ${s.open?'warn':''}"><b class="num">${s.open}</b><span>${esc(tr('تكليف مفتوح','open'))}</span></div>
      <div class="xd-m ${s.late?'crit':'ok'}"><b class="num">${s.late}</b><span>${esc(tr('متأخر','overdue'))}</span></div></div>
     <div class="xd-foot"><span>${I.org||''}<b class="num">${subs.length}</b> ${esc(tr('جهة تابعة لها مهام','sub-units with duties'))}</span><span><b class="num">${s.done}</b> ${esc(tr('منجز','done'))}</span><span class="pill p-${st[0]}">${esc(st[1])}</span></div></article>`}).join('');
  /* coverage map: which units have documented duties and which still await their document */
  const covMap=MAIN.filter(id=>id!=='gm').map(id=>{const kids=orgKids(id);if(!kids.length)return '';
    const done=kids.filter(k=>dutiesOf(k.id).length).length;
    return `<div class="dt-cm"><div class="dt-cm-h"><b>${esc(uShort(id))}</b><span class="num">${done}/${kids.length}</span><span class="dt-bar"><i style="width:${Math.round(done/kids.length*100)}%"></i></span></div>
     <div class="dt-cm-k">${kids.map(k=>{const has=dutiesOf(k.id).length;return `<button type="button" class="dt-chip ${has?'on':''}" ${has?`data-dt-unit="${k.id}"`:`data-org-focus-dt="${k.id}"`} data-tip="${esc(has?tr(`${has} مهام موثّقة`,`${has} documented duties`):tr('بانتظار وثيقة المهام','Awaiting the duties document'))}">${has?'✓':'○'} ${esc(k.title)}</button>`}).join('')}</div></div>`}).join('');
  return `<div class="xd-head"><h3 class="section-title">${esc(tr('الإدارات ومهامها','Departments and their duties'))} <small>${esc(tr('اضغط على أي إدارة لفتح صفحة مهامها','Open any department for its duties page'))}</small></h3>
    <div class="dt-acts"><label class="xd-search">${I.search}<input type="search" id="dt-kq" value="${esc(DT.ui.kq||'')}" placeholder="${esc(tr('بحث في كل المهام والاختصاصات…','Search every duty…'))}"></label>
     <button class="btn sm" data-dt="xlsx">${I.down}${esc(tr('تصدير Excel','Export Excel'))}</button>${isAdmin()?`<button class="btn sm primary" data-dt="add-duties">${I.plus}${esc(tr('إضافة مهام إدارة','Add department duties'))}</button>`:''}</div></div>
   ${q?searchHits(q):''}
   <div class="xd-cards">${cards||`<div class="empty">${esc(tr('لا نتائج','No results'))}</div>`}</div>
   <section class="panel dt-cov" id="dt-cov"><h3 class="section-title">${esc(tr('خريطة توثيق المهام','Duties documentation map'))} <small>${esc(tr('✓ موثّقة · ○ بانتظار وثيقتها. عند وصول وثيقة إدارة تُضاف هنا فتظهر في كل المنظومة.','✓ documented · ○ awaiting document. When a document arrives it is added here and shows everywhere.'))}</small></h3>
    <div class="dt-cms">${covMap}</div></section>`;
}
function searchHits(q){const hits=[];ORG_DUTY_ORDER.forEach(id=>dutiesOf(id).forEach((d,i)=>{if(norm(d.tag+' '+d.txt+' '+(d.txtEn||'')).includes(q))hits.push({id,d,n:i+1})}));
  return `<section class="panel"><h3 class="section-title">${hits.length} ${esc(tr('نتيجة في المهام','matching duties'))}</h3>${hits.length?`<ol class="dt-hits">${hits.slice(0,40).map(h=>`<li data-dt-unit="${h.id}"><span class="od-tag">${esc(dutyTag(h.d))}</span><span>${esc(dutyTxt(h.d))}</span><small>${esc(uTitle(h.id))} · ${h.n}</small></li>`).join('')}</ol>`:''}</section>`}

/* ----- department page ----- */
function dutyRow(id,d,n){const L=all().filter(a=>(a.dutyUnit||a.toUnit)===id&&String(a.duty)===String(n)),op=L.filter(isOpen).length,lt=L.filter(isLate).length,dn=L.filter(a=>a.status==='done').length;
  const rc=(S.records||[]).filter(r=>r.unit===id&&String(r.duty)===String(n)).length;
  return `<li class="dt-du"><span class="od-n num">${n}</span><div class="dt-du-b"><div class="dt-du-t"><span class="od-tag">${esc(dutyTag(d))}</span>${d.u?`<span class="pill p-warn" data-tip="${esc(tr('قراءة غير مؤكدة من المستند الممسوح، تحتاج تدقيقًا','Unclear in the scan, please verify'))}">${esc(tr('تدقيق','Verify'))}</span>`:''}</div>
   <p>${esc(dutyTxt(d))}</p>
   <div class="dt-du-m">${L.length?`<button type="button" data-dt-duty="${id}|${n}"><b class="num">${op}</b> ${esc(tr('مفتوح','open'))}${lt?` · <b class="num crit">${lt}</b> ${esc(tr('متأخر','late'))}`:''} · <b class="num">${dn}</b> ${esc(tr('منجز','done'))}</button>`:`<span class="muted">${esc(tr('لا تكليفات بعد','No assignments yet'))}</span>`}
    ${rc?`<span><b class="num">${rc}</b> ${esc(tr('سجل','records'))}</span>`:''}
    ${canIssue()&&targets().includes(deptOf(id))?`<button type="button" class="btn sm dt-assign" data-dt="new" data-u="${id}" data-n="${n}">${DI.send}${esc(tr('تكليف','Assign'))}</button>`:''}</div></div></li>`}
function viewUnit(id){const o=ORG_BY.get(id),m=META[id]||{},src=m.src,ds=dutiesOf(id),dep=deptOf(id),s=stats(all().filter(a=>a.toUnit===id||(a.dutyUnit===id))),c=coverage(id);
  const subs=orgAll(id).filter(x=>dutiesOf(x.id).length);
  const lead=ORG_DUTIES[id]?tr(ORG_DUTIES[id].lead,m.leadEn):'';
  const pend=orgKids(id).filter(k=>!dutiesOf(k.id).length);
  return `<div class="dt-crumbs"><button class="btn sm ghost" data-dt-unit="">← ${esc(tr('كل الإدارات','All departments'))}</button>${orgPath(id).filter(x=>x.id!=='board'&&x.id!==id).map(x=>`<button class="dt-cr" data-dt-unit="${x.id}">${esc(x.title)}</button>`).join('<span>›</span>')}</div>
  <section class="dt-uh t-${o.type}"><div class="dt-uh-m"><span class="xd-type">${esc(typeL(o))}</span><h2>${esc(o.title)}</h2><p>${o.vacant?esc(tr('شاغرة','Vacant')):`<b>${esc(o.head)}</b>${o.empNo?` · <span class="num">${esc(o.empNo)}</span>`:''}`}</p>
    ${src?`<div class="dt-srcbox s-${esc(src.kind)}">${DI.doc}<div><span>${esc(tr(...(SRC_KIND[src.kind]||SRC_KIND.other)))}</span><b>${esc(srcLabel(src))}</b>${src.note?`<small>${esc(tr(src.note,src.noteEn))}</small>`:''}${src.kind==='decree'?`<small>${esc(tr('نافذ اعتبارًا من','Effective'))} ${fd(ORG_DECREE.eff)} · ${esc(tr('إحالة','Ref.'))} ${esc(ORG_DECREE.ref)}</small>`:''}${m.admin?`<small>${esc(tr('أضافه مدير النظام','Added by the administrator'))}${m.by?': '+esc(m.by):''}${m.at?' · '+fd(m.at):''}</small>`:''}</div></div>`:''}</div>
   <div class="dt-uh-k"><div><b class="num">${ds.length}</b><span>${esc(tr('مهمة','duties'))}</span></div><div><b class="num">${s.open}</b><span>${esc(tr('تكليف مفتوح','open'))}</span></div><div class="${s.late?'crit':''}"><b class="num">${s.late}</b><span>${esc(tr('متأخر','overdue'))}</span></div><div><b class="num">${c.pct}%</b><span>${esc(tr('تغطية','coverage'))}</span></div></div>
   <div class="dt-uh-a">${canIssue()&&targets().includes(dep)&&ds.length?`<button class="btn sm primary" data-dt="new" data-u="${id}">${DI.send}${esc(tr('تكليف جديد','New assignment'))}</button>`:''}
    <button class="btn sm" data-dt="print-unit" data-u="${id}">${DI.print}${esc(tr('بطاقة المهام PDF','Duties card PDF'))}</button>
    <button class="btn sm ghost" data-dt-orgdash="${id}">${esc(tr('سجل الإدارة ولوحتها','Records & dashboard'))}</button>${isAdmin()?`<button class="btn sm ghost" data-dt="add-duties" data-u="${id}">${I.edit||''}${esc(tr('تعديل المهام','Edit duties'))}</button>`:''}</div></section>
  ${m.purpose?`<section class="panel dt-purpose"><h3 class="section-title">${esc(tr('الغرض من الوظيفة','Job purpose'))}</h3><ul>${m.purpose.map(p=>`<li>${esc(tr(p[0],p[1]))}</li>`).join('')}</ul></section>`:''}
  ${ds.length?`<section class="panel"><h3 class="section-title">${esc(tr('المهام والاختصاصات','Duties & responsibilities'))} <small>${ds.length}</small></h3>${lead?`<p class="od-lead">${esc(lead)}</p>`:''}<ol class="dt-dus">${ds.map((d,i)=>dutyRow(id,d,i+1)).join('')}</ol></section>`
   :`<section class="panel dt-await"><b>${esc(tr('لم تصل وثيقة مهام هذه الجهة بعد','This unit’s duties document has not arrived yet'))}</b><p class="muted">${esc(tr('عند وصولها تُضاف في ملف duties-data.js أو من زر «إضافة مهام إدارة» فتظهر هنا مباشرة.','When it arrives, add it in duties-data.js or with “Add department duties” and it appears here.'))}</p>${isAdmin()?`<button class="btn sm primary" data-dt="add-duties" data-u="${id}">${I.plus}${esc(tr('إضافة مهام هذه الجهة','Add this unit’s duties'))}</button>`:''}</section>`}
  ${subs.map(x=>{const xm=META[x.id]||{};return `<section class="panel dt-sub t-${x.type}"><div class="dt-sub-h"><div><span class="xd-type">${esc(typeL(x))}</span><h3>${esc(x.title)}</h3><p class="muted">${x.vacant?esc(tr('شاغرة','Vacant')):esc(x.head)}</p></div><button class="btn sm ghost" data-dt-unit="${x.id}">${esc(tr('صفحة الوحدة','Unit page'))}</button></div>
    ${ORG_DUTIES[x.id].lead?`<p class="od-lead">${esc(tr(ORG_DUTIES[x.id].lead,xm.leadEn))}</p>`:''}<ol class="dt-dus">${dutiesOf(x.id).map((d,i)=>dutyRow(x.id,d,i+1)).join('')}</ol></section>`}).join('')}
  ${m.job?jobCard(m.job,id):''}
  ${pend.length&&ds.length?`<section class="panel dt-await"><h3 class="section-title">${esc(tr('جهات تابعة بانتظار وثيقة مهامها','Sub-units awaiting their duties document'))} <small>${pend.length}</small></h3><div class="dt-cm-k">${pend.map(k=>`<button type="button" class="dt-chip" data-dt-unit="${k.id}">○ ${esc(k.title)}</button>`).join('')}</div></section>`:''}`;
}
function jobCard(j,id){const T=x=>esc(tr(x[0],x[1]));const o=ORG_BY.get(id);
  const li=a=>a.map(x=>`<li>${T(x)}</li>`).join('');
  const same=o&&!o.vacant&&j.holder&&norm(o.head)===norm(j.holder);
  return `<section class="panel dt-job"><h3 class="section-title">${DI.user}${esc(tr('بطاقة الوصف الوظيفي','Job description card'))} <small>${esc(tr('من نموذج جمع معلومات الوظيفة','from the job information form'))}</small></h3>
   <div class="dt-job-top"><div class="dt-jt"><span>${esc(tr('مسمى الوظيفة','Job title'))}</span><b>${esc(tr(j.title,j.titleEn))}</b></div>
    <div class="dt-jf"><span>${esc(tr('الفئة','Grade'))}</span><b class="num">${esc(j.grade)}</b></div>
    <div class="dt-jf"><span>${esc(tr('المسؤول المباشر','Reports to'))}</span><b>${esc(tr(j.reportsTo,j.reportsToEn))}</b></div>
    <div class="dt-jf"><span>${esc(tr('موقع العمل','Location'))}</span><b>${esc(tr(j.location,j.locationEn))}</b></div>
    ${j.holder?`<div class="dt-jf"><span>${esc(tr('شاغل الوظيفة','Job holder'))}</span><b>${esc(j.holder)}</b>${same?`<small class="ok">✓ ${esc(tr('مطابق للهيكل','matches the structure'))}</small>`:''}</div>`:''}</div>
   <div class="dt-job-grid">
    <div><h4>${esc(tr('التقسيمات التابعة للمكتب','Office structure'))}</h4><ul class="dt-tl">${j.structure.map(s=>`<li><span class="tag">${esc(tr(s[0],s[2]))}</span>${esc(tr(s[1],s[3]))}</li>`).join('')}</ul></div>
    <div><h4>${esc(tr('المسؤولية الإشرافية','Supervises'))}</h4><ul>${li(j.supervises)}</ul></div>
    <div><h4>${esc(tr('متطلبات إشغال الوظيفة','Requirements'))}</h4><dl><dt>${esc(tr('المؤهل العلمي','Qualification'))}</dt><dd>${T(j.qualification)}</dd><dt>${esc(tr('الخبرة','Experience'))}</dt><dd>${T(j.experience)}</dd><dt>${esc(tr('التدريب','Training'))}</dt><dd><ul>${li(j.training)}</ul></dd></dl></div>
    <div><h4>${esc(tr('المهارات والقدرات','Skills'))}</h4><div class="dt-sk"><span>${esc(tr('فنية','Technical'))}</span>${j.skills.tech.map(x=>`<i>${T(x)}</i>`).join('')}</div><div class="dt-sk"><span>${esc(tr('إدارية','Managerial'))}</span>${j.skills.admin.map(x=>`<i>${T(x)}</i>`).join('')}</div><div class="dt-sk"><span>${esc(tr('شخصية','Personal'))}</span>${j.skills.personal.map(x=>`<i>${T(x)}</i>`).join('')}</div></div>
    <div><h4>${esc(tr('اتصالات العمل','Work contacts'))}</h4>${j.contacts.internal.map(c=>`<p><b>${esc(tr('داخلية','Internal'))}:</b> ${esc(tr(c[0],c[3]))}<br><small class="muted">${esc(tr(c[1],c[4]))} · ${esc(tr(c[2],c[5]))}</small></p>`).join('')}<p><b>${esc(tr('خارجية','External'))}:</b> ${esc(tr(j.contacts.external,j.contacts.externalEn))}</p></div>
    <div><h4>${esc(tr('بيئة العمل','Work environment'))}</h4><p>${T(j.environment)}</p></div></div>
   ${j.mismatch?`<div class="banner info dt-mis"><b>${esc(tr('ملاحظة مطابقة','Consistency note'))}:</b> ${T(j.mismatch)}</div>`:''}</section>`}

/* ----- assignments ----- */
function filtered(){const u=DT.ui,q=norm(u.q);let r=all();
  if(u.scope==='in'&&myU())r=r.filter(a=>a.toUnit===myU());else if(u.scope==='out'&&myU())r=r.filter(a=>a.fromUnit===myU());
  if(u.u)r=r.filter(a=>deptOf(a.toUnit)===u.u||a.toUnit===u.u||a.dutyUnit===u.u);
  if(u.duty){const [du,dn]=u.duty.split('|');r=r.filter(a=>(a.dutyUnit||a.toUnit)===du&&String(a.duty)===dn)}
  if(u.f==='open')r=r.filter(isOpen);else if(u.f==='late')r=r.filter(isLate);else if(STATUS[u.f])r=r.filter(a=>a.status===u.f);
  if(q)r=r.filter(a=>norm([a.no,a.title,a.details,a.assignee,uTitle(a.toUnit),uTitle(a.fromUnit),(dutyRef(a)||{it:{tag:''}}).it.tag].join(' ')).includes(q));
  const pr={high:0,normal:1,low:2};
  return r.sort((a,b)=>(isLate(b)-isLate(a))||((a.status==='done')-(b.status==='done'))||(a.due||'9').localeCompare(b.due||'9')||(pr[a.priority]??1)-(pr[b.priority]??1))}
function viewTasks(){const u=DT.ui,rows=filtered(),L=all();
  const cnt=k=>k==='open'?L.filter(isOpen).length:k==='late'?L.filter(isLate).length:k==='all'?L.length:L.filter(a=>a.status===k).length;
  const chips=[['open','المفتوحة','Open'],['late','المتأخرة','Overdue'],['new','جديدة','New'],['progress','قيد التنفيذ','In progress'],['review','بانتظار الاعتماد','Awaiting approval'],['hold','متوقفة','On hold'],['done','المنجزة','Done'],['all','الكل','All']];
  const dsel=u.duty?u.duty.split('|'):null,dit=dsel?dutiesOf(dsel[0])[Number(dsel[1])-1]:null;
  return `<div class="toolbar dt-tb">${canIssue()?`<button class="btn primary sm" data-dt="new">${DI.send}${esc(tr('تكليف جديد','New assignment'))}</button>`:''}
    <div class="grow">${I.search}<input type="search" id="dt-q" value="${esc(u.q)}" placeholder="${esc(tr('بحث بالرقم أو الموضوع أو المكلَّف…','Search number, subject, assignee…'))}"></div>
    ${myU()?`<select id="dt-scope"><option value="all" ${u.scope==='all'?'selected':''}>${esc(tr('الواردة والصادرة','Incoming & outgoing'))}</option><option value="in" ${u.scope==='in'?'selected':''}>${esc(tr('الواردة لإدارتنا','Incoming'))}</option><option value="out" ${u.scope==='out'?'selected':''}>${esc(tr('الصادرة منا','Issued by us'))}</option></select>`:''}
    ${seesAll()?`<select id="dt-u"><option value="">${esc(tr('كل الإدارات','All departments'))}</option>${MAIN.map(x=>`<option value="${x}" ${u.u===x?'selected':''}>${esc(uShort(x))}</option>`).join('')}</select>`:''}
    <div class="xd-seg" role="group"><button data-dt-vw="list" aria-selected="${u.vw!=='board'}">${DI.list}${esc(tr('قائمة','List'))}</button><button data-dt-vw="board" aria-selected="${u.vw==='board'}">${DI.board}${esc(tr('لوحة','Board'))}</button></div>
    <button class="btn sm" data-dt="xlsx-tasks">${I.down}Excel</button></div>
  ${dit?`<div class="dt-dfilter">${esc(tr('مصفّاة على المهمة','Filtered by duty'))}: <b>${esc(dutyTag(dit))}</b> · ${esc(uTitle(dsel[0]))} <button class="btn sm ghost" data-dt-duty="">✕</button></div>`:''}
  <div class="chips">${chips.map(([k,a,e])=>`<button class="chip" data-dt-f="${k}" aria-pressed="${u.f===k}">${esc(tr(a,e))} <span class="num">${cnt(k)}</span></button>`).join('')}</div>
  ${!DT.loaded?`<div class="tablewrap"><div class="empty">${esc(tr('جارٍ تحميل التكليفات…','Loading assignments…'))}</div></div>`:u.vw==='board'?boardHTML(rows):listHTML(rows)}`}
function progBar(a){const p=a.status==='done'?100:Math.max(0,Math.min(100,Number(a.progress)||0));return `<span class="dt-pb ${isLate(a)?'late':a.status==='done'?'done':''}" data-tip="${p}%"><i style="width:${p}%"></i></span><small class="num">${p}%</small>`}
function listHTML(rows){if(!rows.length)return emptyTasks();
  return `<div class="count-line">${rows.length} ${esc(tr('تكليف','assignments'))}</div><div class="tablewrap dt-tw"><table><thead><tr><th class="nosort">${esc(tr('الرقم','No.'))}</th><th class="nosort">${esc(tr('الموضوع','Subject'))}</th><th class="nosort">${esc(tr('المهمة','Duty'))}</th><th class="nosort">${esc(tr('من ← إلى','From → To'))}</th><th class="nosort">${esc(tr('المكلَّف','Assignee'))}</th><th class="nosort">${esc(tr('الموعد','Due'))}</th><th class="nosort">${esc(tr('الإنجاز','Progress'))}</th><th class="nosort">${esc(tr('الحالة','Status'))}</th></tr></thead><tbody>
  ${rows.map(a=>{const d=dutyRef(a);return `<tr data-dt-open="${esc(a.id)}" class="${isLate(a)?'dt-late':''}" tabindex="0"><td class="n"><span class="num">${esc(a.no||'')}</span>${a.priority==='high'?` ${pill(PRIO,'high')}`:''}</td><td class="t-strong wrap">${esc(a.title)}</td>
   <td>${d?`<span class="tag" data-tip="${esc(dutyTxt(d.it))}">${d.n}. ${esc(dutyTag(d.it))}</span>`:'<span class="muted">—</span>'}</td>
   <td><small>${esc(uShort(a.fromUnit))} ←</small><br><b>${esc(a.subUnit?uTitle(a.subUnit):uShort(a.toUnit))}</b></td><td>${esc(a.assignee||'—')}</td><td>${dueTxt(a)}</td><td class="dt-pc">${progBar(a)}</td><td>${pill(STATUS,a.status)}${isLate(a)?` <span class="pill p-crit">${esc(tr('متأخر','Overdue'))}</span>`:''}</td></tr>`}).join('')}</tbody></table></div>`}
function boardHTML(rows){const cols=['new','progress','review','hold','done'];if(!rows.length)return emptyTasks();
  return `<div class="dt-board">${cols.map(k=>{const r=rows.filter(a=>a.status===k);return `<div class="dt-col s-${k}"><h4>${pill(STATUS,k)} <span class="num">${r.length}</span></h4>
   ${r.map(a=>{const d=dutyRef(a);return `<button type="button" class="dt-tk ${isLate(a)?'late':''}" data-dt-open="${esc(a.id)}"><span class="dt-tk-n num">${esc(a.no||'')}${a.priority==='high'?` · ${esc(tr('عاجل','Urgent'))}`:''}</span><b>${esc(a.title)}</b>${d?`<small>${d.n}. ${esc(dutyTag(d.it))}</small>`:''}<span class="dt-tk-f"><span>${esc(a.subUnit?uTitle(a.subUnit):uShort(a.toUnit))}</span><span>${dueTxt(a)}</span></span>${progBar(a)}</button>`}).join('')||`<div class="dt-col-e">—</div>`}</div>`}).join('')}</div>`}
function emptyTasks(){const any=all().length;return `<div class="panel dt-empty"><div class="dt-empty-i">${DI.send}</div><b>${esc(any?tr('لا تكليفات مطابقة','No matching assignments'):tr('لا توجد تكليفات بعد','No assignments yet'))}</b>
  <p class="muted">${esc(any?tr('غيّر الفلتر أو البحث.','Change the filter or search.'):canIssue()?tr('أصدر أول تكليف واربطه بمهمة من مهام الإدارة، ثم تابع تنفيذه حتى الاعتماد.','Issue the first assignment, link it to a duty, and track it until approval.'):tr('ستظهر هنا التكليفات الواردة لإدارتك أو الصادرة منها.','Assignments to or from your department will appear here.'))}</p>
  ${!any&&canIssue()?`<button class="btn primary" data-dt="new">${DI.send}${esc(tr('تكليف جديد','New assignment'))}</button>`:''}</div>`}

/* ----- assignment drawer ----- */
function openTask(id,keep){const a=DT.list.get(id);if(!a)return;DT.open=id;const d=dutyRef(a),iss=issuerSide(a),doer=doerSide(a),st=a.status;
  const sc=document.querySelector('.drawer-body');const y=keep&&sc?sc.scrollTop:0;
  const acts=[];
  if(doer&&st==='new')acts.push(['start',tr('بدء التنفيذ','Start'),'primary']);
  if(doer&&(st==='progress'||st==='new'||st==='hold'))acts.push(['update',tr('تحديث الإنجاز','Update progress'),st==='new'?'':'primary']);
  if(doer&&st==='progress')acts.push(['submit',tr('رفع للاعتماد','Submit for approval'),'']);
  if(doer&&st==='progress')acts.push(['hold',tr('إيقاف مؤقت','Put on hold'),'ghost']);
  if(iss&&st==='review')acts.push(['approve',tr('اعتماد الإنجاز','Approve'),'primary'],['return',tr('إعادة للتنفيذ','Send back'),'']);
  if(iss&&st!=='done')acts.push(['edit',tr('تعديل','Edit'),'ghost']);
  if(iss&&st==='done')acts.push(['reopen',tr('إعادة فتح','Reopen'),'ghost']);
  if((isAdmin()||(a.createdBy===(me()||{}).email&&st==='new')))acts.push(['delete',tr('حذف','Delete'),'ghost danger']);
  const att=(a.attachments||[]).length?(window.ATT&&ATT.view?ATT.view(a.attachments):a.attachments.map(x=>esc(x.name)).join('، ')):'';
  drawer(`<button class="iconbtn" data-act="close-drawer" aria-label="${esc(tr('إغلاق','Close'))}">${I.close}</button><div style="min-width:0"><div class="muted num" style="font-size:12px">${esc(a.no||'')}</div><h3 style="margin:0;font-size:16px">${esc(a.title)}</h3></div>`,
  `<div class="dt-dr" data-dt-id="${esc(id)}">
   <div class="dt-dr-st">${pill(STATUS,st)}${a.priority?pill(PRIO,a.priority):''}${isLate(a)?`<span class="pill p-crit">${esc(tr('متأخر','Overdue'))}</span>`:''}<span class="grow"></span>${progBar(a)}</div>
   <dl class="dt-dl"><dt>${esc(tr('من','From'))}</dt><dd>${esc(uTitle(a.fromUnit))}<small>${esc(a.createdByName||a.createdBy||'')}</small></dd>
    <dt>${esc(tr('إلى','To'))}</dt><dd>${esc(uTitle(a.toUnit))}${a.subUnit?`<small>${esc(uTitle(a.subUnit))}</small>`:''}</dd>
    <dt>${esc(tr('المكلَّف','Assignee'))}</dt><dd>${esc(a.assignee||'—')}</dd>
    <dt>${esc(tr('المهمة','Duty'))}</dt><dd>${d?`<span class="od-tag">${d.n}. ${esc(dutyTag(d.it))}</span><small>${esc(dutyTxt(d.it))}</small>`:'—'}</dd>
    <dt>${esc(tr('تاريخ الإصدار','Issued'))}</dt><dd class="num">${fd(a.start||(a.createdAt||'').slice(0,10))}</dd><dt>${esc(tr('الموعد النهائي','Due'))}</dt><dd>${dueTxt(a)}</dd>
    ${a.doneAt?`<dt>${esc(tr('تاريخ الاعتماد','Approved'))}</dt><dd class="num">${fd(a.doneAt.slice(0,10))}</dd>`:''}</dl>
   ${a.details?`<div class="dt-det">${esc(a.details).replace(/\n/g,'<br>')}</div>`:''}
   ${att?`<div><h4 class="dt-h4">${esc(tr('المرفقات','Attachments'))}</h4>${att}</div>`:''}
   ${acts.length?`<div class="dt-dr-acts">${acts.map(([k,l,c])=>`<button class="btn sm ${c}" data-dt-a="${k}">${esc(l)}</button>`).join('')}</div>`:`<div class="muted" style="font-size:12.5px">${esc(tr('للاطلاع فقط: الإجراءات متاحة للإدارة المكلَّفة والجهة المُصدِرة.','View only: actions are available to the assigned and the issuing departments.'))}</div>`}
   <div id="dt-act-form"></div>
   <h4 class="dt-h4">${esc(tr('سجل المتابعة','Activity'))}</h4>
   <ol class="dt-log">${(a.log||[]).slice().reverse().map(l=>`<li><span class="dt-log-d"></span><div><b>${esc(l.name||l.by||'')}</b> <small class="muted">${esc(uShort(l.unit||''))} · <span class="num">${l.ts?new Date(l.ts).toLocaleString(EN()?'en-GB':'ar-LY-u-nu-latn',{dateStyle:'medium',timeStyle:'short'}):''}</span></small>
    <div>${esc(actLabel(l.act))}${l.progress!=null&&l.progress!==''?` · <span class="num">${l.progress}%</span>`:''}</div>${l.note?`<p>${esc(l.note)}</p>`:''}</div></li>`).join('')}</ol></div>`);
  const dr=document.querySelector('#drawer-root .drawer');if(dr){dr.dataset.dt='1';if(keep){const b=dr.querySelector('.drawer-body');if(b)b.scrollTop=y}}}
const ACT={create:['أصدر التكليف','Issued the assignment'],start:['بدأ التنفيذ','Started'],update:['حدّث الإنجاز','Updated progress'],submit:['رفع للاعتماد','Submitted for approval'],
 hold:['أوقف مؤقتًا','Put on hold'],approve:['اعتمد الإنجاز','Approved'],return:['أعاد للتنفيذ','Sent back'],edit:['عدّل التكليف','Edited'],reopen:['أعاد الفتح','Reopened']};
const actLabel=k=>tr(...(ACT[k]||[k,k]));
function actForm(k,a){const el=document.getElementById('dt-act-form');if(!el)return;
  const needP=k==='update'||k==='start',needNote=k==='return'||k==='hold';
  el.innerHTML=`<div class="dt-af"><b>${esc(actLabel(k))}</b>
   ${needP?`<label class="dt-range"><span>${esc(tr('نسبة الإنجاز','Progress'))}: <b class="num" id="dt-pv">${Number(a.progress)||0}%</b></span><input type="range" id="dt-p" min="0" max="100" step="5" value="${Number(a.progress)||(k==='start'?10:0)}"></label>`:''}
   <div class="field"><label for="dt-note">${esc(tr(needNote?'السبب / الملاحظة (مطلوب)':'ملاحظة (اختياري)',needNote?'Reason / note (required)':'Note (optional)'))}</label><textarea id="dt-note" rows="3"></textarea></div>
   <div class="dt-af-b"><button class="btn sm primary" data-dt-do="${k}">${esc(tr('تأكيد','Confirm'))}</button><button class="btn sm ghost" data-dt-do="">${esc(tr('إلغاء','Cancel'))}</button><span class="dt-err" id="dt-aerr"></span></div></div>`;
  const r=el.querySelector('#dt-p');if(r){const v=el.querySelector('#dt-pv');r.addEventListener('input',()=>v.textContent=r.value+'%');if(k==='start')v.textContent=r.value+'%'}
  el.querySelector('textarea').focus()}
async function doAct(k,a){const note=(val('dt-note')||'').slice(0,1000),pEl=document.getElementById('dt-p'),m=me()||{};
  if((k==='return'||k==='hold')&&!note){document.getElementById('dt-aerr').textContent=tr('اكتب السبب.','Enter a reason.');return}
  let status=a.status,progress=Number(a.progress)||0;
  if(k==='start'){status='progress';progress=pEl?Number(pEl.value):10}
  else if(k==='update'){progress=pEl?Number(pEl.value):progress;if(status==='new'||status==='hold')status='progress'}
  else if(k==='submit'){status='review';progress=100}else if(k==='hold')status='hold';
  else if(k==='approve'){status='done';progress=100}else if(k==='return'||k==='reopen'){status='progress';if(progress>=100)progress=90}
  const upd={status,progress,updatedAt:nowISO(),log:[...(a.log||[]),{ts:nowISO(),by:m.email||'',name:m.name||'',unit:myU()||(isAdmin()?'admin':''),act:k,note,progress}]};
  if(k==='approve')upd.doneAt=nowISO();if(k==='return'||k==='reopen')upd.doneAt='';
  try{await FS().collection('assignments').doc(a.id).update(upd);toast(tr('تم الحفظ','Saved'))}catch(e){document.getElementById('dt-aerr').textContent=errMsg(e)}}
function errMsg(e){return e&&e.code==='permission-denied'?tr('لا تملك صلاحية هذا الإجراء','You do not have permission for this action'):((e&&e.message)||tr('تعذّر الحفظ','Could not save'))}

/* ----- new / edit assignment ----- */
function unitOptions(dep,sel){return [ORG_BY.get(dep),...orgAll(dep)].filter(Boolean).map(o=>{const lvl=Math.max(0,orgPath(o.id).length-orgPath(dep).length);return `<option value="${o.id}" ${o.id===sel?'selected':''}>${'  '.repeat(lvl)}${esc(o.title)}${dutiesOf(o.id).length?` (${dutiesOf(o.id).length})`:''}</option>`}).join('')}
function dutyOptions(u,sel){const ds=dutiesOf(u);return ds.length?`<option value="">${esc(tr('— اختر المهمة —','— choose the duty —'))}</option>`+ds.map((d,i)=>`<option value="${i+1}" ${String(sel)===String(i+1)?'selected':''}>${i+1}. ${esc(dutyTag(d))}: ${esc(dutyTxt(d).slice(0,80))}${dutyTxt(d).length>80?'…':''}</option>`).join(''):`<option value="">${esc(tr('لا توجد مهام موثّقة لهذه الجهة','No documented duties for this unit'))}</option>`}
function taskForm(a,pre){const isNew=!a;pre=pre||{};const tg=targets();
  const dep=a?a.toUnit:(pre.u&&tg.includes(deptOf(pre.u))?deptOf(pre.u):tg[0]);const dutyU=a?(a.dutyUnit||a.toUnit):(pre.u||dep);
  a=a||{priority:'normal',start:TODAY_ISO,due:iso(new Date(Date.now()+7*864e5)),duty:pre.n||''};
  const attField=window.ATT&&ATT.formField?ATT.formField('dlg',a.attachments||[],{name:a.title||'تكليف'}):'';
  modal(isNew?tr('تكليف جديد','New assignment'):tr('تعديل التكليف','Edit assignment'),`<fieldset><legend>${esc(tr('الجهة المكلَّفة','Assigned to'))}</legend>
    <div class="field"><label for="t-to">${esc(tr('الإدارة','Department'))}<span class="req">*</span></label><select id="t-to" ${isNew?'':'disabled'}>${tg.concat(isNew||tg.includes(dep)?[]:[dep]).map(x=>`<option value="${x}" ${x===dep?'selected':''}>${esc(uTitle(x))}</option>`).join('')}</select></div>
    <div class="field"><label for="t-unit">${esc(tr('القسم / الوحدة','Section / unit'))}</label><select id="t-unit">${unitOptions(dep,a.subUnit||dutyU)}</select></div>
    <div class="field full"><label for="t-duty">${esc(tr('المهمة / الاختصاص','Duty'))}<span class="req">*</span></label><select id="t-duty">${dutyOptions(dutyU,a.duty)}</select><span class="hint" id="t-dhint"></span></div>
    <div class="field"><label for="t-who">${esc(tr('المكلَّف (اسم الموظف)','Assignee (employee)'))}</label><input id="t-who" value="${esc(a.assignee||'')}" list="t-who-l" autocomplete="off">${dl('t-who-l',unitTree(dep).map(x=>(ORG_BY.get(x)||{}).head).filter(Boolean))}</div>
    </fieldset><fieldset><legend>${esc(tr('التكليف','Assignment'))}</legend>
    ${F('t-title',tr('الموضوع','Subject'),a.title,{req:1,full:1})}
    <div class="field full"><label for="t-det">${esc(tr('التفاصيل والمطلوب','Details'))}</label><textarea id="t-det" rows="4">${esc(a.details||'')}</textarea></div>
    <div class="field"><label for="t-pr">${esc(tr('الأولوية','Priority'))}</label><select id="t-pr">${Object.keys(PRIO).map(k=>`<option value="${k}" ${a.priority===k?'selected':''}>${esc(tr(PRIO[k][0],PRIO[k][1]))}</option>`).join('')}</select></div>
    ${F('t-start',tr('تاريخ الإصدار','Issue date'),a.start,{type:'date'})}${F('t-due',tr('الموعد النهائي','Due date'),a.due,{type:'date',req:1})}</fieldset>
    ${attField?`<fieldset><legend>${esc(tr('المرفقات','Attachments'))}</legend>${attField}</fieldset>`:''}`,
  `<button type="submit" class="btn primary" data-dt="save" data-id="${esc(a.id||'')}">${DI.send}${esc(isNew?tr('إصدار التكليف','Issue'):tr('حفظ','Save'))}</button><button type="button" class="btn" data-act="close-dlg">${esc(tr('إلغاء','Cancel'))}</button><span id="f-err" class="dt-err"></span>`);
  const to=document.getElementById('t-to'),un=document.getElementById('t-unit'),du=document.getElementById('t-duty'),hint=()=>{const it=dutiesOf(un.value)[Number(du.value)-1];document.getElementById('t-dhint').textContent=it?dutyTxt(it):''};
  to.addEventListener('change',()=>{un.innerHTML=unitOptions(to.value,to.value);du.innerHTML=dutyOptions(to.value,'');hint()});
  un.addEventListener('change',()=>{du.innerHTML=dutyOptions(un.value,'');hint()});du.addEventListener('change',hint);hint()}
function rnd(n){const a='ABCDEFGHJKMNPQRSTUVWXYZ23456789';let s='';crypto.getRandomValues(new Uint8Array(n)).forEach(b=>s+=a[b%a.length]);return s}
async function saveTask(id){const old=id?DT.list.get(id):null,m=me()||{},err=document.getElementById('f-err');
  const toUnit=old?old.toUnit:val('t-to'),sub=val('t-unit'),duty=val('t-duty'),title=val('t-title').slice(0,300),due=val('t-due');
  if(!toUnit||!title||!due){err.textContent=tr('الإدارة والموضوع والموعد النهائي مطلوبة.','Department, subject and due date are required.');return}
  if(dutiesOf(sub).length&&!duty){err.textContent=tr('اختر المهمة التي يندرج تحتها التكليف.','Choose the duty this assignment belongs to.');return}
  if(!old&&!targets().includes(toUnit)){err.textContent=tr('لا تملك صلاحية التكليف لهذه الإدارة.','You cannot assign to this department.');return}
  const start=val('t-start')||TODAY_ISO;if(due<start){err.textContent=tr('الموعد النهائي قبل تاريخ الإصدار.','Due date is before the issue date.');return}
  const o={toUnit,subUnit:sub&&sub!==toUnit?sub:'',dutyUnit:sub||toUnit,duty:duty||'',title,details:val('t-det').slice(0,4000),assignee:val('t-who').slice(0,120),priority:val('t-pr')||'normal',start,due,updatedAt:nowISO()};
  if(window.ATT&&ATT.val){o.attachments=await ATT.val('dlg','f-err');if(o.attachments==null)return}else o.attachments=(old&&old.attachments)||[];
  const entry={ts:nowISO(),by:m.email||'',name:m.name||'',unit:myU()||(isAdmin()?'admin':''),act:old?'edit':'create',note:'',progress:old?Number(old.progress)||0:0};
  try{if(old){o.log=[...(old.log||[]),entry];await FS().collection('assignments').doc(id).update(o)}
   else{const from=isAdmin()&&!myU()?'gm':myU();Object.assign(o,{no:'T-'+TODAY_ISO.slice(2,4)+TODAY_ISO.slice(5,7)+'-'+rnd(4),fromUnit:from,status:'new',progress:0,log:[entry],createdBy:m.email,createdByName:m.name||'',createdAt:nowISO(),doneAt:''});
     await FS().collection('assignments').add(o)}
   dlg.close();toast(old?tr('تم حفظ التعديل','Saved'):tr('تم إصدار التكليف','Assignment issued'))}catch(e){err.textContent=errMsg(e)}}

/* ----- KPIs ----- */
function viewKpi(){const L=all(),rows=MAIN.map(id=>({id,s:stats(deptList(id)),c:coverage(id)})),T=stats(L);
  const mx=Math.max(1,...rows.map(r=>r.s.n));
  const seg=(r)=>{const t=Math.max(1,r.s.n);const p=x=>(x/mx*100).toFixed(1);return `<span class="dt-stack" style="width:${(r.s.n/mx*100).toFixed(1)}%">${[['done',r.s.done],['review',r.s.review],['progress',r.s.prog],['new',r.s.neu],['hold',r.s.hold]].filter(x=>x[1]).map(([k,v])=>`<i class="s-${k}" style="flex:${v}" data-tip="${esc(tr(STATUS[k][0],STATUS[k][1]))}: ${v}"></i>`).join('')}</span>`};
  /* weekly completions, last 8 weeks */
  const wk=[];const t0=new Date(TODAY_ISO);for(let i=7;i>=0;i--){const e=new Date(t0);e.setDate(e.getDate()-i*7);const s=new Date(e);s.setDate(s.getDate()-6);wk.push({s:iso(s),e:iso(e),n:0,c:0})}
  L.forEach(a=>{const d=(a.doneAt||'').slice(0,10),c=(a.createdAt||'').slice(0,10);wk.forEach(w=>{if(d&&d>=w.s&&d<=w.e)w.n++;if(c&&c>=w.s&&c<=w.e)w.c++})});
  const wm=Math.max(1,...wk.map(w=>Math.max(w.n,w.c)));
  const late=L.filter(isLate).sort((a,b)=>(a.due||'').localeCompare(b.due||'')).slice(0,8);
  return `<div class="kpis org-kpis">
   <div class="kpi"><span class="l">${esc(tr('إجمالي التكليفات','Total assignments'))}</span><span class="v num">${T.n}</span><span class="s">${esc(tr(`مفتوح ${T.open}`,`Open ${T.open}`))}</span></div>
   <div class="kpi"><span class="l">${esc(tr('نسبة الإنجاز','Completion rate'))}</span><span class="v num">${T.rate}%</span><span class="s">${esc(tr(`منجز ${T.done}`,`Done ${T.done}`))}</span></div>
   <div class="kpi"><span class="l">${esc(tr('الإنجاز في الموعد','On-time completion'))}</span><span class="v num">${T.onTime==null?'—':T.onTime+'%'}</span><span class="s">${esc(tr('من المنجز','of completed'))}</span></div>
   <div class="kpi ${T.late?'crit':''}"><span class="l">${esc(tr('متأخرة','Overdue'))}</span><span class="v num">${T.late}</span><span class="s">${esc(tr('مفتوحة تجاوزت موعدها','open past due date'))}</span></div>
   <div class="kpi"><span class="l">${esc(tr('متوسط مدة الإنجاز','Average cycle time'))}</span><span class="v num">${T.cycle==null?'—':T.cycle}</span><span class="s">${esc(tr('يوم من الإصدار للاعتماد','days, issue to approval'))}</span></div></div>
  <div class="grid2 xd-grid dt-kg">
   <section class="panel"><div class="xd-ph"><h3 class="section-title">${esc(tr('التكليفات حسب الإدارة والحالة','Assignments by department and status'))}</h3></div>
    <div class="dt-lg">${['done','review','progress','new','hold'].map(k=>`<span><i class="s-${k}"></i>${esc(tr(STATUS[k][0],STATUS[k][1]))}</span>`).join('')}</div>
    <div class="dt-bars">${rows.map(r=>`<button type="button" class="dt-br" data-dt-kpiu="${r.id}"><span class="dt-bl">${esc(uShort(r.id))}</span><span class="dt-bt">${r.s.n?seg(r):''}</span><b class="num">${r.s.n}</b></button>`).join('')}</div></section>
   <section class="panel"><div class="xd-ph"><h3 class="section-title">${esc(tr('آخر 8 أسابيع','Last 8 weeks'))}</h3><div class="dt-lg"><span><i class="s-issued"></i>${esc(tr('صادرة','Issued'))}</span><span><i class="s-done"></i>${esc(tr('معتمدة','Approved'))}</span></div></div>
    <div class="dt-wk">${wk.map(w=>`<div class="dt-wc" data-tip="${fd(w.s)} – ${fd(w.e)}: ${w.c} / ${w.n}"><div class="dt-wb"><i class="s-issued" style="height:${(w.c/wm*100).toFixed(1)}%"></i><i class="s-done" style="height:${(w.n/wm*100).toFixed(1)}%"></i></div><small class="num">${w.e.slice(5).replace('-','/')}</small></div>`).join('')}</div></section></div>
  <section class="panel"><h3 class="section-title">${esc(tr('بطاقة أداء الإدارات','Department scorecard'))}</h3>
   <div class="tablewrap dt-sc"><table><thead><tr><th class="nosort">${esc(tr('الإدارة','Department'))}</th><th class="nosort">${esc(tr('المهام','Duties'))}</th><th class="nosort">${esc(tr('تغطية المهام','Duty coverage'))}</th><th class="nosort">${esc(tr('التكليفات','Assignments'))}</th><th class="nosort">${esc(tr('مفتوحة','Open'))}</th><th class="nosort">${esc(tr('متأخرة','Overdue'))}</th><th class="nosort">${esc(tr('الإنجاز','Done'))}</th><th class="nosort">${esc(tr('في الموعد','On time'))}</th><th class="nosort">${esc(tr('متوسط المدة','Avg. days'))}</th></tr></thead><tbody>
   ${rows.map(r=>`<tr data-dt-unit-k="${r.id}" style="cursor:pointer"><td class="t-strong">${esc(uTitle(r.id))}</td><td class="n">${deptUnits(r.id).reduce((n,x)=>n+dutiesOf(x).length,0)}</td><td><span class="dt-bar sm"><i style="width:${r.c.pct}%"></i></span> <span class="num">${r.c.pct}%</span></td><td class="n">${r.s.n}</td><td class="n">${r.s.open}</td><td class="n ${r.s.late?'crit':''}">${r.s.late}</td><td class="n">${r.s.rate}%</td><td class="n">${r.s.onTime==null?'—':r.s.onTime+'%'}</td><td class="n">${r.s.cycle==null?'—':r.s.cycle}</td></tr>`).join('')}</tbody></table></div></section>
  ${late.length?`<section class="panel"><h3 class="section-title">${esc(tr('تكليفات تحتاج تدخلًا','Assignments that need action'))} <small>${late.length}</small></h3>${late.map(a=>`<div class="alert-row" data-dt-open="${esc(a.id)}" style="cursor:pointer"><span class="pill p-crit">${esc(tr(`متأخر ${-daysLeft(a)} يوم`,`${-daysLeft(a)}d overdue`))}</span><div><b>${esc(a.title)}</b><div class="muted" style="font-size:12px">${esc(uTitle(a.toUnit))} · ${esc(a.assignee||'')}</div></div></div>`).join('')}</section>`:''}`}

/* ----- access & permissions ----- */
function viewAccess(){const m=me()||{},role=m.role||'viewer',u=myU();
  const Y='<span class="dt-y">✓</span>',N='<span class="dt-n">—</span>',P=t=>`<span class="dt-p">${esc(t)}</span>`;
  const mat=[
   [tr('الاطلاع على دليل المهام والهيكل','View duties guide and structure'),Y,Y,Y,Y],
   [tr('رؤية التكليفات','See assignments'),P(tr('كل الإدارات','All')),P(tr('كل الإدارات','All')),P(tr('إدارته فقط','Own department')),P(tr('إدارته فقط','Own department'))],
   [tr('إصدار تكليف','Issue an assignment'),P(tr('لأي إدارة','Any department')),P(tr('لأي إدارة','Any department')),P(tr('داخل إدارته','Within own department')),N],
   [tr('تنفيذ التكليف وتحديث الإنجاز','Work on an assignment'),Y,P(tr('الوارد لإدارته','Incoming to own')),P(tr('الوارد لإدارته','Incoming to own')),N],
   [tr('اعتماد الإنجاز أو إعادته','Approve or send back'),Y,Y,P(tr('ما أصدرته إدارته','Issued by own')),N],
   [tr('حذف تكليف','Delete an assignment'),Y,P(tr('ما أنشأه وهو جديد','Own, while new')),P(tr('ما أنشأه وهو جديد','Own, while new')),N],
   [tr('سجلات الإدارة (إضافة/تعديل)','Department records'),Y,P(tr('كل الإدارات','All')),P(tr('إدارته فقط','Own department')),N],
   [tr('إضافة وتعديل مهام الإدارات','Add or edit department duties'),Y,N,N,N],
   [tr('المستخدمون والأدوار والإعدادات','Users, roles and settings'),Y,N,N,N],
   [tr('سجل العمليات','Activity log'),Y,N,N,N]];
  const can=[];if(role==='admin')can.push(tr('كل الصلاحيات بصفتك مدير النظام.','Full access as administrator.'));
  else{if(u)can.push(tr(`ترى التكليفات الواردة إلى «${uTitle(u)}» والصادرة منها.`,`You see assignments to and from “${uTitle(u)}”.`));else can.push(tr('حسابك غير مربوط بإدارة: لا تظهر لك تكليفات.','Not linked to a department: no assignments shown.'));
   if(role==='editor'&&u)can.push(u==='gm'?tr('تصدر تكليفات لأي إدارة وتعتمد إنجازها.','You can issue to any department and approve.'):tr('تصدر تكليفات داخل إدارتك، وتنفّذ الوارد إليها وترفعه للاعتماد.','You can issue within your department and work on incoming assignments.'));
   if(role==='viewer')can.push(tr('صلاحيتك اطلاع فقط.','You have read-only access.'))}
  return `<div class="grid2 xd-grid"><section class="panel dt-me"><h3 class="section-title">${DI.shield}${esc(tr('صلاحياتك','Your access'))}</h3>
    <dl class="dt-dl"><dt>${esc(tr('الحساب','Account'))}</dt><dd dir="ltr" style="text-align:start">${esc(m.email||'—')}</dd><dt>${esc(tr('الدور','Role'))}</dt><dd>${esc(tr(...(ROLE_L[role]||ROLE_L.viewer)))}</dd><dt>${esc(tr('الإدارة','Department'))}</dt><dd>${u?esc(uTitle(u)):'—'}</dd></dl>
    <ul class="dt-can">${can.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section>
   <section class="panel"><h3 class="section-title">${esc(tr('كيف تُحمى البيانات','How data is protected'))}</h3><ul class="dt-can">
    <li>${esc(tr('الصلاحيات مفروضة في قواعد Firestore على الخادم، لا في الواجهة فقط: لا يستطيع أحد قراءة تكليفات إدارة أخرى حتى لو عدّل الصفحة.','Permissions are enforced by Firestore rules on the server, not only in the page.'))}</li>
    <li>${esc(tr('كل تكليف يحفظ سجل متابعة لا يُحذف منه (من فعل ماذا ومتى).','Each assignment keeps an append-only activity trail.'))}</li>
    <li>${esc(tr('الإدارة المكلَّفة لا تستطيع اعتماد عملها بنفسها؛ الاعتماد للجهة المُصدِرة.','The assigned department cannot approve its own work.'))}</li>
    <li>${esc(tr('ربط المستخدم بإدارته وتحديد دوره من صلاحية مدير النظام وحده.','Only the administrator links users to departments and sets roles.'))}</li></ul></section></div>
  <section class="panel"><h3 class="section-title">${esc(tr('مصفوفة التخويلات','Permission matrix'))} <small>${esc(tr('مطابقة لقواعد الحماية في firestore.rules','mirrors firestore.rules'))}</small></h3>
   <div class="tablewrap dt-mx"><table><thead><tr><th class="nosort">${esc(tr('الإجراء','Action'))}</th><th class="nosort">${esc(tr('مدير النظام','Administrator'))}</th><th class="nosort">${esc(tr('محرر الإدارة العامة','General Admin. editor'))}</th><th class="nosort">${esc(tr('محرر إدارة','Department editor'))}</th><th class="nosort">${esc(tr('مشاهد','Viewer'))}</th></tr></thead>
   <tbody>${mat.map(r=>`<tr><td class="t-strong">${esc(r[0])}</td>${r.slice(1).map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
   <p class="muted" style="font-size:12px;margin:8px 0 0">${esc(tr('عضو مجلس الإدارة: يطّلع على كل التكليفات ولا يصدرها إلا داخل جهته.','Board member: sees every assignment and issues only within their own unit.'))}</p></section>
  ${isAdmin()?`<section class="panel"><div class="xd-ph"><h3 class="section-title">${esc(tr('المستخدمون وتخويلاتهم','Users and their access'))}</h3><div class="dt-acts"><button class="btn sm" data-dt="roles-reload">${esc(tr('تحديث','Refresh'))}</button><button class="btn sm ghost" data-dt-gov="meetings">${esc(tr('ربط المستخدمين بالإدارات','Link users to departments'))}</button><button class="btn sm ghost" data-dt-gov="settings">${esc(tr('إضافة مستخدم / تغيير الدور','Add user / change role'))}</button></div></div><div id="dt-roles">${rolesHTML()}</div></section>
   <section class="panel"><h3 class="section-title">${DI.shield}${esc(tr('فحص الأمان قبل التسليم','Pre-handover security check'))}</h3><ul class="dt-chk">${secChecks().map(c=>`<li class="${c[0]}"><span>${c[0]==='ok'?'✓':c[0]==='warn'?'!':'✕'}</span><div><b>${esc(c[1])}</b>${c[2]?`<small>${esc(c[2])}</small>`:''}</div></li>`).join('')}</ul></section>`:''}`}
function rolesHTML(){if(!DT.roles||DT.roles.loading)return `<div class="muted">${esc(tr('جارٍ التحميل…','Loading…'))}</div>`;if(DT.roles.err)return `<div class="banner">${esc(DT.roles.err)}</div>`;
  const r=DT.roles.list;return `<div class="tablewrap" style="min-height:0"><table><thead><tr><th class="nosort">${esc(tr('البريد','Email'))}</th><th class="nosort">${esc(tr('الاسم','Name'))}</th><th class="nosort">${esc(tr('الدور','Role'))}</th><th class="nosort">${esc(tr('الإدارة','Department'))}</th><th class="nosort">${esc(tr('ملاحظة','Note'))}</th></tr></thead><tbody>
   ${r.map(x=>{const warn=x.role!=='admin'&&!x.unit?tr('غير مربوط بإدارة','Not linked to a department'):x.role==='editor'&&x.unit==='gm'?tr('يرى ويصدر لكل الإدارات','Sees and issues to all'):'';
    return `<tr><td dir="ltr" style="text-align:start">${esc(x.email)}</td><td>${esc(x.name||'')}</td><td><span class="pill ${x.role==='admin'?'p-crit':x.role==='editor'?'p-info':'p-neutral'}">${esc(tr(...(ROLE_L[x.role]||[x.role,x.role])))}</span></td><td>${x.unit?esc(uShort(x.unit)):'—'}</td><td>${warn?`<small class="${!x.unit?'crit':''}">${esc(warn)}</small>`:''}</td></tr>`}).join('')}</tbody></table></div>`}
function secChecks(){const r=DT.roles&&DT.roles.list||[],admins=r.filter(x=>x.role==='admin').length,loose=r.filter(x=>x.role!=='admin'&&!x.unit).length;
  return [[DT.rulesOk===false?'crit':DT.rulesOk?'ok':'warn',tr('قواعد الحماية الجديدة منشورة في Firebase','New security rules are published'),DT.rulesOk===false?tr('القراءة رُفضت: انشر firestore.rules من لوحة Firebase.','Read denied: publish firestore.rules in Firebase.'):DT.rulesOk?'':tr('لم يُتحقق بعد.','Not verified yet.')],
   [admins>=2?'ok':'warn',tr(`عدد مديري النظام: ${admins}`,`Administrators: ${admins}`),admins>=2?'':tr('يُنصح بمديرَين اثنين (أساسي واحتياطي) حتى لا تُفقد السيطرة.','Keep two administrators (main and backup).')],
   [admins>4?'warn':'ok',tr('صلاحية مدير النظام محصورة','Admin rights are limited'),admins>4?tr('عدد المديرين كبير، راجعهم.','Many admins; review them.'):''],
   [loose?'warn':'ok',tr(`مستخدمون غير مربوطين بإدارة: ${loose}`,`Users without a department: ${loose}`),loose?tr('اربطهم من صفحة الاجتماعات المغلقة حتى تظهر لهم مهامهم.','Link them so they see their work.'):''],
   [location.protocol==='https:'||location.hostname==='localhost'?'ok':'crit',tr('الاتصال مشفّر (HTTPS)','Connection is encrypted (HTTPS)'),'']]}
async function loadRoles(){if(!isAdmin())return;try{const qs=await FS().collection('roles').get();const list=[];qs.forEach(d=>list.push(Object.assign({email:d.id},d.data())));
  list.sort((a,b)=>({admin:0,editor:1,viewer:2}[a.role]??3)-({admin:0,editor:1,viewer:2}[b.role]??3)||a.email.localeCompare(b.email));DT.roles={list}}catch(e){DT.roles={err:errMsg(e),list:[]}}
  const el=document.getElementById('dt-roles');if(el&&S.view==='duties'&&DT.ui.tab==='access')keepScroll(render)}

/* ----- admin: add / edit a department's duties ----- */
function dutiesForm(pre){if(!isAdmin())return;const sel=pre||'';const cur=sel&&ORG_DUTIES[sel];const m=META[sel]||{};const src=(m.admin&&m.src)||{kind:'job'};
  const units=[ORG_BY.get('gm'),...orgAll('gm')].filter(Boolean);
  const lines=cur?dutiesOf(sel).map(d=>(d.tag?d.tag+': ':'')+d.txt).join('\n'):'';
  modal(tr('إضافة / تعديل مهام إدارة','Add / edit department duties'),`<fieldset><legend>${esc(tr('الجهة والمصدر','Unit and source'))}</legend>
   <div class="field full"><label for="d-unit">${esc(tr('الجهة','Unit'))}<span class="req">*</span></label><select id="d-unit"><option value=""></option>${units.map(o=>`<option value="${o.id}" ${o.id===sel?'selected':''}>${'  '.repeat(Math.max(0,orgPath(o.id).length-3))}${esc(o.title)}${dutiesOf(o.id).length?' ✓':''}</option>`).join('')}</select></div>
   <div class="field"><label for="d-kind">${esc(tr('نوع الوثيقة','Document type'))}</label><select id="d-kind">${Object.keys(SRC_KIND).map(k=>`<option value="${k}" ${src.kind===k?'selected':''}>${esc(tr(...SRC_KIND[k]))}</option>`).join('')}</select></div>
   ${F('d-ref',tr('رقم الإشاري','Reference no.'),src.ref||'')}${F('d-title',tr('عنوان الوثيقة','Document title'),src.title||'',{full:1})}${F('d-date',tr('تاريخ الوثيقة','Document date'),src.date||'',{type:'date'})}</fieldset>
   <fieldset><legend>${esc(tr('المهام','Duties'))}</legend>
   <div class="field full"><label for="d-lead">${esc(tr('العبارة التمهيدية','Lead sentence'))}</label><input id="d-lead" value="${esc(cur?cur.lead:'')}" placeholder="${esc(tr('مثال: يتولى القسم المهام الآتية:','e.g. The section is responsible for:'))}"></div>
   <div class="field full"><label for="d-items">${esc(tr('المهام: كل مهمة في سطر','Duties: one per line'))}<span class="req">*</span></label><textarea id="d-items" rows="10" placeholder="${esc(tr('التقارير: إعداد التقارير الشهرية ورفعها…\nمتابعة المواضيع الواردة…','Reports: prepare monthly reports…'))}">${esc(lines)}</textarea>
    <span class="hint" id="d-hint">${esc(tr('اكتب «المجال: النص» ليُصنَّف السطر، أو النص فقط. ضع (؟) في آخر السطر إذا كانت القراءة غير مؤكدة.','Write “Area: text” to tag a line, or just the text. End a line with (?) if the reading is uncertain.'))}</span></div></fieldset>`,
  `<button type="submit" class="btn primary" data-dt="save-duties">${esc(tr('حفظ ونشر','Save & publish'))}</button><button type="button" class="btn" data-act="close-dlg">${esc(tr('إلغاء','Cancel'))}</button>${sel&&OVR[sel]?`<button type="button" class="btn danger" data-dt="del-duties" data-u="${sel}" style="margin-inline-start:auto">${esc(tr('حذف التعديل','Remove override'))}</button>`:''}<span id="f-err" class="dt-err"></span>`);
  const us=document.getElementById('d-unit'),ta=document.getElementById('d-items'),h=document.getElementById('d-hint');
  const cnt=()=>{const n=ta.value.split('\n').filter(x=>x.trim()).length;h.dataset.n=n};ta.addEventListener('input',cnt);
  us.addEventListener('change',()=>{const id=us.value;if(!ta.value.trim()&&ORG_DUTIES[id]){ta.value=dutiesOf(id).map(d=>(d.tag?d.tag+': ':'')+d.txt).join('\n');document.getElementById('d-lead').value=ORG_DUTIES[id].lead||''}})}
async function saveDuties(){const err=document.getElementById('f-err'),id=val('d-unit');if(!id){err.textContent=tr('اختر الجهة.','Choose the unit.');return}
  const items=document.getElementById('d-items').value.split('\n').map(x=>x.trim()).filter(Boolean).slice(0,80).map(x=>{let u=false;if(/\(\s*[؟?]\s*\)$/.test(x)){u=true;x=x.replace(/\(\s*[؟?]\s*\)$/,'').trim()}
    const m=x.match(/^([^:：]{2,30})\s*[:：]\s*(.+)$/);return m?{t:m[1].trim(),x:m[2].trim().slice(0,1000),u}:{t:tr('عام','General'),x:x.slice(0,1000),u}});
  if(!items.length){err.textContent=tr('أدخل مهمة واحدة على الأقل.','Enter at least one duty.');return}
  const m=me()||{};const doc={lead:val('d-lead').slice(0,400),items,src:{kind:val('d-kind')||'other',title:val('d-title').slice(0,200),ref:val('d-ref').slice(0,60),date:val('d-date')},by:m.email||'',byName:m.name||'',at:nowISO()};
  try{await FS().collection('duties').doc(id).set(doc);dlg.close();DT.ui.unit=id;DT.ui.tab='guide';toast(tr('تم نشر المهام','Duties published'))}catch(e){err.textContent=errMsg(e)}}

/* ----- exports & print ----- */
function exportDuties(){const rows=[];ORG_DUTY_ORDER.forEach(id=>{const o=ORG_BY.get(id),s=srcOf(id);dutiesOf(id).forEach((d,i)=>rows.push({'الجهة':o.title,'الإدارة':uShort(deptOf(id)),'م':i+1,'المجال':d.tag,'المهمة':d.txt,'تدقيق':d.u?'نعم':'','المصدر':srcLabel(s),'المسؤول':o.vacant?'شاغرة':o.head}))});
  saveXlsx([['مهام الإدارات',rows],['التكليفات',taskRows(all())]],'مهام-الإدارات-'+TODAY_ISO+'.xlsx')}
function taskRows(L){return L.map(a=>{const d=dutyRef(a);return {'الرقم':a.no||'','الموضوع':a.title,'من':uTitle(a.fromUnit),'إلى':uTitle(a.toUnit),'القسم/الوحدة':a.subUnit?uTitle(a.subUnit):'','المهمة':d?d.n+'. '+d.it.tag:'','المكلف':a.assignee||'','الأولوية':(PRIO[a.priority]||PRIO.normal)[0],'تاريخ الإصدار':a.start||'','الموعد':a.due||'','الحالة':(STATUS[a.status]||STATUS.new)[0],'متأخر':isLate(a)?'نعم':'','الإنجاز %':a.status==='done'?100:Number(a.progress)||0,'تاريخ الاعتماد':(a.doneAt||'').slice(0,10),'أصدره':a.createdByName||a.createdBy||''}})}
function printUnit(id){const o=ORG_BY.get(id),m=META[id]||{},en=EN(),T=(a,b)=>esc(en&&b?b:a),logo=(document.querySelector('.side img, header img, .lg-card img')||{}).src||'';
  const sec=(x,head)=>{const ds=dutiesOf(x);if(!ds.length)return '';const xo=ORG_BY.get(x),mm=META[x]||{};return `<section class="du">${head?`<h3>${esc(xo.title)} <small>${esc(typeL(xo))} · ${xo.vacant?T('شاغرة','Vacant'):esc(xo.head)}</small></h3>`:''}${ORG_DUTIES[x].lead?`<p class="lead">${T(ORG_DUTIES[x].lead,mm.leadEn)}</p>`:''}<ol>${ds.map(d=>`<li><b>${T(d.tag,d.tagEn)}</b><span>${T(d.txt,d.txtEn)}${d.u?` <i class="u">${T('تدقيق','verify')}</i>`:''}</span></li>`).join('')}</ol></section>`};
  const j=m.job;const w=window.open('','_blank');if(!w){toast(tr('اسمح بفتح النوافذ المنبثقة لتصدير PDF','Allow pop-ups to export PDF'));return}
  w.document.open();w.document.write(`<!doctype html><html lang="${en?'en':'ar'}" dir="${en?'ltr':'rtl'}"><head><meta charset="utf-8"><title>${T('بطاقة مهام','Duties card')} — ${esc(o.title)}</title><style>
@page{size:A4;margin:14mm 12mm 16mm}*{box-sizing:border-box}body{font-family:Arial,Arimo,"Noto Sans Arabic",Tahoma,sans-serif;font-weight:700;color:#13263a;margin:0;font-size:11.5px;line-height:1.7;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.hd{display:flex;align-items:center;gap:14px;border-bottom:3px solid #0b5c8a;padding-bottom:10px;margin-bottom:12px}.hd img{width:64px}.hd h1{margin:0;font-size:19px}.hd p{margin:0;color:#5d6d7e}
.src{border:1px solid #dce3ea;border-radius:8px;padding:8px 12px;margin:0 0 12px;background:#f7f9fb}.src b{color:#0b5c8a}
.du{border:1px solid #dce3ea;border-radius:10px;margin:0 0 12px;overflow:hidden;break-inside:avoid-page}.du h3{margin:0;padding:8px 12px;background:#f2f4f6;font-size:13.5px}.du h3 small{color:#5d6d7e;font-size:10.5px}
.lead{margin:0;padding:8px 12px 0;color:#5d6d7e}.du ol{list-style:none;margin:0;padding:6px 12px 10px;counter-reset:d}.du li{display:grid;grid-template-columns:22px 100px 1fr;gap:8px;padding:5px 0;border-top:1px dashed #e9eef3;counter-increment:d;break-inside:avoid}.du li:first-child{border-top:0}
.du li::before{content:counter(d);width:20px;height:20px;border-radius:6px;background:#e3eff7;color:#0b5c8a;display:grid;place-items:center;font-size:10.5px}.du li b{color:#5d6d7e;font-size:10.5px}.u{font-style:normal;color:#a86a0c;font-size:10px}
.job{display:grid;grid-template-columns:1fr 1fr;gap:10px}.job div{border:1px solid #dce3ea;border-radius:8px;padding:8px 10px;break-inside:avoid}.job h4{margin:0 0 4px;color:#0b5c8a;font-size:12px}.job ul{margin:0;padding-inline-start:18px}
.sig{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:26px;break-inside:avoid}.sig div{border-top:1px solid #8ea3b8;padding-top:6px;text-align:center;color:#5d6d7e;font-size:10.5px;min-height:46px}
.ft{margin-top:14px;color:#8ea3b8;font-size:10px;display:flex;justify-content:space-between}</style></head><body>
<div class="hd">${logo?`<img src="${logo}" alt="">`:''}<div><p>${T('شركة البريقة لتسويق النفط · الإدارة العامة للمبيعات والشؤون التجارية','Brega Petroleum Marketing Co. · General Administration for Sales & Commercial Affairs')}</p><h1>${T('بطاقة المهام والاختصاصات','Duties & responsibilities card')}: ${esc(o.title)}</h1><p>${esc(typeL(o))} · ${o.vacant?T('شاغرة','Vacant'):esc(o.head)}${o.empNo?' · '+esc(o.empNo):''}</p></div></div>
${m.src?`<div class="src">${T('المصدر','Source')}: <b>${esc(srcLabel(m.src))}</b>${m.src.note?' · '+T(m.src.note,m.src.noteEn):''}</div>`:''}
${m.purpose?`<section class="du"><h3>${T('الغرض من الوظيفة','Job purpose')}</h3><ol>${m.purpose.map(p=>`<li><b></b><span>${T(p[0],p[1])}</span></li>`).join('')}</ol></section>`:''}
${sec(id,false)}${orgAll(id).filter(x=>dutiesOf(x.id).length).map(x=>sec(x.id,true)).join('')}
${j?`<h3 style="font-size:14px;margin:14px 0 8px">${T('بطاقة الوصف الوظيفي','Job description')}</h3><div class="job"><div><h4>${T('مسمى الوظيفة','Job title')}</h4>${T(j.title,j.titleEn)}<br>${T('الفئة','Grade')}: ${esc(j.grade)} · ${T('المسؤول المباشر','Reports to')}: ${T(j.reportsTo,j.reportsToEn)}</div>
<div><h4>${T('المسؤولية الإشرافية','Supervises')}</h4><ul>${j.supervises.map(x=>`<li>${T(x[0],x[1])}</li>`).join('')}</ul></div>
<div><h4>${T('متطلبات الإشغال','Requirements')}</h4>${T(j.qualification[0],j.qualification[1])} · ${T(j.experience[0],j.experience[1])}<ul>${j.training.map(x=>`<li>${T(x[0],x[1])}</li>`).join('')}</ul></div>
<div><h4>${T('المهارات','Skills')}</h4>${[...j.skills.tech,...j.skills.admin,...j.skills.personal].map(x=>T(x[0],x[1])).join(' · ')}</div></div>`:''}
<div class="sig"><div>${T('شاغل الوظيفة','Job holder')}</div><div>${T('المسؤول المباشر','Direct manager')}</div><div>${T('إدارة الموارد البشرية','Human Resources')}</div></div>
<div class="ft"><span>${T('صادر من منظومة الإدارة العامة للمبيعات والشؤون التجارية','Issued by the Sales & Commercial Affairs system')}</span><span>${fd(TODAY_ISO)}</span></div></body></html>`);w.document.close();setTimeout(()=>{try{w.focus();w.print()}catch(e){}},400)}

/* ----- executive dashboard panel ----- */
function dashPanel(){const L=all();if(!me())return '';const T=stats(L);
  const rows=MAIN.map(id=>({id,s:stats(deptList(id)),c:coverage(id)}));const mx=Math.max(1,...rows.map(r=>r.s.n));
  return `<section class="panel dt-dash"><div class="xd-ph"><h3 class="section-title">${I.duty}${esc(tr('مهام الإدارات والتكليفات','Department duties & assignments'))} <small>${esc(tr('اضغط للانتقال','click to open'))}</small></h3><button class="btn sm" data-dt-go="">${esc(tr('مركز المهام','Duties centre'))}</button></div>
   <div class="dt-dk">${[[tr('مهام موثّقة','Documented duties'),ORG_DUTY_ORDER.reduce((n,id)=>n+dutiesOf(id).length,0),'guide',''],[tr('تكليفات مفتوحة','Open'),T.open,'tasks',''],[tr('متأخرة','Overdue'),T.late,'tasks',T.late?'crit':''],[tr('بانتظار الاعتماد','Awaiting approval'),T.review,'tasks',T.review?'warn':''],[tr('نسبة الإنجاز','Completion'),T.rate+'%','kpi','']].map(([l,v,t,c])=>`<button type="button" class="dt-dkc ${c}" data-dt-go="" data-dt-tab2="${t}"><b class="num">${v}</b><span>${esc(l)}</span></button>`).join('')}</div>
   <div class="dt-bars">${rows.map(r=>`<button type="button" class="dt-br" data-dt-go="${r.id}"><span class="dt-bl">${esc(uShort(r.id))}</span><span class="dt-bt"><span class="dt-bar"><i style="width:${r.c.pct}%"></i></span></span><b class="num">${r.c.pct}%</b><small>${r.s.open} ${esc(tr('مفتوح','open'))}${r.s.late?` · <span class="crit">${r.s.late} ${esc(tr('متأخر','late'))}</span>`:''}</small></button>`).join('')}</div>
   <p class="muted" style="font-size:12px;margin:8px 0 0">${esc(tr('النسبة = مهام الإدارة التي عليها تكليف أو سجل من إجمالي مهامها الموثّقة.','Percentage = duties with at least one assignment or record, out of the documented duties.'))}</p></section>`}

/* ---------- events ---------- */
function after(){const q=document.getElementById('dt-q');if(q)q.addEventListener('input',debounce(()=>{DT.ui.q=q.value;const p=q.selectionStart;render();const n=document.getElementById('dt-q');if(n){n.focus();try{n.setSelectionRange(p,p)}catch(e){}}},200));
  const kq=document.getElementById('dt-kq');if(kq)kq.addEventListener('input',debounce(()=>{DT.ui.kq=kq.value;const p=kq.selectionStart;render();const n=document.getElementById('dt-kq');if(n){n.focus();try{n.setSelectionRange(p,p)}catch(e){}}},250));
  const sc=document.getElementById('dt-scope');if(sc)sc.addEventListener('change',()=>{DT.ui.scope=sc.value;render()});
  const uu=document.getElementById('dt-u');if(uu)uu.addEventListener('change',()=>{DT.ui.u=uu.value;render()});
  if(DT.ui.tab==='access'&&isAdmin()&&!DT.roles){DT.roles={loading:true};loadRoles()}}
function setTab(t,extra){Object.assign(DT.ui,{tab:t},extra||{});render();const b=document.querySelector('.dt-tabs');if(b&&b.getBoundingClientRect().top<0)b.scrollIntoView({block:'start'})}
document.addEventListener('click',async e=>{
  const go2=e.target.closest('[data-dt-go]');if(go2){e.preventDefault();const u=go2.dataset.dtGo;Object.assign(DT.ui,{tab:go2.dataset.dtTab2||'guide',unit:u||''});go('duties');return}
  if(S.view!=='duties'&&!e.target.closest('.drawer[data-dt]'))return;
  const tab=e.target.closest('[data-dt-tab]');if(tab){const ex={};if(tab.dataset.dtF)ex.f=tab.dataset.dtF;if(tab.dataset.dtTab==='guide')ex.unit='';setTab(tab.dataset.dtTab,ex);if(tab.dataset.dtCov){const c=document.getElementById('dt-cov');if(c)c.scrollIntoView({behavior:'smooth'})}return}
  const un=e.target.closest('[data-dt-unit]');if(un&&!e.target.closest('[data-dt]')){DT.ui.unit=un.dataset.dtUnit;DT.ui.tab='guide';render();window.scrollTo(0,0);return}
  const uk=e.target.closest('[data-dt-unit-k],[data-dt-kpiu]');if(uk){setTab('tasks',{u:uk.dataset.dtUnitK||uk.dataset.dtKpiu,f:'all',duty:''});return}
  const of=e.target.closest('[data-org-focus-dt]');if(of){DT.ui.unit=of.dataset.orgFocusDt;render();window.scrollTo(0,0);return}
  const du=e.target.closest('[data-dt-duty]');if(du){setTab('tasks',{duty:du.dataset.dtDuty,f:du.dataset.dtDuty?'all':DT.ui.f,u:''});return}
  const f=e.target.closest('[data-dt-f]');if(f){DT.ui.f=f.dataset.dtF;render();return}
  const vw=e.target.closest('[data-dt-vw]');if(vw){DT.ui.vw=vw.dataset.dtVw;render();return}
  const od=e.target.closest('[data-dt-orgdash]');if(od){go('org',{om:'dash',of:od.dataset.dtOrgdash});return}
  const gv=e.target.closest('[data-dt-gov]');if(gv){go(gv.dataset.dtGov);return}
  const op=e.target.closest('[data-dt-open]');if(op){openTask(op.dataset.dtOpen);return}
  const ac=e.target.closest('[data-dt-a]');if(ac){const a=DT.list.get(DT.open);if(!a)return;const k=ac.dataset.dtA;
    if(k==='edit'){taskForm(a);return}
    if(k==='delete'){if(!ac.classList.contains('armed')){ac.classList.add('armed');ac.textContent=tr('تأكيد الحذف','Confirm delete');setTimeout(()=>{ac.classList.remove('armed');ac.textContent=tr('حذف','Delete')},4000);return}
      try{await FS().collection('assignments').doc(a.id).delete();closeDrawer();DT.open=null;toast(tr('تم حذف التكليف','Assignment deleted'))}catch(err){toast(errMsg(err))}return}
    actForm(k,a);return}
  const dd=e.target.closest('[data-dt-do]');if(dd){const k=dd.dataset.dtDo;if(!k){document.getElementById('dt-act-form').innerHTML='';return}const a=DT.list.get(DT.open);if(!a)return;dd.disabled=true;try{await doAct(k,a)}finally{dd.disabled=false}return}
  const b=e.target.closest('[data-dt]');if(!b)return;const k=b.dataset.dt;
  if(k==='new'){e.preventDefault();if(!canIssue()){toast(tr('لا تملك صلاحية إصدار التكليفات','You cannot issue assignments'));return}if(dlg.open)dlg.close();taskForm(null,{u:b.dataset.u,n:b.dataset.n});return}
  if(k==='save'){e.preventDefault();b.disabled=true;try{await saveTask(b.dataset.id||null)}finally{b.disabled=false}return}
  if(k==='add-duties'){e.preventDefault();dutiesForm(b.dataset.u||DT.ui.unit||'');return}
  if(k==='save-duties'){e.preventDefault();b.disabled=true;try{await saveDuties()}finally{b.disabled=false}return}
  if(k==='del-duties'){e.preventDefault();if(!b.classList.contains('armed')){b.classList.add('armed');b.textContent=tr('تأكيد','Confirm');return}try{await FS().collection('duties').doc(b.dataset.u).delete();dlg.close();toast(tr('أُزيل التعديل وعادت المهام الأصلية','Override removed'))}catch(err){document.getElementById('f-err').textContent=errMsg(err)}return}
  if(k==='xlsx'){exportDuties();return}
  if(k==='xlsx-tasks'){saveXlsx([['التكليفات',taskRows(filtered())]],'التكليفات-'+TODAY_ISO+'.xlsx');return}
  if(k==='print-unit'){printUnit(b.dataset.u);return}
  if(k==='roles-reload'){DT.roles=null;render();return}
},true);
document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const t=e.target.closest&&e.target.closest('tr[data-dt-open],article[data-dt-unit]');if(!t)return;e.preventDefault();t.click()});

/* ---------- styles ---------- */
(function(){const st=document.createElement('style');st.id='dt-css';st.textContent=`
.dt-hero .xd-hk{all:unset;box-sizing:border-box;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:12px 14px;display:flex;flex-direction:column;gap:2px;cursor:pointer;min-width:0}
.dt-hero .xd-hk:hover,.dt-hero .xd-hk:focus-visible{background:rgba(255,255,255,.11);border-color:rgba(124,196,236,.55)}
.dt-of{font-size:15px;color:#8ea9c1;font-weight:700}
.dt-tabs{display:flex;gap:4px;border-bottom:1px solid var(--line);overflow-x:auto;scrollbar-width:none;position:sticky;top:0;z-index:5;background:var(--bg);padding-top:4px}
.dt-tabs button{border:0;background:transparent;font:inherit;font-size:14px;color:var(--muted);padding:10px 14px;border-bottom:3px solid transparent;cursor:pointer;white-space:nowrap;display:inline-flex;gap:6px;align-items:center}
.dt-tabs button[aria-selected="true"]{color:var(--ink);border-bottom-color:var(--accent)}.dt-tabs button:hover{color:var(--ink)}
.dt-tc{background:var(--accent);color:#fff;border-radius:999px;font-size:11px;padding:0 7px;line-height:18px}
#dt-body{display:flex;flex-direction:column;gap:14px;margin-top:14px}
.dt-acts{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.dt-card{cursor:pointer}.dt-card:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.dt-src{display:inline-flex;align-items:center;gap:5px;margin-top:6px;font-size:11.5px;color:var(--muted);border:1px dashed var(--line);border-radius:6px;padding:1px 7px}.dt-src svg{width:13px;height:13px}
.dt-src.s-job{color:var(--info);border-color:color-mix(in srgb,var(--info) 40%,transparent)}.dt-src.s-memo{color:var(--warn);border-color:color-mix(in srgb,var(--warn) 40%,transparent)}.dt-src.s-decree{color:var(--accent)}
.dt-cms{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:14px}
.dt-cm{border:1px solid var(--line2);border-radius:10px;padding:12px;background:var(--surface2)}
.dt-cm-h{display:flex;align-items:center;gap:10px;margin-bottom:8px}.dt-cm-h b{font-size:14px}.dt-cm-h .num{color:var(--muted);font-size:12.5px}.dt-cm-h .dt-bar{flex:1}
.dt-bar{display:inline-block;height:7px;border-radius:999px;background:var(--line2);overflow:hidden;min-width:60px;vertical-align:middle}.dt-bar i{display:block;height:100%;background:var(--ok);border-radius:999px}.dt-bar.sm{width:80px}
.dt-cm-k{display:flex;flex-wrap:wrap;gap:6px}
.dt-chip{all:unset;cursor:pointer;font-size:12px;padding:3px 9px;border-radius:999px;border:1px dashed var(--line);color:var(--muted);background:var(--surface)}
.dt-chip.on{border-style:solid;border-color:color-mix(in srgb,var(--ok) 45%,transparent);color:var(--ok);background:var(--ok-soft)}.dt-chip:hover,.dt-chip:focus-visible{border-color:var(--accent);color:var(--accent)}
.dt-hits{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}.dt-hits li{display:grid;grid-template-columns:auto 1fr auto;gap:10px;padding:8px 4px;border-top:1px solid var(--line2);cursor:pointer;align-items:start}.dt-hits li:hover{background:var(--surface2)}.dt-hits small{color:var(--muted)}
.dt-crumbs{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12.5px;color:var(--muted)}.dt-cr{all:unset;cursor:pointer;color:var(--accent)}.dt-cr:hover{text-decoration:underline}
.dt-uh{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px 20px;background:var(--surface);border:1px solid var(--line);border-top:4px solid var(--c,var(--accent));border-radius:12px;padding:18px;box-shadow:var(--shadow)}
.dt-uh h2{margin:6px 0 2px;font-family:var(--f-display);font-size:21px;line-height:1.35}.dt-uh p{margin:0;color:var(--muted)}
.dt-uh-k{display:grid;grid-template-columns:repeat(4,minmax(70px,1fr));gap:8px;align-self:start}.dt-uh-k div{border:1px solid var(--line2);border-radius:10px;padding:8px;text-align:center;background:var(--surface2)}.dt-uh-k b{display:block;font-size:22px;font-family:var(--f-display)}.dt-uh-k span{font-size:11.5px;color:var(--muted)}.dt-uh-k .crit b{color:var(--crit)}
.dt-uh-a{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px}
.dt-srcbox{display:flex;gap:10px;align-items:flex-start;margin-top:12px;border:1px solid var(--line2);border-inline-start:4px solid var(--accent);border-radius:8px;padding:9px 12px;background:var(--surface2);max-width:640px}
.dt-srcbox.s-job{border-inline-start-color:var(--info)}.dt-srcbox.s-memo{border-inline-start-color:var(--warn)}
.dt-srcbox svg{width:20px;height:20px;flex:none;color:var(--muted);margin-top:2px}.dt-srcbox div{display:flex;flex-direction:column;gap:1px}.dt-srcbox span{font-size:11.5px;color:var(--muted)}.dt-srcbox small{color:var(--muted);font-size:11.5px}
.dt-srcline{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 18px 6px;font-size:12.5px;color:var(--muted)}.dt-srcline svg{width:15px;height:15px}.dt-srcline b{color:var(--ink)}
.dt-purpose ul{margin:0;padding-inline-start:20px;display:flex;flex-direction:column;gap:4px}
.dt-dus{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,380px),1fr));gap:10px}
.dt-du{display:flex;gap:12px;border:1px solid var(--line);border-radius:10px;padding:12px;background:var(--surface);transition:border-color .15s}.dt-du:hover{border-color:var(--accent)}
.dt-du-b{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}.dt-du-t{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.dt-du p{margin:0;line-height:1.75}
.dt-du-m{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;font-size:12px;color:var(--muted);margin-top:auto;padding-top:6px;border-top:1px dashed var(--line2)}
.dt-du-m>button:not(.btn){all:unset;cursor:pointer;color:var(--accent)}.dt-du-m>button:not(.btn):hover{text-decoration:underline}.dt-du-m b{color:var(--ink)}.dt-du-m .crit{color:var(--crit)}
.dt-assign{margin-inline-start:auto;height:28px}.dt-assign svg,.dt-uh-a svg,.dt-tb svg,.dt-empty svg{width:15px;height:15px}
.dt-sub{border-inline-start:4px solid var(--c,var(--accent))}.dt-sub-h{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;margin-bottom:6px}.dt-sub-h h3{margin:4px 0 0;font-size:15px}.dt-sub-h p{margin:0;font-size:12.5px}
.dt-await{border-style:dashed;text-align:start}.dt-await p{margin:4px 0 10px}
.dt-job .section-title svg{width:18px;height:18px}
.dt-job-top{display:grid;grid-template-columns:2fr repeat(4,minmax(0,1fr));gap:10px;margin-bottom:12px}
.dt-job-top>div{border:1px solid var(--line2);border-radius:10px;padding:10px 12px;background:var(--surface2);display:flex;flex-direction:column;gap:2px;min-width:0}.dt-job-top span{font-size:11.5px;color:var(--muted)}.dt-job-top b{font-size:13.5px;line-height:1.5}.dt-jt b{font-size:15px}.dt-job-top small.ok{color:var(--ok);font-size:11.5px}
.dt-job-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:12px}
.dt-job-grid>div{border:1px solid var(--line2);border-radius:10px;padding:12px}.dt-job-grid h4{margin:0 0 8px;font-size:13px;color:var(--accent)}.dt-job-grid ul{margin:0;padding-inline-start:18px;display:flex;flex-direction:column;gap:3px;font-size:13px}.dt-job-grid p{margin:0 0 6px;font-size:13px}
.dt-job-grid dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 10px;font-size:13px}.dt-job-grid dt{color:var(--muted)}.dt-job-grid dd{margin:0}
.dt-tl{list-style:none!important;padding:0!important}.dt-tl li{display:flex;gap:6px;align-items:center}
.dt-sk{display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin-bottom:6px}.dt-sk span{font-size:11.5px;color:var(--muted);min-width:44px}.dt-sk i{font-style:normal;font-size:12px;background:var(--accent-soft);color:var(--accent);border-radius:999px;padding:2px 9px}
.dt-mis{margin-top:12px}
.dt-tb .grow{min-width:200px}.dt-tb .xd-seg button{display:inline-flex;gap:5px;align-items:center}.dt-tb .xd-seg svg{width:14px;height:14px}
.dt-dfilter{font-size:13px;display:flex;gap:6px;align-items:center;background:var(--accent-soft);border-radius:8px;padding:4px 10px;width:max-content;max-width:100%}
.dt-tw tbody tr{cursor:pointer}.dt-tw tr.dt-late td:first-child{box-shadow:inset -3px 0 0 var(--crit)}[dir=ltr] .dt-tw tr.dt-late td:first-child{box-shadow:inset 3px 0 0 var(--crit)}
.dt-tw td.wrap{white-space:normal;min-width:200px;max-width:360px}
.dt-due{display:block;font-size:11px;color:var(--muted)}.dt-due.warn{color:var(--warn)}.dt-due.crit{color:var(--crit)}
.dt-pc{white-space:nowrap}.dt-pb{display:inline-block;width:56px;height:7px;border-radius:999px;background:var(--line2);overflow:hidden;vertical-align:middle;margin-inline-end:6px}.dt-pb i{display:block;height:100%;background:var(--accent)}.dt-pb.done i{background:var(--ok)}.dt-pb.late i{background:var(--crit)}
.dt-board{display:grid;grid-template-columns:repeat(5,minmax(220px,1fr));gap:10px;overflow-x:auto;padding-bottom:6px}
.dt-col{background:var(--surface2);border:1px solid var(--line);border-radius:10px;padding:10px;display:flex;flex-direction:column;gap:8px;min-height:160px}.dt-col h4{margin:0;display:flex;gap:6px;align-items:center;font-size:13px}
.dt-col-e{color:var(--muted);text-align:center;padding:20px 0}
.dt-tk{all:unset;box-sizing:border-box;cursor:pointer;background:var(--surface);border:1px solid var(--line);border-radius:9px;padding:10px;display:flex;flex-direction:column;gap:4px;box-shadow:var(--shadow)}.dt-tk:hover,.dt-tk:focus-visible{border-color:var(--accent)}.dt-tk.late{border-inline-start:3px solid var(--crit)}
.dt-tk-n{font-size:11px;color:var(--muted)}.dt-tk b{font-size:13.5px;line-height:1.5}.dt-tk small{color:var(--muted);font-size:11.5px}.dt-tk-f{display:flex;justify-content:space-between;gap:6px;font-size:11.5px;color:var(--muted)}
.dt-empty{text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;padding:36px 20px}.dt-empty p{margin:0;max-width:440px}.dt-empty-i{width:52px;height:52px;border-radius:14px;background:var(--accent-soft);color:var(--accent);display:grid;place-items:center}.dt-empty-i svg{width:26px;height:26px}
.dt-dr{display:flex;flex-direction:column;gap:14px}.dt-dr-st{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.dt-dr-st .grow{flex:1}
.dt-dl{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:0;font-size:13.5px}.dt-dl dt{color:var(--muted)}.dt-dl dd{margin:0;display:flex;flex-direction:column;gap:2px}.dt-dl small{color:var(--muted);font-size:12px}.dt-dl dd .od-tag{align-self:flex-start}
.dt-det{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:12px;line-height:1.8;font-size:13.5px}
.dt-h4{margin:0 0 6px;font-size:13px;color:var(--muted)}
.dt-dr-acts{display:flex;flex-wrap:wrap;gap:8px;padding:12px;border-radius:10px;background:var(--surface);border:1px solid var(--line)}
.dt-af{display:flex;flex-direction:column;gap:10px;padding:12px;border:1px solid var(--accent);border-radius:10px;background:var(--accent-soft)}.dt-af-b{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.dt-range{display:flex;flex-direction:column;gap:4px;font-size:13px}.dt-range input{width:100%;accent-color:var(--accent)}
.dt-err{color:var(--crit);font-size:12.5px;margin-inline-start:8px}
.dt-log{list-style:none;margin:0;padding:0;display:flex;flex-direction:column}.dt-log li{display:flex;gap:10px;position:relative;padding-bottom:12px}.dt-log li:not(:last-child)::before{content:"";position:absolute;inset-inline-start:5px;top:14px;bottom:0;border-inline-start:2px solid var(--line)}
.dt-log-d{width:12px;height:12px;border-radius:50%;background:var(--accent);flex:none;margin-top:4px}.dt-log p{margin:4px 0 0;background:var(--surface);border:1px solid var(--line2);border-radius:8px;padding:6px 10px;font-size:13px}
.dt-kg{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)}
.dt-lg{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12px;color:var(--muted);margin-bottom:10px}.dt-lg span{display:inline-flex;align-items:center;gap:5px}.dt-lg i{width:11px;height:11px;border-radius:3px;display:inline-block}
.s-done{background:var(--ok)}.s-review{background:#7c5cc4}.s-progress{background:var(--warn)}.s-new{background:var(--info)}.s-hold{background:var(--neutral)}.s-issued{background:color-mix(in srgb,var(--accent) 45%,transparent)}
.dt-lg i.s-done,.dt-stack i.s-done,.dt-wb i.s-done{background:var(--ok)}
.dt-bars{display:flex;flex-direction:column;gap:6px}
.dt-br{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:150px minmax(0,1fr) 44px auto;gap:10px;align-items:center;padding:5px 6px;border-radius:8px;font-size:13px}.dt-br:hover,.dt-br:focus-visible{background:var(--surface2)}
.dt-br small{color:var(--muted);font-size:11.5px;white-space:nowrap}.dt-br .crit{color:var(--crit)}
.dt-bl{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dt-bt{display:block;min-width:0}.dt-bt .dt-bar{width:100%;height:9px}
.dt-stack{display:flex;height:16px;border-radius:5px;overflow:hidden;gap:2px;min-width:6px}.dt-stack i{display:block;height:100%}
.dt-wk{display:grid;grid-template-columns:repeat(8,1fr);gap:8px;align-items:end;height:180px}
.dt-wc{display:flex;flex-direction:column;align-items:center;gap:4px;height:100%}.dt-wb{flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center;gap:3px;border-bottom:1px solid var(--line)}
.dt-wb i{display:block;width:40%;max-width:18px;border-radius:4px 4px 0 0;min-height:1px}.dt-wc small{font-size:10.5px;color:var(--muted)}
.dt-sc td.crit,.dt-sc .crit{color:var(--crit);font-weight:700}
.dt-mx td{text-align:center}.dt-mx td:first-child{text-align:start}.dt-y{color:var(--ok);font-size:16px}.dt-n{color:var(--muted)}.dt-p{font-size:12px;background:var(--info-soft);color:var(--info);border-radius:6px;padding:2px 8px;white-space:nowrap}
#dt-body .section-title svg,.dt-dash .section-title svg{width:18px;height:18px;flex:none}
.dt-can{margin:10px 0 0;padding-inline-start:20px;display:flex;flex-direction:column;gap:6px;font-size:13.5px;line-height:1.7}
.dt-chk{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}.dt-chk li{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--line2);border-radius:10px;padding:10px 12px}
.dt-chk li>span{width:22px;height:22px;border-radius:50%;display:grid;place-items:center;flex:none;font-size:12px;color:#fff}.dt-chk li.ok>span{background:var(--ok)}.dt-chk li.warn>span{background:var(--warn)}.dt-chk li.crit>span{background:var(--crit)}
.dt-chk small{display:block;color:var(--muted);font-size:12px}small.crit{color:var(--crit)}
.dt-dash .section-title svg{width:18px;height:18px}
.dt-dk{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-bottom:12px}
.dt-dkc{all:unset;box-sizing:border-box;cursor:pointer;border:1px solid var(--line2);border-radius:10px;padding:10px;text-align:center;display:flex;flex-direction:column;gap:2px;background:var(--surface2)}.dt-dkc:hover,.dt-dkc:focus-visible{border-color:var(--accent)}
.dt-dkc b{font-size:22px;font-family:var(--f-display)}.dt-dkc span{font-size:11.5px;color:var(--muted)}.dt-dkc.crit b{color:var(--crit)}.dt-dkc.warn b{color:var(--warn)}
@media (max-width:900px){.dt-uh{grid-template-columns:1fr}.dt-job-top{grid-template-columns:1fr 1fr}.dt-jt{grid-column:1/-1}.dt-kg{grid-template-columns:1fr}.dt-dk{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media (max-width:640px){.dt-uh-k{grid-template-columns:repeat(2,1fr)}.dt-br{grid-template-columns:100px minmax(0,1fr) 40px}.dt-br small{display:none}.dt-board{grid-template-columns:repeat(5,minmax(200px,82vw))}.dt-hits li{grid-template-columns:1fr}}
@media print{.dt-tabs,.dt-acts,.dt-uh-a,.dt-assign,.dt-tb{display:none!important}}
`;document.head.appendChild(st)})();

renderNav();if(S.view==='duties'||S.view==='dash')render();
start();
})();
