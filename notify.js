/* ===== الإشعارات والتقويم (Notifications bell, preferences, browser alerts, calendar) =====
   Loaded after duties.js. No Cloud Functions are needed: the bell derives its items from data the user already
   receives (assignments, meetings, contracts, customer requests), so the security rules decide what each person sees.
   Read state and preferences live in Firestore `prefs/<email>` (each user reads and writes only their own document).
   The calendar page (`calendar`) shows the same events by month with Hijri dates, the Libyan weekend and .ics export. */
"use strict";
(function(){
const EN=()=>{if(window.I18N&&I18N.lang)return I18N.lang==='en';try{return localStorage.getItem('cm_lang')==='en'}catch(e){return false}};
const tr=(a,b)=>EN()&&b?b:a;
const me=()=>(window.__me&&window.__me())||null;
const FS=()=>window.__fs&&window.__fs();
const say=m=>{try{toast(m)}catch(e){}};
const DEF={assign:true,review:true,due:true,meet:true,contract:true,ticket:true,browser:false};
const NT={raw:null,prefs:null,seen:{},items:[],open:false,notified:null,sub:null,timer:null};
const TYPE={assign:['تكليف جديد','New assignment','p-info'],review:['بانتظار الاعتماد','Awaiting approval','p-warn'],due:['موعد تكليف','Assignment due','p-crit'],meet:['اجتماع','Meeting','p-fl'],contract:['عقد','Contract','p-warn'],ticket:['طلب زبون','Customer request','p-crit']};
const unit=()=>{const m=me();return m?m.unit||'':''};
const nd=n=>{n=Math.abs(n);if(EN())return n+(n===1?' day':' days');return n===1?'يوم واحد':n===2?'يومان':n<=10?n+' أيام':n+' يومًا'};
const isTop=()=>{const m=me();return !!m&&(m.role==='admin'||['gm','board'].includes(m.unit))};
const uName=id=>{try{return (ORG_BY.get(id)||{}).title||id||''}catch(e){return id||''}};
const SV={bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/></svg>',
 cal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
 chk:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>'};

/* ---------- preferences & read state (prefs/<email>) ---------- */
function loadPrefs(){const m=me(),fs=FS();if(!m||!fs||NT.sub)return;
  NT.sub=fs.collection('prefs').doc(m.email).onSnapshot(d=>{NT.raw=d.exists?d.data():{};NT.prefs=Object.assign({},DEF,NT.raw.notif||{});NT.seen=NT.raw.seen||{};refresh()},
    ()=>{NT.raw={};NT.prefs=Object.assign({},DEF);refresh()})}
async function savePrefs(patch){const m=me(),fs=FS();if(!m||!fs)return;
  const next=Object.assign({},NT.raw||{},{notif:NT.prefs||DEF,seen:NT.seen},patch);
  const ids=new Set(NT.items.map(i=>i.id));next.seen=Object.fromEntries(Object.entries(next.seen||{}).filter(([k])=>ids.has(k)).slice(-400));
  NT.raw=next;NT.prefs=next.notif;NT.seen=next.seen;
  try{await fs.collection('prefs').doc(m.email).set(next)}catch(e){console.warn('prefs',e)}}

/* ---------- navigation helpers ---------- */
const click=(sel,wait)=>new Promise(r=>setTimeout(()=>{const b=document.querySelector(sel);if(b)b.click();r(!!b)},wait||80));
async function openTask(id){go('duties');await click('[data-dt-tab="tasks"]');await click('[data-dt-open="'+CSS.escape(id)+'"]',120)}
async function openMeet(id){go('meetings');await click('[data-mt-open="'+CSS.escape(id)+'"]',150)}

/* ---------- derive the list ---------- */
function compute(){const m=me();if(!m)return[];const p=NT.prefs||DEF,u=unit(),top=isTop(),today=TODAY_ISO,out=[];const cap={};
  const push=it=>{cap[it.type]=(cap[it.type]||0)+1;if(cap[it.type]<=25)out.push(it)};
  ((window.__assignments&&window.__assignments())||[]).forEach(a=>{const toMe=a.toUnit===u||top,fromMe=a.fromUnit===u||top;
    if(p.assign&&a.status==='new'&&(a.toUnit===u||(top&&m.unit!=='board')))push({id:'a-new-'+a.id,type:'assign',at:a.createdAt||a.start||'',title:tr('تكليف جديد','New assignment')+(top?' · '+uName(a.toUnit):''),body:a.title,prio:2,open:()=>openTask(a.id)});
    if(p.review&&a.status==='review'&&fromMe)push({id:'a-rev-'+a.id+'-'+(a.log||[]).length,type:'review',at:a.updatedAt||'',title:tr('تكليف بانتظار الاعتماد','Assignment awaiting approval'),body:a.title,prio:2,open:()=>openTask(a.id)});
    if(p.due&&a.status!=='done'&&a.due&&(toMe||fromMe)){const d=days(today,a.due);
      if(d<0)push({id:'a-late-'+a.id,type:'due',at:a.due,title:tr('تكليف متأخر','Overdue assignment')+' · '+nd(d),body:a.title,prio:3,open:()=>openTask(a.id)});
      else if(d<=3)push({id:'a-soon-'+a.id+'-'+a.due,type:'due',at:a.due,title:d===0?tr('تكليف يستحق اليوم','Assignment due today'):tr('تكليف يستحق خلال','Assignment due in')+' '+nd(d),body:a.title,prio:1,open:()=>openTask(a.id)})}});
  ((window.__meetings&&window.__meetings())||[]).forEach(mt=>{if(!p.meet||!mt.date||mt.status==='cancelled'||mt.status==='closed')return;const d=days(today,mt.date);if(d<0||d>7)return;
    const inv=(mt.units||[]).includes(u)||mt.createdBy===m.email||m.role==='admin';if(!inv)return;const r=mt.rsvp&&mt.rsvp[m.email];
    push({id:'m-'+mt.id+'-'+mt.date,type:'meet',at:mt.date,title:(d===0?tr('اجتماع اليوم','Meeting today'):d===1?tr('اجتماع غدًا','Meeting tomorrow'):tr('اجتماع خلال','Meeting in')+' '+nd(d))+(mt.time?' · '+mt.time:''),body:(mt.title||'')+(r?'':' · '+tr('لم تُحدد حضورك بعد','RSVP pending')),prio:d<=1?2:1,open:()=>openMeet(mt.id)})});
  if(p.contract&&typeof D!=='undefined'&&D.get)S.contracts.forEach(c=>{const d=D.get(c.id);if(!d||!d.alert)return;
    push({id:'c-'+c.id+'-'+d.alert,type:'contract',at:d.effEnd||'',title:tr('عقد','Contract')+' · '+d.alert,body:(c.no||'')+' — '+(c.company||''),prio:d.alert==='عاجل'?3:1,open:()=>{go('contracts');setTimeout(()=>openContract(c.id),80)}})});
  if(p.ticket)(S.tickets||[]).forEach(t=>{if(t.status==='مغلق'||!t.dueDate)return;const d=days(today,t.dueDate);if(d>1)return;
    push({id:'t-'+t.id+'-'+(d<0?'late':'soon'),type:'ticket',at:t.dueDate,title:d<0?tr('طلب زبون متأخر','Overdue customer request'):tr('طلب زبون يستحق اليوم أو غدًا','Customer request due now'),body:(t.no?t.no+' — ':'')+(t.customer||t.subject||''),prio:d<0?3:1,open:()=>{go('cs');setTimeout(()=>openTicket(t.id),80)}})});
  out.sort((x,y)=>(y.prio-x.prio)||String(y.at).localeCompare(String(x.at)));return out}
const unread=()=>NT.items.filter(i=>!NT.seen[i.id]);

/* ---------- bell ---------- */
function mount(){const box=document.querySelector('.top-actions');if(!box||document.getElementById('nt-btn')||!me())return;
  const b=document.createElement('button');b.id='nt-btn';b.className='iconbtn nt-btn';b.type='button';b.setAttribute('aria-label',tr('الإشعارات','Notifications'));b.title=tr('الإشعارات','Notifications');b.innerHTML=SV.bell+'<span class="nt-badge" hidden></span>';
  const th=document.getElementById('theme-btn');box.insertBefore(b,th||null);
  const p=document.createElement('div');p.id='nt-panel';p.className='nt-panel';p.hidden=true;p.setAttribute('role','dialog');p.setAttribute('aria-label',tr('الإشعارات','Notifications'));document.body.appendChild(p);
  b.addEventListener('click',()=>toggle());
  document.addEventListener('click',e=>{if(NT.open&&!e.target.closest('#nt-panel,#nt-btn'))toggle(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&NT.open)toggle(false)});}
function toggle(v){NT.open=v==null?!NT.open:v;const p=document.getElementById('nt-panel');if(!p)return;p.hidden=!NT.open;if(NT.open)paint()}
function badge(){const b=document.querySelector('#nt-btn .nt-badge');if(!b)return;const n=unread().length;b.hidden=!n;b.textContent=n>99?'99+':String(n);const btn=document.getElementById('nt-btn');if(btn)btn.classList.toggle('has',n>0)}
function groupOf(it){const d=it.at?days(TODAY_ISO,String(it.at).slice(0,10)):0;if(it.type==='due'&&it.prio===3||it.type==='ticket'&&it.prio===3||it.type==='contract'&&it.prio===3)return 0;if(d<=0)return 1;if(d<=7)return 2;return 3}
const GL=[['متأخر وعاجل','Overdue & urgent'],['اليوم','Today'],['هذا الأسبوع','This week'],['لاحقًا','Later']];
function paint(){const p=document.getElementById('nt-panel');if(!p)return;const items=NT.items;
  const groups=[[],[],[],[]];items.forEach(i=>groups[groupOf(i)].push(i));
  p.innerHTML=`<div class="nt-head"><b>${esc(tr('الإشعارات','Notifications'))} <small>${items.length?unread().length+' '+esc(tr('غير مقروء','unread')):''}</small></b><div style="display:flex;gap:6px"><button type="button" class="btn sm ghost" data-nt="all" ${unread().length?'':'disabled'}>${SV.chk}${esc(tr('تعليم الكل كمقروء','Mark all read'))}</button><button type="button" class="btn sm ghost" data-nt="prefs">${esc(tr('الإعدادات','Settings'))}</button></div></div>
   ${items.length?groups.map((g,gi)=>g.length?`<div class="nt-g">${esc(tr(...GL[gi]))}</div>${g.map(it=>`<button type="button" class="nt-it${NT.seen[it.id]?'':' un'}" data-nt-open="${esc(it.id)}"><span class="pill ${TYPE[it.type][2]}">${esc(tr(TYPE[it.type][0],TYPE[it.type][1]))}</span><span class="nt-tx"><b>${esc(it.title)}</b><small dir="auto">${esc(it.body||'')}</small></span>${it.at?`<time>${esc(fd(String(it.at).slice(0,10)))}</time>`:''}</button>`).join('')}`:'').join(''):`<div class="empty" style="padding:22px"><b>${esc(tr('لا إشعارات','No notifications'))}</b>${esc(tr('ستظهر هنا التكليفات الجديدة والمتأخرة والاجتماعات القادمة والعقود القريبة من الانتهاء.','New and overdue assignments, upcoming meetings and expiring contracts appear here.'))}</div>`}`;
  p.querySelectorAll('[data-nt-open]').forEach(b=>b.addEventListener('click',()=>{const it=items.find(i=>i.id===b.dataset.ntOpen);if(!it)return;NT.seen[it.id]=nowTs();savePrefs();toggle(false);badge();it.open()}));
  const all=p.querySelector('[data-nt="all"]');if(all)all.onclick=()=>{items.forEach(i=>NT.seen[i.id]=nowTs());savePrefs();badge();paint()};
  const pr=p.querySelector('[data-nt="prefs"]');if(pr)pr.onclick=()=>{toggle(false);go('settings');setTimeout(()=>{const el=document.getElementById('nt-prefs');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})},150)}}
const nowTs=()=>new Date().toISOString();
function browserNotify(items){if(!NT.prefs||!NT.prefs.browser||!('Notification' in window)||Notification.permission!=='granted')return;
  if(!NT.notified){NT.notified=new Set(items.map(i=>i.id));return}
  let n=0;items.forEach(it=>{if(NT.notified.has(it.id)||NT.seen[it.id])return;NT.notified.add(it.id);if(n++>=3)return;
    try{const x=new Notification(it.title,{body:it.body||'',icon:'icons/icon-192.png',dir:EN()?'ltr':'rtl',lang:EN()?'en':'ar',tag:it.id});x.onclick=()=>{window.focus();it.open();x.close()}}catch(e){}})}
function refresh(){if(!me())return;mount();NT.items=compute();badge();if(NT.open)paint();browserNotify(NT.items)}
const refreshSoon=(()=>{let t;return()=>{clearTimeout(t);t=setTimeout(refresh,150)}})();

/* ---------- preferences panel (settings page) ---------- */
const LBL={assign:['التكليفات الجديدة لإدارتي','New assignments for my department'],review:['تكليفات بانتظار اعتمادي','Assignments awaiting my approval'],due:['مواعيد التكليفات (متأخرة أو خلال 3 أيام)','Assignment deadlines (overdue or within 3 days)'],meet:['الاجتماعات خلال الأسبوع','Meetings this week'],contract:['العقود القريبة من الانتهاء','Contracts near expiry'],ticket:['طلبات الزبائن المستحقة','Customer requests due']};
function prefsPanel(){const p=NT.prefs||DEF;const perm=('Notification' in window)?Notification.permission:'unsupported';
  return `<div class="panel" id="nt-prefs"><h3 class="section-title">${SV.bell}${esc(tr('الإشعارات','Notifications'))}</h3>
   <p class="muted" style="margin:0 0 10px;font-size:13px">${esc(tr('اختر ما يظهر في جرس الإشعارات. تُحفظ هذه التفضيلات لحسابك على كل الأجهزة.','Choose what the bell shows. Preferences are saved to your account on every device.'))}</p>
   <div class="nt-opts">${Object.keys(LBL).map(k=>`<label class="nt-opt"><input type="checkbox" data-nt-pref="${k}" ${p[k]?'checked':''}><span>${esc(tr(...LBL[k]))}</span></label>`).join('')}
    <label class="nt-opt"><input type="checkbox" data-nt-pref="browser" ${p.browser&&perm==='granted'?'checked':''} ${perm==='unsupported'||perm==='denied'?'disabled':''}><span>${esc(tr('تنبيهات المتصفح عند ظهور إشعار جديد والمنظومة مفتوحة','Browser alerts when a new item appears while the system is open'))}${perm==='denied'?` <small class="muted">(${esc(tr('مرفوضة من إعدادات المتصفح','blocked in the browser settings'))})</small>`:''}</span></label></div>
   <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button type="button" class="btn sm" data-nt="test">${esc(tr('إشعار تجريبي','Test notification'))}</button></div></div>`}
function bindPrefs(){const box=document.getElementById('nt-prefs');if(!box)return;
  box.querySelectorAll('[data-nt-pref]').forEach(cb=>cb.addEventListener('change',async()=>{const k=cb.dataset.ntPref;
    if(k==='browser'&&cb.checked){const r=await Notification.requestPermission();if(r!=='granted'){cb.checked=false;say(tr('لم يُسمح بتنبيهات المتصفح','Browser alerts were not allowed'));return}}
    NT.prefs=Object.assign({},NT.prefs||DEF,{[k]:cb.checked});await savePrefs();refresh();say(tr('حُفظت التفضيلات','Preferences saved'))}));
  const t=box.querySelector('[data-nt="test"]');if(t)t.onclick=()=>{say(tr('هكذا يظهر الإشعار داخل المنظومة','This is how an in-app notification looks'));if(NT.prefs&&NT.prefs.browser&&Notification.permission==='granted')try{new Notification(tr('إشعار تجريبي','Test notification'),{body:tr('تنبيهات المتصفح تعمل','Browser alerts are working'),icon:'icons/icon-192.png',dir:'rtl'})}catch(e){}}}

/* ---------- calendar page ---------- */
const DAYS=[['السبت','Sat'],['الأحد','Sun'],['الاثنين','Mon'],['الثلاثاء','Tue'],['الأربعاء','Wed'],['الخميس','Thu'],['الجمعة','Fri']];
const MON=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],MONE=['January','February','March','April','May','June','July','August','September','October','November','December'];
let HJ=null;try{HJ=new Intl.DateTimeFormat('ar-LY-u-ca-islamic-umalqura-nu-latn',{day:'numeric',month:'short'})}catch(e){try{HJ=new Intl.DateTimeFormat('ar-u-ca-islamic-nu-latn',{day:'numeric',month:'short'})}catch(e2){HJ=null}}
const hijri=d=>{try{return HJ?HJ.format(d):''}catch(e){return ''}};
function calState(){if(!S.ui.cal){const t=pd(TODAY_ISO);S.ui.cal={y:t.getFullYear(),m:t.getMonth(),sel:TODAY_ISO,types:{assign:true,meet:true,contract:true,ticket:true,record:true}}}return S.ui.cal}
function calEvents(){const m=me();if(!m)return[];const u=unit(),top=isTop(),ev=[];
  ((window.__assignments&&window.__assignments())||[]).forEach(a=>{if(!a.due)return;ev.push({d:a.due,type:'assign',t:a.title,s:uName(a.toUnit),st:a.status,open:()=>openTask(a.id)})});
  ((window.__meetings&&window.__meetings())||[]).forEach(mt=>{if(!mt.date||mt.status==='cancelled')return;ev.push({d:mt.date,type:'meet',t:(mt.time?mt.time+' ':'')+(mt.title||''),s:(mt.units||[]).map(uName).join('، '),st:mt.status,open:()=>openMeet(mt.id)})});
  if(typeof D!=='undefined'&&D.get)S.contracts.forEach(c=>{const d=D.get(c.id);if(!d||!d.effEnd)return;ev.push({d:d.effEnd,type:'contract',t:tr('انتهاء عقد','Contract ends')+' '+(c.no||''),s:c.company||'',st:d.status,open:()=>{go('contracts');setTimeout(()=>openContract(c.id),80)}})});
  (S.tickets||[]).forEach(t=>{if(!t.dueDate)return;ev.push({d:t.dueDate,type:'ticket',t:(t.no?t.no+' — ':'')+(t.subject||t.customer||''),s:t.customer||'',st:t.status,open:()=>{go('cs');setTimeout(()=>openTicket(t.id),80)}})});
  (S.records||[]).forEach(r=>{if(!r.date)return;ev.push({d:r.date,type:'record',t:r.title||'',s:uName(r.unit),st:r.status,open:()=>{go('org',{focus:r.unit});}})});
  return ev}
const TL={assign:['تكليف','Assignment'],meet:['اجتماع','Meeting'],contract:['عقد','Contract'],ticket:['طلب زبون','Customer request'],record:['سجل','Record']};
function viewCal(){const st=calState();const first=new Date(st.y,st.m,1),last=new Date(st.y,st.m+1,0);
  const ev=calEvents().filter(e=>st.types[e.type]);const byDay={};ev.forEach(e=>{(byDay[e.d]||(byDay[e.d]=[])).push(e)});
  // grid starts on Saturday (Libyan week); weekend Friday/Saturday
  const lead=(first.getDay()+1)%7;const cells=[];for(let i=0;i<lead;i++)cells.push(null);for(let d=1;d<=last.getDate();d++)cells.push(new Date(st.y,st.m,d));while(cells.length%7)cells.push(null);
  const selEv=(byDay[st.sel]||[]);const monthEv=ev.filter(e=>e.d>=iso(first)&&e.d<=iso(last));
  return `<div class="cal-head"><div><h2 class="page-title" style="margin:0">${SV.cal}${esc(tr('التقويم','Calendar'))}</h2><p class="muted" style="margin:2px 0 0;font-size:13px">${esc(tr('مواعيد التكليفات والاجتماعات وانتهاء العقود وطلبات الزبائن وسجلات الإدارات في مكان واحد.','Assignment deadlines, meetings, contract expiries, customer requests and department records in one place.'))}</p></div>
    <div class="cal-nav"><button type="button" class="btn sm" data-cal="prev" aria-label="${esc(tr('الشهر السابق','Previous month'))}">‹</button><b>${esc(EN()?MONE[st.m]:MON[st.m])} ${st.y}</b><button type="button" class="btn sm" data-cal="next" aria-label="${esc(tr('الشهر التالي','Next month'))}">›</button><button type="button" class="btn sm ghost" data-cal="today">${esc(tr('اليوم','Today'))}</button><button type="button" class="btn sm ghost" data-cal="ics" title="${esc(tr('تنزيل ملف تقويم لإضافته إلى هاتفك أو Outlook','Download a calendar file for your phone or Outlook'))}">${esc(tr('تصدير .ics','Export .ics'))}</button><button type="button" class="btn sm ghost" data-cal="print">${esc(tr('طباعة','Print'))}</button></div></div>
   <div class="cal-filters">${Object.keys(TL).map(k=>`<label class="cal-f ${k}"><input type="checkbox" data-cal-t="${k}" ${st.types[k]?'checked':''}><span>${esc(tr(...TL[k]))}</span></label>`).join('')}<span class="muted" style="font-size:12.5px;margin-inline-start:auto">${monthEv.length} ${esc(tr('حدث هذا الشهر','events this month'))}</span></div>
   <div class="cal-grid" role="grid">${DAYS.map(d=>`<div class="cal-dn" role="columnheader">${esc(tr(...d))}</div>`).join('')}
    ${cells.map(c=>{if(!c)return '<div class="cal-c off"></div>';const k=iso(c);const list=byDay[k]||[];const wk=c.getDay()===5||c.getDay()===6;
      return `<button type="button" class="cal-c${k===TODAY_ISO?' today':''}${k===st.sel?' sel':''}${wk?' wk':''}" data-cal-day="${k}" role="gridcell" aria-label="${esc(fd(k))}"><span class="cal-d">${c.getDate()}</span><span class="cal-h">${esc(hijri(c))}</span>
       <span class="cal-ev">${list.slice(0,3).map(e=>`<i class="${e.type}" title="${esc(e.t)}">${esc(e.t)}</i>`).join('')}${list.length>3?`<em>+${list.length-3}</em>`:''}</span></button>`}).join('')}</div>
   <section class="panel" style="margin-top:12px"><h3 class="section-title">${esc(fd(st.sel))} <small>${selEv.length?selEv.length+' '+esc(tr('حدث','events')):esc(tr('لا أحداث','no events'))}</small></h3>
    ${selEv.length?`<div class="cal-list">${selEv.map((e,i)=>`<button type="button" class="cal-li" data-cal-open="${i}"><span class="pill ${e.type==='assign'?'p-info':e.type==='meet'?'p-fl':e.type==='contract'?'p-warn':e.type==='ticket'?'p-crit':'p-neutral'}">${esc(tr(...TL[e.type]))}</span><b dir="auto">${esc(e.t)}</b><small>${esc(e.s||'')}${e.st?' · '+esc(e.st):''}</small></button>`).join('')}</div>`:`<p class="muted" style="margin:0">${esc(tr('اختر يومًا من الشبكة لعرض أحداثه.','Pick a day in the grid to see its events.'))}</p>`}</section>`}
function bindCal(){const st=calState();const root=document.getElementById('view');if(!root)return;
  root.querySelectorAll('[data-cal]').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.cal;
    if(k==='prev'){st.m--;if(st.m<0){st.m=11;st.y--}}else if(k==='next'){st.m++;if(st.m>11){st.m=0;st.y++}}else if(k==='today'){const t=pd(TODAY_ISO);st.y=t.getFullYear();st.m=t.getMonth();st.sel=TODAY_ISO}
    else if(k==='ics'){exportIcs();return}else if(k==='print'){window.print();return}render()}));
  root.querySelectorAll('[data-cal-t]').forEach(cb=>cb.addEventListener('change',()=>{st.types[cb.dataset.calT]=cb.checked;render()}));
  root.querySelectorAll('[data-cal-day]').forEach(b=>b.addEventListener('click',()=>{st.sel=b.dataset.calDay;render()}));
  const sel=calEvents().filter(e=>st.types[e.type]&&e.d===st.sel);
  root.querySelectorAll('[data-cal-open]').forEach(b=>b.addEventListener('click',()=>{const e=sel[+b.dataset.calOpen];if(e)e.open()}))}
function exportIcs(){const st=calState();const first=new Date(st.y,st.m,1),last=new Date(st.y,st.m+1,0);
  const ev=calEvents().filter(e=>st.types[e.type]&&e.d>=iso(first)&&e.d<=iso(last));if(!ev.length){say(tr('لا أحداث في هذا الشهر','No events this month'));return}
  const esc1=s=>String(s||'').replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');
  const stamp=new Date().toISOString().replace(/[-:]/g,'').slice(0,15)+'Z';
  const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Brega Petroleum Marketing//Sales System//AR','CALSCALE:GREGORIAN','METHOD:PUBLISH'];
  ev.forEach((e,i)=>{const d=e.d.replace(/-/g,'');const nd=iso(new Date(pd(e.d).getTime()+86400000)).replace(/-/g,'');lines.push('BEGIN:VEVENT','UID:'+stamp+'-'+i+'@brega-sales','DTSTAMP:'+stamp,'DTSTART;VALUE=DATE:'+d,'DTEND;VALUE=DATE:'+nd,'SUMMARY:'+esc1(tr(...TL[e.type])+': '+e.t),'DESCRIPTION:'+esc1(e.s||''),'END:VEVENT')});
  lines.push('END:VCALENDAR');const blob=new Blob([lines.join('\r\n')],{type:'text/calendar;charset=utf-8'});const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=`brega-${st.y}-${String(st.m+1).padStart(2,'0')}.ics`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},2000)}

/* ---------- wiring ---------- */
I.cal=SV.cal;
const at=VIEWS.findIndex(v=>v.id==='cs');VIEWS.splice(at<0?VIEWS.length:at+1,0,{id:'calendar',label:'التقويم',icon:'cal',group:'عام'});
const __render=render;render=function(){if(S.view==='calendar'){recompute();document.getElementById('view').innerHTML=dbBanner()+viewCal();bindCal();renderNav()}else __render();
  if(S.view==='settings'){const v=document.getElementById('view');if(v&&!document.getElementById('nt-prefs')&&me()){v.insertAdjacentHTML('beforeend',prefsPanel());bindPrefs()}}
  refreshSoon()};
try{if(localStorage.getItem('cm_view')==='calendar'&&S.view!=='calendar')go('calendar')}catch(e){}
if(window.I18N&&I18N.add)I18N.add({'التقويم':'Calendar'});
(function wait(n){if(me()){loadPrefs();refresh();renderNav();return}if(n<120)setTimeout(()=>wait(n+1),500)})(0);
NT.timer=setInterval(()=>{if(me())refresh()},45000);
const css=document.createElement('style');css.textContent=`
.nt-btn{position:relative}.nt-btn.has{color:var(--accent)}.nt-badge{position:absolute;top:2px;inset-inline-end:2px;min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:var(--crit);color:#fff;font-size:10.5px;font-weight:700;display:grid;place-items:center;line-height:1}
.nt-panel{position:fixed;top:60px;inset-inline-end:16px;width:min(420px,calc(100vw - 24px));max-height:min(70vh,640px);overflow:auto;background:var(--surface);border:1px solid var(--line);border-radius:14px;box-shadow:0 12px 40px rgba(15,34,54,.18);z-index:58;display:flex;flex-direction:column}
.nt-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px;border-bottom:1px solid var(--line2);position:sticky;top:0;background:var(--surface);flex-wrap:wrap}.nt-head small{color:var(--muted);font-weight:400;font-size:12px}
.nt-g{font-size:11.5px;color:var(--muted);padding:8px 14px 4px;text-transform:uppercase;letter-spacing:.02em}
.nt-it{all:unset;cursor:pointer;display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:9px 14px;border-bottom:1px solid var(--line2);font:inherit;color:var(--ink)}.nt-it:hover,.nt-it:focus-visible{background:var(--surface2)}.nt-it.un{background:var(--accent-soft)}.nt-it.un .nt-tx b::before{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--accent);margin-inline-end:6px;vertical-align:middle}
.nt-tx{display:flex;flex-direction:column;min-width:0}.nt-tx b{font-size:13.5px}.nt-tx small{color:var(--muted);font-size:12.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nt-it time{font-size:11.5px;color:var(--muted);white-space:nowrap}
.nt-opts{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:6px 18px}.nt-opt{display:flex;gap:8px;align-items:flex-start;font-size:13.5px;cursor:pointer}.nt-opt input{margin-top:3px;accent-color:var(--accent)}
.cal-head{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start;justify-content:space-between}.cal-nav{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.cal-nav b{min-width:120px;text-align:center;font-size:15px}
.cal-filters{display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;margin:10px 0 8px}.cal-f{display:flex;gap:6px;align-items:center;font-size:13px;cursor:pointer}.cal-f input{accent-color:var(--accent)}.cal-f::before{content:'';width:10px;height:10px;border-radius:3px;background:var(--info)}.cal-f.meet::before{background:var(--flame)}.cal-f.contract::before{background:var(--warn)}.cal-f.ticket::before{background:var(--crit)}.cal-f.record::before{background:var(--neutral)}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:8px}.cal-dn{text-align:center;font-size:12px;color:var(--muted);padding:4px 0 6px}
.cal-c{all:unset;box-sizing:border-box;min-height:88px;border-radius:8px;border:1px solid var(--line2);padding:5px 6px;display:flex;flex-direction:column;gap:3px;cursor:pointer;font:inherit;color:var(--ink);background:var(--surface);overflow:hidden}.cal-c.off{visibility:hidden}.cal-c.wk{background:var(--surface2)}.cal-c:hover,.cal-c:focus-visible{border-color:var(--accent)}.cal-c.sel{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}.cal-c.today .cal-d{background:var(--accent);color:#fff}
.cal-d{font-weight:700;font-size:13px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center}.cal-h{font-size:10px;color:var(--muted);margin-top:-2px}
.cal-ev{display:flex;flex-direction:column;gap:2px;font-size:11px}.cal-ev i{font-style:normal;border-radius:4px;padding:1px 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:var(--info-soft);color:var(--info)}.cal-ev i.meet{background:var(--flame-soft);color:var(--flame)}.cal-ev i.contract{background:var(--warn-soft);color:var(--warn)}.cal-ev i.ticket{background:var(--crit-soft);color:var(--crit)}.cal-ev i.record{background:var(--neutral-soft);color:var(--neutral)}.cal-ev em{font-style:normal;font-size:10.5px;color:var(--muted)}
.cal-list{display:flex;flex-direction:column;gap:6px}.cal-li{all:unset;cursor:pointer;display:grid;grid-template-columns:auto 1fr;gap:4px 10px;align-items:center;padding:8px 10px;border:1px solid var(--line2);border-radius:8px;font:inherit;color:var(--ink)}.cal-li:hover{background:var(--surface2)}.cal-li small{grid-column:2;color:var(--muted);font-size:12px}
@media (max-width:720px){.cal-c{min-height:64px;padding:3px}.cal-ev i{display:none}.cal-ev::after{content:'';}.cal-c .cal-ev:not(:empty)::before{content:'●';font-size:9px;color:var(--accent)}.cal-h{display:none}}
@media print{.cal-nav,.cal-filters,.side,.top,.mobile-nav{display:none!important}.cal-grid{border:none}}`;document.head.appendChild(css);
})();
