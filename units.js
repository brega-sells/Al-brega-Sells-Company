/* ===== وحدات الكميات: عرض موحّد بالمتر المكعب (Fuel quantity units) =====
   The closing-reports exports state quantities in whatever unit the source system used: litres for one product,
   tonnes for another, cylinders for LPG. The dashboards (SMS055, sales analysis, transfers, receipts, and any module
   that calls window.FuelUnits) show every volume/mass quantity in cubic metres (م³), the international reference:
     litres  → m³  : ÷ 1000 (exact)
     tonnes  → m³  : ÷ density (t/m³) at 15 °C, per product
     kg      → m³  : ÷ density (kg/m³)
     cylinders and other counts stay as they are (a count cannot become a volume without the fill mass).
   Densities: a default per product type sold by the company (gasoline 740, diesel 835, LPG 540, kerosene 800, heavy fuel oil 970,
   marine fuel 890 kg/m³), overridden per type («@marine») or per product code by the administrator from Settings ← «وحدات الكميات» (Firestore config/units).
   Loaded before the dashboards. Every row keeps its original quantity (q0) and unit (u0) for tooltips and exports. */
"use strict";
(function(){
const EN=()=>!!(window.I18N&&I18N.lang==='en');
const T=(a,e)=>EN()?e:a;
const M3='م³';
/* the product types sold by the company (the «النوع» list of the sales system): gasoline, diesel, LPG, heavy fuel oil
   and marine fuel. Marine fuel is checked first because «marine gas oil» would otherwise read as diesel; its default
   0.890 t/m³ is marine gas oil (MGO), heavier marine fuels reach 0.991 and are set per product in Settings. */
const FAM=[ // [family id, Arabic, English, default density kg/m³, name patterns (normalised, no spaces), product codes]
  ['marine','وقود السفن','Marine fuel',890,/سفن|بحري|marine|bunker|mgo|mdo|ifo/,[]],
  ['gasoline','البنزين','Gasoline',740,/بنزين|gasoline|petrol|mogas/,['33500']],
  ['diesel','وقود الديزل','Diesel',835,/ديزل|سولار|diesel|gasoil/,['44347']],
  ['lpg','غاز مسال','LPG',540,/مسال|غاز|lpg|propane|butane|بوتان|بروبان/,['16291']],
  ['kerosene','كيروسين','Kerosene',800,/كيروسين|كيروسين|كاز|kerosene|kero|jet|avtur/,[]],
  ['fueloil','الزيت الثقيل','Heavy fuel oil',970,/ثقيل|زيتوقود|fueloil|hfo|mazut|مازوت/,[]]];
/* contract / line types that are not a product (services, maintenance, transport, supply): never converted to a volume */
const NOT_PRODUCT=/خدم|صيان|نقلوتشغيل|^نقل|تشغيل|توريد|service|maintenance|transport|supply/;
const U={over:{},names:{},loaded:false,ver:0};
const nrm=s=>(window.norm?norm(String(s||'')):String(s||'').toLowerCase()).replace(/[\s\/\\\-_.()]/g,'');
/* unit kind from the unit text: L, T, KG, M3, or '' for counts (cylinders…) */
function kind(u){const s=nrm(u);if(!s)return'';
  if(/م3|م³|m3|m³|مترمكعب|cbm|cubic/.test(s))return'M3';
  if(/اسطوان|سلندر|cyl|عبوه|عبوة|قاروره|كرتون|حبه|قطعه|pcs|unit/.test(s))return'';
  if(/كغم|كجم|كيلو|kg|kilo/.test(s))return'KG';
  if(/طن|ton|^mt$|^t$|tonne/.test(s))return'T';
  if(/لتر|ليتر|ltr|lit|^l$|liter|litre|سالب/.test(s))return'L';return''}
function isService(name){const n=nrm(name);return !!n&&NOT_PRODUCT.test(n)&&!FAM.some(f=>f[4].test(n))}
function family(code,name){const c=String(code||'').trim(),n=nrm(name);for(const f of FAM){if(f[5].includes(c)||(n&&f[4].test(n)))return f}return null}
/* density in kg/m³ for a product: admin override by code, else the family default, else null */
function density(code,name){const c=String(code||'').trim();if(U.over[c]>0)return {d:U.over[c],src:'override'};const f=family(c,name);if(!f)return null;
  if(U.over['@'+f[0]]>0)return {d:U.over['@'+f[0]],src:'override',fam:f};return {d:f[3],src:'default',fam:f}}
/* convert one quantity; returns {q,u,d} with u=م³, or null when the unit is a count or no density is known */
function toM3(q,u,code,name){if(isService(name))return null;const k=kind(u);if(!k)return null;const n=+q||0;
  if(k==='M3')return {q:n,u:M3,k};if(k==='L')return {q:n/1000,u:M3,k};
  const dd=density(code,name);if(!dd)return null;return {q:k==='T'?n*1000/dd.d:n/dd.d,u:M3,k,d:dd.d,src:dd.src}}
/* normalise rows of a dashboard in place-safe copies: q (and rq when present) in م³, u=م³; originals in q0/u0; memoised per array */
const memo=new WeakMap();
function normalize(rows){if(!rows||!rows.length)return rows||[];const m=memo.get(rows);if(m&&m.ver===U.ver)return m.out;
  const out=rows.map(r=>{if(!r.u&&!r.u0)return r;const u0=r.u0||r.u,q0=r.q0!=null?r.q0:r.q;const c=toM3(q0,u0,r.p,r.pn);if(!c){if(r.u0)return Object.assign({},r,{u:u0,q:q0,rq:r.rq0!=null?r.rq0:r.rq});return r}
    const o=Object.assign({},r,{q:c.q,u:M3,q0,u0,uk:c.k,ud:c.d||0});if(r.rq!=null){o.rq0=r.rq0!=null?r.rq0:r.rq;o.rq=toM3(o.rq0,u0,r.p,r.pn).q}return o});
  memo.set(rows,{ver:U.ver,out});return out}
/* text for the conversions actually used in a set of rows, e.g. «لتر ÷ 1000 · طن ÷ 0.835 (وقود الديزل)» */
function explain(rows){const seen=new Map();(rows||[]).forEach(r=>{if(!r.u0||r.u!==M3)return;const key=r.uk+(r.uk==='T'||r.uk==='KG'?'|'+r.p:'');if(!seen.has(key))seen.set(key,r)});
  const parts=[];seen.forEach(r=>{if(r.uk==='L')parts.push(T('لتر ÷ 1000','litres ÷ 1000'));else if(r.uk==='M3')parts.push(T('م³ كما هي','m³ as is'));
    else parts.push(T(`${r.uk==='T'?'طن':'كغم'} ÷ ${r.uk==='T'?(r.ud/1000).toFixed(3):r.ud} (${r.pn})`,`${r.uk==='T'?'tonnes':'kg'} ÷ ${r.uk==='T'?(r.ud/1000).toFixed(3):r.ud} (${r.pn})`))});
  return parts.length?T('الكميات بالمتر المكعب: ','Quantities in cubic metres: ')+parts.join(' · ')+(parts.some(p=>/÷ 0\.|kg|كغم/.test(p))?T(' · الكثافة عند 15°م، يعدّلها مدير النظام من الإعدادات',' · density at 15 °C, editable by the administrator in Settings'):''):''}
/* products seen by the dashboards, so the settings panel can list them */
function seen(rows){(rows||[]).forEach(r=>{if(r.p&&r.pn&&!U.names[r.p])U.names[r.p]=r.pn})}
/* admin configuration: config/units {densities:{code:kg/m³}, names:{code:name}} */
async function load(){if(U.loaded)return;U.loaded=true;try{const FS=window.__fs&&window.__fs();if(!FS)return;
  FS.collection('config').doc('units').onSnapshot(d=>{const x=(d.exists&&d.data())||{};U.over={};Object.entries(x.densities||{}).forEach(([k,v])=>{if(+v>0)U.over[k]=+v});Object.assign(U.names,x.names||{});U.ver++;if(typeof render==='function'&&['settings','sms055','sales','transfers','receipts','org'].includes(window.S&&S.view))render()},()=>{})}catch(e){}}
async function save(dens){const FS=window.__fs(),m=(window.__me&&window.__me())||{};const names={};Object.keys(dens).forEach(k=>{if(U.names[k])names[k]=U.names[k]});
  await FS.collection('config').doc('units').set({densities:dens,names,by:m.email||'',at:new Date().toISOString()});
  try{await FS.collection('log').add({at:firebase.firestore.FieldValue.serverTimestamp(),ts:new Date().toISOString(),user:m.email,name:m.name||'',action:'تعديل كثافات المنتجات',col:'config',id:'units',summary:Object.entries(dens).map(([k,v])=>`${names[k]||k}: ${v}`).join('، ')})}catch(e){}}

/* ---------- settings panel (administrator) ---------- */
function panel(){const me=(window.__me&&window.__me())||{};if(me.role!=='admin')return '';load();
  const ORD=['gasoline','fueloil','lpg','diesel','marine','kerosene'];/* the order of the sales system's «النوع» list */
  const famRows=FAM.slice().sort((a,b)=>ORD.indexOf(a[0])-ORD.indexOf(b[0])).map(f=>{const o=U.over['@'+f[0]];return {c:'@'+f[0],shown:T('كل منتجات النوع','all products of this type'),n:T(f[1],f[2]),d:o>0?o:f[3],src:o>0?'override':'default',fam:f}});
  const codes=new Set([...Object.keys(U.names),...Object.keys(U.over).filter(k=>k[0]!=='@'),...FAM.flatMap(f=>f[5])].filter(c=>!isService(U.names[c])));
  const prodRows=[...codes].map(c=>{const dd=density(c,U.names[c]);const f=family(c,U.names[c]);return {c,n:U.names[c]||(f?T(f[1],f[2]):''),d:dd?dd.d:'',src:dd?dd.src:'',fam:f}}).sort((a,b)=>a.n.localeCompare(b.n,'ar'));
  const rows=famRows.concat(prodRows);
  return `<div class="panel" id="fu-panel"><h3 class="section-title">${esc(T('وحدات الكميات','Quantity units'))} <small>${esc(T('كل اللوحات تعرض الكميات بالمتر المكعب','every dashboard shows quantities in cubic metres'))}</small></h3>
   <p class="muted" style="margin:0 0 8px;font-size:13px;line-height:1.8">${esc(T('اللتر يُقسم على 1000، والطن يُقسم على كثافة المنتج عند 15°م (طن/م³). الكثافات الافتراضية لأنواع منتجات الشركة: البنزين 0.740، وقود الديزل 0.835، غاز مسال 0.540، كيروسين 0.800، الزيت الثقيل 0.970، وقود السفن 0.890 (زيت الغاز البحري؛ أنواع وقود السفن الأثقل تصل إلى 0.991). عدّل الصف العام للنوع ليسري على كل منتجاته، أو صف منتج محدد برمزه. الاسطوانات تبقى عددًا، وأنواع الخدمات (تقديم خدمات، صيانة، نقل وتشغيل، توريد منتجات نفطية) لا تُحوَّل إلى حجم.','Litres are divided by 1000; tonnes by the product density at 15 °C (t/m³). Defaults for the company product types: gasoline 0.740, diesel 0.835, LPG 0.540, kerosene 0.800, heavy fuel oil 0.970, marine fuel 0.890 (marine gas oil; heavier marine fuels reach 0.991). Edit a type row to apply to all its products, or a product row by its code. Cylinders stay a count, and service types (services, maintenance, transport, petroleum supply) are never converted to a volume.'))}</p>
   <div class="tablewrap" style="max-height:none;min-height:0"><table><thead><tr><th class="nosort">${esc(T('رمز المنتج','Product code'))}</th><th class="nosort">${esc(T('المنتج','Product'))}</th><th class="nosort">${esc(T('الكثافة كغم/م³','Density kg/m³'))}</th><th class="nosort">${esc(T('المصدر','Source'))}</th></tr></thead>
   <tbody>${rows.map(r=>`<tr${r.shown?' class="fu-fam"':''}><td class="num">${r.shown?`<b>${esc(T('نوع','Type'))}</b> <small class="muted">${esc(r.shown)}</small>`:esc(r.c)}</td><td>${esc(r.n||'—')}</td><td><input type="number" min="400" max="1200" step="0.1" data-fu-d="${esc(r.c)}" value="${esc(String(r.d))}" style="width:110px" aria-label="${esc(T('الكثافة','Density'))}"></td><td class="muted">${esc(r.src==='override'?T('معدّلة','edited'):r.src==='default'?T('افتراضية','default'):T('غير معروفة: تُعرض الأطنان كما هي','unknown: tonnes stay as entered'))}</td></tr>`).join('')}
   <tr><td><input type="text" id="fu-new-c" placeholder="${esc(T('رمز جديد','new code'))}" style="width:110px"></td><td><input type="text" id="fu-new-n" placeholder="${esc(T('اسم المنتج','product name'))}"></td><td><input type="number" id="fu-new-d" min="400" max="1200" step="0.1" placeholder="835" style="width:110px"></td><td></td></tr></tbody></table></div>
   <div class="toolbar" style="margin-top:8px"><button type="button" class="btn primary sm" data-fu="save">${esc(T('حفظ الكثافات','Save densities'))}</button><span id="fu-msg" class="muted" style="font-size:12.5px"></span></div></div>`}
document.addEventListener('click',async e=>{const b=e.target.closest('[data-fu="save"]');if(!b)return;const msg=document.getElementById('fu-msg');const dens={};let bad='';
  document.querySelectorAll('#fu-panel [data-fu-d]').forEach(i=>{const v=parseFloat(i.value);const c=i.dataset.fuD;const fam=c[0]==='@';const f=fam?FAM.find(x=>'@'+x[0]===c):family(c,U.names[c]);if(!i.value)return;if(!(v>=400&&v<=1200)){bad=fam?T(f[1],f[2]):c;return}
    const base=f?(fam?f[3]:(U.over['@'+f[0]]>0?U.over['@'+f[0]]:f[3])):null;if(base==null||Math.abs(base-v)>0.01)dens[c]=Math.round(v*10)/10});
  const nc=(document.getElementById('fu-new-c')||{}).value||'',nn=(document.getElementById('fu-new-n')||{}).value||'',nd=parseFloat((document.getElementById('fu-new-d')||{}).value);
  if(nc.trim()&&nd>=400&&nd<=1200){dens[nc.trim()]=Math.round(nd*10)/10;if(nn.trim())U.names[nc.trim()]=nn.trim().slice(0,80)}else if(nc.trim()){bad=nc}
  if(bad){msg.style.color='var(--crit)';msg.textContent=T(`الكثافة يجب أن تكون بين 400 و1200 كغم/م³ (${bad})`,`Density must be between 400 and 1200 kg/m³ (${bad})`);return}
  b.disabled=true;msg.style.color='';msg.textContent=T('جارٍ الحفظ…','Saving…');
  try{await save(dens);msg.textContent=T('تم الحفظ، وتُعاد قراءة اللوحات بالكثافات الجديدة','Saved; the dashboards now use the new densities')}catch(err){msg.style.color='var(--crit)';msg.textContent=T('تعذّر الحفظ: ','Could not save: ')+(err.message||'')}b.disabled=false});
if(window.I18N&&I18N.add)I18N.add({'وحدات الكميات':'Quantity units'});
window.FuelUnits={M3,kind,family,density,toM3,isService,normalize,explain,seen,load,save,panel,state:U,families:FAM};
})();
