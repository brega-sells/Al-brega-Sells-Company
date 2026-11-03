/* ===== In-app analysis, Power BI style (opened from the Power BI button) =====
   Takes the same tables the Excel export builds and reads them generically: measures (numeric columns),
   dimensions (text columns with few distinct values) and a date column. Draws, with plain SVG:
   KPI tiles, share by category (donut), monthly trend this year vs last year, top categories (bars),
   count vs total per category (scatter) and a summary table with growth; slicers for table, measure,
   dimension, date column and year; clicking a category cross-filters every visual.
   All text goes through esc(); nothing from the data is rendered as HTML. Loaded after bi.js. */
(function(){
"use strict";
const en=()=>!!(window.I18N&&I18N.lang==='en');
const T=(a,e)=>en()?e:a;
const tl=s=>{try{return en()&&window.I18N&&I18N.t?I18N.t(String(s)):String(s)}catch(e){return String(s)}};
const COUNT='__count';
const DATE=/^(\d{4})-(\d{2})-(\d{2})/;
const MONTHS_AR=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const MONTHS_EN=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const mon=i=>en()?MONTHS_EN[i]:MONTHS_AR[i];
const NF=new Intl.NumberFormat('en-US',{maximumFractionDigits:2});
const CF=new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1});
const fmt=v=>v==null||!isFinite(v)?'—':Math.abs(v)>=10000?CF.format(v):NF.format(Math.round(v*100)/100);
const full=v=>v==null||!isFinite(v)?'—':NF.format(Math.round(v*100)/100);
const pct=v=>v==null||!isFinite(v)?'—':(v>0?'+':'')+(Math.round(v*10)/10)+'%';
const SER=6; /* categorical slots 1..5 + «other» */

/* ---------- reading a table ---------- */
function num(v){if(typeof v==='number')return isFinite(v)?v:null;if(v==null||v==='')return null;const s=String(v).replace(/,/g,'').trim();return /^-?\d+(\.\d+)?$/.test(s)?+s:null}
function profile(t){
  const n=t.rows.length;const meas=[],dims=[],dates=[];
  t.keys.forEach(k=>{const ty=t.types[k];const vals=t.rows.map(r=>r[k]).filter(v=>v!=null&&v!=='');if(!vals.length)return;
    if(ty==='int'||ty==='number'){const d=new Set(vals).size;
      if(/رقم|ترتيب|^id$|seq|no\.?$|هاتف|phone|الصفحة|page/i.test(k)&&ty==='int')return;
      if(ty==='int'&&d===n&&n>8&&!/قيمة|كمية|مبلغ|value|qty|amount/i.test(k))return;
      meas.push(k);return}
    if(ty==='date'||vals.every(v=>DATE.test(String(v)))){dates.push({k,c:vals.length});return}
    if(/هاتف|phone|مسار|path|ملاحظ|note|عنوان|address|بريد|mail|السجل التجاري|ملف|file|رابط|url/i.test(k))return;
    if(vals.reduce((a,v)=>a+String(v).length,0)/vals.length>40)return;
    const d=new Set(vals.map(v=>String(v).trim())).size;
    if(d>=2&&d<=40&&(d<=Math.max(6,n*.6)))dims.push({k,d})});
  const pick=(arr,re)=>arr.find(x=>re.test(x))||null;
  const m=pick(meas,/القيمة|المبلغ|قيمة|value|amount/i)||pick(meas,/الكمية|كمية|qty|quantity/i)||meas[0]||COUNT;
  const dimPref=/الحالة|النوع|نوع|المنطقة|الموقع|الإدارة|المنتج|status|type|region|product/i;
  dims.sort((a,b)=>(dimPref.test(b.k)-dimPref.test(a.k))||(a.d-b.d));
  dates.sort((a,b)=>(/توقيع|sign/i.test(b.k)-/توقيع|sign/i.test(a.k))||(b.c-a.c));
  return {meas,dims:dims.map(x=>x.k),dates:dates.map(x=>x.k),m,dim:dims.length?dims[0].k:null,date:dates.length?dates[0].k:null}}

/* ---------- state ---------- */
let D=null;
function open(tables,title){
  tables=tables.filter(t=>t.rows&&t.rows.length);if(!tables.length){toast(T('لا توجد بيانات للتحليل','Nothing to analyse'));return}
  D={tables,title:title||'',ti:0,sel:null,year:null};setTable(0);
  let d=document.getElementById('bi-dash');
  if(!d){d=document.createElement('dialog');d.id='bi-dash';d.className='bi-dash';d.setAttribute('aria-labelledby','bd-title');document.body.appendChild(d);
    d.addEventListener('click',onClick);d.addEventListener('change',onChange);
    d.addEventListener('mouseover',onHover);d.addEventListener('mousemove',onMove);d.addEventListener('mouseleave',hideTip);
    d.addEventListener('focusin',onHover);d.addEventListener('focusout',hideTip);
    d.addEventListener('keydown',e=>{const c=e.target.closest&&e.target.closest('[data-bd-cat]');if(c&&(e.key==='Enter'||e.key===' ')){e.preventDefault();c.dispatchEvent(new MouseEvent('click',{bubbles:true}))}})}
  draw();if(!d.open)d.showModal();
  const c=d.querySelector('[data-bd="close"]');c&&c.focus()}
function setTable(i){D.ti=i;D.t=D.tables[i];D.p=profile(D.t);D.m=D.p.m;D.dim=D.p.dim;D.date=D.p.date;D.sel=null;D.year=null}
const val=r=>D.m===COUNT?1:(num(r[D.m])||0);
const catOf=r=>{const v=r[D.dim];return v==null||String(v).trim()===''?T('(فارغ)','(blank)'):String(v).trim()};
const yearOf=r=>{const m=DATE.exec(String(r[D.date]||''));return m?+m[1]:null};
const monthOf=r=>{const m=DATE.exec(String(r[D.date]||''));return m?+m[2]-1:null};
function years(){if(!D.date)return[];return [...new Set(D.t.rows.map(yearOf).filter(Boolean))].sort((a,b)=>a-b)}
function measName(){return D.m===COUNT?T('عدد السجلات','Record count'):tl(D.m)}

/* category order and colour are fixed per table+dimension (colour follows the entity, not the filter) */
function catTable(rows){const g=new Map();rows.forEach(r=>{const c=catOf(r);const o=g.get(c)||{c,n:0,v:0};o.n++;o.v+=val(r);g.set(c,o)});return [...g.values()].sort((a,b)=>b.v-a.v||b.n-a.n)}
function colourMap(){const all=D.dim?catTable(D.t.rows):[];const m=new Map();all.forEach((x,i)=>m.set(x.c,i<SER-1?i+1:0));return m}

/* ---------- drawing ---------- */
function draw(){const d=document.getElementById('bi-dash');if(!d)return;const t=D.t,p=D.p;
  const ys=years();if(D.year&&!ys.includes(D.year))D.year=null;
  const cy=D.year||(ys.length?ys[ys.length-1]:null),py=cy?cy-1:null;
  const inSel=r=>!D.sel||catOf(r)===D.sel;
  const rows=t.rows.filter(inSel);
  const rowsY=cy?rows.filter(r=>yearOf(r)===cy):rows;
  const rowsP=py?rows.filter(r=>yearOf(r)===py):[];
  const total=rowsY.reduce((a,r)=>a+val(r),0),prev=rowsP.reduce((a,r)=>a+val(r),0);
  const yoy=py&&prev?((total-prev)/Math.abs(prev))*100:null;
  const cm=colourMap();
  const cats=D.dim?catTable(cy?t.rows.filter(r=>yearOf(r)===cy):t.rows):[];
  const catsP=D.dim&&py?new Map(catTable(t.rows.filter(r=>yearOf(r)===py)).map(x=>[x.c,x])):new Map();
  const top=cats[0];const catTotal=cats.reduce((a,x)=>a+x.v,0);
  const opt=(v,l,s)=>`<option value="${esc(v)}"${s?' selected':''}>${esc(l)}</option>`;
  const slicers=`<div class="bd-slicers" role="group" aria-label="${esc(T('المرشحات','Filters'))}">
    ${D.tables.length>1?`<label><span>${esc(T('الجدول','Table'))}</span><select data-bd="table">${D.tables.map((x,i)=>opt(i,x.name,i===D.ti)).join('')}</select></label>`:''}
    <label><span>${esc(T('المقياس','Measure'))}</span><select data-bd="m">${opt(COUNT,T('عدد السجلات','Record count'),D.m===COUNT)}${p.meas.map(k=>opt(k,tl(k),D.m===k)).join('')}</select></label>
    ${p.dims.length?`<label><span>${esc(T('التصنيف','Category'))}</span><select data-bd="dim">${p.dims.map(k=>opt(k,tl(k),D.dim===k)).join('')}</select></label>`:''}
    ${p.dates.length?`<label><span>${esc(T('التاريخ','Date'))}</span><select data-bd="date">${p.dates.map(k=>opt(k,tl(k),D.date===k)).join('')}</select></label>`:''}
    ${ys.length?`<div class="bd-years" role="group" aria-label="${esc(T('السنة','Year'))}"><button type="button" data-bd-year="" aria-pressed="${!D.year}">${esc(T('الأحدث','Latest'))}</button>${ys.slice(-6).map(y=>`<button type="button" data-bd-year="${y}" aria-pressed="${D.year===y}">${y}</button>`).join('')}</div>`:''}
    ${D.sel?`<button type="button" class="bd-clear" data-bd="clear">${esc(D.sel)} ✕</button>`:''}</div>`;
  const kpi=(l,v,s,cls)=>`<div class="bd-kpi${cls?' '+cls:''}"><b><bdi dir="ltr">${esc(v)}</bdi></b><span>${esc(l)}</span>${s?`<small>${esc(s)}</small>`:''}</div>`;
  const yl=cy?String(cy):T('كل الفترات','All periods');
  const kpis=`<div class="bd-kpis">
    ${kpi(measName()+' — '+yl,fmt(total),full(total))}
    ${kpi(T('السجلات','Records')+' — '+yl,fmt(rowsY.length),rows.length!==rowsY.length?T('الإجمالي ','All ')+full(rows.length):'')}
    ${kpi(T('المتوسط لكل سجل','Average per record'),fmt(rowsY.length?total/rowsY.length:null),'')}
    ${py?kpi(measName()+' — '+py,fmt(prev),full(prev)):''}
    ${py?kpi(T('النمو عن العام السابق','Growth vs last year'),pct(yoy),yoy==null?T('لا بيانات للعام السابق','No last-year data'):(yoy>=0?'▲ ':'▼ ')+fmt(Math.abs(total-prev)),yoy==null?'':yoy>=0?'up':'down'):''}
    ${top?kpi(T('الأعلى: ','Top: ')+top.c,(catTotal?Math.round(top.v/catTotal*1000)/10:0)+'%',fmt(top.v)):''}</div>`;
  const card=(cls,title,body,sub)=>`<section class="bd-card ${cls}"><header><h4>${esc(title)}</h4>${sub?`<span>${esc(sub)}</span>`:''}</header>${body}</section>`;
  const parts=[];const dn=tl(D.dim||'');
  const cTrend=D.date?card('bd-w2',T('الاتجاه الشهري: ','Monthly trend: ')+measName(),trend(rows,cy,py),cy?(py?cy+' / '+py:String(cy)):''):'';
  const cDonut=D.dim?card('',T('التوزيع حسب ','Share by ')+dn,donut(cats,cm,catTotal),yl):'';
  const cStack=D.dim&&D.date&&cy?card('bd-w2',T('شهريًا حسب ','Monthly by ')+dn,stacked(rows,cy,cm),String(cy)):'';
  const cBars=D.dim?card(cTrend?'':'bd-w2',T('الأعلى حسب ','Top by ')+dn,bars(cats.slice(0,10),cm),yl):'';
  const cTable=D.dim?card('bd-w2',T('ملخص ','Summary by ')+dn,table(cats,catsP,catTotal,cy,py,cm),''):'';
  const cSc=D.dim?card('',T('العدد مقابل ','Count vs ')+measName(),scatter(cats.slice(0,12)),T('كل نقطة تصنيف','Each dot is a category')):'';
  [cTrend,cDonut,cStack,cBars,cTable,cSc].forEach(c=>{if(c)parts.push(c)});
  if(!D.dim&&!D.date)parts.push(card('bd-wide',T('لا توجد أعمدة للتصنيف أو التاريخ','No category or date columns'),`<p class="muted">${esc(T('هذا الجدول لا يحوي أعمدة تصلح للتحليل البياني. استخدم التصدير إلى Power BI.','This table has no columns that can be charted. Use the Power BI export.'))}</p>`,''));
  d.innerHTML=`<div class="bd-top"><span class="bi-badge">${window.__biIcon||''}</span><div class="bd-tt"><h3 id="bd-title">${esc(T('تحليل البيانات','Data analysis'))} — ${esc(t.name)}</h3><span>${esc(full(t.rows.length))} ${esc(T('سجل','records'))} · ${esc(D.title)}</span></div>
     <button type="button" class="btn sm" data-bd="pack">${I.down}${esc(T('تصدير إلى Power BI','Export to Power BI'))}</button><button type="button" class="btn sm" data-bd="print">${esc(T('طباعة','Print'))}</button><button type="button" class="iconbtn" data-bd="close" aria-label="${esc(T('إغلاق','Close'))}">${I.close}</button></div>
    ${slicers}<div class="bd-body">${kpis}<div class="bd-grid">${parts.join('')}</div>
    <p class="bd-foot muted">${esc(T('انقر على أي تصنيف في المخططات لتصفية كل اللوحة. الأرقام محسوبة في المتصفح من البيانات المعروضة نفسها في الشاشة.','Click a category in any visual to filter the whole page. Figures are computed in the browser from the same data shown on screen.'))}</p></div><div class="bd-tip" role="tooltip" hidden></div>`}

/* monthly trend: this year (solid, slot 1) vs last year (dashed, muted); hover column shows both */
function trend(rows,cy,py){
  const W=860,H=250,L=46,R=12,Tp=14,B=28;const iw=W-L-R,ih=H-Tp-B;
  const sum=y=>{const a=Array(12).fill(0),c=Array(12).fill(0);rows.forEach(r=>{if(yearOf(r)!==y)return;const m=monthOf(r);if(m==null)return;a[m]+=val(r);c[m]++});return {a,c}};
  let A,P=null;
  if(cy){A=sum(cy);if(py)P=sum(py)}else return `<p class="muted">${esc(T('لا توجد تواريخ صالحة.','No valid dates.'))}</p>`;
  const hasP=P&&P.c.some(x=>x);
  const mx=Math.max(1,...A.a,...(hasP?P.a:[]));const nice=niceMax(mx);
  const x=i=>L+iw*(i+.5)/12,y=v=>Tp+ih-(v/nice)*ih;
  const path=arr=>arr.map((v,i)=>(i?'L':'M')+x(i).toFixed(1)+' '+y(v).toFixed(1)).join(' ');
  const grid=[0,.25,.5,.75,1].map(f=>`<line x1="${L}" x2="${W-R}" y1="${y(nice*f)}" y2="${y(nice*f)}" class="bd-grid-l"/><text x="${L-6}" y="${y(nice*f)+4}" class="bd-ax" text-anchor="end">${esc(fmt(nice*f))}</text>`).join('');
  const xl=MONTHS_AR.map((_,i)=>`<text x="${x(i)}" y="${H-8}" class="bd-ax bd-mon" text-anchor="middle">${esc(mon(i))}</text>`).join('');
  const area=`M${x(0)} ${y(0)} `+A.a.map((v,i)=>'L'+x(i).toFixed(1)+' '+y(v).toFixed(1)).join(' ')+` L${x(11)} ${y(0)} Z`;
  const dots=A.a.map((v,i)=>A.c[i]?`<circle cx="${x(i)}" cy="${y(v)}" r="4" class="bd-dot"/>`:'').join('');
  const hits=A.a.map((v,i)=>`<rect x="${x(i)-iw/24}" y="${Tp}" width="${iw/12}" height="${ih}" class="bd-hit" tabindex="0" data-tip="${esc(mon(i)+' — '+cy+': '+full(v)+(hasP?' · '+py+': '+full(P.a[i])+(P.a[i]?' ('+pct((v-P.a[i])/Math.abs(P.a[i])*100)+')':''):''))}"/>`).join('');
  const legend=`<div class="bd-legend"><span><i class="s1"></i>${cy}</span>${hasP?`<span><i class="sp"></i>${py}</span>`:''}</div>`;
  return legend+`<svg viewBox="0 0 ${W} ${H}" class="bd-svg" role="img" aria-label="${esc(T('الاتجاه الشهري','Monthly trend'))}" direction="ltr">${grid}${xl}<path d="${area}" class="bd-area"/>${hasP?`<path d="${path(P.a)}" class="bd-line-p"/>`:''}<path d="${path(A.a)}" class="bd-line"/>${dots}${hits}</svg>`}
function niceMax(v){const p=Math.pow(10,Math.floor(Math.log10(v)));const f=v/p;return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p}

/* stacked monthly columns by category (top 5 + other), 2px surface gap between segments */
function stacked(rows,cy,cm){
  const W=860,H=230,L=46,R=12,Tp=10,B=28;const iw=W-L-R,ih=H-Tp-B;
  const M=Array.from({length:12},()=>new Map());
  rows.forEach(r=>{if(yearOf(r)!==cy)return;const m=monthOf(r);if(m==null)return;const s=slot(cm,catOf(r));const key=s?catOf(r):T('أخرى','Other');const o=M[m].get(key)||{c:key,s,v:0};o.v+=val(r);M[m].set(key,o)});
  const tot=M.map(m=>[...m.values()].reduce((a,x)=>a+x.v,0));const nice=niceMax(Math.max(1,...tot));
  const bw=iw/12*.62,x=i=>L+iw*(i+.5)/12,y=v=>Tp+ih-(v/nice)*ih;
  const grid=[0,.5,1].map(f=>`<line x1="${L}" x2="${W-R}" y1="${y(nice*f)}" y2="${y(nice*f)}" class="bd-grid-l"/><text x="${L-6}" y="${y(nice*f)+4}" class="bd-ax" text-anchor="end">${esc(fmt(nice*f))}</text>`).join('');
  let cols='';M.forEach((m,i)=>{let acc=0;const segs=[...m.values()].sort((a,b)=>(a.s||99)-(b.s||99));
    segs.forEach((sg,j)=>{const h=sg.v/nice*ih;if(h<=0)return;const top=y(acc+sg.v);const gap=j?2:0;
      cols+=`<rect x="${x(i)-bw/2}" y="${top}" width="${bw}" height="${Math.max(0,h-gap)}" rx="${j===segs.length-1?3:0}" class="bd-s${sg.s}${D.sel&&D.sel!==sg.c?' bd-dim':''}"${sg.s?` data-bd-cat="${esc(sg.c)}"`:''} data-tip="${esc(mon(i)+' — '+sg.c+': '+full(sg.v))}"/>`;acc+=sg.v})});
  const xl=MONTHS_AR.map((_,i)=>`<text x="${x(i)}" y="${H-8}" class="bd-ax bd-mon" text-anchor="middle">${esc(mon(i))}</text>`).join('');
  const keys=new Map();M.forEach(m=>m.forEach(o=>keys.set(o.c,o.s)));
  const leg=[...keys.entries()].sort((a,b)=>(a[1]||99)-(b[1]||99)).map(([c,s])=>`<span><i class="bd-s${s}"></i>${esc(c)}</span>`).join('');
  return `<div class="bd-legend">${leg}</div><svg viewBox="0 0 ${W} ${H}" class="bd-svg" role="img" aria-label="${esc(T('شهريًا حسب التصنيف','Monthly by category'))}" direction="ltr">${grid}${cols}${xl}</svg>`}
function slot(cm,c){const s=cm.get(c);return s==null?0:s}
function donut(cats,cm,total){
  if(!total)return `<p class="muted">${esc(T('لا قيم.','No values.'))}</p>`;
  const main=cats.filter(x=>slot(cm,x.c)>0),rest=cats.filter(x=>slot(cm,x.c)===0);
  const segs=main.map(x=>({c:x.c,v:x.v,s:slot(cm,x.c)}));if(rest.length)segs.push({c:T('أخرى','Other'),v:rest.reduce((a,x)=>a+x.v,0),s:0,other:true});
  const R=80,r=52,cx=100,cy=100;let a0=-Math.PI/2;const gap=segs.length>1?.012:0;
  const arcs=segs.map(sg=>{const a=sg.v/total*Math.PI*2;const s=a0+gap,e=a0+a-gap;a0+=a;if(e<=s)return'';
    const lg=e-s>Math.PI?1:0;const P=(rad,ang)=>[cx+rad*Math.cos(ang),cy+rad*Math.sin(ang)];
    const [x1,y1]=P(R,s),[x2,y2]=P(R,e),[x3,y3]=P(r,e),[x4,y4]=P(r,s);
    const d=segs.length===1?`M${cx} ${cy-R}A${R} ${R} 0 1 1 ${cx-.01} ${cy-R}L${cx-.01} ${cy-r}A${r} ${r} 0 1 0 ${cx} ${cy-r}Z`:`M${x1} ${y1}A${R} ${R} 0 ${lg} 1 ${x2} ${y2}L${x3} ${y3}A${r} ${r} 0 ${lg} 0 ${x4} ${y4}Z`;
    return `<path d="${d}" class="bd-s${sg.s}${D.sel&&D.sel!==sg.c?' bd-dim':''}"${sg.other?'':` data-bd-cat="${esc(sg.c)}" tabindex="0" role="button"`} data-tip="${esc(sg.c+': '+full(sg.v)+' ('+(Math.round(sg.v/total*1000)/10)+'%)')}"/>`}).join('');
  const leg=segs.map(sg=>`<li${sg.other?'':` data-bd-cat="${esc(sg.c)}"`}><i class="bd-s${sg.s}"></i><span>${esc(sg.c)}</span><b>${Math.round(sg.v/total*1000)/10}%</b></li>`).join('');
  return `<div class="bd-donut"><svg viewBox="0 0 200 200" class="bd-svg" role="img" aria-label="${esc(T('التوزيع','Share'))}">${arcs}<text x="100" y="98" text-anchor="middle" class="bd-dc">${esc(fmt(total))}</text><text x="100" y="117" text-anchor="middle" class="bd-ax">${esc(T('الإجمالي','Total'))}</text></svg><ul class="bd-leg">${leg}</ul></div>`}
function bars(cats,cm){
  if(!cats.length)return'';const mx=Math.max(...cats.map(x=>x.v),1);
  return `<ul class="bd-bars">${cats.map(x=>`<li data-bd-cat="${esc(x.c)}" tabindex="0" role="button" class="${D.sel&&D.sel!==x.c?'bd-dim':''}" data-tip="${esc(x.c+': '+full(x.v)+' · '+x.n+' '+T('سجل','records'))}"><span class="bd-bl">${esc(x.c)}</span><span class="bd-bt"><i class="bd-s${slot(cm,x.c)}" style="width:${Math.max(1.5,x.v/mx*100).toFixed(1)}%"></i></span><b>${esc(fmt(x.v))}</b></li>`).join('')}</ul>`}
function scatter(cats){
  if(cats.length<2)return `<p class="muted">${esc(T('يحتاج تصنيفين على الأقل.','Needs at least two categories.'))}</p>`;
  const W=360,H=220,L=48,R=34,Tp=22,B=30;const iw=W-L-R,ih=H-Tp-B;
  const mxn=niceMax(Math.max(...cats.map(x=>x.n),1)),mxv=niceMax(Math.max(...cats.map(x=>x.v),1));
  const x=v=>L+v/mxn*iw,y=v=>Tp+ih-v/mxv*ih;
  const g=[0,.5,1].map(f=>`<line x1="${L}" x2="${W-R}" y1="${y(mxv*f)}" y2="${y(mxv*f)}" class="bd-grid-l"/><text x="${L-5}" y="${y(mxv*f)+4}" class="bd-ax" text-anchor="end">${esc(fmt(mxv*f))}</text><text x="${x(mxn*f)}" y="${H-12}" class="bd-ax" text-anchor="middle">${esc(fmt(mxn*f))}</text>`).join('');
  const placed=[];const lab=cats.slice(0,4).map(c=>{const px=x(c.n),py=y(c.v)-10;if(placed.some(([a,b])=>Math.abs(a-px)<70&&Math.abs(b-py)<14))return'';placed.push([px,py]);return `<text x="${px}" y="${py}" class="bd-ax bd-pl" text-anchor="middle">${esc(String(c.c).slice(0,18))}</text>`}).join('');
  const dots=cats.map(c=>`<circle cx="${x(c.n)}" cy="${y(c.v)}" r="6" class="bd-sc${D.sel&&D.sel!==c.c?' bd-dim':''}" data-bd-cat="${esc(c.c)}" tabindex="0" role="button" data-tip="${esc(c.c+' — '+T('العدد','count')+': '+c.n+' · '+measName()+': '+full(c.v))}"/>`).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="bd-svg" role="img" aria-label="${esc(T('العدد مقابل القيمة','Count vs value'))}" direction="ltr">${g}<text x="${W-R}" y="${H-1}" class="bd-ax" text-anchor="end">${esc(T('عدد السجلات','records'))} →</text>${dots}${lab}</svg>`}
function table(cats,catsP,total,cy,py,cm){
  const rows=cats.map(x=>{const p=catsP.get(x.c);const pv=p?p.v:0;const g=py&&pv?((x.v-pv)/Math.abs(pv))*100:null;
    return `<tr data-bd-cat="${esc(x.c)}" class="${D.sel===x.c?'on':''}"><td><i class="bd-s${slot(cm,x.c)}"></i>${esc(x.c)}</td><td>${esc(full(x.n))}</td><td>${esc(full(x.v))}</td>${py?`<td>${esc(full(pv))}</td><td class="${g==null?'':g>=0?'up':'down'}">${g==null?'—':(g>=0?'▲ ':'▼ ')+esc(pct(g))}</td>`:''}<td>${total?Math.round(x.v/total*1000)/10:0}%</td></tr>`}).join('');
  const pT=[...catsP.values()].reduce((a,x)=>a+x.v,0);const gT=py&&pT?((total-pT)/Math.abs(pT))*100:null;
  return `<div class="tablewrap bd-tw"><table class="bd-table"><thead><tr><th>${esc(tl(D.dim))}</th><th>${esc(T('السجلات','Records'))}</th><th>${esc(measName())}${cy?' '+cy:''}</th>${py?`<th>${py}</th><th>${esc(T('النمو','Growth'))}</th>`:''}<th>${esc(T('الحصة','Share'))}</th></tr></thead><tbody>${rows}</tbody>
   <tfoot><tr><td>${esc(T('الإجمالي','Total'))}</td><td>${esc(full(cats.reduce((a,x)=>a+x.n,0)))}</td><td>${esc(full(total))}</td>${py?`<td>${esc(full(pT))}</td><td class="${gT==null?'':gT>=0?'up':'down'}">${gT==null?'—':esc(pct(gT))}</td>`:''}<td>100%</td></tr></tfoot></table></div>`}

/* ---------- interaction ---------- */
function onClick(e){const d=e.currentTarget;if(e.target===d){d.close();return}
  const b=e.target.closest('[data-bd],[data-bd-year],[data-bd-cat]');if(!b)return;
  if(b.dataset.bdCat!=null){D.sel=D.sel===b.dataset.bdCat?null:b.dataset.bdCat;draw();focusSel(b.dataset.bdCat);return}
  if(b.dataset.bdYear!=null){D.year=b.dataset.bdYear?+b.dataset.bdYear:null;draw();return}
  const k=b.dataset.bd;
  if(k==='close'){d.close();return}
  if(k==='clear'){D.sel=null;draw();return}
  if(k==='print'){window.print();return}
  if(k==='pack'&&window.__biExport){d.close();window.__biExport(D.tables,D.title);return}}
function focusSel(c){if(!c)return;const el=[...document.querySelectorAll('#bi-dash .bd-bars [data-bd-cat]')].find(x=>x.dataset.bdCat===c);el&&el.focus({preventScroll:true})}
function onChange(e){const s=e.target;if(!s.dataset||!s.dataset.bd)return;const k=s.dataset.bd;
  if(k==='table')setTable(+s.value);else if(k==='m')D.m=s.value;else if(k==='dim'){D.dim=s.value;D.sel=null}else if(k==='date'){D.date=s.value;D.year=null}
  draw();const n=document.querySelector(`#bi-dash [data-bd="${k}"]`);n&&n.focus()}
function tip(){return document.querySelector('#bi-dash .bd-tip')}
function onHover(e){const el=e.target.closest&&e.target.closest('[data-tip]');const t=tip();if(!t)return;if(!el){t.hidden=true;return}
  t.textContent=el.dataset.tip;t.hidden=false;if(e.type!=='focusin'){place(e.clientX,e.clientY);return}if(true){const r=el.getBoundingClientRect();place(r.left+r.width/2,r.top)}}
function onMove(e){const t=tip();if(t&&!t.hidden)place(e.clientX,e.clientY)}
function place(x,y){const t=tip();const w=t.offsetWidth,h=t.offsetHeight;t.style.left=Math.max(8,Math.min(innerWidth-w-8,x-w/2))+'px';t.style.top=Math.max(8,y-h-14)+'px'}
function hideTip(){const t=tip();if(t)t.hidden=true}

window.__biDash=open;
if(window.I18N&&I18N.add)I18N.add({'تحليل البيانات':'Data analysis'});
})();
