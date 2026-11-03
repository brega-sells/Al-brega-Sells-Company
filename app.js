"use strict";
/* ============ Icons ============ */
const I={
 org:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="3" width="6" height="4" rx="1"/><rect x="3" y="17" width="6" height="4" rx="1"/><rect x="15" y="17" width="6" height="4" rx="1"/><path d="M12 7v5M6 17v-5h12v5"/></svg>',
 dash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
 chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20h16"/><rect x="5" y="11" width="3" height="6" rx=".5"/><rect x="10.5" y="6" width="3" height="11" rx=".5"/><rect x="16" y="9" width="3" height="8" rx=".5"/></svg>',
 support:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="3" y="13" width="4" height="6" rx="1.5"/><rect x="17" y="13" width="4" height="6" rx="1.5"/><path d="M19 19c0 1.5-2 2.5-5 2.5"/></svg>',
 contract:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
 factory:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 21V10l6 4V10l6 4V5h4v16z"/><path d="M7 18h2M12 18h2"/></svg>',
 batch:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></svg>',
 people:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M16 9h3a1 1 0 0 1 1 1v11M8 7h4M8 11h4M8 15h4M2 21h20"/></svg>',
 ext:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4M12 13v5M9.5 15.5 12 13l2.5 2.5"/></svg>',
 gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
 plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>',
 down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
 up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V9M7 14l5-5 5 5M5 4h14"/></svg>',
 close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>',
 edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
 search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
 file:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
 link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>'
};

/* ============ State ============ */
const COLS=['contracts','needs','batches','extensions','letters','companies','tickets','notices','records'];
const S={contracts:[],needs:[],batches:[],extensions:[],letters:[],companies:[],tickets:[],notices:[],records:[],nm:null,
  settings:{t1:90,t2:60,t3:30,types:['بيع وقود الديزل','بيع منتج الزيت الثقيل','بيع منتج غاز مسال','بيع وقود السفن','بيع البنزين','توريد منتجات نفطية','تقديم خدمات','صيانة','نقل وتشغيل'],depts:['إدارة المبيعات','الإدارة التجارية','الإدارة الفنية','الشؤون القانونية','إدارة العقود والتوثيق'],specials:['معلق','منتهٍ قبل موعده'],currencies:['دينار ليبي','دولار أمريكي','يورو']},
  settingsVersion:null, loaded:{}, db:null, user:null, canWrite:true, assets:null, downloads:null, dbState:'wait',
  view:'dash', ui:{} };
const today=new Date(); today.setHours(0,0,0,0);
const TODAY_ISO=iso(today);

/* ============ Utils ============ */
function esc(s){return (s==null?'':String(s)).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function iso(d){if(!d)return'';const z=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())}
function pd(s){if(!s)return null;if(s instanceof Date)return s;const m=String(s).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);if(!m)return null;return new Date(+m[1],+m[2]-1,+m[3])}
function fd(s){const d=pd(s);if(!d)return'—';return d.getFullYear()+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+String(d.getDate()).padStart(2,'0')}
function days(a,b){return Math.round((pd(b)-pd(a))/86400000)}
const NF=new Intl.NumberFormat('en-US');
function fn(v){if(v==null||v===''||isNaN(v))return'—';return NF.format(v)}
function num(v){if(v==null||v==='')return null;const n=Number(String(v).replace(/[,،\s]/g,''));return isNaN(n)?null:n}
function norm(s){return (s||'').toString().replace(/[ً-ْـ]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\s+/g,' ').trim().toLowerCase()}
function normNo(s){return norm(s).replace(/[\s.\/\\\-_]/g,'')}
function uid(p){return p+Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
const GENERIC=new Set('شركه مصنع مصانع صناعه لصناعه للصناعات صناعات الصناعات انتاج لانتاج الانتاج تربيه لتربيه مقاولات للمقاولات المقاولات العامه عامه استثمار والاستثمار الاستثمار عقاري العقاري مواد البناء بناء الغذائيه غذائيه المواد و وشركاه وشركاؤه شركاؤه وشركاءه شركاءه مؤسسه اداره الخدمات خدمات ليبيه الليبيه الحديثه المتحده للتجاره تجاره والتجاره العالميه للخدمات وذبح وتسويق تسويق مشروبات المشروبات للمشروبات مصراته طرابلس زليتن بنغازي الخمس سرت سبها الزاويه صبراته غريان ترهونه ليبيا مشروع تنفيذ تاهيل تطوير تجهيز استكمال اعمال مجمع المجمع وحده صيد الصيد المسماه مزارع وصناعه والصناعات وتصنيع وتعليب'.split(' '));
function tokens(s){return norm(s).replace(/[^ء-يa-z0-9 ]/g,' ').split(' ').filter(Boolean).map(t=>t.replace(/^(وال|بال|لل|ال)/,'')).filter(t=>t.length>1&&!GENERIC.has(t)&&!GENERIC.has('ال'+t)&&!GENERIC.has('ل'+t))}
function nameMatch(a,b){const ta=tokens(a),tb=tokens(b);if(!ta.length||!tb.length||ta[0]!==tb[0])return 0;const A=new Set(ta),B=new Set(tb);let inter=0;A.forEach(t=>{if(B.has(t))inter++});const rmin=inter/Math.min(A.size,B.size),rmax=inter/Math.max(A.size,B.size);if(rmin<0.5||rmax<0.34)return 0;return 0.7+0.3*rmax}
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.hidden=false;clearTimeout(toast._t);toast._t=setTimeout(()=>t.hidden=true,2800)}
function debounce(f,ms){let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>f(...a),ms)}}
function uniq(arr){return [...new Set(arr.filter(v=>v!=null&&String(v).trim()!=='').map(v=>String(v).trim()))].sort((a,b)=>a.localeCompare(b,'ar'))}
function sumBy(arr,f){return arr.reduce((s,x)=>s+(Number(f(x))||0),0)}
function cleanRegion(r){return (r||'').toString().split(/[\/–\-]/)[0].trim()}

/* ============ Derived: contracts ============ */
function extsFor(c){const k=normNo(c.no);return S.extensions.filter(e=>normNo(e.contractNo)===k).sort((a,b)=>(a.newEnd||'').localeCompare(b.newEnd||''))}
function lettersFor(c){const k=normNo(c.no);return S.letters.filter(e=>normNo(e.contractNo)===k).sort((a,b)=>(b.date||'').localeCompare(a.date||''))}
function derive(c){
  const ex=extsFor(c);let eff=c.endDate||'';ex.forEach(e=>{if(e.newEnd&&e.newEnd>eff)eff=e.newEnd});
  const st=S.settings;let status,remain=null;
  if(eff)remain=days(TODAY_ISO,eff);
  if(c.special)status=c.special;
  else if(c.startDate&&c.startDate>TODAY_ISO)status='لم يبدأ بعد';
  else if(eff&&eff<TODAY_ISO)status='منتهٍ';
  else if(eff&&remain<=st.t1)status='قريب الانتهاء';
  else if(eff)status='ساري';
  else status='غير محدد';
  let alert='';
  if(status==='ساري'||status==='قريب الانتهاء'){if(remain<=st.t3)alert='عاجل';else if(remain<=st.t2)alert='خلال 60 يوم';else if(remain<=st.t1)alert='خلال 90 يوم'}
  const dur=(c.startDate&&c.endDate)?Math.round(days(c.startDate,c.endDate)/30.4):null;
  let progress=null;if(c.startDate&&eff){const tot=days(c.startDate,eff);const el=days(c.startDate,TODAY_ISO);progress=Math.max(0,Math.min(1,el/(tot||1)))}
  return {effEnd:eff,status,remain,alert,dur,exts:ex.length,progress}
}
function statusPill(s){const m={'ساري':'p-ok','قريب الانتهاء':'p-warn','منتهٍ':'p-crit','لم يبدأ بعد':'p-info','معلق':'p-fl','منتهٍ قبل موعده':'p-neutral','غير محدد':'p-neutral'};return `<span class="pill ${m[s]||'p-neutral'}">${esc(s)}</span>`}
function alertPill(a){if(!a)return'';const m={'عاجل':'p-crit','خلال 60 يوم':'p-warn','خلال 90 يوم':'p-info'};return `<span class="pill ${m[a]}">${esc(a)}</span>`}
let D=new Map(); // contract id -> derived
let DUP=new Set();
let MATCH={byNeed:new Map(),byContract:new Map()};
function recompute(){
  D=new Map();S.contracts.forEach(c=>D.set(c.id,derive(c)));
  const seen=new Map();DUP=new Set();
  S.contracts.forEach(c=>{const k=normNo(c.no)+'|'+norm(c.company);if(!normNo(c.no))return;if(seen.has(k)){DUP.add(c.id);DUP.add(seen.get(k))}else seen.set(k,c.id)});
  MATCH={byNeed:new Map(),byContract:new Map()};
  const ct=S.contracts.filter(c=>!/السفن/.test(c.type||'')).map(c=>({c,t:c.company}));
  S.needs.forEach(n=>{let best=null,bs=0;ct.forEach(({c,t})=>{const s=nameMatch(n.company,t);if(s>bs){bs=s;best=c}});
    if(best&&bs>=0.62){MATCH.byNeed.set(n.id,best);if(!MATCH.byContract.has(best.id))MATCH.byContract.set(best.id,[]);MATCH.byContract.get(best.id).push(n)}});
}
function batchOf(n){return S.batches.find(b=>b.id===n.batch)}
function batchName(id){const b=S.batches.find(b=>b.id===id);return b?b.name:(id||'—')}
function batchesSorted(){return [...S.batches].sort((a,b)=>(a.order||0)-(b.order||0))}

/* ============ Navigation ============ */
const VIEWS=[
 {id:'dash',label:'لوحة المؤشرات',icon:'dash',group:'عام'},
 {id:'ana',label:'تحليل البيانات',icon:'chart',group:'عام'},
 {id:'cs',label:'خدمة الزبائن',icon:'support',group:'عام',count:()=>S.tickets.filter(t=>t.status!=='مغلق').length||''},
 {id:'contracts',label:'عقود البريقة',icon:'contract',group:'مهام قسم المتابعة والتقارير - العامة للمبيعات',nav:false,count:()=>S.contracts.length},
 {id:'ext',label:'التمديدات والمراسلات',icon:'ext',group:'مهام قسم المتابعة والتقارير - العامة للمبيعات',nav:false,count:()=>S.extensions.length+S.letters.length},
 {id:'needs',label:'كشوفات الاحتياجات',icon:'factory',group:'مهام قسم المتابعة والتقارير - العامة للمبيعات',nav:false,count:()=>S.needs.length},
 {id:'batches',label:'الدفعات والمراسلات',icon:'batch',group:'مهام قسم المتابعة والتقارير - العامة للمبيعات',nav:false,count:()=>S.batches.length},
 {id:'dir',label:'دليل الجهات',icon:'people',group:'مهام قسم المتابعة والتقارير - العامة للمبيعات',nav:false},
 {id:'org',label:'الهيكل التنظيمي',icon:'org',group:'مشترك',count:()=>ORG.length-1},
 {id:'settings',label:'الإعدادات والاستيراد',icon:'gear',group:'مشترك'}];
function renderNav(){
  let g='',h='';VIEWS.filter(v=>v.nav!==false).forEach(v=>{if(v.group!==g){g=v.group;h+=`<div class="nav-label">${esc(g)}</div>`}
    h+=`<button data-v="${v.id}" aria-current="${S.view===v.id||v.id==='org'&&VIEWS.some(x=>x.id===S.view&&x.nav===false)}">${I[v.icon]}<span>${esc(v.label)}</span>${v.count?`<span class="cnt">${v.count()}</span>`:''}</button>`});
  document.getElementById('nav').innerHTML=h;updBack();
  document.getElementById('mnav').innerHTML=VIEWS.filter(v=>v.nav!==false).map(v=>`<button data-v="${v.id}" aria-current="${S.view===v.id}">${esc(v.label)}</button>`).join('');
}
function go(v,opts,fromHistory){const prev=S.view;S.view=v;if(opts)Object.assign(S.ui,opts);try{localStorage.setItem('cm_view',v)}catch(e){}
  if(!fromHistory&&v!==prev)try{history.pushState({v,d:((history.state&&history.state.d)||0)+1},'')}catch(e){}
  renderNav();render();window.scrollTo(0,0)}
/* back button: browser history when there is an earlier page in the system, otherwise the dashboard */
function updBack(){const b=document.getElementById('back-btn');if(b)b.hidden=S.view==='dash'}
function goBack(){if(history.state&&history.state.d>0)history.back();else{go('dash',null,true);try{history.replaceState({v:'dash',d:0},'')}catch(e){}}}
window.addEventListener('popstate',e=>{const v=e.state&&e.state.v;go(v&&VIEWS.some(x=>x.id===v)?v:'dash',null,true)});
document.addEventListener('click',e=>{if(e.target.closest('#back-btn'))goBack()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(b&&(b.closest('#nav')||b.closest('#mnav')))go(b.dataset.v)});

/* ============ Render dispatcher ============ */
function render(){
  recompute();
  const v=document.getElementById('view');
  const fn={dash:viewDash,contracts:viewContracts,needs:viewNeeds,batches:viewBatches,dir:viewDir,ext:viewExt,org:viewOrg,ana:viewAna,cs:viewCs,settings:viewSettings}[S.view]||viewDash;
  v.innerHTML=dbBanner()+fn();
  (afterRender[S.view]||(()=>{}))();
}
const afterRender={};
function dbBanner(){
  if(S.dbState==='none')return `<div class="banner">تعذّر الوصول إلى قاعدة بيانات المنظومة في هذا العرض. افتح المنظومة وأنت مسجّل الدخول في حسابك ليتم تحميل البيانات وحفظ التعديلات.</div>`;
  if(S.dbState==='wait')return `<div class="banner info">جارٍ تحميل البيانات من قاعدة المنظومة…</div>`;
  if(!S.canWrite)return `<div class="banner info">لديك صلاحية الاطلاع فقط. الإضافة والتعديل متاحة لمن يملك صلاحية التحرير.</div>`;
  return '';
}

/* ============ Dashboard ============ */
function viewDash(){
  const cs=S.contracts.map(c=>({c,d:D.get(c.id)}));
  const cnt=s=>cs.filter(x=>x.d.status===s).length;
  const active=cs.filter(x=>x.d.status==='ساري'||x.d.status==='قريب الانتهاء');
  const w=n=>active.filter(x=>x.d.remain<=n).length;
  const N=S.needs;
  const fuel={dg:sumBy(N,n=>n.dieselGen),do:sumBy(N,n=>n.dieselOp),gas:sumBy(N,n=>n.gas),ho:sumBy(N,n=>n.heavyOil),ke:sumBy(N,n=>n.kerosene),pq:sumBy(N,n=>n.projQty)};
  const matched=N.filter(n=>MATCH.byNeed.has(n.id)).length;
  // by type
  const byType={};cs.forEach(x=>{const k=x.c.type||'غير محدد';byType[k]=(byType[k]||0)+1});
  const typeRows=Object.entries(byType).sort((a,b)=>b[1]-a[1]);
  const maxT=Math.max(1,...typeRows.map(r=>r[1]));
  // expiry months next 12
  const months=[];for(let i=0;i<12;i++){const d=new Date(today.getFullYear(),today.getMonth()+i,1);months.push({y:d.getFullYear(),m:d.getMonth(),n:0})}
  cs.forEach(x=>{const e=pd(x.d.effEnd);if(!e)return;const mm=months.find(o=>o.y===e.getFullYear()&&o.m===e.getMonth());if(mm)mm.n++});
  const maxM=Math.max(1,...months.map(m=>m.n));
  const MN=['ينا','فبر','مار','أبر','ماي','يون','يول','أغس','سبت','أكت','نوف','ديس'];
  // needs by batch
  const bb=batchesSorted().map(b=>{const r=N.filter(n=>n.batch===b.id);return {b,c:r.length,d:sumBy(r,n=>(n.dieselGen||0)+(n.dieselOp||0))}});
  const maxB=Math.max(1,...bb.map(x=>x.d));
  // region
  const reg={};N.forEach(n=>{const k=cleanRegion(n.region)||'غير محدد';reg[k]=(reg[k]||0)+1});
  const regRows=Object.entries(reg).sort((a,b)=>b[1]-a[1]).slice(0,10);const maxR=Math.max(1,...regRows.map(r=>r[1]));
  const soon=active.filter(x=>x.d.remain<=S.settings.t1).sort((a,b)=>a.d.remain-b.d.remain).slice(0,8);
  const upcoming=cs.filter(x=>x.d.status==='لم يبدأ بعد').sort((a,b)=>(a.c.startDate||'').localeCompare(b.c.startDate||'')).slice(0,6);
  return `
  ${xdExec()}
  <div>
   <h3 class="section-title">عقود البريقة</h3>
   <div class="kpis">
    ${kpi('إجمالي العقود',S.contracts.length,'',`مسجلة في المنظومة`,"contracts",{})}
    ${kpi('سارية حاليًا',active.length,'ok','ساري + قريب الانتهاء',"contracts",{st:'active'})}
    ${kpi(`تنتهي خلال ${S.settings.t3} يومًا`,w(S.settings.t3),'crit','تحتاج إجراء عاجل',"contracts",{st:'a30'})}
    ${kpi(`تنتهي خلال ${S.settings.t1} يومًا`,w(S.settings.t1),'warn',`منها ${w(S.settings.t2)} خلال ${S.settings.t2} يومًا`,"contracts",{st:'a90'})}
    ${kpi('لم يبدأ سريانها',cnt('لم يبدأ بعد'),'','بانتظار تاريخ البداية',"contracts",{st:'لم يبدأ بعد'})}
    ${kpi('منتهية',cnt('منتهٍ')+cnt('منتهٍ قبل موعده'),'',`معلقة: ${cnt('معلق')}`,"contracts",{st:'منتهٍ'})}
   </div>
  </div>
  <div>
   <h3 class="section-title">كشوفات وزارة الصناعة والمعادن <small>احتياجات شهر أكتوبر 2026</small></h3>
   <div class="kpis">
    ${kpi('المنشآت في الكشوفات',N.length,'',`ضمن ${S.batches.length} دفعات`,"needs",{})}
    ${kpi('ديزل مطلوب (لتر)',fn(fuel.dg+fuel.do),'fl',`مولدات ${fn(fuel.dg)} · تشغيلية ${fn(fuel.do)}`,"needs",{fuel:'diesel'})}
    ${kpi('غاز (طن)',fn(fuel.gas),'','',"needs",{fuel:'gas'})}
    ${kpi('زيت ثقيل (لتر)',fn(fuel.ho),'','',"needs",{fuel:'ho'})}
    ${kpi('كيروسين (لتر)',fn(fuel.ke),'','',"needs",{fuel:'ke'})}
    ${kpi('لها عقد مع البريقة',matched,'ok',`من أصل ${N.length} منشأة (مطابقة بالاسم)`,"needs",{link:'yes'})}
   </div>
  </div>
  <div class="grid2">
   <div class="panel"><h3 class="section-title">تنبيهات الانتهاء <small>خلال ${S.settings.t1} يومًا</small></h3>
    ${soon.length?`<div class="alerts">${soon.map(x=>`<div class="alert-row" data-open-c="${x.c.id}"><span class="days ${x.d.remain<=S.settings.t3?'p-crit':x.d.remain<=S.settings.t2?'p-warn':'p-info'}">${x.d.remain} يوم</span><span class="nm">${esc(x.c.company)}<small>${esc(x.c.no)} · ينتهي ${fd(x.d.effEnd)}</small></span>${statusPill(x.d.status)}</div>`).join('')}</div>`
      :`<div class="empty"><b>لا توجد عقود قريبة الانتهاء</b>كل العقود السارية تنتهي بعد أكثر من ${S.settings.t1} يومًا.${upcoming.length?'':''}</div>`}
    ${upcoming.length?`<h3 class="section-title" style="margin-top:14px">عقود تبدأ قريبًا</h3><div class="alerts">${upcoming.map(x=>`<div class="alert-row" data-open-c="${x.c.id}"><span class="days p-info">${days(TODAY_ISO,x.c.startDate)} يوم</span><span class="nm">${esc(x.c.company)}<small>${esc(x.c.no)} · يبدأ ${fd(x.c.startDate)}</small></span>${statusPill(x.d.status)}</div>`).join('')}</div>`:''}
   </div>
   <div class="panel"><h3 class="section-title">مواعيد انتهاء العقود <small>الأشهر الاثنا عشر القادمة</small></h3>
    <div class="cols">${months.map(m=>`<div class="col"><span class="cv">${m.n||''}</span><div class="c ${m.n&&m.y===today.getFullYear()&&m.m-today.getMonth()<3?'hot':''}" style="height:${m.n/maxM*100}%"></div></div>`).join('')}</div>
    <div class="col-labels">${months.map(m=>`<span>${MN[m.m]}${m.m===0||m===months[0]?' '+String(m.y).slice(2):''}</span>`).join('')}</div>
    <h3 class="section-title" style="margin-top:18px">العقود حسب النوع</h3>
    <div class="bars">${typeRows.map(([k,v])=>`<div class="bar-row"><span class="lab" title="${esc(k)}">${esc(k)}</span><div class="bar-track"><div class="bar-fill" style="width:${v/maxT*100}%"></div></div><span class="val">${v}</span></div>`).join('')||'<div class="muted">لا توجد بيانات</div>'}</div>
   </div>
   <div class="panel"><h3 class="section-title">الديزل المطلوب حسب الدفعة <small>لتر شهريًا (مولدات + تشغيلية)</small></h3>
    <div class="bars">${bb.map(x=>`<div class="bar-row"><span class="lab">${esc(x.b.name)} <span class="muted">(${x.c})</span></span><div class="bar-track"><div class="bar-fill" style="width:${x.d/maxB*100}%;background:var(--flame)"></div></div><span class="val">${fn(x.d)}</span></div>`).join('')||'<div class="muted">لا توجد دفعات</div>'}</div>
    <div class="fuel-grid" style="margin-top:16px">
      <div class="fuel"><div class="l">ديزل مولدات</div><div class="v">${fn(fuel.dg)}</div><div class="u">لتر</div></div>
      <div class="fuel"><div class="l">ديزل تشغيلية</div><div class="v">${fn(fuel.do)}</div><div class="u">لتر</div></div>
      <div class="fuel"><div class="l">غاز</div><div class="v">${fn(fuel.gas)}</div><div class="u">طن</div></div>
      <div class="fuel"><div class="l">زيت ثقيل</div><div class="v">${fn(fuel.ho)}</div><div class="u">لتر</div></div>
      <div class="fuel"><div class="l">كيروسين</div><div class="v">${fn(fuel.ke)}</div><div class="u">لتر</div></div>
      <div class="fuel"><div class="l">كميات المشروعات</div><div class="v">${fn(fuel.pq)}</div><div class="u">لتر (نوع الوقود غير محدد)</div></div>
    </div>
   </div>
   <div class="panel"><h3 class="section-title">المنشآت حسب المنطقة <small>أعلى 10 مناطق</small></h3>
    <div class="bars">${regRows.map(([k,v])=>`<div class="bar-row" data-region="${esc(k)}" style="cursor:pointer"><span class="lab">${esc(k)}</span><div class="bar-track"><div class="bar-fill" style="width:${v/maxR*100}%"></div></div><span class="val">${v}</span></div>`).join('')||'<div class="muted">لا توجد بيانات</div>'}</div>
   </div>
  </div>`;
}
function kpi(l,v,cls,s,view,f){return `<button class="kpi ${cls}" data-kpi='${esc(JSON.stringify({view,f}))}'><span class="l">${esc(l)}</span><span class="v">${typeof v==='number'?fn(v):v}</span><span class="s">${esc(s)}</span></button>`}
afterRender.dash=()=>{const q=document.getElementById('xd-q');if(q){xdFilter();q.addEventListener('input',debounce(()=>{S.ui.xq=q.value;xdFilter()},120))}};
/* ============ Executive overview: all departments ============ */
const XD_ORDER=['e','w','ca','gm-fo','gm-rep'];
const XD_REG={'المنطقتان الوسطى والشرقية':'e','المنطقتان الغربية والجنوبية':'w'};
const XD_METRICS=[['pos','المناصب'],['tk','طلبات الزبائن المفتوحة'],['nt','إشعارات البيع الجارية'],['mt','الاجتماعات القادمة']];
function xdDept(id){const p=orgPath(id),i=p.findIndex(o=>o.id==='gm');return i<0?'':p[i+1]?p[i+1].id:'gm'}
function xdRing(pct,sz=64){const p=Math.max(0,Math.min(100,pct)),r=(sz-10)/2,C=2*Math.PI*r;
  return `<svg class="xd-ring" viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}" aria-hidden="true"><circle cx="${sz/2}" cy="${sz/2}" r="${r}" class="xd-ring-t"/>${p?`<circle cx="${sz/2}" cy="${sz/2}" r="${r}" class="xd-ring-v" style="stroke-dasharray:${C*p/100} ${C}" transform="rotate(-90 ${sz/2} ${sz/2})"/>`:''}</svg>`}
function xdData(){
  const byT=new Map();ORG.forEach(o=>byT.set(norm(o.title),o.id));
  const tk=S.tickets.map(t=>({t,dp:(()=>{const id=byT.get(norm(t.assignee||''));return id?xdDept(id):''})()}));
  const mts=(typeof M!=='undefined'&&M.list)?[...M.list.values()]:[];const up=typeof isUpcoming==='function'?mts.filter(m=>{try{return isUpcoming(m)}catch(e){return false}}):[];
  const cs=S.contracts.map(c=>({c,d:D.get(c.id)})),act=cs.filter(x=>x.d.status==='ساري'||x.d.status==='قريب الانتهاء');
  const N=S.notices,run=N.filter(n=>n.status==='جارٍ'),unpaid=N.filter(n=>n.status!=='موقوف'&&n.payment!=='تم السداد');
  const deps=XD_ORDER.map(id=>ORG_BY.get(id)).filter(Boolean).map(o=>{
    const pos=[o,...orgAll(o.id)],vac=pos.filter(x=>x.vacant).length,unc=pos.filter(x=>x.uncertain).length;
    const T=tk.filter(x=>x.dp===o.id).map(x=>x.t),open=T.filter(t=>t.status!=='مغلق'),late=open.filter(tkLate);
    const myM=up.filter(m=>(m.units||[]).includes(o.id)||m.organizer===o.id);
    const myN=N.filter(n=>XD_REG[n.region]===o.id),myRun=myN.filter(n=>n.status==='جارٍ');
    let core=[];
    if(o.id==='e'||o.id==='w')core=[['إشعارات بيع جارية',myRun.length,'',{v:'nt',nst:'جارٍ'}],['إشعارات مكتملة',myN.filter(n=>n.status==='مكتمل').length,'ok',{v:'nt',nst:'مكتمل'}],['مشرفون ووحدات',orgAll(o.id).length,'',{org:o.id}]];
    if(o.id==='ca'){const cl=S.tickets.filter(t=>t.status!=='مغلق'&&t.type==='مطالبة مالية أو فواتير').length,val=sumBy(act,x=>x.c.value||0);
      core=[['إشعارات بانتظار السداد',unpaid.length,unpaid.length?'warn':'',{v:'nt'}],['مطالبات مالية مفتوحة',cl,cl?'warn':'',{v:'cs',type:'مطالبة مالية أو فواتير'}],['قيمة العقود السارية',val?anShort(val):'—','',{v:'contracts',st:'active'}]]}
    if(o.id==='gm-fo'){const rg=uniq(S.needs.map(n=>cleanRegion(n.region)).filter(Boolean)).length;
      core=[['منشآت في الكشوفات',S.needs.length,'',{v:'needs'}],['مناطق مغطاة',rg,'',{v:'needs'}],['مشرفو المتابعة',orgKids(o.id).filter(x=>x.type==='super').length||orgKids(o.id).length,'',{org:o.id}]]}
    if(o.id==='gm-rep'){const w1=act.filter(x=>x.d.remain<=S.settings.t1).length;
      core=[['عقود سارية',act.length,'ok',{v:'contracts',st:'active'}],[`تنتهي خلال ${S.settings.t1} يومًا`,w1,w1?'warn':'',{v:'contracts',st:'a90'}],['تمديدات ومراسلات',S.extensions.length+S.letters.length,'',{v:'ext'}]]}
    return {o,pos:pos.length,vac,unc,fillPct:ocPct(pos.length-vac,pos.length),T,open,late,mt:myM.length,nt:myRun.length,core}});
  return {deps,tk,up,act,run,unpaid,cs};
}
function xdExec(){
  const X=xdData(),gm=ORG_BY.get('gm'),all=[gm,...orgAll('gm')],vac=all.filter(o=>o.vacant).length,fill=ocPct(all.length-vac,all.length);
  const openT=S.tickets.filter(t=>t.status!=='مغلق'),lateT=openT.filter(tkLate);
  const m=S.ui.xm&&XD_METRICS.some(x=>x[0]===S.ui.xm)?S.ui.xm:'pos';
  const val=d=>m==='pos'?d.pos:m==='tk'?d.open.length:m==='nt'?d.nt:d.mt;
  const rows=X.deps.map(d=>({d,v:val(d)})).sort((a,b)=>b.v-a.v),mx=Math.max(1,...rows.map(r=>r.v)),tot=rows.reduce((s,r)=>s+r.v,0);
  const mLbl=XD_METRICS.find(x=>x[0]===m)[1];
  const attn=[];
  X.deps.forEach(d=>{if(d.late.length)attn.push(['crit',`${d.o.title}: ${d.late.length} طلب متأخر عن موعده`,{v:'cs',st:'late'}]);if(d.vac)attn.push(['warn',`${d.o.title}: ${d.vac} منصب شاغر`,{org:d.o.id}])});
  const a30=X.act.filter(x=>x.d.remain<=S.settings.t3).length;if(a30)attn.unshift(['crit',`${a30} عقد ينتهي خلال ${S.settings.t3} يومًا`,{v:'contracts',st:'a30'}]);
  const xd=o=>`data-xd='${esc(JSON.stringify(o))}' role="button" tabindex="0"`;
  const hk=(l,v,s,o,c='')=>`<div class="xd-hk ${c}" ${xd(o)}><span class="l">${l}</span><b class="num">${typeof v==='number'?fn(v):v}</b><span class="s">${s}</span></div>`;
  return `<section class="xd-hero">
   <div class="xd-hero-main">
    <span class="xd-eyebrow">لوحة المؤشرات التنفيذية</span>
    <h2>${esc(gm.title)}</h2>
    <p class="xd-sub">${gm.vacant?'':`<b>${esc(gm.head)}</b>${ORG_ROLE.gm?` · <span>${esc(ORG_ROLE.gm)}</span>`:''}`}</p>
    <p class="xd-date">بيانات محدّثة حتى ${fd(TODAY_ISO)}</p>
    <div class="xd-hero-gauge" ${xd({org:'gm'})} data-tip="${esc('نسبة إشغال المناصب: '+fill+'%')}">${xdRing(fill,84)}<b class="num">${fill}%</b><span>إشغال المناصب<small>${all.length-vac} من ${all.length}</small></span></div>
   </div>
   <div class="xd-hks">
    ${hk('العقود السارية',X.act.length,`من ${fn(S.contracts.length)} عقد مسجّل`,{v:'contracts',st:'active'})}
    ${hk('منشآت الكشوفات',S.needs.length,`ضمن ${fn(S.batches.length)} دفعات`,{v:'needs'})}
    ${hk('طلبات الزبائن المفتوحة',openT.length,lateT.length?`${lateT.length} متأخرة عن موعدها`:'لا توجد طلبات متأخرة',{v:'cs',st:'open'},lateT.length?'crit':'')}
    ${hk('إشعارات بيع جارية',X.run.length,`${fn(X.unpaid.length)} بانتظار السداد`,{v:'nt',nst:'جارٍ'})}
    ${hk('الاجتماعات القادمة',X.up.length,'بين الإدارات',{v:'meetings'})}
    ${hk('الإدارات والجهات',all.length-1,`${orgKids('gm').length} جهات رئيسية · ${vac} شاغر`,{org:'board'},vac?'warn':'')}
   </div>
  </section>
  <div class="xd-head"><h3 class="section-title">الإدارات <small>اضغط على أي إدارة لفتح لوحتها التفصيلية</small></h3>
   <div class="grow xd-search">${I.search}<input type="search" id="xd-q" value="${esc(S.ui.xq||'')}" placeholder="بحث باسم الإدارة أو المسؤول…" aria-label="بحث في الإدارات"></div></div>
  <div class="xd-cards" id="xd-cards">${X.deps.map(d=>{const st=d.late.length?['crit','! طلبات متأخرة']:d.vac?['warn','! شواغر']:['ok','✓ مستقرة'];
   return `<article class="xd-card" data-q="${esc(norm(d.o.title+' '+(d.o.head||'')))}">
    <header ${xd({org:d.o.id})}><div class="xd-ct"><span class="xd-type">${esc((ORG_TYPES.find(t=>t.k===d.o.type)||{}).l||'')}</span><h4>${esc(d.o.title)}</h4><p>${d.o.vacant?'شاغرة':esc(d.o.head)}</p></div>
     <div class="xd-cg" data-tip="${esc('إشغال المناصب: '+d.fillPct+'%')}">${xdRing(d.fillPct,62)}<b class="num">${d.fillPct}%</b></div></header>
    <div class="xd-core">${d.core.map(c=>`<div class="xd-m ${c[2]}" ${xd(c[3])}><b class="num">${typeof c[1]==='number'?fn(c[1]):esc(c[1])}</b><span>${esc(c[0])}</span></div>`).join('')}</div>
    <div class="xd-foot"><span>${I.org||''}<b class="num">${d.pos}</b> منصب</span><span ${xd({v:'cs',st:'open'})}><b class="num">${d.open.length}</b> طلب مفتوح</span><span ${xd({v:'meetings'})}><b class="num">${d.mt}</b> اجتماع قادم</span>${ORG_DUTIES[d.o.id]?`<span ${xd({od:d.o.id})}><b class="num">${ORG_DUTIES[d.o.id].items.length}</b> مهام</span>`:''}<span ${xd({org:d.o.id})}><b class="num">${(S.records||[]).filter(x=>x.unit===d.o.id).length}</b> سجل</span><span class="pill p-${st[0]==='ok'?'ok':st[0]==='warn'?'warn':'crit'}">${st[1]}</span></div>
   </article>`}).join('')}<div class="empty xd-none" hidden><b>لا توجد إدارة مطابقة</b>جرّب كلمة بحث أخرى.</div></div>
  <div class="grid2 xd-grid">
   <section class="panel"><div class="xd-ph"><h3 class="section-title">مقارنة بين الإدارات <small>${esc(mLbl)} · الإجمالي <span class="num">${fn(tot)}</span></small></h3>
    <div class="xd-seg" role="tablist">${XD_METRICS.map(([k,l])=>`<button role="tab" aria-selected="${k===m}" data-xd-m="${k}">${l}</button>`).join('')}</div></div>
    ${tot?`<div class="ocd-bars">${rows.map(r=>`<div class="ocd-row go" ${xd({org:r.d.o.id})}><span class="ocd-lbl" title="${esc(r.d.o.title)}">${esc(r.d.o.title)}</span><span class="ocd-track">${r.v?`<span class="ocd-seg f" style="width:${r.v*100/mx}%" data-tip="${esc(r.d.o.title+' · '+mLbl+': '+r.v)}"></span>`:''}</span><span class="ocd-val num">${fn(r.v)}</span></div>`).join('')}</div>`
      :`<div class="empty"><b>لا توجد بيانات بعد</b>ستظهر المقارنة فور تسجيل البيانات.</div>`}
   </section>
   <section class="panel"><h3 class="section-title">إشغال المناصب حسب الإدارة <small>مشغولة مقابل شاغرة</small></h3>
    <div class="ocd-legend"><span><i class="f"></i>مشغولة</span><span><i class="v"></i>شاغرة</span></div>
    <div class="ocd-bars">${X.deps.slice().sort((a,b)=>b.pos-a.pos).map(d=>{const mxp=Math.max(...X.deps.map(x=>x.pos));return `<div class="ocd-row go" ${xd({org:d.o.id})}><span class="ocd-lbl" title="${esc(d.o.title)}">${esc(d.o.title)}</span><span class="ocd-track"><span class="ocd-seg f" style="width:${(d.pos-d.vac)*100/mxp}%" data-tip="${esc(d.o.title+' · مشغولة '+(d.pos-d.vac))}"></span>${d.vac?`<span class="ocd-seg v" style="width:${d.vac*100/mxp}%" data-tip="${esc(d.o.title+' · شاغرة '+d.vac)}"></span>`:''}</span><span class="ocd-val num">${d.pos}</span></div>`}).join('')}</div>
   </section>
  </div>
  <section class="panel xd-attn"><h3 class="section-title">يحتاج انتباه الإدارة العامة <small>${attn.length?`<span class="num">${attn.length}</span> بند`:''}</small></h3>
   ${attn.length?`<div class="alerts">${attn.slice(0,8).map(a=>`<div class="alert-row" ${xd(a[2])}><span class="days p-${a[0]}">${a[0]==='crit'?'! عاجل':'! متابعة'}</span><span class="nm">${esc(a[1])}</span></div>`).join('')}</div>`
     :`<div class="empty"><b>✓ لا توجد بنود عاجلة</b>كل الإدارات مستقرة حسب البيانات الحالية.</div>`}
  </section>
  <h3 class="xd-ops">التفاصيل التشغيلية <small>العقود والكشوفات · مهام قسم المتابعة والتقارير</small></h3>`;
}
document.addEventListener('click',e=>{if(S.view!=='dash')return;
  const mb=e.target.closest('[data-xd-m]');if(mb){S.ui.xm=mb.dataset.xdM;const y=window.scrollY;render();window.scrollTo(0,y);return}
  const g=e.target.closest('[data-xd]');if(!g)return;e.stopPropagation();const o=JSON.parse(g.dataset.xd);
  if(o.org){go('org',{om:'dash',of:o.org==='board'?'':o.org});return}
  if(o.od){go('org',{om:'duties',od:o.od});return}
  if(o.v==='contracts'){S.ui.c={q:'',st:o.st||'all',type:'',dept:'',sort:'remain',dir:'asc'};go('contracts');return}
  if(o.v==='needs'){S.ui.n={q:'',batch:'',region:'',fuel:'',link:'',act:'',sec:'',sort:'seq',dir:'asc'};go('needs');return}
  if(o.v==='cs'){S.ui.cs=Object.assign(csUI(),{tab:'tk',q:'',st:o.st||'',type:o.type||'',pri:'',as:''});go('cs');return}
  if(o.v==='nt'){S.ui.cs=Object.assign(csUI(),{tab:'nt',nq:'',nst:o.nst||'',nsg:'',nstg:''});go('cs');return}
  go(o.v)},true);
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&S.view==='dash'&&e.target.closest&&e.target.closest('[data-xd],[data-xd-m]'))e.target.click()});
function xdFilter(){const q=norm(S.ui.xq||'');let n=0;document.querySelectorAll('#xd-cards .xd-card').forEach(c=>{const h=q&&!c.dataset.q.includes(q);c.hidden=h;if(!h)n++});const e=document.querySelector('.xd-none');if(e)e.hidden=!!n}
document.addEventListener('click',e=>{
  const k=e.target.closest('[data-kpi]');if(k){const o=JSON.parse(k.dataset.kpi);if(o.view==='contracts'){S.ui.c={q:'',st:o.f.st||'all',type:'',dept:'',sort:S.ui.c?.sort||'remain',dir:'asc'}}else{S.ui.n={q:'',batch:'',region:'',fuel:o.f.fuel||'',link:o.f.link||'',act:'',sec:'',sort:'seq',dir:'asc'}}go(o.view);return}
  const r=e.target.closest('[data-region]');if(r&&S.view==='dash'){S.ui.n={q:'',batch:'',region:r.dataset.region,fuel:'',link:'',sort:'seq',dir:'asc'};go('needs');return}
  const oc=e.target.closest('[data-open-c]');if(oc){openContract(oc.dataset.openC);return}
  const on=e.target.closest('[data-open-n]');if(on){openNeed(on.dataset.openN);return}
});

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

/* ============ Organizational structure ============ */
/* المصدر: ملف «الإدارة العامة للمبيعات والشؤون التجارية» (هيكل معتمد بانتظار اعتماد مجلس الإدارة).
   كل عنصر: [المعرّف، معرّف الجهة الأعلى، المسمى، المسؤول، الرقم الوظيفي، علامات]
   العلامات: v = شاغرة · u = تحتاج تدقيق (الاسم أو الرقم غير واضح في الصورة الممسوحة).
   الصلاحيات تُضاف لاحقًا في ORG_PERMS بمفتاح معرّف الجهة، ولم تُحدَّد بعد. */
const ORG_ROWS=[
 ['board',null,'عضو مجلس الإدارة للتزويد والمبيعات والطاقات المتجددة','مصطفى محمد الشنطة','515486'],
 ['gm','board','الإدارة العامة للمبيعات والشؤون التجارية','محمد البهلول الثابت',''],
 // تتبع المدير العام مباشرة
 ['gm-rep','gm','قسم المتابعة والتقارير - العامة للمبيعات','الصغيرة عمر عبد الدائم','512607'],
 ['gm-rep-f','gm-rep','وحدة المتابعة العامة للمبيعات','عبد الباسط منصف الاجنف','40985','u'],
 ['gm-rep-r','gm-rep','وحدة التقارير - العامة للمبيعات','فريدة حسن العودي','514945'],
 ['gm-rep-a','gm-rep','وحدة تحليل البيانات والكميات','جمعة ساسي القادري','509933'],
 ['gm-fo','gm','مكتب متابعة المبيعات','خالد حسن الطوير','501167'],
 ['gm-fo-tr','gm-fo','مشرف متابعة المبيعات طرابلس','نصر الدين جمعة حكومة','507051'],
 ['gm-fo-ms','gm-fo','مشرف متابعة المبيعات مصراتة','جبريل الجالي محمد أبو لوفة','517379'],
 ['gm-fo-zw','gm-fo','مشرف متابعة المبيعات الزاوية','أبو القاسم احمد المحمودي','511463'],
 ['gm-fo-sb','gm-fo','مشرف متابعة المبيعات سبها','معتز احمد سعد خليفة','511058'],
 ['gm-fo-bn','gm-fo','مشرف متابعة المبيعات بنغازي','سراج سالم عبدالكريم عبدالله','507307'],
 ['gm-fo-tb','gm-fo','مشرف متابعة المبيعات طبرق','محمد رحيل حسن الصابر','504105'],
 ['gm-fo-br','gm-fo','مشرف متابعة المبيعات البريقة والسرير','عبدالعالي ابوبكر عقيلة','510055'],
 ['gm-fo-is','gm-fo','وحدة نظم المعلومات والبيانات التجارية','علي مصطفى علي','514604'],
 // إدارة الشؤون التجارية والتحصيلات
 ['ca','gm','إدارة الشؤون التجارية والتحصيلات','محمد صالح الغول','500126'],
 ['ca-acc','ca','منسق حسابات الزبائن م','عبد الفتاح دخيل الثابت','504375'],
 ['ca-acc-big','ca-acc','قسم كبار المستهلكين م','علي عبد الله القريقني','504221'],
 ['ca-acc-debt','ca-acc','قسم متابعة الديون م','محمد فتحي زريمق','509215'],
 ['ca-acc-ctr','ca-acc','قسم العقود التجارية م','صلاح جمعة الفرجاني','502664'],
 ['ca-acc-mkt','ca-acc','قسم التسويق م','أسامة رمضان عبد السلام الثابت','502401'],
 ['ca-cr','ca','منسق الائتمان والتحصيلات م','حمزة عبد الناصر عبد السلام غزي','513006'],
 ['ca-cr-cr','ca-cr','قسم الائتمان م','عبد الفتاح سليمان أبو عينة','500974'],
 ['ca-cr-col','ca-cr','قسم التحصيلات م','محمد محمد منصور سويسي','501068'],
 // إدارة المبيعات غ.ج
 ['w','gm','إدارة المبيعات غ.ج','جلال سالم شنيبش','514539'],
 ['w-svc','w','قسم خدمات المحطات والزبائن غ.ج','خالد خليفة الشامس','505323'],
 ['w-fol','w','قسم المتابعة غ.ج','عائدة عياد الدويبي','503701'],
 ['w-dat','w','قسم البيانات والتقارير غ.ج','أبوبكر النفاتي الجهاني','502692'],
 ['w-dat-d','w-dat','مشرف وحدة البيانات غ.ج','نورالدين خالد سليمان','504817'],
 ['w-dat-r','w-dat','مشرف وحدة التقارير غ.ج','مؤيد علي مقيلي','506339'],
 ['w-st','w','منسق المحطات غ.ج','حسن الشارف الدعيكي','503152'],
 ['w-st-tr','w-st','قسم مبيعات طرابلس','وليد الهادي ارطيل','514696'],
 ['w-st-tr-s','w-st-tr','وحدة مبيعات المحطات طرابلس','عبد الحكيم محمد عبد الله','510052'],
 ['w-st-tr-o','w-st-tr','وحدة طلبات محطات طرابلس','ناصر عبد العزيز السائح','514655'],
 ['w-st-tr-f','w-st-tr','وحدة متابعة محطات طرابلس','خالد حسن سعد','509802','u'],
 ['w-st-ev','w-st','قسم تقييم وقبول المحطات غ.ج','خالد عمار أبو قرين','500986'],
 ['w-st-ev-u','w-st-ev','وحدة تقييم المحطات غ.ج','نورية مختار منصور','506028'],
 ['w-st-jb','w-st','مكتب محطات الجبل الغربي','احمد علي المغربي','501308'],
 ['w-st-jb-i','w-st-jb','وحدة التفتيش الجبل الغربي','ايمن عبد السلام عمر','509181'],
 ['w-st-jb-s','w-st-jb','وحدة مبيعات الجبل الغربي','طارق محمد حمزة','501829'],
 ['w-st-jb-p','w-st-jb','وحدة متابعة نقاط الجبل الغربي','حمزة العاشم احمد الحاج','509188'],
 ['w-dc','w','منسق مبيعات شركات التوزيع غ.ج','محمد عمر المشري','503326','u'],
 ['w-dc-po','w-dc','قسم متابعة وإدارة أوامر الشراء غ.ج','عبدالمالك جمعة الفروج','','u'],
 ['w-dc-qt','w-dc','قسم حساب الكميات والمطابقة مع الشركات غ.ج','وسيم محمد السعداوي','','u'],
 ['w-av','w','منسق مبيعات الطيران والسفن غ.ج','زكريا عيسى الباروني','505120','u'],
 ['w-av-jf','w-av','قسم مبيعات وقود الطيران غ.ج','أيمن علي عبيسة','509114','u'],
 ['w-av-jf-1','w-av-jf','وحدة مبيعات طيران معيتيقة، زوارة','عبدالحكيم عامر أبو صبع','503410'],
 ['w-av-jf-2','w-av-jf','وحدة مبيعات طيران طرابلس، الزنتان، غدامس','احمد موسى دخيل','502373'],
 ['w-av-mr','w-av','قسم المبيعات ووقود السفن غ.ج','رجب علي الفيتوري','509832'],
 ['w-av-mr-1','w-av-mr','وحدة مبيعات السفن طرابلس','راشد محمد أبو لسين','502404'],
 ['w-pc','w','منسق مبيعات القطاع العام والمستهلكين غ.ج','عبد المالك خالد القمودي','506728','u'],
 ['w-pc-con','w-pc','قسم مبيعات المستهلكين غ.ج','أمال أبو بكر الرحماني','500920','u'],
 ['w-pc-con-bk','w-pc-con','وحدة مبيعات المخابز غ.ج','نصر احمد أبو صلاح','514405'],
 ['w-pc-pub','w-pc','قسم مبيعات القطاع العام غ.ج','عبد المهيمن سعد النهاس','509443','u'],
 ['w-pc-oil','w-pc','وحدة مبيعات الزيوت والشحوم غ.ج','محمد عبد الرحمن نصيح','506806','u'],
 ['w-pc-cash','w-pc','قسم المبيعات النقدية غ.ج','سيف الإسلام يوسف أبو هادي','511306'],
 ['w-ord','w','قسم الطلبات غ.ج','أحمد المبروك احتيوش','510855','u'],
 ['w-ord-tr','w-ord','وحدة طلبات مستودعات طرابلس','إسماعيل سعد النهامي','502766','u'],
 // إدارة المبيعات و.ش
 ['e','gm','إدارة المبيعات و.ش','رافع احميدة السعيطي','500739'],
 ['e-fol','e','قسم المتابعة و.ش','سراج سالم عبدالكريم','507307'],
 ['e-dat','e','قسم البيانات والتقارير و.ش','عبدالعزيز عبدالله عبد ربه','507324'],
 ['e-po','e','قسم متابعة وإدارة أوامر الشراء و.ش','إبراهيم الناجي ادريس','511187'],
 ['e-qt','e','قسم حساب الكميات والمطابقة مع الشركات و.ش','عقيلة علي عقيلة','507350','u'],
 ['e-st','e','منسق المحطات و.ش','طارق سعد بوقرين','502090'],
 ['e-st-ev','e-st','قسم تقييم وقبول المحطات و.ش','نور الهدى المافوري','511111'],
 ['e-st-ev-u','e-st-ev','وحدة تقييم المحطات و.ش','محمد فرج الترهوني','507350','u'],
 ['e-st-bn','e-st','قسم مبيعات بنغازي','محمد عبد الله الامام','504423'],
 ['e-st-bn-s','e-st-bn','وحدة مبيعات المحطات بنغازي','اوريدة المهدي البزار','512711'],
 ['e-st-bn-o','e-st-bn','وحدة الطلبات بنغازي','محمد جمال الجهاني','511296'],
 ['e-st-bn-p','e-st-bn','وحدة القطاع العام والمستهلكين بنغازي','حسن مصطفى بوحنيك','510950'],
 ['e-st-bn-g','e-st-bn','وحدة موزعي الغاز بنغازي','خالد عبد الرحيم الاطيوش','505205'],
 ['e-st-dr','e-st','مكتب محطات درنه','محمد إبراهيم النعاس','510057'],
 ['e-st-dr-i','e-st-dr','وحدة التفتيش درنه','شعبان امراجع المسوري','507602'],
 ['e-st-dr-s','e-st-dr','وحدة مبيعات درنه','نزار احمد العصيبي','508489','u'],
 ['e-st-dr-p','e-st-dr','وحدة متابعة نقاط درنه','الصديق موسى بوجازية','506436'],
 ['e-st-bd','e-st','مكتب محطات البيضاء','','','v'],
 ['e-st-bd-i','e-st-bd','وحدة التفتيش البيضاء','','','v'],
 ['e-st-bd-s','e-st-bd','وحدة مبيعات البيضاء','','','v'],
 ['e-st-bd-p','e-st-bd','وحدة متابعة نقاط البيضاء','','','v'],
 ['e-st-aj','e-st','مكتب محطات اجدابيا','احمد محمود علي','507246'],
 ['e-st-aj-i','e-st-aj','وحدة التفتيش اجدابيا','','','v'],
 ['e-st-aj-s','e-st-aj','وحدة مبيعات اجدابيا','عثمان امهدي عقيلة','510730'],
 ['e-st-aj-p','e-st-aj','وحدة متابعة نقاط اجدابيا','','','v'],
 ['e-st-mj','e-st','مكتب محطات المرج','عماد علي اقدير','508675'],
 ['e-st-mj-i','e-st-mj','وحدة التفتيش المرج','سعد خالد سعد','511239'],
 ['e-st-mj-s','e-st-mj','وحدة مبيعات المرج','يزيد محمد سليمان','514843'],
 ['e-st-mj-p','e-st-mj','وحدة متابعة نقاط المرج','احمد إبراهيم شعيب','507477'],
 ['e-st-sj','e-st','مكتب محطات سرت الجفرة','ايمن محمد عامر','509935'],
 ['e-st-sj-i','e-st-sj','وحدة التفتيش سرت الجفرة','بوبكر مفتاح إبراهيم','510486'],
 ['e-st-sj-s','e-st-sj','وحدة مبيعات سرت الجفرة','حسام احمودة ادعابو','506182','u'],
 ['e-st-sj-p','e-st-sj','وحدة متابعة نقاط سرت الجفرة','علي فرج السنة','512409','u'],
 ['e-av','e','منسق مبيعات الطيران والسفن و.ش','احمد عبدالعزيز بن جفيلة','504580','u'],
 ['e-av-jf','e-av','قسم مبيعات وقود الطيران و.ش','محسن جمعة الغرياني','505581'],
 ['e-av-mr','e-av','قسم مبيعات وقود السفن و.ش','عبدالسلام محمد العشيبي','504260'],
 ['e-dc','e','منسق مبيعات شركات التوزيع و.ش','اشرف المبروك محمد','507493'],
 ['e-pc','e','منسق مبيعات القطاع العام والمستهلكين و.ش','احمد مصطفى المجذوب','503737'],
 ['e-pc-pub','e-pc','قسم مبيعات القطاع العام و.ش','مصطفى عثمان فرحات','500234'],
 ['e-pc-con','e-pc','قسم مبيعات المستهلكين و.ش','','','v'],
 ['e-pc-oil','e-pc','وحدة مبيعات الزيوت والشحوم و.ش','محمد يحيى البناني','504177'],
 ['e-ord','e','قسم الطلبات و.ش','زكريا عبدالرحمن المكي','507158'],
 ['e-ord-x','e-ord','وحدة الطلبات المنفذ و.ش','هشام عثمان علي','510189','u']];
const ORG_TYPES=[
 {k:'board',re:/^عضو مجلس/,l:'مجلس الإدارة',p:'p-fl'},
 {k:'gm',re:/^الإدارة العامة/,l:'إدارة عامة',p:'p-fl'},
 {k:'dept',re:/^إدارة/,l:'إدارة',p:'p-info'},
 {k:'coord',re:/^منسق/,l:'منسق',p:'p-ok'},
 {k:'office',re:/^مكتب/,l:'مكتب',p:'p-warn'},
 {k:'section',re:/^قسم/,l:'قسم',p:'p-neutral'},
 {k:'super',re:/^مشرف/,l:'مشرف',p:'p-neutral'},
 {k:'unit',re:/^وحدة/,l:'وحدة',p:'p-neutral'}];
const ORG=ORG_ROWS.map(([id,parent,title,head,empNo,fl=''])=>({id,parent,title,head,empNo,type:(ORG_TYPES.find(t=>t.re.test(title))||ORG_TYPES[7]).k,vacant:fl.includes('v'),uncertain:fl.includes('u')}));
const ORG_BY=new Map(ORG.map(o=>[o.id,o]));
const orgKids=id=>ORG.filter(o=>o.parent===id);
/* صلاحيات كل جهة: { [معرّف الجهة]: [...] } — تُملأ عند وصول بيانات الصلاحيات */
const ORG_PERMS={};
/* صفة المسؤول عند ورودها في كتاب التكليف */
const ORG_ROLE={'gm':'مكلف بمهام مدير عام المبيعات والشؤون التجارية'};
/* مهام كل جهة: صفحات المنظومة التي تتولاها، بمفتاح معرّف الجهة */
const ORG_TASKS={'gm-rep':['contracts','ext','needs','batches','dir']};
/* اختصاصات الإدارات كما وردت في قرار مجلس الإدارة رقم (160) لسنة 2026م (إحالة مكتب شؤون مجلس الإدارة رقم 265) */
const ORG_DECREE={no:'160',year:'2026',date:'2026-08-03',eff:'2026-08-01',ref:'265',title:'بشأن استحداث الإدارة العامة للمبيعات والشؤون التجارية',
 arts:[['المادة (1)','يُستحدث بموجب هذا القرار إنشاء إدارة عامة جديدة تسمى الإدارة العامة للمبيعات والشؤون التجارية.'],
  ['المادة (2)','يتكون الهيكل التنظيمي للإدارة الجديدة من: إدارة المبيعات غ.ج، وإدارة المبيعات و.ش، وإدارة الشؤون التجارية والتحصيلات.'],
  ['المادة (3)','تتولى الإدارة العامة للمبيعات والشؤون التجارية المستحدثة القيام بالمهام والاختصاصات المبيّنة لها ولإداراتها.'],
  ['المادة (4)','يُنقل العاملون بإدارتي المبيعات غ.ج و و.ش والعاملون بإدارة الشؤون التجارية والتحصيلات بالإدارة العامة للشؤون التجارية السابقة إلى الإدارة العامة للمبيعات والشؤون التجارية وفقًا لهذا القرار.'],
  ['المادة (5)','تتولى الإدارة العامة للموارد البشرية اتخاذ الإجراءات اللازمة لوضع هذا القرار موضع التنفيذ.'],
  ['المادة (6)','يُعمل بهذا القرار اعتبارًا من 2026/08/01 وعلى الإدارات ذات العلاقة تنفيذه.']]};
const ORG_SALES_DUTIES=[
 ['التخطيط','تنفيذ سياسات وخطط البيع المعتمدة بالشركة.'],
 ['الزبائن','استلام ودراسة طلبات الزبائن ومحطات الوقود والجهات العامة والخاصة، واستكمال إجراءات البيع وفقًا للنظم المعمول بها.'],
 ['التوزيع والإمداد','متابعة انسياب توزيع المحروقات والغاز والمنتجات النفطية إلى شركات التوزيع ومحطات الوقود بالمناطق الخاضعة لإشرافها، بالتنسيق مع إدارات المناطق.'],
 ['المالية والتحصيل','متابعة أرصدة الزبائن والمبيعات الآجلة بالتنسيق مع إدارة الشؤون التجارية والتحصيلات.'],
 ['البيانات','حصر وتوثيق بيانات الزبائن ومحطات الوقود العاملة وتحديثها بصفة دورية.'],
 ['التخطيط','رصد احتياجات المناطق والزبائن وكبار المستهلكين من المنتجات النفطية، واقتراح البرامج التنفيذية.'],
 ['الشكاوى','معالجة شكاوى الزبائن والمشاكل التشغيلية في نطاقها، ورفع ما يتجاوز صلاحياتها إلى الإدارة العامة.'],
 ['التقارير','إعداد تقارير المبيعات الشهرية والدورية عن نشاط الإدارة ورفعها إلى الإدارة العامة للمبيعات والشؤون التجارية.'],
 ['مهام أخرى','أية مهام أخرى تكلف بها من الإدارة العامة في نطاق اختصاصها.']];
const ORG_DUTIES={
 gm:{lead:'تتولى الإدارة العامة للمبيعات والشؤون التجارية الإشراف العام على نشاط المبيعات والشؤون التجارية على مستوى الشركة، وتختص بما يلي:',items:[
  ['السياسات','رسم السياسات العامة للمبيعات وتسويق المنتجات النفطية والغاز والزيوت، والإشراف على تنفيذها بعد اعتمادها من مجلس الإدارة.'],
  ['الإشراف','الإشراف الفني والإداري على الإدارات والمكاتب التابعة لها، وتنسيق العمل فيما بينها، وتوزيع الاختصاصات بما يضمن تسيير العمل بمرافقها بصورة منتظمة.'],
  ['التخطيط','إعداد الخطط والبرامج التقديرية لاحتياجات المناطق من المحروقات والمنتجات النفطية بالتنسيق مع الإدارات المختصة، ومتابعة تنفيذها.'],
  ['التوزيع والإمداد','متابعة انتظام عمليات التوزيع والإمداد لكافة الزبائن، ومعالجة الاختناقات والصعوبات التي تعترض سير العمل.'],
  ['العقود','اعتماد ومتابعة العقود والاتفاقيات التجارية المبرمة مع الزبائن والموزعين والجهات العامة، بالتنسيق مع الإدارات ذات العلاقة.'],
  ['المالية والتحصيل','متابعة الموقف المالي للمبيعات الآجلة والمديونيات والتحصيلات، واتخاذ الإجراءات اللازمة بشأنها بالتنسيق مع الإدارة العامة للشؤون المالية.'],
  ['التطوير والرقمنة','اقتراح تطوير منظومات العمل وإجراءات البيع والتوزيع، والعمل على رقمنة العمليات التجارية.'],
  ['التقارير','إعداد التقارير الدورية والسنوية عن نشاط المبيعات والشؤون التجارية ورفعها إلى مجلس الإدارة.']]},
 w:{lead:'مهام إدارة المبيعات غ.ج، وتتولى القيام بما يلي:',items:ORG_SALES_DUTIES},
 e:{lead:'مهام إدارة المبيعات و.ش، وتتولى القيام بما يلي:',items:ORG_SALES_DUTIES},
 ca:{lead:'إدارة الشؤون التجارية والتحصيلات، وتختص بالآتي:',items:[
  ['العقود','متابعة العقود والاتفاقيات التجارية المبرمة مع الزبائن والموزعين، والتحقق من الالتزام ببنودها ومدد سريانها، والتنبيه إلى مواعيد تجديدها.'],
  ['الضمانات','متابعة الضمانات المصرفية وخطابات الاعتماد المقدمة من الزبائن، والتحقق من صلاحيتها وكفايتها بالتنسيق مع الإدارة العامة للشؤون المالية.'],
  ['المالية والتحصيل','حصر ومتابعة المديونيات والمبيعات الآجلة على مستوى إدارتي المبيعات، وإعداد كشوفات دورية بالمواقف والتحصيلات.'],
  ['المالية والتحصيل','التنسيق مع الإدارة العامة للشؤون المالية بشأن التسويات المالية والمطابقات الدورية لأرصدة الزبائن.'],
  ['المالية والتحصيل','اقتراح الإجراءات اللازمة حيال الزبائن المتأخرين عن السداد، وإعداد المذكرات اللازمة بشأنها.'],
  ['التقارير','إعداد تقرير دوري شامل عن الموقف التجاري والتحصيلات ورفعه إلى مدير عام الإدارة.']]}};
const ORG_DUTY_ORDER=['gm','w','e','ca'];
function viewOrgDuties(el){
  const sel=ORG_DUTIES[S.ui.od]?S.ui.od:'',q=norm(S.ui.odq2||''),D0=ORG_DECREE;
  const ids=sel?[sel]:ORG_DUTY_ORDER,tot=ORG_DUTY_ORDER.reduce((n,id)=>n+ORG_DUTIES[id].items.length,0);
  let hits=0;
  const secs=ids.map(id=>{const o=ORG_BY.get(id),d=ORG_DUTIES[id],t=ORG_TYPES.find(x=>x.k===o.type)||{};
    const items=d.items.map((x,i)=>({tag:x[0],txt:x[1],n:i+1})).filter(x=>!q||norm(x.tag+' '+x.txt).includes(q));hits+=items.length;if(q&&!items.length)return '';
    const tags=uniq(d.items.map(x=>x[0]));
    return `<section class="od-sec t-${o.type}" id="od-${id}">
     <header class="od-h"><div class="od-hm"><span class="od-type">${esc(t.l||'')}</span><h3>${esc(o.title)}</h3>
      <p>${o.vacant?'شاغرة':`<b>${esc(o.head)}</b>${ORG_ROLE[id]?` · ${esc(ORG_ROLE[id])}`:''}`}</p></div>
      <div class="od-stats"><span><b class="num">${d.items.length}</b>مهام</span><span><b class="num">${orgAll(id).length}</b>جهة تابعة</span><span><b class="num">${tags.length}</b>مجال عمل</span><span class="go" data-od-dash="${id}" role="button" tabindex="0" data-tip="${esc('فتح سجل الإدارة')}"><b class="num">${(S.records||[]).filter(x=>x.unit===id).length}</b>سجل</span></div>
      <div class="od-acts"><button class="btn sm" data-od-dash="${id}">لوحة المؤشرات</button><button class="btn sm ghost" data-org-focus="${id}">عرض في المخطط</button></div></header>
     <p class="od-lead">${esc(d.lead)}</p>
     <ol class="od-list">${items.map(x=>`<li><span class="od-n num">${x.n}</span><div><span class="od-tag">${esc(x.tag)}</span><p>${esc(x.txt)}</p></div></li>`).join('')}</ol>
    </section>`}).join('');
  const other=orgKids('gm').filter(o=>!ORG_DUTIES[o.id]);
  el.innerHTML=`<div class="od-decree">
    <div class="od-seal">${I.org||''}</div>
    <div class="od-dm"><span class="od-eyebrow">قرار مجلس الإدارة</span><h3>القرار رقم (${D0.no}) لسنة ${D0.year}م</h3><p>${esc(D0.title)}</p>
     <div class="od-meta"><span>تاريخ القرار <b class="num">${fd(D0.date)}</b></span><span>نافذ اعتبارًا من <b class="num">${fd(D0.eff)}</b></span><span>إحالة مكتب شؤون مجلس الإدارة رقم <b class="num">${D0.ref}</b></span></div></div>
    <div class="od-big"><b class="num">${tot}</b><span>مهمة واختصاصًا</span><small>لـ ${ORG_DUTY_ORDER.length} جهات</small></div>
   </div>
   <details class="od-arts"><summary>مواد القرار <small>${D0.arts.length} مواد</small></summary><ol>${D0.arts.map(a=>`<li><b>${esc(a[0])}</b><span>${esc(a[1])}</span></li>`).join('')}</ol></details>
   <div class="od-bar"><div class="ocd-scopes" style="margin:0"><button data-od="" aria-pressed="${!sel}">كل الجهات</button>${ORG_DUTY_ORDER.map(id=>`<button data-od="${id}" aria-pressed="${sel===id}">${esc(ORG_BY.get(id).title)} <span class="num">${ORG_DUTIES[id].items.length}</span></button>`).join('')}</div>
    <div class="grow od-search">${I.search}<input type="search" id="od-q" value="${esc(S.ui.odq2||'')}" placeholder="بحث في المهام والاختصاصات…" aria-label="بحث في المهام"></div></div>
   ${q?`<div class="count-line">${hits} نتيجة</div>`:''}
   ${secs||`<div class="empty"><b>لا نتائج</b>جرّب كلمة أخرى.</div>`}
   ${!sel&&!q&&other.length?`<section class="od-note"><h4>جهات تابعة للإدارة العامة لم يحدد القرار اختصاصاتها</h4><ul>${other.map(o=>{const tk=(ORG_TASKS[o.id]||[]).map(v=>VIEWS.find(x=>x.id===v)).filter(Boolean);return `<li><b>${esc(o.title)}</b> <span class="muted">${o.vacant?'شاغرة':esc(o.head)}</span>${tk.length?`<span class="od-tk">مهامها في المنظومة: ${tk.map(v=>`<button type="button" data-org-go="${v.id}">${esc(v.label)}</button>`).join('')}</span>`:''}</li>`}).join('')}</ul></section>`:''}`;
  const qi=el.querySelector('#od-q');qi.addEventListener('input',debounce(()=>{S.ui.odq2=qi.value;const p=qi.selectionStart;viewOrgDuties(el);const n=el.querySelector('#od-q');n.focus();try{n.setSelectionRange(p,p)}catch(e){}},200));
}
/* تصدير الهيكل التنظيمي والمهام والاختصاصات بصيغة PDF (عبر طباعة المتصفح: حفظ كـ PDF) */
function orgPdfHtml(){
  const en=!!(window.I18N&&I18N.lang==='en'),T=s=>en?I18N.t(s):s,D0=ORG_DECREE,logo=(document.querySelector('.side img, header img, .lg-card img')||{}).src||'';
  const typeL=o=>T((ORG_TYPES.find(x=>x.k===o.type)||{}).l||'');
  const h=s=>esc(s);
  const head=o=>o.vacant?`<i class="vac">${T('شاغرة')}</i>`:h(o.head)+(ORG_ROLE[o.id]?`<br><small>${h(T(ORG_ROLE[o.id]))}</small>`:'');
  const tree=(id,d)=>orgKids(id).map(o=>`<tr><td class="lv${Math.min(d,4)}"><span class="dot t-${o.type}"></span>${h(o.title)}</td><td>${typeL(o)}</td><td>${head(o)}</td><td class="n">${h(o.empNo||'—')}</td><td class="n">${orgAll(o.id).length||'—'}</td></tr>`+tree(o.id,d+1)).join('');
  const units=[ORG_BY.get('gm'),...orgAll('gm')],vac=units.filter(o=>o.vacant).length;
  const duties=ORG_DUTY_ORDER.map(id=>{const o=ORG_BY.get(id),d=ORG_DUTIES[id];return `<section class="du t-${o.type}"><h3><span class="dot t-${o.type}"></span>${h(o.title)} <small>${typeL(o)} · ${o.vacant?T('شاغرة'):h(o.head)}${ORG_ROLE[id]?' · '+h(T(ORG_ROLE[id])):''}</small></h3><p class="lead">${h(T(d.lead))}</p>
   <ol>${d.items.map(x=>`<li><b>${h(T(x[0]))}</b><span>${h(T(x[1]))}</span></li>`).join('')}</ol></section>`}).join('');
  const other=orgKids('gm').filter(o=>!ORG_DUTIES[o.id]);
  return `<!doctype html><html lang="${en?'en':'ar'}" dir="${en?'ltr':'rtl'}"><head><meta charset="utf-8"><title>${h(T('الهيكل التنظيمي والمهام والاختصاصات'))} — ${fd(TODAY_ISO)}</title>
<style>
@page{size:A4;margin:14mm 12mm 16mm}
*{box-sizing:border-box}body{font-family:Arial,Arimo,"Noto Sans Arabic",Tahoma,sans-serif;font-weight:700;color:#0e2240;margin:0;font-size:11.5px;line-height:1.7;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cover{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:250mm;border:1px solid #d8e0eb;border-radius:12px;padding:30px;background:linear-gradient(180deg,#f6f8fc,#fff);break-after:page}
.cover img{width:120px;height:auto;margin-bottom:18px}.cover .eyebrow{color:#0063ad;font-size:13px;letter-spacing:.02em}.cover h1{font-size:26px;margin:6px 0 2px;color:#0b3168;line-height:1.4}.cover h2{font-size:16px;margin:0 0 16px;color:#55677f;font-weight:700}
.cover .box{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;max-width:520px;margin:12px 0 20px}.cover .box div{border:1px solid #d8e0eb;border-radius:10px;padding:10px;background:#fff}.cover .box b{display:block;font-size:24px;color:#0063ad}.cover .box span{font-size:11px;color:#55677f}
.cover .dec{border-top:1px dashed #d8e0eb;padding-top:14px;color:#55677f;font-size:12px;max-width:560px}.cover .dec b{color:#0e2240}
.cover .ft{margin-top:auto;color:#93aac6;font-size:10.5px}
h2.sec{font-size:17px;color:#0b3168;margin:0 0 4px;padding-bottom:6px;border-bottom:3px solid #0063ad;display:flex;align-items:baseline;gap:10px}h2.sec small{color:#55677f;font-size:11px;font-weight:700}
p.sub{margin:4px 0 12px;color:#55677f}
table{width:100%;border-collapse:collapse;font-size:11px}th{background:#0b3168;color:#fff;padding:7px 8px;text-align:start;font-size:11px}td{padding:6px 8px;border-bottom:1px solid #e7ecf4;vertical-align:top}tr{break-inside:avoid}tbody tr:nth-child(even) td{background:#f6f8fc}
td.n{font-variant-numeric:tabular-nums;white-space:nowrap}td small{color:#55677f;font-size:10px}i.vac{color:#a86a0c;font-style:normal}
.lv1{padding-inline-start:8px}.lv2{padding-inline-start:30px}.lv3{padding-inline-start:52px}.lv4{padding-inline-start:74px}
.dot{display:inline-block;width:9px;height:9px;border-radius:3px;margin-inline-end:6px;vertical-align:middle;background:#667585}
.t-gm .dot,.dot.t-gm{background:#0b3168}.dot.t-dept{background:#0063ad}.dot.t-coord{background:#1d7a4c}.dot.t-office{background:#a86a0c}.dot.t-section{background:#3a55c4}
.legend{display:flex;flex-wrap:wrap;gap:6px 16px;margin:8px 0 0;font-size:10.5px;color:#55677f}
.arts{margin:0 0 14px;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:8px}.arts li{border:1px solid #d8e0eb;border-radius:8px;padding:8px 10px;font-size:10.5px;break-inside:avoid}.arts b{display:block;color:#0063ad;margin-bottom:2px}
.du{break-inside:avoid-page;margin:14px 0 0;border:1px solid #d8e0eb;border-radius:10px;overflow:hidden}
.du h3{margin:0;padding:9px 12px;background:#f3f5f9;font-size:14px;color:#0b3168;border-bottom:1px solid #d8e0eb}.du h3 small{font-weight:700;color:#55677f;font-size:10.5px;margin-inline-start:6px}
.du .lead{margin:0;padding:8px 12px 0;color:#55677f;font-size:11px}
.du ol{margin:0;padding:8px 12px 10px;list-style:none;counter-reset:d}.du li{display:grid;grid-template-columns:22px 110px 1fr;gap:8px;padding:5px 0;border-top:1px dashed #e7ecf4;counter-increment:d;break-inside:avoid}.du li:first-child{border-top:0}
.du li::before{content:counter(d);width:20px;height:20px;border-radius:6px;background:#e1edf9;color:#0063ad;display:grid;place-items:center;font-size:10.5px}.du li b{color:#55677f;font-size:10.5px}
.note{margin-top:14px;border:1px dashed #d8e0eb;border-radius:10px;padding:10px 12px;font-size:11px;color:#55677f}.note b{color:#0e2240}
.pg{break-before:page}
</style></head><body>
<section class="cover">${logo?`<img src="${logo}" alt="">`:''}
 <div class="eyebrow">${h(T('شركة البريقة لتسويق النفط'))}</div>
 <h1>${h(T('الإدارة العامة للمبيعات والشؤون التجارية'))}</h1>
 <h2>${h(T('الهيكل التنظيمي والمهام والاختصاصات'))}</h2>
 <div class="box"><div><b>${units.length}</b><span>${h(T('جهة في الهيكل'))}</span></div><div><b>${orgKids('gm').length}</b><span>${h(T('جهات رئيسية'))}</span></div><div><b>${ORG_DUTY_ORDER.reduce((n,id)=>n+ORG_DUTIES[id].items.length,0)}</b><span>${h(T('مهمة واختصاصًا'))}</span></div></div>
 <div class="dec">${h(T('المرجع'))}: <b>${h(T(`قرار مجلس الإدارة رقم (${D0.no}) لسنة ${D0.year}م`))}</b> — ${h(T(D0.title))}<br>${h(T('تاريخ القرار'))} <b>${fd(D0.date)}</b> · ${h(T('نافذ اعتبارًا من'))} <b>${fd(D0.eff)}</b> · ${h(T('إحالة مكتب شؤون مجلس الإدارة رقم'))} <b>${D0.ref}</b></div>
 <div class="ft">${h(T('صادر من منظومة الإدارة العامة للمبيعات والشؤون التجارية'))} · ${fd(TODAY_ISO)}</div>
</section>
<h2 class="sec">${h(T('الهيكل التنظيمي'))} <small>${units.length} ${h(T('جهة'))} · ${vac} ${h(T('شاغرة'))}</small></h2>
<p class="sub">${h(T('الإدارة العامة للمبيعات والشؤون التجارية وإداراتها وأقسامها ووحداتها، كما وردت في الهيكل المعتمد.'))}</p>
<table><thead><tr><th>${h(T('الجهة'))}</th><th>${h(T('النوع'))}</th><th>${h(T('المسؤول'))}</th><th>${h(T('الرقم الوظيفي'))}</th><th>${h(T('جهات تابعة'))}</th></tr></thead><tbody>
${(()=>{const b=ORG_BY.get('board');return `<tr><td><span class="dot t-gm"></span>${h(b.title)}</td><td>${typeL(b)}</td><td>${head(b)}</td><td class="n">${h(b.empNo||'—')}</td><td class="n">${orgAll(b.id).length}</td></tr>`})()}${tree('board',1)}</tbody></table>
<div class="legend">${ORG_TYPES.filter(x=>x.k!=='board'&&x.k!=='super').map(x=>`<span><span class="dot t-${x.k}"></span>${h(T(x.l))}</span>`).join('')}<span><i class="vac">${h(T('شاغرة'))}</i> = ${h(T('منصب شاغر'))}</span></div>
<h2 class="sec pg">${h(T('المهام والاختصاصات'))} <small>${h(T(`قرار مجلس الإدارة رقم (${D0.no}) لسنة ${D0.year}م`))}</small></h2>
<p class="sub">${h(T('مواد القرار'))}</p>
<ol class="arts">${D0.arts.map(a=>`<li><b>${h(T(a[0]))}</b>${h(T(a[1]))}</li>`).join('')}</ol>
${duties}
${other.length?`<div class="note"><b>${h(T('جهات تابعة للإدارة العامة لم يحدد القرار اختصاصاتها'))}:</b> ${other.map(o=>h(o.title)+' ('+(o.vacant?T('شاغرة'):h(o.head))+')').join(' · ')}</div>`:''}
</body></html>`}
function orgPdf(){const w=window.open('','_blank');if(!w){toast(window.I18N?I18N.t('اسمح بفتح النوافذ المنبثقة لتصدير PDF'):'اسمح بفتح النوافذ المنبثقة لتصدير PDF');return}
  w.document.open();w.document.write(orgPdfHtml());w.document.close();
  const run=()=>{try{w.focus();w.print()}catch(e){}};if(w.document.readyState==='complete')setTimeout(run,300);else w.addEventListener('load',()=>setTimeout(run,300));
  toast(window.I18N?I18N.t('اختر «حفظ كـ PDF» في نافذة الطباعة'):'اختر «حفظ كـ PDF» في نافذة الطباعة')}
/* ============ سجلات الإدارات: إضافة وحذف وإرفاق وتصدير، كلٌّ في نطاق مهامه ============ */
const REC_TYPES=['مراسلة','تقرير','عقد / اتفاقية','كشف','محضر','مذكرة','ضمان مصرفي','أخرى'];
const REC_ST=['جارٍ','منجز','مؤجل'];const REC_STC={'جارٍ':'p-info','منجز':'p-ok','مؤجل':'p-warn'};
const REC_UNITS=['gm','w','e','ca','gm-rep','gm-fo'];
let REC_UNIT=null;
async function recMyUnit(){if(REC_UNIT!=null)return REC_UNIT;const me=window.__me&&window.__me();if(!me||!window.__fs){REC_UNIT='';return ''}
  if(typeof M!=='undefined'&&M.unit!==undefined&&M.loaded){REC_UNIT=M.unit||'';return REC_UNIT}
  try{const r=await window.__fs().collection('roles').doc(me.email).get();REC_UNIT=(r.exists&&r.data().unit)||''}catch(e){REC_UNIT=''}return REC_UNIT}
function recCan(unit){const me=window.__me&&window.__me();if(!me)return S.canWrite;if(me.role==='admin')return true;if(!S.canWrite||me.role==='viewer')return false;const u=REC_UNIT||'';return u===unit||u==='gm'}
function recDuties(unit){const d=ORG_DUTIES[unit];if(d)return d.items.map((x,i)=>({n:i+1,l:x[0]+' — '+x[1].slice(0,70)+(x[1].length>70?'…':''),full:x[1],tag:x[0]}));
  const tk=(ORG_TASKS[unit]||[]).map(v=>VIEWS.find(x=>x.id===v)).filter(Boolean);return tk.map((v,i)=>({n:i+1,l:v.label,full:v.label,tag:v.label}))}
function recUI(){return S.ui.rc||(S.ui.rc={q:'',duty:'',st:'',type:''})}
function recRows(unit){const u=recUI(),q=norm(u.q);let r=(S.records||[]).filter(x=>x.unit===unit);
  if(u.duty)r=r.filter(x=>String(x.duty||'')===u.duty);if(u.st)r=r.filter(x=>x.status===u.st);if(u.type)r=r.filter(x=>x.type===u.type);
  if(q)r=r.filter(x=>norm([x.title,x.ref,x.notes,x.type,(x.attachments||[]).map(a=>a.name).join(' ')].join(' ')).includes(q));
  return r.sort((a,b)=>(b.date||'').localeCompare(a.date||'')||(b.createdAt||'').localeCompare(a.createdAt||''))}
function recDutyLabel(unit,n){const d=recDuties(unit).find(x=>String(x.n)===String(n));return d?d.tag:''}
function recPanel(unit){const o=ORG_BY.get(unit);if(!o)return '';const all=(S.records||[]).filter(x=>x.unit===unit),u=recUI(),duties=recDuties(unit),can=recCan(unit);
  const open=all.filter(x=>x.status!=='منجز').length,files=all.reduce((n,x)=>n+(x.attachments||[]).length,0);
  return `<section class="panel ocd-wide rec" id="rec-panel" data-unit="${unit}"><div class="rec-head"><div><h3 class="section-title">سجل الإدارة <small>إضافة وحذف وإرفاق وتصدير، كلٌّ في نطاق مهامه</small></h3>
    <div class="rec-stats"><span><b class="num">${all.length}</b> سجل</span><span><b class="num">${open}</b> جارٍ</span><span><b class="num">${files}</b> مرفق</span>${can?'':'<span class="pill p-neutral">اطلاع فقط</span>'}</div></div>
   <div class="toolbar">${can?`<button class="btn primary sm" data-act="rec-new" data-unit="${unit}">${I.plus}إضافة سجل</button>`:''}<button class="btn sm" data-act="rec-export" data-unit="${unit}">${I.down}تصدير Excel</button><button class="btn sm" data-act="rec-pdf" data-unit="${unit}">${I.down}تصدير PDF</button></div></div>
   <div class="toolbar rec-filters"><div class="grow">${I.search}<input type="search" id="rc-q" value="${esc(u.q)}" placeholder="بحث في السجلات والمرفقات…"></div>
    <select id="rc-duty"><option value="">كل المهام</option>${duties.map(d=>`<option value="${d.n}" ${u.duty===String(d.n)?'selected':''}>${d.n}. ${esc(d.tag)}</option>`).join('')}</select>
    <select id="rc-type"><option value="">كل الأنواع</option>${REC_TYPES.map(t=>`<option ${u.type===t?'selected':''}>${t}</option>`).join('')}</select>
    <select id="rc-st"><option value="">كل الحالات</option>${REC_ST.map(t=>`<option ${u.st===t?'selected':''}>${t}</option>`).join('')}</select></div>
   <div id="rec-table"></div></section>`}
function renderRecTable(unit){const el=document.getElementById('rec-table');if(!el)return;const r=recRows(unit),can=recCan(unit),duties=recDuties(unit);
  const att=l=>window.ATT&&ATT.view?ATT.view(l,{compact:1}):l.map(a=>`<span class="tag">${esc(a.name)}</span>`).join(' ');
  el.innerHTML=r.length?`<div class="count-line">${r.length} سجل</div><div class="tablewrap rec-tw"><table><thead><tr><th class="nosort">التاريخ</th><th class="nosort">الموضوع</th><th class="nosort">المهمة</th><th class="nosort">النوع</th><th class="nosort">الإشارة</th><th class="nosort">المرفقات</th><th class="nosort">الحالة</th><th class="nosort">بواسطة</th>${can?'<th class="nosort"></th>':''}</tr></thead><tbody>
   ${r.map(x=>{const d=duties.find(y=>String(y.n)===String(x.duty));return `<tr data-rec="${x.id}"><td class="n">${fd(x.date)}</td><td class="t-strong wrap">${esc(x.title||'—')}${x.notes?`<small class="muted" style="display:block;font-weight:400">${esc(x.notes.slice(0,90))}${x.notes.length>90?'…':''}</small>`:''}</td><td>${d?`<span class="tag link" data-tip="${esc(d.full)}">${d.n}. ${esc(d.tag)}</span>`:'<span class="muted">—</span>'}</td><td>${esc(x.type||'—')}</td><td class="n">${esc(x.ref||'—')}</td><td class="rec-att">${(x.attachments||[]).length?att(x.attachments):'<span class="muted">—</span>'}</td><td><span class="pill ${REC_STC[x.status]||'p-neutral'}">${esc(x.status||'جارٍ')}</span>${x.hold?`<span class="pill p-crit" data-tip="${esc('حجز قانوني: '+(x.hold.reason||''))}" style="margin-inline-start:4px">🔒</span>`:''}${(x.history||[]).length?`<button type="button" class="btn sm ghost" data-rec-hist="${x.id}" title="تاريخ التعديلات" style="margin-inline-start:4px;padding:2px 6px">${(x.history||[]).length}✎</button>`:''}</td><td><small>${esc(x.by||'')}</small></td>${can?`<td class="rec-acts"><button class="btn sm ghost" data-act="rec-edit" data-id="${x.id}" data-unit="${unit}">تعديل</button><button class="btn sm ghost danger" data-act="rec-del" data-id="${x.id}" data-unit="${unit}">حذف</button></td>`:''}</tr>`}).join('')}</tbody></table></div>`
   :`<div class="empty"><b>${(S.records||[]).some(x=>x.unit===unit)?'لا توجد سجلات مطابقة':'لا توجد سجلات بعد'}</b>${can?'اضغط «إضافة سجل» لتسجيل مراسلة أو تقرير أو مرفق ضمن مهام هذه الإدارة.':'سيظهر هنا ما تسجله الإدارة ضمن مهامها.'}</div>`}
function recBind(unit){const p=document.getElementById('rec-panel');if(!p)return;recMyUnit().then(()=>{renderRecTable(unit);const h=p.querySelector('[data-act="rec-new"]');if(!h&&recCan(unit)){const tb=p.querySelector('.rec-head .toolbar');tb.insertAdjacentHTML('afterbegin',`<button class="btn primary sm" data-act="rec-new" data-unit="${unit}">${I.plus}إضافة سجل</button>`);const ro=p.querySelector('.rec-stats .pill');if(ro)ro.remove()}});
  const u=recUI();const q=p.querySelector('#rc-q');q.addEventListener('input',debounce(()=>{u.q=q.value;renderRecTable(unit)},150));
  ['duty','type','st'].forEach(k=>p.querySelector('#rc-'+k).addEventListener('change',e=>{u[k]=e.target.value;renderRecTable(unit)}))}
function recForm(unit,rec){const isNew=!rec;const o=ORG_BY.get(unit);rec=rec||{date:TODAY_ISO,status:'جارٍ',type:'مراسلة',duty:recUI().duty||''};const duties=recDuties(unit);
  const attField=window.ATT&&ATT.formField?ATT.formField('dlg',rec.attachments||[],{name:rec.title||o.title,scope:{k:'units',u:[unit,'gm','board']}}):`<div class="field full"><label>المرفقات</label><span class="hint">ميزة إرفاق الملفات والمسح الضوئي قيد التفعيل؛ أعد تحميل الصفحة لاحقًا.</span></div>`;
  modal(isNew?'إضافة سجل — '+o.title:'تعديل السجل',`<fieldset><legend>السجل</legend>
    <div class="field full"><label for="r-duty">المهمة / الاختصاص<span class="req">*</span></label><select id="r-duty"><option value="">— اختر المهمة التي يندرج تحتها السجل —</option>${duties.map(d=>`<option value="${d.n}" ${String(rec.duty)===String(d.n)?'selected':''}>${d.n}. ${esc(d.l)}</option>`).join('')}${duties.length?'':'<option value="0">عام</option>'}</select></div>
    ${F('r-title','الموضوع',rec.title,{req:1,full:1})}${F('r-type','النوع',rec.type,{type:'select',options:uniq([...REC_TYPES,rec.type])})}${F('r-date','التاريخ',rec.date,{type:'date',req:1})}
    ${F('r-ref','رقم الإشارة / المرجع',rec.ref)}${F('r-st','الحالة',rec.status,{type:'select',options:REC_ST})}${F('r-notes','ملاحظات',rec.notes,{type:'textarea',full:1})}</fieldset>
   <fieldset><legend>المرفقات</legend>${attField}${!isNew&&(window.__me&&window.__me()||{}).role==='admin'?`<div class="field full gv-hold"><label><input type="checkbox" id="r-hold" ${rec.hold?'checked':''}> حجز قانوني: يمنع حذف السجل حتى يرفع مدير النظام الحجز</label><input id="r-hold-reason" placeholder="سبب الحجز (قضية، تدقيق، مراجعة…)" value="${esc(rec.hold&&rec.hold.reason||'')}" maxlength="200" style="margin-top:6px"></div>`:''}</fieldset>`,
  `<button type="submit" class="btn primary" data-act="rec-save" data-id="${rec.id||''}" data-unit="${unit}">حفظ</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button>${!isNew?`<button type="button" class="btn danger" data-act="del" data-col="records" data-id="${rec.id}" style="margin-inline-start:auto">حذف</button>`:''}<span id="f-err" style="color:var(--crit);font-size:12.5px;margin-inline-start:8px"></span>`)}
async function recSave(unit,id){const old=id?(S.records||[]).find(x=>x.id===id):null;
  const o={unit,duty:val('r-duty'),title:val('r-title'),type:val('r-type'),date:val('r-date'),ref:val('r-ref'),status:val('r-st')||'جارٍ',notes:val('r-notes')};
  if(!o.title||!o.date||o.duty===''){document.getElementById('f-err').textContent='المهمة والموضوع والتاريخ مطلوبة.';return}
  o.attachments=window.ATT&&ATT.val?await ATT.val('dlg','f-err'):(old&&old.attachments)||[];
  const me=window.__me&&window.__me();if(old){o.by=old.by||'';o.createdBy=old.createdBy||'';const hEl=document.getElementById('r-hold');if(hEl){if(hEl.checked)o.hold=old.hold||{by:(me&&me.email)||'',at:new Date().toISOString(),reason:(val('r-hold-reason')||'').slice(0,200)};else if(old.hold)o.holdReleased={by:(me&&me.email)||'',at:new Date().toISOString()}}else if(old.hold)o.hold=old.hold;o.history=recHistory(old,o,me)}else{o.by=(me&&(me.name||me.email))||await csMe();o.createdBy=(me&&me.email)||''}
  await write('records',id||uid('r'),o,!id);dlg.close();toast(old?'تم حفظ التعديل':'تم إضافة السجل')}
const REC_HK=['title','type','date','ref','status','notes','duty'];
function recHistory(old,o,me){const ch=REC_HK.filter(k=>String(old[k]||'')!==String(o[k]||'')).map(k=>({k,from:String(old[k]||'').slice(0,120),to:String(o[k]||'').slice(0,120)}));const na=(o.attachments||[]).length,oa=(old.attachments||[]).length;if(na!==oa)ch.push({k:'attachments',from:String(oa),to:String(na)});if(!!o.hold!==!!old.hold)ch.push({k:'hold',from:old.hold?'1':'',to:o.hold?'1':''});const h=(old.history||[]).slice(-99);if(ch.length)h.push({ts:new Date().toISOString(),by:(me&&me.email)||'',name:(me&&me.name)||'',changes:ch});return h}
function recExportRows(unit){return recRows(unit).map((x,i)=>({'م':i+1,'التاريخ':x.date||'','الموضوع':x.title||'','المهمة':x.duty?x.duty+'. '+recDutyLabel(unit,x.duty):'','النوع':x.type||'','رقم الإشارة':x.ref||'','الحالة':x.status||'','المرفقات':(x.attachments||[]).map(a=>a.name).join('، '),'ملاحظات':x.notes||'','بواسطة':x.by||'','آخر تحديث':x.updatedAt?x.updatedAt.slice(0,10):''}))}
function recExport(unit){const o=ORG_BY.get(unit);saveXlsx([['سجل الإدارة',recExportRows(unit)]],'سجل-'+o.title.replace(/[\/\\:*?"<>|]/g,' ')+'-'+TODAY_ISO+'.xlsx')}
function recPdf(unit){const o=ORG_BY.get(unit),en=!!(window.I18N&&I18N.lang==='en'),T=s=>en?I18N.t(s):s,rows=recExportRows(unit),keys=rows.length?Object.keys(rows[0]).filter(k=>k!=='ملاحظات'):[];
  const w=window.open('','_blank');if(!w){toast(T('اسمح بفتح النوافذ المنبثقة لتصدير PDF'));return}
  w.document.open();w.document.write(`<!doctype html><html lang="${en?'en':'ar'}" dir="${en?'ltr':'rtl'}"><head><meta charset="utf-8"><title>${esc(T('سجل الإدارة'))} — ${esc(o.title)}</title><style>@page{size:A4 landscape;margin:12mm}body{font-family:Arial,Arimo,"Noto Sans Arabic",Tahoma,sans-serif;font-weight:700;color:#0e2240;font-size:11px;margin:0}h1{font-size:18px;margin:0 0 2px}p{margin:0 0 12px;color:#55677f}table{width:100%;border-collapse:collapse}th{background:#0b3168;color:#fff;padding:6px 8px;text-align:start}td{padding:5px 8px;border-bottom:1px solid #e7ecf4;vertical-align:top}tr{break-inside:avoid}tbody tr:nth-child(even) td{background:#f6f8fc}.ft{margin-top:10px;color:#93aac6;font-size:10px}</style></head><body>
   <h1>${esc(T('سجل الإدارة'))}: ${esc(o.title)}</h1><p>${o.vacant?T('شاغرة'):esc(o.head)} · ${rows.length} ${esc(T('سجل'))} · ${fd(TODAY_ISO)}</p>
   ${rows.length?`<table><thead><tr>${keys.map(k=>`<th>${esc(T(k))}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${keys.map(k=>`<td>${esc(String(r[k]))}</td>`).join('')}</tr>`).join('')}</tbody></table>`:`<p>${esc(T('لا توجد سجلات بعد'))}</p>`}
   <div class="ft">${esc(T('صادر من منظومة الإدارة العامة للمبيعات والشؤون التجارية'))}</div></body></html>`);w.document.close();
  const run=()=>{try{w.focus();w.print()}catch(e){}};setTimeout(run,400)}
document.addEventListener('click',async e=>{const a=e.target.closest('[data-act^="rec-"]');if(!a)return;const act=a.dataset.act,unit=a.dataset.unit,id=a.dataset.id;
  if(act==='rec-new'){if(!recCan(unit)){toast('لا تملك صلاحية الإضافة في هذه الإدارة');return}if(dlg.open)dlg.close();recForm(unit,null);return}
  if(act==='rec-edit'){e.stopPropagation();const r=(S.records||[]).find(x=>x.id===id);if(r)recForm(unit,r);return}
  if(act==='rec-save'){e.preventDefault();a.disabled=true;try{await recSave(unit,id||null)}catch(err){document.getElementById('f-err').textContent=writeErr(err)}finally{a.disabled=false}return}
  if(act==='rec-del'){e.stopPropagation();if(!a.classList.contains('armed')){a.classList.add('armed');a.textContent='تأكيد الحذف';setTimeout(()=>{a.classList.remove('armed');a.textContent='حذف'},4000);return}
    try{await S.db.collection('records').doc(id).delete();toast('تم حذف السجل')}catch(err){toast(writeErr(err))}return}
  if(act==='rec-export'){recExport(unit);return}
  if(act==='rec-pdf'){recPdf(unit);return}},true);
function orgDutiesPanel(id){const d=ORG_DUTIES[id];if(!d)return '';
  return `<section class="panel ocd-wide"><h3 class="section-title">المهام والاختصاصات <small>قرار مجلس الإدارة رقم (${ORG_DECREE.no}) لسنة ${ORG_DECREE.year}م</small></h3>
   <ol class="od-list od-compact">${d.items.map((x,i)=>`<li><span class="od-n num">${i+1}</span><div><span class="od-tag">${esc(x[0])}</span><p>${esc(x[1])}</p></div></li>`).join('')}</ol>
   <button class="btn sm" data-od-open="${id}" style="margin-top:10px">عرض كل الاختصاصات</button></section>`}
document.addEventListener('click',e=>{if(!e.target.closest('#o-tree'))return;
  const b=e.target.closest('[data-od]');if(b){S.ui.od=b.dataset.od;S.ui.odq2='';renderOrg();return}
  const d=e.target.closest('[data-od-dash]');if(d){S.ui.of=d.dataset.odDash;S.ui.om='dash';document.querySelectorAll('[data-om]').forEach(x=>x.setAttribute('aria-selected',x.dataset.om==='dash'));renderOrg();return}
  const o=e.target.closest('[data-od-open]');if(o){e.stopPropagation();S.ui.od=o.dataset.odOpen;S.ui.om='duties';S.ui.odq2='';document.querySelectorAll('[data-om]').forEach(x=>x.setAttribute('aria-selected',x.dataset.om==='duties'));renderOrg();document.getElementById('o-tree').scrollIntoView({block:'start',behavior:'smooth'})}},true);
function orgPath(id){const p=[];let o=ORG_BY.get(id);while(o){p.unshift(o);o=ORG_BY.get(o.parent)}return p}
function orgDesc(id){return orgKids(id).reduce((n,k)=>n+1+orgDesc(k.id),0)}
function viewOrg(){
  const cnt=k=>ORG.filter(o=>o.type===k).length,mode=S.ui.om||'chart';
  const kp=(l,v,c='')=>`<div class="kpi ${c}" style="cursor:default"><span class="l">${l}</span><span class="v">${v}</span></div>`;
  return `<div class="page-head"><div><h2>الهيكل التنظيمي</h2><p>الإدارة العامة للمبيعات والشؤون التجارية وإداراتها وأقسامها ووحداتها، كما وردت في الهيكل المعتمد. اضغط على أي جهة لعرض ما يتبعها.</p></div>
  <div class="toolbar"><div class="seg" role="tablist"><button data-om="chart" aria-selected="${mode==='chart'}">مخطط</button><button data-om="list" aria-selected="${mode==='list'}">قائمة</button><button data-om="dash" aria-selected="${mode==='dash'}">لوحة المؤشرات</button><button data-om="duties" aria-selected="${mode==='duties'}">المهام والاختصاصات</button></div><button class="btn" data-act="org-print">طباعة</button><button class="btn" data-act="export-org">${I.down}تصدير Excel</button><button class="btn" data-act="export-org-pdf">${I.down}تصدير PDF</button></div></div>
  <div class="kpis org-kpis">${kp('الإدارات',cnt('dept'))}${kp('المنسقون',cnt('coord'))}${kp('الأقسام',cnt('section'))}${kp('المكاتب',cnt('office'))}${kp('الوحدات والمشرفون',cnt('unit')+cnt('super'))}${kp('شواغر',ORG.filter(o=>o.vacant).length,'warn')}</div>
  <div class="toolbar"><div class="grow">${I.search}<input type="search" id="o-q" value="${esc(S.ui.oq||'')}" placeholder="بحث بالمسمى أو اسم المسؤول أو الرقم الوظيفي…"></div>
  <select id="o-f"><option value="">الهيكل الكامل</option>${ORG.filter(o=>orgKids(o.id).length&&o.id!=='board').map(o=>`<option value="${o.id}" ${S.ui.of===o.id?'selected':''}>${'— '.repeat(Math.max(0,orgPath(o.id).length-2))}${esc(o.title)}</option>`).join('')}</select></div>
  <div id="o-tree" class="panel org"></div>
  <div class="oc-legend">${ORG_TYPES.filter(t=>t.k!=='board'&&t.k!=='super').map(t=>`<span><i class="oc-dot t-${t.k}"></i>${t.l}</span>`).join('')}<span><i class="oc-dot vac"></i>شاغرة</span><span><span class="tag dup">تدقيق</span> الاسم أو الرقم غير واضح في النسخة الممسوحة</span></div>`;
}
/* بطاقة جهة في المخطط */
function ocCard(o,cls=''){
  const t=ORG_TYPES.find(x=>x.k===o.type),n=orgKids(o.id).length,perms=ORG_PERMS[o.id],tasks=(ORG_TASKS[o.id]||[]).map(v=>VIEWS.find(x=>x.id===v)).filter(Boolean);
  return `<div class="oc-card t-${o.type}${o.vacant?' vac':''}${n?' has':''} ${cls}" ${n?`data-org-focus="${o.id}" role="button" tabindex="0"`:''} title="${esc(o.title)}">
   <span class="oc-type">${t.l}</span><b class="oc-title">${esc(o.title)}</b>
   ${o.vacant?'<span class="oc-name oc-vac">شاغرة</span>':`<span class="oc-name">${esc(o.head)}</span>${ORG_ROLE[o.id]?`<span class="oc-role">${esc(ORG_ROLE[o.id])}</span>`:''}${o.empNo?`<span class="oc-no num">${esc(o.empNo)}</span>`:''}`}
   ${tasks.length?`<span class="oc-tasks"><span class="oc-tasks-h">المهام</span>${tasks.map(v=>`<button type="button" data-org-go="${v.id}">${I[v.icon]}${esc(v.label)}</button>`).join('')}</span>`:''}
   ${ORG_DUTIES[o.id]?`<button type="button" class="oc-duty" data-od-open="${o.id}">${ORG_DUTIES[o.id].items.length} مهام واختصاصات</button>`:''}
   ${o.uncertain||n||perms&&perms.length?`<span class="oc-foot">${o.uncertain?'<span class="tag dup">تدقيق</span>':''}${perms&&perms.length?`<span class="tag">${perms.length} صلاحية</span>`:''}${n?`<span class="oc-more">${orgDesc(o.id)} جهة تابعة ‹</span>`:''}</span>`:''}</div>`;
}
/* المستوى الأخير يُعرض عموديًا تحت الجهة الأم كما في الهيكل الورقي */
function ocStack(o){const k=orgKids(o.id);return k.length?`<div class="oc-stack">${k.map(c=>ocCard(c,'sm')).join('')}</div>`:''}
function ocBranch(o,rows){const k=orgKids(o.id);
  if(!rows||!k.length)return `<li>${ocCard(o)}${ocStack(o)}</li>`;
  return `<li>${ocCard(o)}<ul>${k.map(c=>ocBranch(c,rows-1)).join('')}</ul></li>`}
function renderOrgChart(el){
  const f=ORG_BY.get(S.ui.of)||ORG_BY.get('board'),path=orgPath(f.id),rows=f.id==='board'?2:1,k=orgKids(f.id);
  el.innerHTML=`<nav class="oc-crumbs">${path.map((p,i)=>i<path.length-1?`<button data-org-focus="${p.id==='board'?'':p.id}">${esc(p.id==='board'?'الهيكل الكامل':p.title)}</button><span>‹</span>`:`<b>${esc(p.id==='board'?'الهيكل الكامل':p.title)}</b>`).join('')}</nav>
  <div class="oc-scroll"><ul class="oc"><li>${ocCard(f,'root')}${k.length?`<ul>${k.map(c=>ocBranch(c,rows-1)).join('')}</ul>`:''}</li></ul></div>`;
  const sc=el.querySelector('.oc-scroll');sc.scrollLeft=(sc.scrollWidth-sc.clientWidth)/2*(getComputedStyle(sc).direction==='rtl'?-1:1);
}
function orgNode(o,hit){
  const kids=orgKids(o.id).filter(k=>hit.has(k.id));
  return `<div class="ol-row">${ocCard(o,'line')}${kids.length?`<div class="ol-kids">${kids.map(k=>orgNode(k,hit)).join('')}</div>`:''}</div>`;
}
function renderOrg(){
  const el=document.getElementById('o-tree');if(!el)return;const q=norm(S.ui.oq||''),root=q?'board':S.ui.of||'board';
  const bare=!q&&(S.ui.om==='dash'||S.ui.om==='duties');el.classList.toggle('bare',bare);el.classList.toggle('duties',!q&&S.ui.om==='duties');const ok=document.querySelector('.org-kpis');if(ok)ok.hidden=bare;if(!q&&S.ui.om==='duties'){el.classList.remove('chart');viewOrgDuties(el);return}if(!q&&S.ui.om==='dash'){el.classList.remove('chart');viewOrgDash(el);return}
  if(!q&&(S.ui.om||'chart')==='chart'){el.classList.add('chart');renderOrgChart(el);return}
  el.classList.remove('chart');const hit=new Set();
  ORG.filter(o=>!q||norm([o.title,o.head,o.empNo].join(' ')).includes(q)).forEach(o=>orgPath(o.id).forEach(p=>hit.add(p.id)));
  el.innerHTML=hit.has(root)?`${q?`<div class="count-line">${ORG.filter(o=>norm([o.title,o.head,o.empNo].join(' ')).includes(q)).length} نتيجة</div>`:''}${orgNode(ORG_BY.get(root),hit)}`:`<div class="empty"><b>لا نتائج</b>جرّب كلمة أخرى.</div>`;
}
function exportOrg(){const r=ORG.map(o=>({'المسمى':o.title,'النوع':ORG_TYPES.find(t=>t.k===o.type).l,'المسؤول':o.vacant?'شاغرة':o.head,'الرقم الوظيفي':o.empNo,'الجهة الأعلى':o.parent?ORG_BY.get(o.parent).title:'','المسار':orgPath(o.id).map(p=>p.title).join(' / '),'تدقيق':o.uncertain?'نعم':''}));const du=[];ORG_DUTY_ORDER.forEach(id=>ORG_DUTIES[id].items.forEach((x,i)=>du.push({'الجهة':ORG_BY.get(id).title,'م':i+1,'المجال':x[0],'المهمة':x[1],'المرجع':'قرار مجلس الإدارة رقم ('+ORG_DECREE.no+') لسنة '+ORG_DECREE.year})));saveXlsx([['الهيكل التنظيمي',r],['المهام والاختصاصات',du]],'الهيكل-التنظيمي-'+TODAY_ISO+'.xlsx')}
afterRender.org=()=>{renderOrg();const q=document.getElementById('o-q');q.addEventListener('input',debounce(()=>{S.ui.oq=q.value;renderOrg()},150));document.getElementById('o-f').addEventListener('change',e=>{S.ui.of=e.target.value;renderOrg()})};
/* ============ لوحة مؤشرات الهيكل التنظيمي ============ */
function orgAll(id){const out=[];const walk=p=>orgKids(p).forEach(k=>{out.push(k);walk(k.id)});walk(id);return out}
function orgDepth(id){const k=orgKids(id);return k.length?1+Math.max(...k.map(c=>orgDepth(c.id))):0}
function ocPct(a,b){return b?Math.round(a*100/b):0}
function ocBars(rows,max,opt={}){
  return `<div class="ocd-bars">${rows.map(r=>`<div class="ocd-row${r.go||r.set?' go':''}" ${r.go?`data-org-dash="${r.go}" role="button" tabindex="0"`:r.set?`data-ocd-set="${r.set}" role="button" tabindex="0"`:''}>
    <span class="ocd-lbl" title="${esc(r.full||r.l)}">${esc(r.l)}</span>
    <span class="ocd-track">${(r.parts||[{v:r.v,c:'f'}]).filter(p=>p.v).map(p=>`<span class="ocd-seg ${p.c}" style="width:${p.v*100/max}%" data-tip="${esc((r.full||r.l)+' · '+(p.t||'')+' '+p.v)}"></span>`).join('')}</span>
    <span class="ocd-val num">${r.vl??r.v}</span></div>`).join('')}</div>`;
}
function ocGauge(pct,label,sub,act){const p=Math.max(0,Math.min(100,pct)),r=52,L=Math.PI*r,met=p>=100;
  return `<div class="ocg${act?' go':''}" ${act?`data-ocd-set="${act}" role="button" tabindex="0"`:''} data-tip="${esc(label+': '+p+'% · الهدف 100%')}">
   <svg viewBox="0 0 128 74" aria-hidden="true"><path d="M12 66a52 52 0 0 1 104 0" class="ocg-track"/>${p?`<path d="M12 66a52 52 0 0 1 104 0" class="ocg-val" style="stroke-dasharray:${L*p/100} ${L}"/>`:''}</svg>
   <b class="num">${p}%</b><span class="ocg-l">${label}</span><span class="ocg-s">${sub}</span>
   <span class="pill ${met?'p-ok':'p-warn'}">${met?'✓ محقق':'! دون الهدف'} · الهدف 100%</span></div>`}
function viewOrgDash(el){
  const root=ORG_BY.get(S.ui.of)||ORG_BY.get('board'),sub=orgAll(root.id),pos=[root,...sub];
  const filled=pos.filter(o=>!o.vacant).length,vac=pos.length-filled,unc=pos.filter(o=>o.uncertain).length,permd=pos.filter(o=>(ORG_PERMS[o.id]||[]).length).length;
  const base=root.id==='board'?'gm':root.id,kids=orgKids(base),tasks=pos.reduce((n,o)=>n+(ORG_TASKS[o.id]||[]).length,0);
  const mgrs=pos.filter(o=>orgKids(o.id).length),avgSpan=mgrs.length?(mgrs.reduce((n,o)=>n+orgKids(o.id).length,0)/mgrs.length):0;
  const kp=(l,v,s='',c='',act='')=>`<div class="kpi ${c}${act?' go':''}" ${act?`data-ocd-set="${act}" role="button" tabindex="0"`:'style="cursor:default"'}><span class="l">${l}</span><span class="v">${v}</span>${s?`<span class="s">${s}</span>`:''}</div>`;
  const types=ORG_TYPES.filter(t=>t.k!=='board').map(t=>({l:t.l,v:sub.filter(o=>o.type===t.k).length,k:t.k})).filter(r=>r.v);
  const maxT=Math.max(1,...types.map(r=>r.v));
  const cmp=kids.map(k=>{const a=[k,...orgAll(k.id)],v=a.filter(o=>o.vacant).length;return {l:k.title,full:k.title,go:orgKids(k.id).length?k.id:'',v:a.length,parts:[{v:a.length-v,c:'f',t:'مشغولة'},{v,c:'v',t:'شاغرة'}],vl:a.length}}).sort((a,b)=>b.v-a.v);
  const maxC=Math.max(1,...cmp.map(r=>r.v));
  const span=mgrs.map(o=>({l:o.title,full:`${o.title} — ${o.vacant?'شاغرة':o.head}`,v:orgKids(o.id).length,go:o.id!==root.id?o.id:''})).sort((a,b)=>b.v-a.v).slice(0,8);
  const maxS=Math.max(1,...span.map(r=>r.v));
  // عدد الجهات في كل مستوى إداري
  const rd=orgPath(root.id).length,lv={};pos.forEach(o=>{const d=orgPath(o.id).length-rd+1;lv[d]=(lv[d]||0)+1});
  const lvs=Object.entries(lv).map(([d,n])=>({d:+d,n})),maxL=Math.max(1,...lvs.map(x=>x.n));
  const path=orgPath(root.id),scopes=['board',...orgKids('gm').map(o=>o.id)];
  el.innerHTML=`<div class="ocd-scopes">${scopes.map(id=>{const o=ORG_BY.get(id);return `<button data-org-dash="${id}" aria-pressed="${id===root.id}">${esc(id==='board'?'الهيكل الكامل':o.title)}</button>`}).join('')}</div>
  <div class="ocd-head"><div><div class="oc-crumbs" style="padding:0 0 4px">${path.map((p,i)=>i<path.length-1?`<button data-org-dash="${p.id}">${esc(p.id==='board'?'الهيكل الكامل':p.title)}</button><span>‹</span>`:'').join('')}</div>
   <h3>${esc(root.id==='board'?'لوحة مؤشرات الهيكل التنظيمي':'لوحة مؤشرات: '+root.title)}</h3><p>${root.vacant?'المسؤول: شاغرة':`المسؤول: <b>${esc(root.head)}</b>${ORG_ROLE[root.id]?` · ${esc(ORG_ROLE[root.id])}`:''}${root.empNo?` <span class="num">${esc(root.empNo)}</span>`:''}`}</p></div>
   ${kids.length?`<button class="btn sm" data-org-focus="${root.id==='board'?'':root.id}">عرض في المخطط</button>`:''}</div>
  <h4 class="ocd-sec">مؤشرات الأداء الرئيسية <small>مقارنة بالهدف</small></h4>
  <div class="ocd-gauges">${ocGauge(ocPct(filled,pos.length),'نسبة إشغال المناصب',`${filled} مشغولة من ${pos.length}`,'st:v')}${ocGauge(ocPct(pos.length-unc,pos.length),'دقة بيانات الهيكل',`${unc} بند بحاجة تدقيق`,'st:u')}${ocGauge(ocPct(permd,pos.length),'اكتمال الصلاحيات',permd?`${permd} جهة محددة`:'بانتظار بيانات الصلاحيات')}</div>
  <h4 class="ocd-sec">بطاقات ملخصة <small>اضغط على البطاقة لتصفية الجدول</small></h4>
  <div class="kpis ocd-kpis">${kp('الجهات التابعة',sub.length,kids.length?`${kids.length} ${root.id==='board'?'تحت الإدارة العامة':'مباشرة'}`:'','','st:')}${kp('المناصب المشغولة',filled,`${ocPct(filled,pos.length)}%`,'ok','st:f')}${kp('الشواغر',vac,`${ocPct(vac,pos.length)}%`,vac?'warn':'','st:v')}${kp('بحاجة تدقيق',unc,'أسماء أو أرقام غير واضحة',unc?'warn':'','st:u')}${kp('المستويات الإدارية',orgDepth(root.id)+1)}${kp('متوسط نطاق الإشراف',avgSpan.toFixed(1),`${mgrs.length} مسؤول له جهات تابعة`)}${kp('المهام المسندة',tasks,tasks?'صفحات في المنظومة':'')}</div>
  <div class="ocd-grid">
   ${orgDutiesPanel(root.id)}
   ${root.id!=='board'?recPanel(root.id):''}
   ${cmp.length>1?`<section class="panel ocd-wide"><h3 class="section-title">${root.id==='board'?'حجم الإدارات والجهات التابعة للإدارة العامة':'حجم الجهات التابعة مباشرة'} <small>اضغط على جهة لعرض لوحتها</small></h3>
     <div class="ocd-legend"><span><i class="f"></i>مشغولة</span><span><i class="v"></i>شاغرة</span></div>${ocBars(cmp,maxC)}</section>`:''}
   ${types.length?`<section class="panel"><h3 class="section-title">التوزيع حسب النوع <small>اضغط للتصفية</small></h3>${ocBars(types.map(t=>({...t,set:'ty:'+t.k})),maxT)}</section>`:''}
   <section class="panel"><h3 class="section-title">عدد الجهات في كل مستوى إداري</h3><div class="ocd-cols">${lvs.map(x=>`<div class="ocd-col" data-tip="${esc('المستوى '+x.d+': '+x.n+' جهة')}"><span class="num">${x.n}</span><i style="height:${Math.max(4,x.n*100/maxL)}%"></i><small>م${x.d}</small></div>`).join('')}</div></section>
   ${span.length?`<section class="panel ocd-wide"><h3 class="section-title">نطاق الإشراف <small>عدد الجهات التابعة مباشرة لكل مسؤول · اضغط لعرض لوحتها</small></h3>${ocBars(span,maxS)}</section>`:''}
   <section class="panel ocd-wide"><h3 class="section-title">جميع الجهات في النطاق</h3>
    <div class="toolbar ocd-filters"><div class="grow">${I.search}<input type="search" id="ocd-q" value="${esc(S.ui.odq||'')}" placeholder="بحث بالمسمى أو الاسم أو الرقم الوظيفي…"></div>
     <select id="ocd-t"><option value="">كل الأنواع</option>${ORG_TYPES.filter(t=>t.k!=='board').map(t=>`<option value="${t.k}" ${S.ui.odt===t.k?'selected':''}>${t.l}</option>`).join('')}</select>
     <select id="ocd-s"><option value="">كل الحالات</option><option value="f" ${S.ui.ods==='f'?'selected':''}>مشغولة</option><option value="v" ${S.ui.ods==='v'?'selected':''}>شاغرة</option><option value="u" ${S.ui.ods==='u'?'selected':''}>بحاجة تدقيق</option></select>
     <button class="btn sm ghost" data-ocd-set="clear">مسح التصفية</button></div>
    <div id="ocd-table"></div></section>
  </div>`;
  const tb=()=>renderOcdTable(pos,root);tb();
  const q=el.querySelector('#ocd-q');q.addEventListener('input',debounce(()=>{S.ui.odq=q.value;tb()},150));
  el.querySelector('#ocd-t').addEventListener('change',e=>{S.ui.odt=e.target.value;tb()});
  el.querySelector('#ocd-s').addEventListener('change',e=>{S.ui.ods=e.target.value;tb()});
  if(root.id!=='board')recBind(root.id);
}
function renderOcdTable(pos,root){const el=document.getElementById('ocd-table');if(!el)return;const q=norm(S.ui.odq||'');
  let r=pos.filter(o=>o.id!=='board');
  if(S.ui.odt)r=r.filter(o=>o.type===S.ui.odt);
  if(S.ui.ods==='f')r=r.filter(o=>!o.vacant);if(S.ui.ods==='v')r=r.filter(o=>o.vacant);if(S.ui.ods==='u')r=r.filter(o=>o.uncertain);
  if(q)r=r.filter(o=>norm([o.title,o.head,o.empNo].join(' ')).includes(q));
  el.innerHTML=`<div class="count-line">${r.length} جهة</div>${r.length?`<div class="tablewrap ocd-tw"><table><thead><tr><th class="nosort">الجهة</th><th class="nosort">النوع</th><th class="nosort">المسؤول</th><th class="nosort">الرقم الوظيفي</th><th class="nosort">تتبع</th><th class="nosort">جهات تابعة</th><th class="nosort">الحالة</th><th class="nosort">الصلاحيات</th></tr></thead><tbody>
  ${r.map(o=>{const a=orgAll(o.id).length;return `<tr ${a?`data-org-dash="${o.id}" style="cursor:pointer"`:''}><td class="t-strong">${esc(o.title)}</td><td>${ORG_TYPES.find(t=>t.k===o.type).l}</td><td>${o.vacant?'—':esc(o.head)}</td><td class="n">${esc(o.empNo||'—')}</td><td>${esc(o.parent?ORG_BY.get(o.parent).title:'—')}</td><td class="n">${a||'—'}</td><td>${o.vacant?'<span class="pill p-warn">شاغرة</span>':o.uncertain?'<span class="tag dup">تدقيق</span>':'<span class="pill p-ok">مشغولة</span>'}</td><td>${(ORG_PERMS[o.id]||[]).length?`${ORG_PERMS[o.id].length} صلاحية`:'<span class="muted">لم تُحدَّد بعد</span>'}</td></tr>`}).join('')}</tbody></table></div>`:'<div class="empty"><b>لا نتائج</b>غيّر التصفية أو البحث.</div>'}`;
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-ocd-set]');if(!b||!b.closest('#o-tree'))return;const v=b.dataset.ocdSet;
  if(v==='clear'){S.ui.odq='';S.ui.odt='';S.ui.ods=''}else{const [k,x]=v.split(':');if(k==='st'){S.ui.ods=x;S.ui.odt=''}if(k==='ty'){S.ui.odt=x;S.ui.ods=''}S.ui.odq=''}
  ['ocd-q','ocd-t','ocd-s'].forEach((id,i)=>{const f=document.getElementById(id);if(f)f.value=[S.ui.odq,S.ui.odt,S.ui.ods][i]||''});
  const root=ORG_BY.get(S.ui.of)||ORG_BY.get('board');renderOcdTable([root,...orgAll(root.id)],root);document.getElementById('ocd-table').scrollIntoView({block:'nearest',behavior:'smooth'})});
function ocTip(e){let t=document.getElementById('oc-tip');const h=e.target.closest&&e.target.closest('[data-tip]');
  if(!h){if(t)t.hidden=true;return}if(!t){t=document.createElement('div');t.id='oc-tip';t.setAttribute('role','tooltip');document.body.appendChild(t)}
  t.textContent=h.dataset.tip;t.hidden=false;const r=h.getBoundingClientRect();t.style.top=(r.top+window.scrollY-t.offsetHeight-8)+'px';t.style.left=Math.max(8,Math.min(window.innerWidth-t.offsetWidth-8,r.left+r.width/2-t.offsetWidth/2))+'px'}
document.addEventListener('mouseover',ocTip);
document.addEventListener('click',e=>{const d=e.target.closest('[data-org-dash]');if(d&&d.closest('#o-tree')){S.ui.of=d.dataset.orgDash==='board'?'':d.dataset.orgDash;const f=document.getElementById('o-f');if(f)f.value=S.ui.of;renderOrg();document.getElementById('o-tree').scrollIntoView({block:'start',behavior:'smooth'})}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.closest&&e.target.closest('[data-org-dash]'))e.target.click()});
function orgFocus(id){S.ui.of=id;S.ui.oq='';const q=document.getElementById('o-q');if(q)q.value='';const f=document.getElementById('o-f');if(f)f.value=id;S.ui.om='chart';document.querySelectorAll('[data-om]').forEach(b=>b.setAttribute('aria-selected',b.dataset.om==='chart'));renderOrg();document.getElementById('o-tree').scrollIntoView({block:'start',behavior:'smooth'})}
document.addEventListener('click',e=>{const g=e.target.closest('[data-org-go]');if(g){go(g.dataset.orgGo);return}const f=e.target.closest('[data-org-focus]');if(f&&f.closest('#o-tree')){orgFocus(f.dataset.orgFocus);return}
  const m=e.target.closest('[data-om]');if(m){S.ui.om=m.dataset.om;document.querySelectorAll('[data-om]').forEach(b=>b.setAttribute('aria-selected',b===m));renderOrg();return}
  if(e.target.closest('[data-act="org-print"]')){S.ui.om='chart';render();document.body.classList.add('print-org');window.print();document.body.classList.remove('print-org')}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'){const f=e.target.closest&&e.target.closest('[data-org-focus]');if(f&&f.closest('#o-tree'))orgFocus(f.dataset.orgFocus)}});

/* ============ تحليل البيانات ============ */
function anShort(v){if(v==null||isNaN(v))return'—';const a=Math.abs(v);if(a>=1e6)return +(v/1e6).toFixed(a>=1e7?0:1)+' مليون';if(a>=1e4)return Math.round(v/1e3)+' ألف';return fn(Math.round(v*10)/10)}
function anBars(rows,opt={}){
  if(!rows.length)return '<div class="empty" style="padding:20px">لا توجد بيانات ضمن التصفية الحالية</div>';
  const max=Math.max(1,...rows.map(r=>r.v)),f=opt.fmt||anShort,u=opt.unit?' '+opt.unit:'';
  return `<div class="an-bars">${rows.map(r=>`<div class="an-row${r.go?' go':''}" ${r.go?`data-an-go='${esc(JSON.stringify(r.go))}' role="button" tabindex="0"`:''} data-tip="${esc((r.full||r.l)+': '+fn(Math.round(r.v*10)/10)+u+(r.note?' · '+r.note:''))}">
   <span class="an-lbl" title="${esc(r.full||r.l)}">${esc(r.l)}</span><span class="an-track"><span class="an-fill${opt.tone?' '+opt.tone:''}" style="width:${r.v?Math.max(1.5,r.v*100/max):0}%"></span></span><span class="an-val num">${f(r.v)}</span></div>`).join('')}</div>`}
function anCols(rows,opt={}){ // rows:{l,v,v2?,full}
  if(!rows.some(r=>r.v||r.v2))return '<div class="empty" style="padding:20px">لا توجد بيانات ضمن التصفية الحالية</div>';
  const max=Math.max(1,...rows.map(r=>Math.max(r.v||0,r.v2||0)));
  return `<div class="an-cols${opt.pair?' pair':''}">${rows.map(r=>`<div class="an-col" data-tip="${esc(r.full+': '+(opt.pair?`${opt.pair[0]} ${r.v} · ${opt.pair[1]} ${r.v2}`:fn(r.v)+(opt.unit?' '+opt.unit:'')))}"><span class="num">${r.v||''}</span><div class="an-colbars"><i style="height:${r.v?Math.max(3,r.v*100/max):0}%"></i>${opt.pair?`<i class="b" style="height:${r.v2?Math.max(3,r.v2*100/max):0}%"></i>`:''}</div><small>${esc(r.l)}</small></div>`).join('')}</div>`}
function anStack(parts){const tot=parts.reduce((s,p)=>s+p.v,0)||1;
  return `<div class="an-stack">${parts.filter(p=>p.v).map(p=>`<span class="${p.c}" style="width:${p.v*100/tot}%" data-tip="${esc(p.l+': '+p.v+' ('+Math.round(p.v*100/tot)+'%)')}" ${p.go?`data-an-go='${esc(JSON.stringify(p.go))}' role="button" tabindex="0"`:''}></span>`).join('')}</div>
   <div class="an-legend">${parts.map(p=>`<span><i class="${p.c}"></i>${esc(p.l)} <b class="num">${p.v}</b> <small class="muted">${Math.round(p.v*100/tot)}%</small></span>`).join('')}</div>`}
function anGroup(arr,kf,vf=()=>1){const m=new Map();arr.forEach(x=>{const k=kf(x);const kk=(k==null||String(k).trim()==='')?'غير محدد':String(k).trim();m.set(kk,(m.get(kk)||0)+(Number(vf(x))||0))});return [...m.entries()].map(([l,v])=>({l,v})).sort((a,b)=>b.v-a.v)}
function anKpi(l,v,s='',cls=''){return `<div class="kpi ${cls}" style="cursor:default"><span class="l">${esc(l)}</span><span class="v">${v}</span>${s?`<span class="s">${s}</span>`:''}</div>`}
const anDiesel=n=>(n.dieselGen||0)+(n.dieselOp||0);
const AN_MN=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function anUI(){return S.ui.an||(S.ui.an={tab:'contracts',type:'',from:'',to:'',batch:'',region:'',ds:'contracts',dim:'type',me:'count'})}
function anContracts(){const u=anUI();return S.contracts.map(c=>({c,d:D.get(c.id)})).filter(({c})=>{
  const dt=c.signDate||c.startDate||'';if(u.type&&c.type!==u.type)return false;if(u.from&&(!dt||dt<u.from))return false;if(u.to&&(!dt||dt>u.to))return false;return true})}
function anNeeds(){const u=anUI();return S.needs.filter(n=>(!u.batch||n.batch===u.batch)&&(!u.region||cleanRegion(n.region)===u.region))}
const AN_TABS=[['contracts','العقود'],['needs','الاحتياجات والوقود'],['opp','الفرص البيعية'],['cs','خدمة الزبائن'],['custom','تحليل مخصّص']];
function viewAna(){const u=anUI();
  const hasC=['contracts','custom'].includes(u.tab),hasN=['needs','opp','custom'].includes(u.tab);
  return `<div class="page-head"><div><h2>تحليل البيانات</h2><p>قراءة تحليلية لعقود البريقة وكشوفات الاحتياجات وطلبات الزبائن، تتحدّث تلقائيًا مع كل تعديل في المنظومة.</p></div>
   <div class="toolbar"><button class="btn" data-act="an-export">${I.down}تصدير التحليل Excel</button></div></div>
  <div class="tabs" role="tablist">${AN_TABS.map(([k,l])=>`<button role="tab" data-an-tab="${k}" aria-selected="${u.tab===k}">${l}</button>`).join('')}</div>
  ${hasC||hasN?`<div class="toolbar an-filters">
   ${hasC?`<label class="an-f">نوع العقد<select id="an-type"><option value="">كل الأنواع</option>${uniq(S.contracts.map(c=>c.type)).map(t=>`<option ${u.type===t?'selected':''}>${esc(t)}</option>`).join('')}</select></label>
   <label class="an-f">التوقيع من<input type="date" id="an-from" value="${esc(u.from)}"></label><label class="an-f">إلى<input type="date" id="an-to" value="${esc(u.to)}"></label>`:''}
   ${hasN?`<label class="an-f">الدفعة<select id="an-batch"><option value="">كل الدفعات</option>${batchesSorted().map(b=>`<option value="${b.id}" ${u.batch===b.id?'selected':''}>${esc(b.name)}</option>`).join('')}</select></label>
   <label class="an-f">المنطقة<select id="an-region"><option value="">كل المناطق</option>${uniq(S.needs.map(n=>cleanRegion(n.region))).map(r=>`<option ${u.region===r?'selected':''}>${esc(r)}</option>`).join('')}</select></label>`:''}
   ${u.type||u.from||u.to||u.batch||u.region?'<button class="btn sm ghost" data-act="an-clear">مسح التصفية</button>':''}
  </div>`:'<div style="height:14px"></div>'}
  <div id="an-body"></div>`}
afterRender.ana=()=>{const u=anUI();const b=document.getElementById('an-body');if(!b)return;
  b.innerHTML=({contracts:anTabContracts,needs:anTabNeeds,opp:anTabOpp,cs:anTabCs,custom:anTabCustom}[u.tab]||anTabContracts)();
  [['an-type','type'],['an-from','from'],['an-to','to'],['an-batch','batch'],['an-region','region']].forEach(([id,k])=>{const e=document.getElementById(id);if(e)e.addEventListener('change',()=>{u[k]=e.value;render()})});
  if(u.tab==='custom')anCustomBind();if(u.tab==='opp')anOppTable()};
function anTabContracts(){
  const cs=anContracts();if(!cs.length)return '<div class="empty"><b>لا توجد عقود</b>ضمن التصفية الحالية.</div>';
  const st=s=>cs.filter(x=>x.d.status===s).length;const active=st('ساري')+st('قريب الانتهاء');
  const lyd=cs.filter(x=>!x.c.currency||x.c.currency==='دينار ليبي');const val=sumBy(lyd,x=>x.c.value);
  const durs=cs.map(x=>x.d.dur).filter(v=>v!=null&&v>0);const avgDur=durs.length?durs.reduce((a,b)=>a+b,0)/durs.length:0;
  const types=anGroup(cs,x=>x.c.type).map(r=>({...r,go:{v:'contracts',f:{type:r.l==='غير محدد'?'':r.l}}}));
  const valT=anGroup(lyd,x=>x.c.type,x=>x.c.value);
  const dept=anGroup(cs,x=>x.c.dept).map(r=>({...r,go:{v:'contracts',f:{dept:r.l==='غير محدد'?'':r.l}}}));
  const loc=anGroup(cs,x=>cleanRegion(x.c.location)).slice(0,10).map(r=>({...r,go:r.l==='غير محدد'?null:{v:'contracts',f:{loc:r.l}}}));
  const topCo=anGroup(lyd,x=>x.c.company,x=>x.c.value).slice(0,10);
  // العقود الموقعة شهريًا: آخر 12 شهرًا منتهية بآخر شهر فيه توقيع أو الشهر الحالي
  const ds=cs.map(x=>x.c.signDate||x.c.startDate).filter(Boolean).sort();const last=pd(ds[ds.length-1])||today;const end=last>today?last:today;
  const months=[];for(let i=11;i>=0;i--){const d=new Date(end.getFullYear(),end.getMonth()-i,1);months.push({y:d.getFullYear(),m:d.getMonth()})}
  const mrows=months.map(o=>{const k=o.y+'-'+String(o.m+1).padStart(2,'0');return {l:AN_MN[o.m].slice(0,3),full:AN_MN[o.m]+' '+o.y,v:cs.filter(x=>(x.c.signDate||x.c.startDate||'').startsWith(k)).length}});
  // محفظة الانتهاء حسب الربع القادم
  const qs=[];for(let i=0;i<6;i++){const d=new Date(today.getFullYear(),Math.floor(today.getMonth()/3)*3+i*3,1);qs.push({y:d.getFullYear(),q:Math.floor(d.getMonth()/3)+1})}
  const qrows=qs.map(o=>({l:'ر'+o.q+' '+o.y,full:'الربع '+o.q+' من '+o.y,v:cs.filter(x=>{const e=pd(x.d.effEnd);return e&&e>=today&&e.getFullYear()===o.y&&Math.floor(e.getMonth()/3)+1===o.q}).length}));
  const durB=[['أقل من 6 أشهر',0,6],['6–12 شهرًا',6,12.5],['1–2 سنة',12.5,24.5],['أكثر من سنتين',24.5,1e9]].map(([l,a,b])=>({l,v:durs.filter(v=>v>=a&&v<b).length}));
  return `<div class="kpis an-kpis">${anKpi('عدد العقود',fn(cs.length),`${active} سارية الآن`)}${anKpi('نسبة العقود السارية',Math.round(active*100/cs.length)+'%',`${st('منتهٍ')} منتهية`,active/cs.length>=.5?'ok':'warn')}
   ${anKpi('القيمة الإجمالية',anShort(val),'دينار ليبي'+(lyd.length<cs.length?` · ${cs.length-lyd.length} بعملة أخرى`:''))}${anKpi('متوسط قيمة العقد',anShort(lyd.length?val/lyd.length:0),'دينار ليبي')}
   ${anKpi('متوسط مدة العقد',avgDur?avgDur.toFixed(1):'—','شهرًا')}${anKpi('تنتهي خلال '+S.settings.t1+' يومًا',fn(cs.filter(x=>x.d.alert).length),'تحتاج متابعة للتجديد',cs.some(x=>x.d.alert)?'warn':'')}</div>
  <div class="an-grid">
   <section class="panel an-wide"><h3 class="section-title">حالة العقود <small>اضغط على جزء لفتح العقود</small></h3>${anStack([
     {l:'ساري',v:st('ساري'),c:'s-ok',go:{v:'contracts',f:{st:'ساري'}}},{l:'قريب الانتهاء',v:st('قريب الانتهاء'),c:'s-warn',go:{v:'contracts',f:{st:'قريب الانتهاء'}}},
     {l:'منتهٍ',v:st('منتهٍ')+st('منتهٍ قبل موعده'),c:'s-crit',go:{v:'contracts',f:{st:'منتهٍ'}}},{l:'لم يبدأ بعد',v:st('لم يبدأ بعد'),c:'s-info',go:{v:'contracts',f:{st:'لم يبدأ بعد'}}},
     {l:'معلق / غير محدد',v:st('معلق')+st('غير محدد'),c:'s-neutral'}])}</section>
   <section class="panel"><h3 class="section-title">عدد العقود حسب النوع <small>اضغط للتصفية</small></h3>${anBars(types,{fmt:fn,unit:'عقد'})}</section>
   <section class="panel"><h3 class="section-title">قيمة العقود حسب النوع <small>دينار ليبي</small></h3>${anBars(valT,{unit:'د.ل',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">العقود الموقّعة شهريًا <small>آخر 12 شهرًا</small></h3>${anCols(mrows,{unit:'عقد'})}</section>
   <section class="panel"><h3 class="section-title">العقود التي تنتهي في الأرباع القادمة</h3>${anCols(qrows,{unit:'عقد'})}</section>
   <section class="panel"><h3 class="section-title">حسب الإدارة المختصة</h3>${anBars(dept,{fmt:fn,unit:'عقد'})}</section>
   <section class="panel"><h3 class="section-title">حسب الموقع <small>أعلى 10</small></h3>${anBars(loc,{fmt:fn,unit:'عقد'})}</section>
   <section class="panel"><h3 class="section-title">أكبر 10 زبائن حسب قيمة العقود <small>دينار ليبي</small></h3>${anBars(topCo,{unit:'د.ل',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">توزيع مدد العقود</h3>${anBars(durB,{fmt:fn,unit:'عقد'})}</section>
  </div>`}
function anTabNeeds(){
  const N=anNeeds();if(!N.length)return '<div class="empty"><b>لا توجد منشآت</b>ضمن التصفية الحالية.</div>';
  const dsl=sumBy(N,anDiesel),linked=N.filter(n=>MATCH.byNeed.has(n.id)).length;
  const fuel=[{l:'ديزل مولدات',v:sumBy(N,n=>n.dieselGen),go:{v:'needs',f:{fuel:'diesel'}}},{l:'ديزل تشغيلية',v:sumBy(N,n=>n.dieselOp),go:{v:'needs',f:{fuel:'diesel'}}},{l:'زيت ثقيل',v:sumBy(N,n=>n.heavyOil),go:{v:'needs',f:{fuel:'ho'}}},{l:'كيروسين',v:sumBy(N,n=>n.kerosene),go:{v:'needs',f:{fuel:'ke'}}},{l:'مشاريع (نوع الوقود غير محدد)',v:sumBy(N,n=>n.projQty),go:{v:'needs',f:{fuel:'proj'}}}].filter(r=>r.v);
  const byB=batchesSorted().map(b=>{const r=N.filter(n=>n.batch===b.id);return {l:b.name,v:sumBy(r,anDiesel),note:r.length+' منشأة',go:{v:'needs',f:{batch:b.id}}}}).filter(r=>r.v);
  const byR=anGroup(N,n=>cleanRegion(n.region),anDiesel).filter(r=>r.v).slice(0,12).map(r=>({...r,go:r.l==='غير محدد'?null:{v:'needs',f:{region:r.l}}}));
  const byA=anGroup(N,n=>n.activity,anDiesel).filter(r=>r.v).slice(0,10).map(r=>({...r,go:r.l==='غير محدد'?null:{v:'needs',f:{act:r.l}}}));
  const cntR=anGroup(N,n=>cleanRegion(n.region)).slice(0,12);
  const top=[...N].sort((a,b)=>anDiesel(b)-anDiesel(a)).slice(0,10).filter(n=>anDiesel(n)).map(n=>({l:n.company,v:anDiesel(n),go:{open:n.id},note:cleanRegion(n.region)}));
  const sz=[['حتى 5 آلاف',0,5e3],['5–20 ألف',5e3,2e4],['20–50 ألف',2e4,5e4],['50–100 ألف',5e4,1e5],['أكثر من 100 ألف',1e5,1e12]].map(([l,a,b])=>({l,v:N.filter(n=>{const d=anDiesel(n);return d>0&&d>=a&&d<b}).length}));
  return `<div class="kpis an-kpis">${anKpi('عدد المنشآت',fn(N.length),`${uniq(N.map(n=>cleanRegion(n.region))).length} منطقة`)}${anKpi('إجمالي الديزل الشهري',anShort(dsl),'لتر/شهر','fl')}
   ${anKpi('متوسط الديزل للمنشأة',anShort(dsl/(N.filter(anDiesel).length||1)),'لتر/شهر للمنشآت المستهلكة')}${anKpi('الغاز',anShort(sumBy(N,n=>n.gas)),'طن')}
   ${anKpi('الزيت الثقيل',anShort(sumBy(N,n=>n.heavyOil)),'لتر')}${anKpi('منشآت مرتبطة بعقد',Math.round(linked*100/N.length)+'%',`${linked} من ${N.length}`,linked*2>=N.length?'ok':'warn')}</div>
  <div class="an-grid">
   <section class="panel"><h3 class="section-title">الكميات المعتمدة حسب نوع الوقود <small>لتر</small></h3>${anBars(fuel,{unit:'لتر'})}</section>
   <section class="panel"><h3 class="section-title">الديزل حسب الدفعة <small>لتر/شهر · اضغط لفتح الدفعة</small></h3>${anBars(byB,{unit:'لتر',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">الديزل حسب المنطقة <small>أعلى 12</small></h3>${anBars(byR,{unit:'لتر',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">عدد المنشآت حسب المنطقة <small>أعلى 12</small></h3>${anBars(cntR,{fmt:fn,unit:'منشأة'})}</section>
   <section class="panel"><h3 class="section-title">الديزل حسب نوع النشاط <small>أعلى 10</small></h3>${anBars(byA,{unit:'لتر',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">المنشآت حسب حجم الاستهلاك الشهري للديزل</h3>${anBars(sz,{fmt:fn,unit:'منشأة'})}</section>
   <section class="panel an-wide"><h3 class="section-title">أكبر 10 منشآت استهلاكًا للديزل <small>اضغط لفتح بطاقة المنشأة</small></h3>${anBars(top,{unit:'لتر/شهر',tone:'fl'})}</section>
  </div>`}
function anOppRows(){return anNeeds().filter(n=>!MATCH.byNeed.has(n.id)&&(anDiesel(n)||n.gas||n.heavyOil||n.kerosene||n.projQty)).sort((a,b)=>anDiesel(b)-anDiesel(a)||(b.gas||0)-(a.gas||0))}
function anTabOpp(){
  const N=anNeeds(),O=anOppRows(),tot=sumBy(N,anDiesel),od=sumBy(O,anDiesel);
  const byR=anGroup(O,n=>cleanRegion(n.region),anDiesel).filter(r=>r.v).slice(0,10).map(r=>({...r,go:r.l==='غير محدد'?null:{v:'needs',f:{region:r.l,link:'no'}}}));
  const byA=anGroup(O,n=>n.activity,anDiesel).filter(r=>r.v).slice(0,10);
  return `<div class="banner info" style="margin-bottom:12px">منشآت معتمدة في كشوفات وزارة الصناعة ولا يوجد لها عقد مسجّل مع شركة البريقة: فرص تعاقد مباشرة، مرتّبة حسب حجم احتياجها الشهري.</div>
  <div class="kpis an-kpis">${anKpi('منشآت بلا عقد',fn(O.length),`من ${N.length} منشأة في الكشوفات`,'warn')}${anKpi('ديزل غير متعاقد عليه',anShort(od),'لتر/شهر','fl')}
   ${anKpi('نسبتها من إجمالي الديزل',tot?Math.round(od*100/tot)+'%':'—','من الاحتياج المعتمد')}${anKpi('غاز غير متعاقد عليه',anShort(sumBy(O,n=>n.gas)),'طن')}</div>
  <div class="an-grid">
   <section class="panel"><h3 class="section-title">الديزل غير المتعاقد عليه حسب المنطقة</h3>${anBars(byR,{unit:'لتر/شهر',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">حسب نوع النشاط</h3>${anBars(byA,{unit:'لتر/شهر',tone:'fl'})}</section>
   <section class="panel an-wide"><h3 class="section-title" style="justify-content:space-between">قائمة الفرص <button class="btn sm" data-act="an-export-opp">${I.down}تصدير القائمة</button></h3><div id="an-opp"></div></section>
  </div>`}
function anOppTable(){const el=document.getElementById('an-opp');if(!el)return;const O=anOppRows();const lim=S.ui.anOppAll?O.length:25;
  el.innerHTML=O.length?`<div class="tablewrap"><table><thead><tr><th class="nosort">#</th><th class="nosort">المنشأة</th><th class="nosort">المنطقة</th><th class="nosort">النشاط</th><th class="nosort">الدفعة</th><th class="nosort">صاحب الترخيص / المفوض</th><th class="nosort">ديزل لتر/شهر</th><th class="nosort">غاز طن</th><th class="nosort">زيت ثقيل</th></tr></thead><tbody>
  ${O.slice(0,lim).map((n,i)=>`<tr data-open-n="${n.id}"><td class="n">${i+1}</td><td class="t-strong">${esc(n.company)}</td><td>${esc(cleanRegion(n.region)||'—')}</td><td>${esc(n.activity||'—')}</td><td><span class="tag">${esc(batchName(n.batch))}</span></td><td>${esc(n.licensee||'—')}</td><td class="n">${fn(anDiesel(n)||null)}</td><td class="n">${fn(n.gas)}</td><td class="n">${fn(n.heavyOil)}</td></tr>`).join('')}</tbody></table></div>
  ${O.length>lim?`<button class="btn sm" style="margin-top:10px" data-act="an-opp-all">عرض كل الفرص (${O.length})</button>`:''}`:'<div class="empty"><b>لا توجد فرص</b>كل المنشآت ضمن التصفية مرتبطة بعقود.</div>'}
function anTabCs(){
  const T=S.tickets;if(!T.length)return `<div class="empty"><b>لا توجد طلبات زبائن بعد</b>سجّل الطلبات والشكاوى من بند «خدمة الزبائن» وستظهر تحليلاتها هنا.<br><br><button class="btn primary" data-v-go="cs">فتح خدمة الزبائن</button></div>`;
  const open=T.filter(t=>t.status!=='مغلق'),closed=T.filter(t=>t.status==='مغلق'),late=open.filter(tkLate);
  const res=closed.map(tkAge).filter(v=>v!=null),avg=res.length?res.reduce((a,b)=>a+b,0)/res.length:null;
  const inTime=closed.filter(t=>!t.dueDate||!t.closedAt||t.closedAt.slice(0,10)<=t.dueDate).length;
  const months=[];for(let i=5;i>=0;i--){const d=new Date(today.getFullYear(),today.getMonth()-i,1);const k=iso(d).slice(0,7);months.push({l:AN_MN[d.getMonth()].slice(0,3),full:AN_MN[d.getMonth()]+' '+d.getFullYear(),v:T.filter(t=>(t.date||'').startsWith(k)).length,v2:T.filter(t=>(t.closedAt||'').startsWith(k)).length})}
  const go=f=>({v:'cs',f});
  const avgBy=(kf)=>{const g=new Map();closed.forEach(t=>{const a=tkAge(t);if(a==null)return;const k=kf(t)||'غير محدد';const o=g.get(k)||{s:0,n:0};o.s+=a;o.n++;g.set(k,o)});return [...g.entries()].map(([l,o])=>({l,v:o.s/o.n,note:o.n+' طلب'})).sort((a,b)=>b.v-a.v)};
  return `<div class="kpis an-kpis">${anKpi('إجمالي الطلبات',fn(T.length),`${open.length} مفتوحة`)}${anKpi('متأخرة عن موعدها',fn(late.length),'طلبات مفتوحة تجاوزت موعد الإنجاز',late.length?'crit':'ok')}
   ${anKpi('متوسط زمن المعالجة',avg==null?'—':avg.toFixed(1),'يومًا للطلبات المغلقة')}${anKpi('الإنجاز في الموعد',closed.length?Math.round(inTime*100/closed.length)+'%':'—',`${inTime} من ${closed.length} مغلقة`,closed.length&&inTime/closed.length>=.8?'ok':'warn')}
   ${anKpi('الشكاوى',fn(T.filter(t=>t.type==='شكوى').length),`${T.filter(t=>t.type==='شكوى'&&t.status!=='مغلق').length} مفتوحة`)}</div>
  <div class="an-grid">
   <section class="panel an-wide"><h3 class="section-title">حالة الطلبات <small>اضغط لفتح القائمة</small></h3>${anStack(TK_ST.map(s=>({l:s,v:T.filter(t=>t.status===s).length,c:TK_STC[s].replace('p-','s-'),go:go({st:s})})))}</section>
   <section class="panel"><h3 class="section-title">الطلبات الواردة والمغلقة شهريًا</h3><div class="an-legend" style="margin:-4px 0 8px"><span><i class="s-info"></i>واردة</span><span><i class="s-ok"></i>مغلقة</span></div>${anCols(months,{pair:['واردة','مغلقة']})}</section>
   <section class="panel"><h3 class="section-title">حسب نوع الطلب</h3>${anBars(anGroup(T,t=>t.type).map(r=>({...r,go:go({type:r.l})})),{fmt:fn,unit:'طلب'})}</section>
   <section class="panel"><h3 class="section-title">حسب قناة الورود</h3>${anBars(anGroup(T,t=>t.channel),{fmt:fn,unit:'طلب'})}</section>
   <section class="panel"><h3 class="section-title">حسب الأولوية</h3>${anBars(TK_PRI.map(p=>({l:p,v:T.filter(t=>t.priority===p).length,go:go({pri:p})})),{fmt:fn,unit:'طلب'})}</section>
   <section class="panel"><h3 class="section-title">متوسط أيام المعالجة حسب النوع</h3>${anBars(avgBy(t=>t.type),{unit:'يوم',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">الطلبات المفتوحة حسب الجهة المسؤولة</h3>${anBars(anGroup(open,t=>t.assignee),{fmt:fn,unit:'طلب'})}</section>
   <section class="panel an-wide"><h3 class="section-title">أكثر الزبائن تواصلًا <small>أعلى 10</small></h3>${anBars(anGroup(T,t=>t.customer).slice(0,10),{fmt:fn,unit:'طلب'})}</section>
  </div>`}
/* تحليل مخصّص: اختيار مصدر البيانات وطريقة التجميع والمقياس */
const AN_DS={
 contracts:{l:'عقود البريقة',rows:()=>anContracts(),
  dims:{type:['نوع العقد',x=>x.c.type],status:['الحالة',x=>x.d.status],dept:['الإدارة المختصة',x=>x.c.dept],loc:['الموقع',x=>cleanRegion(x.c.location)],company:['الشركة المتعاقدة',x=>x.c.company],officer:['المسؤول',x=>x.c.officer],currency:['العملة',x=>x.c.currency],year:['سنة التوقيع',x=>(x.c.signDate||'').slice(0,4)],month:['شهر التوقيع',x=>(x.c.signDate||'').slice(0,7)],alert:['تنبيه الانتهاء',x=>x.d.alert||'لا يوجد']},
  meas:{count:['عدد العقود',()=>1],value:['مجموع القيمة',x=>x.c.value],avgValue:['متوسط القيمة',x=>x.c.value,'avg'],dur:['متوسط المدة (شهر)',x=>x.d.dur,'avg'],exts:['عدد التمديدات',x=>x.d.exts]}},
 needs:{l:'كشوفات الاحتياجات',rows:()=>anNeeds(),
  dims:{batch:['الدفعة',n=>batchName(n.batch)],region:['المنطقة',n=>cleanRegion(n.region)],activity:['نوع النشاط',n=>n.activity],section:['القسم في الكشف',n=>n.section],link:['الارتباط بعقد',n=>MATCH.byNeed.has(n.id)?'مرتبطة بعقد':'بلا عقد']},
  meas:{count:['عدد المنشآت',()=>1],diesel:['ديزل إجمالي (لتر/شهر)',anDiesel],dieselGen:['ديزل مولدات',n=>n.dieselGen],dieselOp:['ديزل تشغيلية',n=>n.dieselOp],gas:['غاز (طن)',n=>n.gas],heavyOil:['زيت ثقيل',n=>n.heavyOil],kerosene:['كيروسين',n=>n.kerosene],avgDiesel:['متوسط الديزل للمنشأة',anDiesel,'avg']}},
 tickets:{l:'طلبات الزبائن',rows:()=>S.tickets,
  dims:{status:['الحالة',t=>t.status],type:['نوع الطلب',t=>t.type],channel:['قناة الورود',t=>t.channel],priority:['الأولوية',t=>t.priority],assignee:['الجهة المسؤولة',t=>t.assignee],customer:['الزبون',t=>t.customer],month:['شهر الورود',t=>(t.date||'').slice(0,7)],late:['الالتزام بالموعد',t=>tkLate(t)?'متأخر':'ضمن الموعد']},
  meas:{count:['عدد الطلبات',()=>1],age:['متوسط أيام المعالجة',t=>tkAge(t),'avg']}}};
function anCustomData(){const u=anUI();const ds=AN_DS[u.ds]||AN_DS.contracts;const dim=ds.dims[u.dim]||Object.values(ds.dims)[0];const me=ds.meas[u.me]||ds.meas.count;
  const g=new Map();ds.rows().forEach(x=>{let k=dim[1](x);k=(k==null||String(k).trim()==='')?'غير محدد':String(k).trim();const v=me[1](x);const o=g.get(k)||{s:0,n:0,c:0};o.c++;if(v!=null&&v!==''&&!isNaN(v)){o.s+=Number(v);o.n++}g.set(k,o)});
  const rows=[...g.entries()].map(([l,o])=>({l,v:me[2]==='avg'?(o.n?o.s/o.n:0):o.s,c:o.c}));
  if(/month|year/.test(u.dim))rows.sort((a,b)=>a.l.localeCompare(b.l));else rows.sort((a,b)=>b.v-a.v);
  return {ds,dim,me,rows}}
function anTabCustom(){const u=anUI();const ds=AN_DS[u.ds]||AN_DS.contracts;if(!ds.dims[u.dim])u.dim=Object.keys(ds.dims)[0];if(!ds.meas[u.me])u.me='count';
  return `<section class="panel"><h3 class="section-title">اختر ما تريد تحليله</h3>
   <div class="toolbar"><label class="an-f">البيانات<select id="an-ds">${Object.entries(AN_DS).map(([k,d])=>`<option value="${k}" ${u.ds===k?'selected':''}>${d.l}</option>`).join('')}</select></label>
   <label class="an-f">التجميع حسب<select id="an-dim">${Object.entries(ds.dims).map(([k,d])=>`<option value="${k}" ${u.dim===k?'selected':''}>${d[0]}</option>`).join('')}</select></label>
   <label class="an-f">المقياس<select id="an-me">${Object.entries(ds.meas).map(([k,d])=>`<option value="${k}" ${u.me===k?'selected':''}>${d[0]}</option>`).join('')}</select></label>
   <button class="btn sm" data-act="an-export-custom" style="align-self:flex-end">${I.down}تصدير النتيجة</button></div></section>
  <div id="an-custom" style="margin-top:14px"></div>`}
function anCustomRender(){const el=document.getElementById('an-custom');if(!el)return;const {ds,dim,me,rows}=anCustomData();const tot=rows.reduce((s,r)=>s+r.v,0);const isAvg=me[2]==='avg';
  el.innerHTML=`<div class="an-grid"><section class="panel"><h3 class="section-title">${esc(me[0])} حسب ${esc(dim[0])} <small>${esc(ds.l)}${rows.length>25?' · أعلى 25':''}</small></h3>${anBars(rows.slice(0,25),{fmt:isAvg?(v=>fn(Math.round(v*10)/10)):anShort})}</section>
   <section class="panel"><h3 class="section-title">الجدول <small>${rows.length} مجموعة</small></h3><div class="tablewrap an-tw"><table><thead><tr><th class="nosort">${esc(dim[0])}</th><th class="nosort">عدد السجلات</th><th class="nosort">${esc(me[0])}</th>${isAvg?'':'<th class="nosort">النسبة</th>'}</tr></thead><tbody>
   ${rows.map(r=>`<tr><td class="t-strong">${esc(r.l)}</td><td class="n">${fn(r.c)}</td><td class="n">${fn(Math.round(r.v*10)/10)}</td>${isAvg?'':`<td class="n">${tot?(r.v*100/tot).toFixed(1)+'%':'—'}</td>`}</tr>`).join('')}</tbody>
   ${isAvg?'':`<tfoot><tr><td>الإجمالي</td><td class="n">${fn(rows.reduce((s,r)=>s+r.c,0))}</td><td class="n">${fn(Math.round(tot*10)/10)}</td><td class="n">100%</td></tr></tfoot>`}</table></div></section></div>`}
function anCustomBind(){const u=anUI();anCustomRender();
  document.getElementById('an-ds').addEventListener('change',e=>{u.ds=e.target.value;u.dim='';u.me='count';render()});
  document.getElementById('an-dim').addEventListener('change',e=>{u.dim=e.target.value;anCustomRender()});
  document.getElementById('an-me').addEventListener('change',e=>{u.me=e.target.value;anCustomRender()})}
function anExport(){recompute();const cs=anContracts(),N=anNeeds();
  const g=(arr,kf,vf,l1,l2)=>anGroup(arr,kf,vf).map(r=>({[l1]:r.l,[l2]:Math.round(r.v*10)/10}));
  saveXlsx([['العقود حسب النوع',anGroup(cs,x=>x.c.type).map(r=>({'نوع العقد':r.l,'عدد العقود':r.v,'القيمة (د.ل)':sumBy(cs.filter(x=>(x.c.type||'غير محدد')===r.l&&(!x.c.currency||x.c.currency==='دينار ليبي')),x=>x.c.value)}))],
   ['العقود حسب الحالة',g(cs,x=>x.d.status,()=>1,'الحالة','عدد العقود')],['العقود حسب الإدارة',g(cs,x=>x.c.dept,()=>1,'الإدارة','عدد العقود')],
   ['الديزل حسب المنطقة',anGroup(N,n=>cleanRegion(n.region),anDiesel).map(r=>({'المنطقة':r.l,'ديزل لتر/شهر':r.v,'عدد المنشآت':N.filter(n=>(cleanRegion(n.region)||'غير محدد')===r.l).length}))],
   ['الديزل حسب النشاط',g(N,n=>n.activity,anDiesel,'النشاط','ديزل لتر/شهر')],['الفرص البيعية',anOppRows().map(anOppRow)],
   ...(S.tickets.length?[['الطلبات حسب النوع',g(S.tickets,t=>t.type,()=>1,'نوع الطلب','العدد')],['الطلبات حسب الحالة',g(S.tickets,t=>t.status,()=>1,'الحالة','العدد')]]:[])],'تحليل-البيانات-'+TODAY_ISO+'.xlsx')}
function anOppRow(n,i){return {'#':i+1,'المنشأة':n.company,'المنطقة':cleanRegion(n.region)||'','النشاط':n.activity||'','الدفعة':batchName(n.batch),'صاحب الترخيص / المفوض':n.licensee||'','ديزل لتر/شهر':anDiesel(n)||'','غاز طن':n.gas??'','زيت ثقيل':n.heavyOil??'','كيروسين':n.kerosene??''}}
function anGo(o){
  if(o.open){openNeed(o.open);return}
  if(o.v==='contracts'){S.ui.c={q:'',st:o.f.st||'all',type:o.f.type||'',dept:o.f.dept||'',loc:o.f.loc||'',sort:'remain',dir:'asc'};go('contracts');return}
  if(o.v==='needs'){S.ui.n={q:'',batch:o.f.batch||'',region:o.f.region||'',fuel:o.f.fuel||'',link:o.f.link||'',act:o.f.act||'',sec:'',sort:o.f.batch?'seq':'dg',dir:o.f.batch?'asc':'desc'};go('needs');return}
  if(o.v==='cs'){S.ui.cs=Object.assign(csUI(),{tab:'tk',q:'',st:'',type:'',pri:'',as:''},o.f);go('cs')}}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-an-tab]');if(t){anUI().tab=t.dataset.anTab;render();return}
  const g=e.target.closest('[data-an-go]');if(g){anGo(JSON.parse(g.dataset.anGo));return}
  const v=e.target.closest('[data-v-go]');if(v){go(v.dataset.vGo);return}
  const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act;
  if(act==='an-clear'){Object.assign(anUI(),{type:'',from:'',to:'',batch:'',region:''});render()}
  if(act==='an-export')anExport();
  if(act==='an-export-opp')saveXlsx([['الفرص البيعية',anOppRows().map(anOppRow)]],'الفرص-البيعية-'+TODAY_ISO+'.xlsx');
  if(act==='an-export-custom'){const {dim,me,rows}=anCustomData();saveXlsx([['تحليل مخصص',rows.map(r=>({[dim[0]]:r.l,'عدد السجلات':r.c,[me[0]]:Math.round(r.v*10)/10}))]],'تحليل-مخصص-'+TODAY_ISO+'.xlsx')}
  if(act==='an-opp-all'){S.ui.anOppAll=true;anOppTable()}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.closest&&e.target.closest('[data-an-go]'))e.target.click()});

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

/* ============ Extensions & letters ============ */
function viewExt(){
  const tab=S.ui.et||'ext';
  const ext=[...S.extensions].sort((a,b)=>(b.decisionDate||'').localeCompare(a.decisionDate||''));
  const let_=[...S.letters].sort((a,b)=>(b.date||'').localeCompare(a.date||''));
  const cByNo=no=>S.contracts.find(c=>normNo(c.no)===normNo(no));
  return `<div class="page-head"><div><h2>التمديدات والمراسلات</h2><p>يُسجَّل كل تمديد كقرار مستقل دون حذف السابق، ويُحسب الانتهاء الفعلي للعقد من آخر تمديد.</p></div>
  <div class="toolbar">${S.canWrite?`<button class="btn primary" data-act="${tab==='ext'?'add-ext':'add-letter'}">${I.plus}${tab==='ext'?'تمديد جديد':'مراسلة جديدة'}</button>`:''}</div></div>
  <div class="tabs" role="tablist"><button role="tab" data-et="ext" aria-selected="${tab==='ext'}">التمديدات (${ext.length})</button><button role="tab" data-et="let" aria-selected="${tab==='let'}">المراسلات (${let_.length})</button></div>
  ${tab==='ext'?(ext.length?`<div class="tablewrap"><table><thead><tr><th class="nosort">رقم العقد</th><th class="nosort">الشركة</th><th class="nosort">تاريخ قرار التمديد</th><th class="nosort">تاريخ الانتهاء الجديد</th><th class="nosort">ملاحظة</th></tr></thead><tbody>${ext.map(e=>{const c=cByNo(e.contractNo);return `<tr data-act="edit-ext" data-id="${e.id}"><td class="t-strong">${esc(e.contractNo)}</td><td>${c?esc(c.company):'<span class="tag dup">عقد غير موجود</span>'}</td><td class="n">${fd(e.decisionDate)}</td><td class="n">${fd(e.newEnd)}</td><td>${esc(e.note||'')}</td></tr>`}).join('')}</tbody></table></div>`:`<div class="panel empty"><b>لا توجد تمديدات مسجلة</b>عند صدور قرار تمديد، سجّله هنا أو من بطاقة العقد.</div>`)
   :(let_.length?`<div class="tablewrap"><table><thead><tr><th class="nosort">رقم العقد</th><th class="nosort">الشركة</th><th class="nosort">رقم المراسلة</th><th class="nosort">التاريخ</th><th class="nosort">الموضوع</th></tr></thead><tbody>${let_.map(e=>{const c=cByNo(e.contractNo);return `<tr data-act="edit-letter" data-id="${e.id}"><td class="t-strong">${esc(e.contractNo)}</td><td>${c?esc(c.company):'<span class="tag dup">عقد غير موجود</span>'}</td><td>${esc(e.ref||'')}</td><td class="n">${fd(e.date)}</td><td>${esc(e.note||'')}</td></tr>`}).join('')}</tbody></table></div>`:`<div class="panel empty"><b>لا توجد مراسلات مسجلة</b>سجّل الإخطارات والمخاطبات المتعلقة بكل عقد.</div>`)}`;
}
afterRender.ext=()=>{};
document.addEventListener('click',e=>{const t=e.target.closest('[data-et]');if(t){S.ui.et=t.dataset.et;render()}});

/* ============ Settings ============ */
/* ---- colour palettes (per device, localStorage cm_palette; default = Brega royal blue) ---- */
const PALETTES=[
 {id:'royal',name:'أزرق البريقة',desc:'ألوان شعار الشركة: أزرق مع لمسة حمراء',sw:['#0b3168','#0063ad','#c8161e','#f3f5f9'],meta:'#0b3168'},
 {id:'graphite',name:'الجرافيت المؤسسي',desc:'رمادي داكن محايد مع أزرق',sw:['#1b2029','#1f5fae','#5b9be6','#f4f5f7'],meta:'#1b2029'},
 {id:'gold',name:'الكحلي والذهبي',desc:'كحلي مع لمسات ذهبية وخلفية دافئة',sw:['#0e1b33','#0d4f8b','#d6a83a','#f5f4f0'],meta:'#0e1b33'}];
function applyPalette(id){const p=PALETTES.find(x=>x.id===id)||PALETTES[0];const r=document.documentElement;
  if(p.id==='royal')delete r.dataset.palette;else r.dataset.palette=p.id;
  const m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',p.meta);return p.id}
function currentPalette(){return document.documentElement.dataset.palette||'royal'}
function paletteChooser(){const cur=currentPalette();
  return `<div class="pal-opts" role="radiogroup" aria-label="نظام الألوان">${PALETTES.map(p=>`<button type="button" class="pal-opt" role="radio" aria-checked="${p.id===cur}" data-palette-pick="${p.id}"><span class="pal-sw" aria-hidden="true">${p.sw.map(c=>`<i style="background:${c}"></i>`).join('')}</span><b>${esc(p.name)}</b><small>${esc(p.desc)}</small></button>`).join('')}</div>`}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-palette-pick]');if(!b)return;
  const id=applyPalette(b.dataset.palettePick);try{localStorage.setItem('cm_palette',id)}catch(err){}
  document.querySelectorAll('[data-palette-pick]').forEach(x=>x.setAttribute('aria-checked',String(x.dataset.palettePick===id)))});
if(window.I18N&&I18N.add)I18N.add({'المظهر':'Appearance','نظام ألوان المنظومة على هذا الجهاز. يعمل مع المظهرين الفاتح والداكن.':'Colour scheme for this device. Works with both light and dark mode.','نظام الألوان':'Colour scheme',
  'أزرق البريقة':'Brega Royal Blue','ألوان شعار الشركة: أزرق مع لمسة حمراء':'The company logo colours: blue with a red accent','الجرافيت المؤسسي':'Corporate Graphite','رمادي داكن محايد مع أزرق':'Neutral charcoal with blue',
  'الكحلي والذهبي':'Navy & Gold','كحلي مع لمسات ذهبية وخلفية دافئة':'Navy with gold accents on a warm background'});
function viewSettings(){
  const s=S.settings;
  return `<div class="page-head"><div><h2>الإعدادات والاستيراد</h2><p>فترات التنبيه والقوائم المستخدمة في النماذج، واستيراد البيانات من Excel وتصدير نسخة كاملة.</p></div></div>
  <div class="grid2">
   <div class="panel"><h3 class="section-title">فترات التنبيه (أيام)</h3>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
     <div class="field"><label for="s-t1">تنبيه أول</label><input id="s-t1" type="number" min="1" value="${s.t1}"></div>
     <div class="field"><label for="s-t2">تنبيه ثانٍ</label><input id="s-t2" type="number" min="1" value="${s.t2}"></div>
     <div class="field"><label for="s-t3">تنبيه عاجل</label><input id="s-t3" type="number" min="1" value="${s.t3}"></div>
    </div>
    <h3 class="section-title" style="margin-top:16px">القوائم</h3>
    <div class="field"><label for="s-types">أنواع العقود (سطر لكل نوع)</label><textarea id="s-types" rows="5">${esc(s.types.join('\n'))}</textarea></div>
    <div class="field" style="margin-top:10px"><label for="s-depts">الإدارات</label><textarea id="s-depts" rows="4">${esc(s.depts.join('\n'))}</textarea></div>
    <div class="field" style="margin-top:10px"><label for="s-specials">الحالات الخاصة</label><textarea id="s-specials" rows="2">${esc(s.specials.join('\n'))}</textarea></div>
    ${S.canWrite?`<div style="margin-top:12px"><button class="btn primary" data-act="save-settings">حفظ الإعدادات</button></div>`:''}
   </div>
   <div class="panel" style="display:flex;flex-direction:column;gap:14px">
    <div><h3 class="section-title">المظهر</h3><p class="muted" style="margin:0 0 8px">نظام ألوان المنظومة على هذا الجهاز. يعمل مع المظهرين الفاتح والداكن.</p>${paletteChooser()}</div>
    <div><h3 class="section-title">تصدير</h3><p class="muted" style="margin:0 0 8px">ملف Excel واحد بكل الأوراق: العقود (مع الحالة المحسوبة)، الكشوفات، الدفعات، التمديدات، المراسلات.</p><button class="btn" data-act="export-all">${I.down}تصدير نسخة كاملة</button></div>
    ${S.canWrite?`<div><h3 class="section-title">استيراد من Excel</h3><p class="muted" style="margin:0 0 8px">يقبل ملف سجل العقود بنفس أعمدة ورقة «العقود» القديمة، أو ملفًا مُصدَّرًا من هذه المنظومة. السجلات الموجودة بنفس رقم العقد والشركة تُحدَّث ولا تتكرر.</p>
     <label class="btn">${I.up}اختيار ملف Excel<input type="file" id="imp-file" accept=".xlsx,.xls,.csv" hidden></label><div id="imp-res" style="margin-top:10px"></div></div>`:''}
    <div><h3 class="section-title">مصادر البيانات الأولية</h3><ul class="muted" style="margin:0;padding-inline-start:18px;font-size:13px">
     <li>سجل العقود (contracts-register.xlsx) — ${S.contracts.length} عقد.</li>
     <li>كشوفات الدفعات من وزارة الصناعة والمعادن لشهر أكتوبر 2026 — ${S.needs.length} منشأة في ${S.batches.length} دفعات.</li>
     <li>نسخ العقود الموقعة (PDF) — بيانات الطرف الثاني والبنود.</li></ul></div>
   </div>
  </div>`;
}
afterRender.settings=()=>{const f=document.getElementById('imp-file');if(f)f.addEventListener('change',importFile)};

/* ============ Forms ============ */
const dlg=document.getElementById('dlg');
function F(id,label,val,opts={}){const t=opts.type||'text';const req=opts.req?'<span class="req">*</span>':'';const full=opts.full?' full':'';
  if(t==='select')return `<div class="field${full}"><label for="${id}">${label}${req}</label><select id="${id}"><option value=""></option>${(opts.options||[]).map(o=>`<option ${o===val?'selected':''}>${esc(o)}</option>`).join('')}</select></div>`;
  if(t==='textarea')return `<div class="field${full}"><label for="${id}">${label}${req}</label><textarea id="${id}">${esc(val||'')}</textarea></div>`;
  return `<div class="field${full}"><label for="${id}">${label}${req}</label><input id="${id}" type="${t}" value="${esc(val??'')}" ${opts.list?`list="${opts.list}"`:''} ${t==='number'?'step="any"':''}>${opts.hint?`<span class="hint" id="${id}-hint">${opts.hint}</span>`:''}</div>`}
function dl(id,vals){return `<datalist id="${id}">${uniq(vals).map(v=>`<option value="${esc(v)}">`).join('')}</datalist>`}
function modal(title,body,foot){dlg.innerHTML=`<form method="dialog" id="mform" novalidate><div class="m-head"><h3>${esc(title)}</h3><button type="button" class="iconbtn" data-act="close-dlg" style="margin-inline-start:auto" aria-label="إغلاق">${I.close}</button></div><div class="m-body">${body}</div><div class="m-foot">${foot}</div></form>`;dlg.showModal();const first=dlg.querySelector('.m-body input,.m-body select');first&&first.focus()}
function val(id){const e=document.getElementById(id);return e?e.value.trim():''}
function contractForm(c){
  const isNew=!c;c=c||{currency:'دينار ليبي',dept:'إدارة المبيعات',party:{}};const p=c.party||{};const s=S.settings;
  modal(isNew?'عقد جديد':'تعديل العقد '+(c.no||''),`
   <fieldset><legend>بيانات أساسية</legend>
    ${F('f-no','رقم العقد',c.no||(isNew?'ع.ت.د/':''),{req:1,hint:'مثال: ع.ت.د/609'})}
    ${F('f-company','الشركة المتعاقدة',c.company,{req:1,list:'dl-comp'})}
    ${F('f-type','نوع العقد',c.type,{type:'select',options:uniq([...s.types,c.type])})}
    ${F('f-location','الموقع',c.location,{list:'dl-loc'})}
    ${F('f-subject','موضوع العقد',c.subject,{full:1})}
   </fieldset>
   <fieldset><legend>التواريخ</legend>
    ${F('f-sign','تاريخ التوقيع',c.signDate,{type:'date'})}${F('f-start','بداية السريان',c.startDate,{type:'date'})}${F('f-end','الانتهاء الأصلي',c.endDate,{type:'date'})}
    <div class="calc" id="f-calc"></div>
   </fieldset>
   <fieldset><legend>القيمة والكميات والمتابعة</legend>
    ${F('f-value','القيمة',c.value,{type:'number'})}${F('f-currency','العملة',c.currency,{type:'select',options:uniq([...s.currencies,c.currency])})}${F('f-qty','الكميات',c.qty,{hint:'مثال: 96468 لتر شهريًا'})}
    ${F('f-dept','الإدارة المختصة',c.dept,{type:'select',options:uniq([...s.depts,c.dept])})}${F('f-officer','مسؤول المتابعة',c.officer)}${F('f-special','حالة خاصة',c.special,{type:'select',options:s.specials})}
    ${F('f-pdf','مسار ملف PDF (اختياري)',c.pdfPath)}
    ${F('f-notes','ملاحظات وإجراءات',c.notes,{type:'textarea',full:1})}
   </fieldset>
   <fieldset><legend>ملف العقد والمرفقات</legend>${ATT.formField('dlg',c.attachments,{name:c.no?'عقد '+c.no:''})}</fieldset>
   <fieldset><legend>بيانات الطرف الثاني (من نسخة العقد)</legend>
    ${F('p-rep','الممثل القانوني / المفوض',p.rep)}${F('p-title','الصفة',p.repTitle)}${F('p-cr','رقم السجل التجاري',p.cr)}${F('p-phone','الهاتف',p.phone)}
    ${F('p-address','العنوان',p.address,{full:1})}${F('p-auth','سند التفويض / الهوية',p.auth,{full:1})}${F('p-purpose','الغرض من الاستعمال',p.purpose,{full:1})}${F('p-qtytext','الكمية كما وردت بالعقد',p.qtyText,{full:1})}${F('p-basis','أساس تحديد الكمية (تقرير اللجنة)',p.basis,{full:1})}
   </fieldset>
   ${dl('dl-comp',[...S.contracts.map(x=>x.company),...S.needs.map(x=>x.company)])}${dl('dl-loc',[...S.contracts.map(x=>x.location),...S.needs.map(x=>x.region)])}`,
  `<button type="submit" class="btn primary" data-act="save-contract" data-id="${c.id||''}">حفظ العقد</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button>${!isNew?`<button type="button" class="btn danger" data-act="del" data-col="contracts" data-id="${c.id}" style="margin-inline-start:auto">حذف العقد</button>`:''}<span class="hint bad" id="f-err" style="margin-inline-start:${isNew?'auto':'8px'};color:var(--crit);font-size:12.5px"></span>`);
  const upd=()=>{const tmp={no:val('f-no'),startDate:val('f-start'),endDate:val('f-end'),special:val('f-special')};const d=derive(tmp);
    document.getElementById('f-calc').innerHTML=`<span>المدة: <b>${d.dur!=null?d.dur+' شهر':'—'}</b></span><span>الحالة المتوقعة: ${statusPill(d.status)}</span><span>المتبقي: <b>${d.remain!=null?d.remain+' يوم':'—'}</b></span>${d.exts?`<span>تمديدات مسجلة: <b>${d.exts}</b> (الانتهاء الفعلي ${fd(d.effEnd)})</span>`:''}`;
    const dup=S.contracts.find(x=>x.id!==c.id&&normNo(x.no)&&normNo(x.no)===normNo(tmp.no));const h=document.getElementById('f-no-hint');
    if(dup){h.textContent='تنبيه: هذا الرقم مستخدم لعقد '+dup.company;h.classList.add('bad')}else{h.textContent='مثال: ع.ت.د/609';h.classList.remove('bad')}};
  ['f-no','f-start','f-end','f-special'].forEach(i=>document.getElementById(i).addEventListener('input',upd));upd();
  document.getElementById('f-company').addEventListener('change',e=>{const n=S.needs.find(x=>norm(x.company)===norm(e.target.value));if(n){if(!val('f-location'))document.getElementById('f-location').value=n.region||'';if(!val('p-rep'))document.getElementById('p-rep').value=n.licensee||''}});
}
async function saveContract(id){
  const o={no:val('f-no'),company:val('f-company'),type:val('f-type'),location:val('f-location'),subject:val('f-subject'),signDate:val('f-sign'),startDate:val('f-start'),endDate:val('f-end'),value:num(val('f-value')),currency:val('f-currency'),qty:val('f-qty'),dept:val('f-dept'),officer:val('f-officer'),special:val('f-special'),pdfPath:val('f-pdf'),notes:val('f-notes'),
    party:{rep:val('p-rep'),repTitle:val('p-title'),cr:val('p-cr'),phone:val('p-phone'),address:val('p-address'),auth:val('p-auth'),purpose:val('p-purpose'),qtyText:val('p-qtytext'),basis:val('p-basis')}};
  const err=document.getElementById('f-err');
  if(!o.no||normNo(o.no)===normNo('ع.ت.د/')){err.textContent='أدخل رقم العقد.';document.getElementById('f-no').focus();return}
  if(!o.company){err.textContent='أدخل اسم الشركة المتعاقدة.';document.getElementById('f-company').focus();return}
  if(o.startDate&&o.endDate&&o.endDate<o.startDate){err.textContent='تاريخ الانتهاء يسبق تاريخ البداية.';return}
  o.attachments=await ATT.val('dlg','f-err');
  const old=id?S.contracts.find(x=>x.id===id):null;if(old){o.party=Object.assign({},old.party||{},o.party);['pdfAssetId','pdfName','pdfUrl','createdAt','source','docInfo'].forEach(k=>{if(old[k]!=null)o[k]=old[k]})}
  await write('contracts',id||uid('c'),o,!id);dlg.close();toast(id?'تم حفظ التعديلات':'تمت إضافة العقد');if(id)openContract(id);
}
function needForm(n){
  const isNew=!n;n=n||{batch:(S.ui.n&&S.ui.n.batch)||(batchesSorted().slice(-1)[0]||{}).id};
  modal(isNew?'منشأة جديدة في كشف الاحتياجات':'تعديل بيانات المنشأة',`
   <fieldset><legend>المنشأة</legend>
    <div class="field"><label for="n-batchsel">الدفعة<span class="req">*</span></label><select id="n-batchsel">${batchesSorted().map(b=>`<option value="${b.id}" ${b.id===n.batch?'selected':''}>${esc(b.name)}</option>`).join('')}</select></div>
    ${F('n-seq','التسلسل في الكشف',n.seq,{type:'number'})}
    ${F('n-company','اسم الشركة / المصنع',n.company,{req:1,full:1,list:'dl-comp'})}
    ${F('n-trade','الاسم التجاري — الشكل القانوني',n.tradeName)}${F('n-section','القسم في الكشف',n.section,{list:'dl-sec'})}${F('n-project','اسم المشروع (للمشروعات)',n.project,{full:1})}
    ${F('n-activity','نوع النشاط',n.activity,{list:'dl-act'})}${F('n-licensee','صاحب الترخيص أو المفوض',n.licensee)}${F('n-region','المنطقة',n.region,{list:'dl-reg'})}
    ${F('n-capacity','الطاقة الإنتاجية',n.capacity,{hint:'مثال: 10400م3/شهر'})}${F('n-power','الطاقة الكهربائية',n.power)}
   </fieldset>
   <fieldset><legend>الكميات المطلوبة للتشغيل (شهريًا)</legend>
    ${F('n-dg','ديزل مولدات (لتر)',n.dieselGen,{type:'number'})}${F('n-do','ديزل تشغيلية (لتر)',n.dieselOp,{type:'number'})}${F('n-gas','غاز (طن)',n.gas,{type:'number'})}${F('n-ho','زيت ثقيل (لتر)',n.heavyOil,{type:'number'})}${F('n-ke','كيروسين (لتر)',n.kerosene,{type:'number'})}${F('n-pq','كمية المشروع الشهرية (لتر)',n.projQty,{type:'number'})}${F('n-bq','الكمية حسب شركة البريقة',n.bregaQty,{type:'number'})}
    ${F('n-notes','ملاحظات',n.notes,{type:'textarea',full:1})}
   </fieldset>${dl('dl-comp',[...S.needs.map(x=>x.company),...S.contracts.map(x=>x.company)])}${dl('dl-act',S.needs.map(x=>x.activity))}${dl('dl-sec',S.needs.map(x=>x.section))}${dl('dl-reg',S.needs.map(x=>x.region))}`,
  `<button type="submit" class="btn primary" data-act="save-need" data-id="${n.id||''}">حفظ</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button>${!isNew?`<button type="button" class="btn danger" data-act="del" data-col="needs" data-id="${n.id}" style="margin-inline-start:auto">حذف</button>`:''}<span id="f-err" style="color:var(--crit);font-size:12.5px;margin-inline-start:8px"></span>`);
}
async function saveNeed(id){
  const o={batch:val('n-batchsel'),seq:num(val('n-seq')),company:val('n-company'),activity:val('n-activity'),licensee:val('n-licensee'),region:val('n-region'),capacity:val('n-capacity'),power:val('n-power'),dieselGen:num(val('n-dg')),dieselOp:num(val('n-do')),gas:num(val('n-gas')),heavyOil:num(val('n-ho')),kerosene:num(val('n-ke')),projQty:num(val('n-pq')),bregaQty:num(val('n-bq')),tradeName:val('n-trade'),section:val('n-section'),project:val('n-project'),notes:val('n-notes')};
  if(!o.company){document.getElementById('f-err').textContent='أدخل اسم المنشأة.';return}
  const old=id?S.needs.find(x=>x.id===id):null;if(old){['page','extra','uncertain','createdAt','visitDate'].forEach(k=>{if(old[k]!=null)o[k]=old[k]})}
  await write('needs',id||uid('n'),o,!id);dlg.close();toast(id?'تم حفظ التعديلات':'تمت إضافة المنشأة');if(id)openNeed(id);
}
function batchForm(b){const isNew=!b;b=b||{order:(Math.max(0,...S.batches.map(x=>x.order||0))+1)};
  modal(isNew?'دفعة جديدة':'تعديل الدفعة',`<fieldset><legend>بيانات الدفعة</legend>${F('b-name','اسم الدفعة',b.name,{req:1,hint:'مثال: الدفعة السادسة'})}${F('b-order','الترتيب',b.order,{type:'number'})}${F('b-ref','الرقم الإشاري',b.ref)}${F('b-date','تاريخ الكتاب',b.date,{type:'date'})}${F('b-count','عدد المنشآت المعلن',b.count,{type:'number'})}${F('b-summary','ملخص الكتاب',b.summary,{type:'textarea',full:1})}</fieldset>`,
  `<button type="submit" class="btn primary" data-act="save-batch" data-id="${b.id||''}">حفظ</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button>${!isNew?`<button type="button" class="btn danger" data-act="del" data-col="batches" data-id="${b.id}" style="margin-inline-start:auto">حذف الدفعة</button>`:''}<span id="f-err" style="color:var(--crit);font-size:12.5px;margin-inline-start:8px"></span>`)}
async function saveBatch(id){const o={name:val('b-name'),order:num(val('b-order')),ref:val('b-ref'),date:val('b-date'),count:num(val('b-count')),summary:val('b-summary')};if(!o.name){document.getElementById('f-err').textContent='أدخل اسم الدفعة.';return}
  const old=id?S.batches.find(x=>x.id===id):null;if(old&&old.pages)o.pages=old.pages;await write('batches',id||uid('b'),o,!id);dlg.close();toast('تم حفظ الدفعة')}
function extForm(e,no){const isNew=!e;e=e||{contractNo:no||''};
  modal(isNew?'تسجيل تمديد':'تعديل التمديد',`<fieldset><legend>قرار التمديد</legend>${F('e-no','رقم العقد',e.contractNo,{req:1,list:'dl-no'})}${F('e-date','تاريخ قرار التمديد',e.decisionDate,{type:'date'})}${F('e-end','تاريخ الانتهاء الجديد',e.newEnd,{type:'date',req:1})}${F('e-note','ملاحظة',e.note,{full:1})}</fieldset><fieldset><legend>المرفقات</legend>${ATT.formField('dlg',e.attachments,{name:'تمديد '+(e.contractNo||'')})}</fieldset>${dl('dl-no',S.contracts.map(c=>c.no))}`,
  `<button type="submit" class="btn primary" data-act="save-ext" data-id="${e.id||''}">حفظ</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button>${!isNew?`<button type="button" class="btn danger" data-act="del" data-col="extensions" data-id="${e.id}" style="margin-inline-start:auto">حذف</button>`:''}<span id="f-err" style="color:var(--crit);font-size:12.5px;margin-inline-start:8px"></span>`)}
async function saveExt(id){const o={contractNo:val('e-no'),decisionDate:val('e-date'),newEnd:val('e-end'),note:val('e-note')};if(!o.contractNo||!o.newEnd){document.getElementById('f-err').textContent='رقم العقد وتاريخ الانتهاء الجديد مطلوبان.';return}
  o.attachments=await ATT.val('dlg','f-err');
  await write('extensions',id||uid('e'),o,!id);dlg.close();toast('تم حفظ التمديد');const c=S.contracts.find(x=>normNo(x.no)===normNo(o.contractNo));if(c&&document.querySelector('.drawer'))openContract(c.id)}
function letterForm(e,no){const isNew=!e;e=e||{contractNo:no||'',date:TODAY_ISO};
  modal(isNew?'تسجيل مراسلة':'تعديل المراسلة',`<fieldset><legend>المراسلة</legend>${F('l-no','رقم العقد',e.contractNo,{req:1,list:'dl-no'})}${F('l-ref','رقم المراسلة',e.ref)}${F('l-date','تاريخ المراسلة',e.date,{type:'date'})}${F('l-note','الموضوع / ملاحظة',e.note,{type:'textarea',full:1})}</fieldset><fieldset><legend>المرفقات</legend>${ATT.formField('dlg',e.attachments,{name:'مراسلة '+(e.ref||e.contractNo||'')})}</fieldset>${dl('dl-no',S.contracts.map(c=>c.no))}`,
  `<button type="submit" class="btn primary" data-act="save-letter" data-id="${e.id||''}">حفظ</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button>${!isNew?`<button type="button" class="btn danger" data-act="del" data-col="letters" data-id="${e.id}" style="margin-inline-start:auto">حذف</button>`:''}<span id="f-err" style="color:var(--crit);font-size:12.5px;margin-inline-start:8px"></span>`)}
async function saveLetter(id){const o={contractNo:val('l-no'),ref:val('l-ref'),date:val('l-date'),note:val('l-note')};if(!o.contractNo){document.getElementById('f-err').textContent='أدخل رقم العقد.';return}
  o.attachments=await ATT.val('dlg','f-err');
  await write('letters',id||uid('l'),o,!id);dlg.close();toast('تم حفظ المراسلة');const c=S.contracts.find(x=>normNo(x.no)===normNo(o.contractNo));if(c&&document.querySelector('.drawer'))openContract(c.id)}
function quickAdd(){modal('إضافة سجل جديد',`<div class="batch-cards">
  <button type="button" class="bcard" data-act="add-contract" style="text-align:start;font:inherit;color:inherit">${I.contract.replace('<svg','<svg width="22" height="22"')}<h4>عقد بريقة</h4><span class="muted">عقد بيع وقود أو غاز مع شركة أو جهة</span></button>
  <button type="button" class="bcard" data-act="add-need" style="text-align:start;font:inherit;color:inherit">${I.factory.replace('<svg','<svg width="22" height="22"')}<h4>منشأة في كشف</h4><span class="muted">احتياجات مصنع من الوقود ضمن دفعة</span></button>
  <button type="button" class="bcard" data-act="add-ext" style="text-align:start;font:inherit;color:inherit">${I.ext.replace('<svg','<svg width="22" height="22"')}<h4>تمديد عقد</h4><span class="muted">قرار تمديد بتاريخ انتهاء جديد</span></button>
  <button type="button" class="bcard" data-act="add-letter" style="text-align:start;font:inherit;color:inherit">${I.file.replace('<svg','<svg width="22" height="22"')}<h4>مراسلة</h4><span class="muted">إخطار أو مخاطبة متعلقة بعقد</span></button>
  <button type="button" class="bcard" data-act="add-batch" style="text-align:start;font:inherit;color:inherit">${I.batch.replace('<svg','<svg width="22" height="22"')}<h4>دفعة وزارة</h4><span class="muted">كتاب إحالة دفعة جديدة من الكشوفات</span></button>
 </div>`,`<button type="button" class="btn" data-act="close-dlg">إغلاق</button>`)}

/* ============ Actions ============ */
document.addEventListener('click',async e=>{
  const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act,id=a.dataset.id;
  if(a.tagName==='INPUT')return;
  if(['save-contract','save-need','save-batch','save-ext','save-letter'].includes(act)){e.preventDefault();if(!S.canWrite)return;a.disabled=true;try{await({'save-contract':saveContract,'save-need':saveNeed,'save-batch':saveBatch,'save-ext':saveExt,'save-letter':saveLetter}[act])(id||null)}catch(err){const fe=document.getElementById('f-err');if(fe)fe.textContent=writeErr(err)}finally{a.disabled=false}return}
  switch(act){
   case 'close-drawer':closeDrawer();break;
   case 'close-dlg':dlg.close();break;
   case 'add-contract':if(dlg.open)dlg.close();contractForm();break;
   case 'edit-contract':contractForm(S.contracts.find(x=>x.id===id));break;
   case 'add-need':if(dlg.open)dlg.close();needForm();break;
   case 'edit-need':needForm(S.needs.find(x=>x.id===id));break;
   case 'add-batch':if(dlg.open)dlg.close();batchForm();break;
   case 'edit-batch':e.stopPropagation();batchForm(S.batches.find(x=>x.id===id));break;
   case 'batch-needs':e.stopPropagation();S.ui.n={q:'',batch:id,region:'',fuel:'',link:'',act:'',sort:'seq',dir:'asc'};go('needs');break;
   case 'add-ext':if(dlg.open)dlg.close();extForm(null,a.dataset.no);break;
   case 'edit-ext':if(S.canWrite)extForm(S.extensions.find(x=>x.id===id));break;
   case 'add-letter':if(dlg.open)dlg.close();letterForm(null,a.dataset.no);break;
   case 'edit-letter':if(S.canWrite)letterForm(S.letters.find(x=>x.id===id));break;
   case 'del':if(!a.classList.contains('armed')){a.classList.add('armed');a.textContent='اضغط مرة أخرى لتأكيد الحذف';setTimeout(()=>{a.classList.remove('armed');a.textContent='حذف'},4000);break}
     try{await S.db.collection(a.dataset.col).doc(id).delete();dlg.close();closeDrawer();toast('تم الحذف')}catch(err){toast(writeErr(err))}break;
   case 'save-settings':saveSettings();break;
   case 'export-contracts':exportContracts(filteredContracts());break;
   case 'export-needs':exportNeeds(filteredNeeds());break;
   case 'export-dir':exportDir();break;
   case 'export-org':exportOrg();break;
   case 'export-org-pdf':orgPdf();break;
   case 'export-all':exportAll();break;
   case 'do-import':doImport();break;
  }
});
document.addEventListener('click',e=>{const b=e.target.closest('[data-batch]');if(b&&!e.target.closest('button'))batchForm&&openBatchNeeds(b.dataset.batch)});
function openBatchNeeds(id){S.ui.n={q:'',batch:id,region:'',fuel:'',link:'',act:'',sort:'seq',dir:'asc'};go('needs')}
document.addEventListener('change',async e=>{const t=e.target;if(t.dataset&&t.dataset.act==='upload-pdf'&&t.files[0]){const id=t.dataset.id;const f=t.files[0];try{toast('جارٍ رفع الملف…');const r=await S.assets.upload(f);const c=S.contracts.find(x=>x.id===id);await write('contracts',id,Object.assign({},stripId(c),{pdfAssetId:r.id,pdfUrl:r.url,pdfName:f.name}),false);toast('تم إرفاق ملف العقد');openContract(id)}catch(err){toast('تعذّر رفع الملف: '+(err.message||err.code||''))}}});
document.getElementById('quick-add').addEventListener('click',()=>{if(!S.canWrite){toast('لا تملك صلاحية الإضافة');return}quickAdd()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.querySelector('.drawer')&&!dlg.open)closeDrawer();if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();document.getElementById('gq').focus()}});

/* ============ DB ============ */
function stripId(o){const r=Object.assign({},o);delete r.id;return r}
function writeErr(err){const c=err&&err.code;if(c==='invalid_argument')return 'لا تملك صلاحية الحفظ أو أن البيانات غير صالحة.';if(c==='quota_exceeded')return 'امتلأت سعة قاعدة البيانات.';if(c==='resource_exhausted')return 'عمليات كثيرة في وقت قصير، حاول بعد لحظات.';return 'تعذّر الحفظ، حاول مرة أخرى.'}
async function write(col,id,obj,isNew){
  if(!S.db)throw {code:'unavailable'};
  const now=new Date().toISOString();const data=JSON.parse(JSON.stringify(Object.assign({},obj,{updatedAt:now},isNew?{createdAt:now}:{})));
  Object.keys(data).forEach(k=>{if(data[k]===null||data[k]==='')delete data[k]});
  if(data.party){Object.keys(data.party).forEach(k=>{if(!data.party[k])delete data.party[k]})}
  await S.db.collection(col).doc(id).set(data);
}
async function saveSettings(){
  const s={t1:num(val('s-t1'))||90,t2:num(val('s-t2'))||60,t3:num(val('s-t3'))||30,types:val('s-types').split('\n').map(x=>x.trim()).filter(Boolean),depts:val('s-depts').split('\n').map(x=>x.trim()).filter(Boolean),specials:val('s-specials').split('\n').map(x=>x.trim()).filter(Boolean),currencies:S.settings.currencies};
  try{await S.db.doc('config/main').set(s);toast('تم حفظ الإعدادات')}catch(err){toast(writeErr(err))}
}
const rerender=debounce(()=>{renderNav();const ae=document.activeElement;const keep=ae&&ae.id&&/^(c-q|n-q|d-q|gq|tk-q|cu-q|nt-q|rc-q)$/.test(ae.id);
  if(keep&&S.view==='cs'){recompute();renderTk();renderCu();renderNt()}else if(keep&&S.view==='contracts'){recompute();renderContractsTable()}else if(keep&&S.view==='needs'){recompute();renderNeedsTable()}else if(keep&&S.view==='dir'){recompute();renderDir()}else if(keep&&S.view==='org'){const p=document.getElementById('rec-panel');if(p)renderRecTable(p.dataset.unit)}else if(!dlg.open)render()},120);
(async function init(){
  try{const t=localStorage.getItem('cm_theme');if(t)document.documentElement.dataset.theme=t;applyPalette(localStorage.getItem('cm_palette')||'royal');const v=localStorage.getItem('cm_view');if(v&&VIEWS.some(x=>x.id===v))S.view=v}catch(e){}
  try{history.replaceState({v:S.view,d:(history.state&&history.state.d)||0},'')}catch(e){}
  document.getElementById('today-line').textContent='اليوم: '+fd(TODAY_ISO);
  renderNav();render();
  if(!window.appRuntime||!window.appRuntime.use){setConn('none');return}
  const [db,user,assets,downloads]=await Promise.all([appRuntime.use('db'),appRuntime.use('user'),appRuntime.use('assets').catch(()=>null),appRuntime.use('downloads').catch(()=>null)]);
  S.user=user;S.assets=assets;S.downloads=downloads;
  if(!db){setConn('none');render();return}
  S.db=db;
  if(user){try{const w=await user.can('data.write');S.canWrite=w!==false}catch(e){}}
  let pending=COLS.length+1;const done=()=>{if(--pending===0){setConn('ready')}};
  COLS.forEach(col=>{let first=true;db.collection(col).onSnapshot(snap=>{S[col]=snap.docs.map(d=>Object.assign({id:d.id},d.data()));if(first){first=false;done()}rerender()},err=>{console.warn(col,err);if(first){first=false;done()}})});
  db.doc('config/notices').onSnapshot(snap=>{S.nm=snap.exists?snap.data():{data:{}};rerender()},()=>{});
  let f2=true;db.doc('config/main').onSnapshot(snap=>{if(snap.exists)S.settings=Object.assign({},S.settings,snap.data());if(f2){f2=false;done()}rerender()},()=>{if(f2){f2=false;done()}});
  setTimeout(()=>{if(S.dbState==='wait')setConn('ready')},8000);
})();
function setConn(s,ok){if(ok===true)s='ready';S.dbState=s;if(s==='ready')S.loadedOnce=true;const d=document.getElementById('conn-dot'),t=document.getElementById('conn-txt');
  if(s==='ready'){d.className='dot on';t.textContent='متصل · الحفظ تلقائي ومشترك';window.__syncReady=true;if(window.__sync)window.__sync.paint()}else if(s==='none'){d.className='dot off';t.textContent='غير متصل بقاعدة البيانات'}render()}
document.getElementById('theme-btn').addEventListener('click',()=>{const r=document.documentElement;const cur=r.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');const nx=cur==='dark'?'light':'dark';r.dataset.theme=nx;try{localStorage.setItem('cm_theme',nx)}catch(e){}});
async function loadArticles(){try{const r=await fetch('articles.json');if(r.ok){const j=await r.json();Object.assign(ARTICLES,j)}}catch(e){}}

/* ============ Global search ============ */
const gq=document.getElementById('gq'),gres=document.getElementById('gres');let gIdx=-1;
function gsearch(){const q=norm(gq.value),qn=normNo(gq.value);if(q.length<2){gres.hidden=true;return}
  const cs=S.contracts.filter(c=>norm([c.no,c.company,c.location,c.type,c.notes,c.party&&c.party.rep].join(' ')).includes(q)||normNo(c.no).includes(qn)).slice(0,8);
  const ns=S.needs.filter(n=>norm([n.company,n.licensee,n.region,n.activity].join(' ')).includes(q)).slice(0,8);
  const bs=S.batches.filter(b=>norm([b.name,b.ref,b.summary].join(' ')).includes(q)).slice(0,4);
  let h='';if(cs.length)h+='<h6>عقود البريقة</h6>'+cs.map(c=>`<button data-open-c="${c.id}"><b>${esc(c.company)}</b><span>${esc(c.no)} · ${esc(D.get(c.id)?.status||'')}</span></button>`).join('');
  if(ns.length)h+='<h6>كشوفات الوزارة</h6>'+ns.map(n=>`<button data-open-n="${n.id}"><b>${esc(n.company)}</b><span>${esc(batchName(n.batch))} · ${esc(n.region||'')}</span></button>`).join('');
  if(bs.length)h+='<h6>الدفعات</h6>'+bs.map(b=>`<button data-gb="${b.id}"><b>${esc(b.name)}</b><span>${esc(b.ref||'')}</span></button>`).join('');
  gres.innerHTML=h||'<div class="empty" style="padding:18px">لا نتائج لـ «'+esc(gq.value)+'»</div>';gres.hidden=false;gIdx=-1}
gq.addEventListener('input',debounce(gsearch,100));gq.addEventListener('focus',gsearch);
gq.addEventListener('keydown',e=>{const items=[...gres.querySelectorAll('button')];if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();gIdx=(gIdx+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;items.forEach((b,i)=>b.classList.toggle('act',i===gIdx))}else if(e.key==='Enter'&&items.length){(items[gIdx]||items[0]).click()}else if(e.key==='Escape'){gres.hidden=true;gq.blur()}});
document.addEventListener('click',e=>{if(!e.target.closest('#gsearch'))gres.hidden=true;else if(e.target.closest('#gres button')){const b=e.target.closest('#gres button');if(b.dataset.gb)openBatchNeeds(b.dataset.gb);gres.hidden=true}});

/* ============ Excel export / import ============ */
async function saveXlsx(sheets,filename){
  if(!window.XLSX){toast('مكتبة Excel لم تُحمّل بعد');return}
  const wb=XLSX.utils.book_new();wb.Workbook={Views:[{RTL:true}]};
  sheets.forEach(([name,rows])=>{const ws=XLSX.utils.json_to_sheet(rows.length?rows:[{'':'لا توجد بيانات'}]);const keys=Object.keys(rows[0]||{});ws['!cols']=keys.map(k=>({wch:Math.min(45,Math.max(10,k.length+2,...rows.slice(0,200).map(r=>String(r[k]??'').length)))}));XLSX.utils.book_append_sheet(wb,ws,name.slice(0,31))});
  const data=XLSX.write(wb,{type:'array',bookType:'xlsx'});
  if(!S.downloads){toast('التنزيل غير متاح في هذا العرض');return}
  try{await S.downloads.save({filename,data:new Uint8Array(data)});toast('تم تجهيز الملف')}catch(err){if(err.code!=='declined')toast('تعذّر تنزيل الملف')}
}
function contractRows(rows){return rows.map(({c,d},i)=>({'م':i+1,'رقم العقد':c.no,'الموقع':c.location||'','الشركة المتعاقدة':c.company,'نوع العقد':c.type||'','موضوع العقد':c.subject||'','تاريخ التوقيع':c.signDate||'','بداية السريان':c.startDate||'','الانتهاء الأصلي':c.endDate||'','الانتهاء الفعلي (بعد التمديد)':d.effEnd||'','المدة الأصلية (شهر)':d.dur??'','القيمة':c.value??'','العملة':c.currency||'','الكميات':c.qty||'','الإدارة المختصة':c.dept||'','مسؤول المتابعة':c.officer||'','حالة خاصة':c.special||'','الحالة':d.status,'المتبقي (يوم)':d.remain??'','التنبيه':d.alert,'عدد التمديدات':d.exts,'مسار ملف PDF':c.pdfPath||'','ملاحظات وإجراءات':c.notes||'','الممثل القانوني':(c.party||{}).rep||'','السجل التجاري':(c.party||{}).cr||'','الهاتف':(c.party||{}).phone||'','العنوان':(c.party||{}).address||''}))}
function needRows(rows){return rows.map(n=>({'الدفعة':batchName(n.batch),'ت':n.seq??'','اسم الشركة / المصنع':n.company,'نوع النشاط':n.activity||'','صاحب الترخيص او المفوض':n.licensee||'','المنطقة':n.region||'','الطاقة الانتاجية':n.capacity||'','الطاقة الكهربائية':n.power||'','ديزل/لتر مولدات':n.dieselGen??'','ديزل/لتر تشغيلية':n.dieselOp??'','غاز/طن':n.gas??'','زيت ثقيل/لتر':n.heavyOil??'','كيروسين/لتر':n.kerosene??'','كمية المشروع/لتر':n.projQty??'','الكمية حسب شركة البريقة':n.bregaQty??'','القسم':n.section||'','الاسم التجاري':n.tradeName||'','اسم المشروع':n.project||'','تاريخ الزيارة':n.visitDate||'','ملاحظات':n.notes||'','عقد البريقة المطابق':(MATCH.byNeed.get(n.id)||{}).no||''}))}
function exportContracts(rows){saveXlsx([['العقود',contractRows(rows)]],'عقود-البريقة-'+TODAY_ISO+'.xlsx')}
function exportNeeds(rows){saveXlsx([['الكشوفات',needRows(rows)]],'كشوفات-الاحتياجات-'+TODAY_ISO+'.xlsx')}
function exportDir(){const r=(S._dirRows||buildDir()).map(e=>({'الجهة':e.name,'المنطقة':e.region||'','النشاط':e.activity||'','المفوض / الممثل':e.person||'','الهاتف':e.phone||'','العقود':e.contracts.map(c=>c.no).join('، '),'الدفعات':e.needs.map(n=>batchName(n.batch)).join('، '),'ديزل معتمد':sumBy(e.needs,n=>(n.dieselGen||0)+(n.dieselOp||0))}));saveXlsx([['دليل الجهات',r]],'دليل-الجهات-'+TODAY_ISO+'.xlsx')}
function exportAll(){recompute();const cs=S.contracts.map(c=>({c,d:D.get(c.id)})).sort((a,b)=>(a.c.no||'').localeCompare(b.c.no||''));
  saveXlsx([['العقود',contractRows(cs)],['الكشوفات',needRows(filteredNeedsAll())],['الدفعات',batchesSorted().map(b=>({'الدفعة':b.name,'الترتيب':b.order,'الرقم الإشاري':b.ref||'','التاريخ':b.date||'','العدد المعلن':b.count??'','المسجل':S.needs.filter(n=>n.batch===b.id).length,'ملخص':b.summary||''}))],['التمديدات',S.extensions.map(e=>({'رقم العقد':e.contractNo,'تاريخ قرار التمديد':e.decisionDate||'','تاريخ الانتهاء الجديد':e.newEnd||'','ملاحظة':e.note||''}))],['المراسلات',S.letters.map(e=>({'رقم العقد':e.contractNo,'رقم المراسلة':e.ref||'','تاريخ المراسلة':e.date||'','ملاحظة':e.note||''}))]],'نسخة-المنظومة-'+TODAY_ISO+'.xlsx')}
function filteredNeedsAll(){const bo=id=>{const b=S.batches.find(x=>x.id===id);return b?b.order||0:999};return [...S.needs].sort((a,b)=>bo(a.batch)-bo(b.batch)||(a.seq||0)-(b.seq||0))}
let IMP=null;
const CMAP={'رقم العقد':'no','الموقع':'location','الشركة المتعاقدة':'company','نوع العقد':'type','موضوع العقد':'subject','تاريخ التوقيع':'signDate','بداية السريان':'startDate','الانتهاء الأصلي':'endDate','القيمة':'value','العملة':'currency','الكميات':'qty','الإدارة المختصة':'dept','مسؤول المتابعة':'officer','حالة خاصة':'special','مسار ملف PDF':'pdfPath','ملاحظات وإجراءات':'notes'};
const NMAP={'ت':'seq','اسم الشركة / المصنع':'company','نوع النشاط':'activity','صاحب الترخيص او المفوض':'licensee','المنطقة':'region','الطاقة الانتاجية':'capacity','الطاقة الكهربائية':'power','ديزل/لتر مولدات':'dieselGen','ديزل/لتر تشغيلية':'dieselOp','غاز/طن':'gas','زيت ثقيل/لتر':'heavyOil','كيروسين/لتر':'kerosene','كمية المشروع/لتر':'projQty','الكمية حسب شركة البريقة':'bregaQty','القسم':'section','الاسم التجاري':'tradeName','اسم المشروع':'project','تاريخ الزيارة':'visitDate','ملاحظات':'notes'};
function xdate(v){if(v==null||v==='')return'';if(v instanceof Date)return iso(v);if(typeof v==='number'){const d=new Date(Math.round((v-25569)*86400000));return iso(new Date(d.getUTCFullYear(),d.getUTCMonth(),d.getUTCDate()))}const m=String(v).match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);if(m)return m[1]+'-'+m[2].padStart(2,'0')+'-'+m[3].padStart(2,'0');const m2=String(v).match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);if(m2)return m2[3]+'-'+m2[2].padStart(2,'0')+'-'+m2[1].padStart(2,'0');return''}
async function importFile(e){const f=e.target.files[0];if(!f)return;const res=document.getElementById('imp-res');
  try{const wb=await readWorkbook(f);
    const cSheet=wb.SheetNames.find(n=>n.includes('العقود'))||null;const nSheet=wb.SheetNames.find(n=>n.includes('الكشوفات')||n.includes('الاحتياجات'));
    const toRows=n=>wb.rows(n);
    let contracts=[],needs=[];
    const first=wb.SheetNames[0];const fr=toRows(cSheet||first);
    if(fr.length&&('رقم العقد' in fr[0]))contracts=fr.map(r=>{const o={};for(const[k,v]of Object.entries(CMAP))if(r[k]!==''&&r[k]!=null)o[v]=r[k];['signDate','startDate','endDate'].forEach(k=>{if(o[k])o[k]=xdate(o[k])});if(o.value!=null)o.value=num(o.value);Object.keys(o).forEach(k=>{if(typeof o[k]==='string')o[k]=o[k].trim()});return o}).filter(o=>o.company);
    if(nSheet){needs=toRows(nSheet).map(r=>{const o={};for(const[k,v]of Object.entries(NMAP))if(r[k]!==''&&r[k]!=null)o[v]=r[k];['seq','dieselGen','dieselOp','gas','heavyOil','kerosene','projQty','bregaQty'].forEach(k=>{if(o[k]!=null)o[k]=num(o[k])});o._batch=String(r['الدفعة']||'').trim();return o}).filter(o=>o.company)}
    let upd=0,add=0;contracts.forEach(o=>{const ex=S.contracts.find(c=>normNo(c.no)===normNo(o.no)&&norm(c.company)===norm(o.company));o._id=ex?ex.id:null;ex?upd++:add++});
    let nadd=0,nupd=0;needs.forEach(o=>{const b=S.batches.find(b=>norm(b.name)===norm(o._batch));o.batch=b?b.id:null;o._newBatch=b?null:o._batch;const ex=S.needs.find(n=>n.batch===o.batch&&norm(n.company)===norm(o.company));o._id=ex?ex.id:null;ex?nupd++:nadd++});
    IMP={contracts,needs};
    res.innerHTML=(contracts.length||needs.length)?`<div class="banner info">تمت قراءة الملف: ${contracts.length?`${contracts.length} عقد (${add} جديد، ${upd} تحديث)`:''}${contracts.length&&needs.length?' و':''}${needs.length?`${needs.length} منشأة (${nadd} جديدة، ${nupd} تحديث)`:''}.<div style="margin-top:8px"><button class="btn primary sm" data-act="do-import">تنفيذ الاستيراد</button></div></div>`:`<div class="banner">لم أجد ورقة بعمود «رقم العقد» أو ورقة «الكشوفات». تأكد من أن الصف الأول يحوي عناوين الأعمدة.</div>`;
  }catch(err){res.innerHTML='<div class="banner">'+esc(err.message||'تعذّرت قراءة الملف.')+'</div>'}
  e.target.value='';
}
async function doImport(){if(!IMP)return;const res=document.getElementById('imp-res');let n=0;
  try{for(const o of IMP.contracts){const id=o._id;delete o._id;const old=id?S.contracts.find(c=>c.id===id):null;await write('contracts',id||uid('c'),Object.assign({},old?stripId(old):{},o),!id);n++}
    const newB={};for(const o of IMP.needs){if(!o.batch&&o._newBatch){if(!newB[o._newBatch]){const bid=uid('b');await write('batches',bid,{name:o._newBatch,order:Math.max(0,...S.batches.map(x=>x.order||0))+1+Object.keys(newB).length},true);newB[o._newBatch]=bid}o.batch=newB[o._newBatch]}
      const id=o._id;['_id','_batch','_newBatch'].forEach(k=>delete o[k]);const old=id?S.needs.find(x=>x.id===id):null;await write('needs',id||uid('n'),Object.assign({},old?stripId(old):{},o),!id);n++}
    res.innerHTML=`<div class="banner info">تم استيراد ${n} سجل بنجاح.</div>`;IMP=null;toast('تم استيراد '+n+' سجل بنجاح')}
  catch(err){res.innerHTML=`<div class="banner">توقف الاستيراد بعد ${n} سجل: ${writeErr(err)}</div>`}}
