/* Core: icons, state S, utilities, contract helpers, navigation go(), render dispatcher.
   Classic script: shares the global scope with the other app files; load order is set in index.html. */
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
/* عرض الجداول الطويلة على دفعات: أول 100 صف، ثم «عرض المزيد». الإجماليات والتصدير تبقى على كل الصفوف.
   يعود العدّاد إلى 100 كلما تغيّر عدد النتائج (بحث أو تصفية). */
const PAGE=100;
function pg(key,rows){const P=S.ui.pg||(S.ui.pg={}),k=P[key];if(!k||k.len!==rows.length)P[key]={len:rows.length,n:PAGE};return rows.slice(0,P[key].n)}
function pgMore(key,rows){const k=(S.ui.pg||{})[key];const n=k?k.n:PAGE;if(rows.length<=n)return '';
  return `<div class="pg-more"><button type="button" class="btn sm" data-pg="${key}">عرض المزيد (${Math.min(PAGE,rows.length-n)})</button><button type="button" class="btn sm ghost" data-pg-all="${key}">عرض الكل (${rows.length})</button><span class="muted">${n} / ${rows.length}</span></div>`}
document.addEventListener('click',e=>{const b=e.target.closest('[data-pg],[data-pg-all]');if(!b)return;const key=b.dataset.pg||b.dataset.pgAll,k=(S.ui.pg||{})[key];if(!k)return;
  k.n=b.dataset.pgAll?k.len:k.n+PAGE;const y=window.scrollY;render();window.scrollTo(0,y)});
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
