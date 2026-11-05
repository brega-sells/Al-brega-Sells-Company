/* ===== لوحة مؤشرات الديون (إدارة الشؤون التجارية والتحصيلات) =====
   Loaded after closures.js and built on the SMS055 pattern. The department imports its monthly workbooks and the page
   turns them into KPIs, charts, a written reading, sortable tables and an Excel / Power BI export. Two file kinds:
     ledger ← «أرصدة حسابات المدينون والدائنون التجاريون» (BPMC-FIN-TOC-F38): the summary sheet (categories with a
              region suffix غ / ش and their subtotals per sector), the general summary (sectors), and the region sheets
              (one row per customer account). Columns: opening balance (debit / credit), withdrawals, debit adjustments,
              collections, credit adjustments, closing balance (debit / credit), in local and foreign currency.
     fuel   ← «بيان بقيمة المحروقات» (BPMC-FIN-ACC-F01): value of fuel per product and customer group for state-funded
              and non-funded customers, cash / credit, and the shares of Brega, the NOC and the river project.
   A flat table (one row per account, e.g. a CSV exported from Power BI or this page's own export) is read too.
   Storage mirrors the closing-reports dashboards: Firestore collection `debts_report`, one `batch` document per
   imported snapshot (sheet = ledger | fuel, from / to = the month) and `part` documents holding its JSON.
   Same rights as sms055 (firestore.rules). The file readers and chart builders are shared from sms055.js. */
"use strict";
(function(){
const L=window.__smsLib;if(!L){console.warn('debts: sms055 library missing');return}
const {readGrids,hn,AD,num,serialIso,colChart,bars,stack,pct,fdi,mName,me}=L;
const EN=()=>{if(window.I18N&&I18N.lang)return I18N.lang==='en';try{return localStorage.getItem('cm_lang')==='en'}catch(e){return false}};
const tr=(ar,en)=>EN()&&en?en:ar;
const ID='debts',COL='debts_report',UNIT='ca',CHUNK=800000,DEPT=['إدارة الشؤون التجارية والتحصيلات','Commercial Affairs & Collections'];
const LABEL=['لوحة الديون','Debts dashboard'];
/* amounts: 6.4 مليار / 218.6 مليون / 52 ألف */
const big=v=>{if(v==null||isNaN(v))return'—';const a=Math.abs(v);if(a>=1e9)return String(+(v/1e9).toFixed(a>=1e10?1:2))+tr(' مليار',' bn');if(a>=1e6)return String(+(v/1e6).toFixed(a>=1e8?0:1))+tr(' مليون',' M');if(a>=1e4)return fn(Math.round(v/1e3))+tr(' ألف',' K');return fn(Math.round(v))};
const n0=v=>fn(Math.round(v||0));
const txt=v=>String(v==null?'':(v&&typeof v==='object'&&'serial' in v?serialIso(v.serial):v)).trim();
const H=v=>hn(txt(v));
const near=(a,b)=>Math.abs(a-b)<=Math.max(1,Math.abs(b)*1e-6);
const r3=v=>Math.round((+v||0)*1000)/1000;
const curU=c=>c==='F'?tr('عملة أجنبية','foreign currency'):tr('د.ل','LYD');
const RG={W:['المنطقة الغربية','Western region'],E:['المنطقة الشرقية','Eastern region'],'':['دون منطقة','No region']};
const rgName=k=>tr(RG[k]?RG[k][0]:k,RG[k]?RG[k][1]:k);
const MONTHS=[['يناير','اي النار','كانون الثاني'],['فبراير','النوار','شباط'],['مارس','الربيع','اذار'],['ابريل','الطير','نيسان'],['مايو','الماء','ايار'],['يونيو','الصيف','حزيران'],
  ['يوليو','ناصر','تموز'],['اغسطس','هانيبال','اب'],['سبتمبر','الفاتح','ايلول'],['اكتوبر','التمور','تشرين الاول'],['نوفمبر','الحرث','تشرين الثاني'],['ديسمبر','الكانون','كانون الاول']];
const monthEnd=(y,m)=>new Date(Date.UTC(y,m,0)).toISOString().slice(0,10);
const mLabel=d=>d?mName(+d.slice(5,7)-1)+' '+d.slice(0,4):'—';

/* ---------- styles (on top of the .sm-* classes of sms055.js) ---------- */
(function(){const st=document.createElement('style');st.textContent=`
.db-page .sm-hero{--hero-a:#4a0d1d;--hero-b:#9b1c31;--hero-c:#6e1426}
.db-page .sm-root{--sm-c1:#9b1c31;--sm-c2:#2a78d6;--sm-c3:#1baf7a;--sm-c4:#8b9099}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]) .db-page .sm-root{--sm-c1:#e0566f;--sm-c2:#3987e5;--sm-c3:#199e70;--sm-c4:#80858d}}
:root[data-theme="dark"] .db-page .sm-root{--sm-c1:#e0566f;--sm-c2:#3987e5;--sm-c3:#199e70;--sm-c4:#80858d}
.db-flow{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;align-items:stretch}
.db-flow div{border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:var(--surface);display:grid;gap:2px;position:relative}
.db-flow div b{font-family:var(--f-display);font-size:19px;font-variant-numeric:tabular-nums}
.db-flow div span{font-size:12px;color:var(--muted)}
.db-flow div i{font-style:normal;font-size:12px;font-weight:700}
.db-flow .up i{color:var(--crit)}.db-flow .dn i{color:var(--ok)}
.db-flow .end{border-color:var(--sm-c1);box-shadow:inset 0 0 0 1px var(--sm-c1)}
.db-wc{display:grid;gap:8px}
.db-wc-row{display:grid;grid-template-columns:minmax(100px,30%) 1fr 64px;gap:10px;align-items:center;font-size:12.5px}
.db-wc-row .an-lbl{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.db-wc-bars{display:grid;gap:3px}.db-wc-bars .an-track{height:8px}
.db-wc-bars .an-fill.w{background:var(--sm-c1)}.db-wc-bars .an-fill.c{background:var(--sm-c3)}
.db-wc-row .cov{text-align:end;font-variant-numeric:tabular-nums;font-weight:600}.db-wc-row .cov.low{color:var(--crit)}
.db-tabs{display:flex;gap:4px;flex-wrap:wrap;margin:0 0 8px}
.db-tabs button{height:34px;padding:0 12px;border-radius:8px;border:1px solid var(--line);background:var(--surface);color:var(--ink);font:inherit;font-size:12.5px;cursor:pointer}
.db-tabs button[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--on-accent,#fff)}
.sm-tbl tr[data-db-acct]{cursor:pointer}
.sm-tbl th[data-db-sort]{cursor:pointer;white-space:nowrap}.sm-tbl th[data-db-sort][aria-sort]::after{content:" ▾";font-size:10px}.sm-tbl th[data-db-sort][aria-sort="ascending"]::after{content:" ▴"}
.sm-tbl td.up{color:var(--crit)}.sm-tbl td.dn{color:var(--ok)}
.db-tag{display:inline-block;font-size:11px;padding:1px 7px;border-radius:999px;border:1px solid var(--line);color:var(--muted);margin-inline-start:4px;white-space:nowrap}
.db-check{font-size:12.5px;margin:6px 0}.db-check b{font-variant-numeric:tabular-nums}
.db-sub{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12.5px;color:rgba(255,255,255,.85);margin-top:8px}.db-sub b{color:#fff;font-variant-numeric:tabular-nums}
@media (max-width:720px){.db-wc-row{grid-template-columns:minmax(80px,34%) 1fr 52px}}
@media print{.db-tabs{display:none}}
`;document.head.appendChild(st)})();

/* ---------- reading the ledger workbook (BPMC-FIN-TOC-F38) ---------- */
function cellDate(v){if(v&&typeof v==='object'&&'serial' in v)return serialIso(v.serial);if(typeof v==='number')return v>40000&&v<80000?serialIso(v):'';
  const s=AD(String(v||'')).trim();let x=s.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})/);if(x)return x[1]+'-'+x[2].padStart(2,'0')+'-'+x[3].padStart(2,'0');
  x=s.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})/);if(x){let a=+x[1],b=+x[2];const d=a>12?a:b,m=a>12?b:a;if(m<1||m>12||d<1||d>31)return '';return x[3]+'-'+String(m).padStart(2,'0')+'-'+String(d).padStart(2,'0')}return ''}
/* a ledger table header: two «الرصيد في» columns (opening, closing) and «المسحوبات»; the next row says مدين / دائن */
function ledgerHeader(row,sub){const h=row.map(H);const bal=[];h.forEach((x,i)=>{if(/^الرصيد( في| السابق| الافتتاحي| الحالي| الختامي)?$/.test(x)||/^الرصيد في/.test(x))bal.push(i)});
  const w=h.findIndex(x=>/^المسحوبات/.test(x));if(bal.length<2||w<0)return null;const s=(sub||[]).map(H);const f=re=>h.findIndex(x=>re.test(x));
  const m={name:f(/^(اسم الزبون|اسم العميل|البيان|الزبون|العميل|الجهه)/),acct:f(/^رقم (الحساب|العميل|الزبون)/),ob:bal[0],cb:bal[bal.length-1],w,da:f(/^التسويات المدينه/),c:f(/^التحصيلات/),ca:f(/^التسويات الدا[يئ]نه/)};
  if(m.name<0)m.name=0;const cred=(lo,hi)=>{for(let i=lo+1;i<hi;i++)if(/دا[يئ]ن/.test(s[i]||''))return i;return -1};
  m.oc=cred(m.ob,w);if(m.oc<0&&m.ob+1<w&&m.ob+1!==m.acct)m.oc=m.ob+1;
  m.cc=cred(m.cb,m.cb+4);if(m.cc<0){for(let i=m.cb+1;i<Math.min(row.length,m.cb+3);i++)if(txt(row[i])){m.cc=i;break}}
  const ds=[];row.forEach((v,i)=>{const d=cellDate(v);if(d)ds.push([i,d])});
  m.prev=(ds.find(([i])=>i>m.ob&&i<=m.ob+2)||[])[1]||'';m.asOf=(ds.find(([i])=>i>m.cb&&i<=m.cb+2)||[])[1]||'';
  m.sub=s.some(x=>/مدين|دا[يئ]ن/.test(x));return m}
const VALS=['ob','oc','w','da','c','ca','cb','cc'];
function rowVals(m,r){const g=i=>i!=null&&i>=0?num(r[i]):0;
  return {ob:g(m.ob),oc:Math.abs(g(m.oc)),w:g(m.w),da:g(m.da),c:Math.abs(g(m.c)),ca:Math.abs(g(m.ca)),cb:g(m.cb),cc:Math.abs(g(m.cc))}}
const isNum=x=>typeof x==='number'||(typeof x==='string'&&/^\(?-?[\d,.٠-٩]+\)?$/.test(AD(x).trim())&&/\d/.test(AD(x)));
function cleanSec(s){return String(s).replace(/["“”«»]/g,' ').replace(/^\s*(تابع\s+)?ديون\s+(حسابات\s+)?/,'').replace(/(بالعملة|العملة)\s+(المحلية|الأجنبية|الاجنبية)/g,'')
  .replace(/المنطقة\s+(الغربية|الشرقية)/g,'').replace(/\s+/g,' ').trim()||String(s).trim()}
/* summary rows → categories: a row whose name ends with غ / ش is a category of that region; a row that equals the sum of the
   rows before it is their sector subtotal; «إجمالي ديون …» is the stated grand total of the currency */
function groupify(rows){const cats=[],stated={};let P=[];
  const flush=()=>{P.forEach(p=>{p.g=p.g||p.n;cats.push(p)});P=[]};
  rows.forEach(x=>{const hx=H(x.n);
    if(/^اجمال/.test(hx)&&/ديون/.test(hx)){flush();stated[x.cur]=x;return}
    const m=x.n.match(/^(.*\S)\s+(غ|ش)$/);if(m){x.n=m[1].trim();x.rg=m[2]==='غ'?'W':'E';P.push(x);return}
    const sum=k=>P.reduce((s,p)=>s+p[k],0);
    if(P.length>1&&P.every(p=>p.cur===x.cur)&&near(sum('cb'),x.cb)&&near(sum('w'),x.w)&&near(sum('ob'),x.ob)){const g=/^اجمال/.test(hx)?P[0].n:x.n.trim();P.forEach(p=>p.g=g);flush();return}
    if(/^اجمال/.test(hx))return;
    x.rg='';P.push(x)});
  flush();return {cats,stated}}
function parseLedger(sheets,file){const custs=[],sums=[],dates=[];const seen=new Set();
  for(const sh of sheets){const g=sh.grid,sn=H(sh.name);const sheetRg=/الشرقيه/.test(sn)?'E':/الغربيه/.test(sn)?'W':'';
    let cur='L',sec='',rg=sheetRg,hdr=null;const srows=[];
    for(let i=0;i<g.length;i++){const r=g[i]||[];const filled=r.filter(x=>txt(x)!=='');if(!filled.length)continue;
      const h=ledgerHeader(r,g[i+1]);if(h){hdr=h;if(h.prev)dates.push(h.prev);if(h.asOf)dates.push(h.asOf);if(h.sub)i++;continue}
      const numeric=r.some((x,j)=>isNum(x)&&(!hdr||j!==hdr.acct));
      if(!numeric){const t=H(filled.map(txt).join(' '));if(/الاجنبيه/.test(t))cur='F';else if(/المحليه/.test(t))cur='L';
        if(/ليوم/.test(t))r.forEach(v=>{const d=cellDate(v);if(d)dates.push(d)});
        if(/ديون/.test(t)&&!/رقم الوثيقه/.test(t)){sec=cleanSec(filled.map(txt).join(' '));rg=/الشرقيه/.test(t)?'E':/الغربيه/.test(t)?'W':sheetRg;if(/الاجنبيه/.test(t))cur='F';else if(/المحليه/.test(t))cur='L'}
        continue}
      if(!hdr)continue;const name=txt(r[hdr.name]);if(!name||/مدين|دا[يئ]ن/.test(H(name)))continue;const v=rowVals(hdr,r);
      if(hdr.acct>=0){if(/^اجمال/.test(H(name)))continue;const a=txt(r[hdr.acct]);if(!a)continue;if(VALS.every(k=>!v[k]))continue;
        const key=a+'|'+cur+'|'+rg;if(seen.has(key))continue;seen.add(key);custs.push(Object.assign({a,n:name.replace(/\s+/g,' '),rg,sec,cur},v))}
      else srows.push(Object.assign({n:name.replace(/\s+/g,' ').trim(),cur},v))}
    if(srows.length)sums.push(Object.assign(groupify(srows),{sheet:sh.name}))}
  /* the summary sheet with the most region categories is the base; a sectors-only sheet gives the sector names */
  sums.sort((a,b)=>b.cats.filter(c=>c.rg).length-a.cats.filter(c=>c.rg).length||b.cats.length-a.cats.length);
  let cats=[],stated={},sheet='';if(sums.length){cats=sums[0].cats;stated=Object.assign({},...sums.slice().reverse().map(s=>s.stated));sheet=sums[0].sheet;
    const names=sums.slice(1).flatMap(s=>s.cats.filter(c=>c.g===c.n&&!c.rg));
    [...new Set(cats.map(c=>c.g))].forEach(gn=>{const gs=cats.filter(c=>c.g===gn);const cb=gs.reduce((s,c)=>s+c.cb,0),w=gs.reduce((s,c)=>s+c.w,0);
      const hit=names.find(x=>x.cur===gs[0].cur&&near(x.cb,cb)&&near(x.w,w));if(hit)gs.forEach(c=>c.g=hit.n.trim())})}
  else if(custs.length){const m=new Map();custs.forEach(c=>{const k=c.sec+'|'+c.rg+'|'+c.cur;let x=m.get(k);if(!x)m.set(k,x={n:c.sec||tr('حسابات أخرى','Other accounts'),g:c.sec||tr('حسابات أخرى','Other accounts'),rg:c.rg,cur:c.cur,ob:0,oc:0,w:0,da:0,c:0,ca:0,cb:0,cc:0});VALS.forEach(k2=>x[k2]+=c[k2])});cats=[...m.values()];sheet=tr('أوراق المناطق','region sheets')}
  if(!cats.length&&!custs.length)return null;
  dates.sort();let asOf=dates[dates.length-1]||'',prev=dates.length>1?dates[0]:'';
  if(!asOf){const x=AD(file||'').match(/(?:^|\D)(\d{1,2})\s*[-_.\/ ]\s*(20\d\d)(?:\D|$)/);if(x)asOf=monthEnd(+x[2],+x[1])}
  if(!asOf)throw new Error(tr('لم نجد تاريخ الأرصدة («كما هي في دفاترنا الرئيسية ليوم …») في الملف، ولا شهرًا في اسمه.','The balance date («as in our books on …») was not found in the file, nor a month in its name.'));
  if(!prev||prev>=asOf)prev=new Date(Date.UTC(+asOf.slice(0,4),+asOf.slice(5,7)-1,0)).toISOString().slice(0,10);
  const rnd=o=>{VALS.forEach(k=>o[k]=r3(o[k]));return o};
  return {T:'ledger',asOf,prev,sheet,cats:cats.map(c=>rnd({n:c.n,g:c.g,rg:c.rg||'',cur:c.cur,ob:c.ob,oc:c.oc,w:c.w,da:c.da,c:c.c,ca:c.ca,cb:c.cb,cc:c.cc})),
    custs:custs.map(c=>rnd(c)),stated:Object.fromEntries(Object.entries(stated).map(([k,v])=>[k,rnd(Object.fromEntries(VALS.map(x=>[x,v[x]])))]))}}

/* ---------- a flat table: one row per account or category (Power BI CSV, this page's own export) ---------- */
const FLAT=[['n',['اسم الزبون','الزبون','اسم العميل','العميل','البيان','الفئه','customer','name','account name']],['a',['رقم الحساب','رقم العميل','رقم الزبون','account','account no','account_no']],
  ['rg',['المنطقه','region']],['g',['القطاع','المجموعه','sector','group']],['sec',['القسم','التصنيف','section']],['cur',['العمله','currency']],['asOf',['كما في','تاريخ الرصيد','as of','date']],
  ['ob',['الرصيد السابق','الرصيد الافتتاحي مدين','الرصيد الافتتاحي','opening debit','opening']],['oc',['الرصيد الافتتاحي دائن','opening credit']],['w',['المسحوبات','withdrawals']],['da',['التسويات المدينه','debit adjustments']],
  ['c',['التحصيلات','collections']],['ca',['التسويات الدائنه','credit adjustments']],['cb',['الرصيد الحالي','الرصيد الختامي مدين','الرصيد الختامي','رصيد الاقفال','closing debit','closing','balance']],['cc',['الرصيد الختامي دائن','closing credit']]];
function parseFlat(sheets,file){for(const sh of sheets){const g=sh.grid;
  for(let i=0;i<Math.min(g.length,20);i++){const h=(g[i]||[]).map(H);const m={};FLAT.forEach(([k,al])=>{const ix=h.findIndex(x=>al.map(hn).includes(x));if(ix>=0)m[k]=ix});
    if(m.n==null||m.cb==null||(m.w==null&&m.c==null))continue;
    const rows=[];let asOf='';g.slice(i+1).forEach(r=>{const n=txt(r[m.n]);if(!n||/^اجمال/.test(H(n)))return;const o={n};
      ['a','g','sec'].forEach(k=>o[k]=m[k]!=null?txt(r[m[k]]):'');const rgv=H(m.rg!=null?r[m.rg]:'');o.rg=/شرق|^e/.test(rgv)?'E':/غرب|^w/.test(rgv)?'W':'';
      const cv=H(m.cur!=null?r[m.cur]:'');o.cur=/اجنب|^f|usd|\$/.test(cv)?'F':'L';VALS.forEach(k=>o[k]=m[k]!=null?Math.abs(num(r[m[k]]))*(k==='ob'||k==='cb'||k==='w'||k==='da'?Math.sign(num(r[m[k]]))||1:1):0);
      if(m.asOf!=null){const d=cellDate(r[m.asOf]);if(d&&d>asOf)asOf=d}rows.push(o)});
    if(!rows.length)continue;const withA=rows.some(r=>r.a);
    if(!asOf){const x=AD(file||'').match(/(?:^|\D)(\d{1,2})\s*[-_.\/ ]\s*(20\d\d)(?:\D|$)/)||AD(file||'').match(/(20\d\d)-(\d{2})-(\d{2})/);if(x)asOf=x[0].length>8&&/^20/.test(x[1])?x[1]+'-'+x[2]+'-'+x[3]:monthEnd(+x[2],+x[1])}
    if(!asOf)throw new Error(tr('أضف عمود «كما في» (تاريخ الرصيد) أو اكتب الشهر في اسم الملف، مثل «مديونية 8-2026».','Add an «as of» column (balance date) or put the month in the file name, e.g. «debts 8-2026».'));
    const custs=withA?rows.map(r=>({a:r.a||r.n,n:r.n,rg:r.rg,sec:r.sec||r.g,cur:r.cur,...Object.fromEntries(VALS.map(k=>[k,r3(r[k])]))})):[];
    let cats;if(withA){const mm=new Map();custs.forEach(c=>{const k=(c.sec||'')+'|'+c.rg+'|'+c.cur;let x=mm.get(k);if(!x)mm.set(k,x={n:c.sec||tr('حسابات أخرى','Other accounts'),g:c.sec||tr('حسابات أخرى','Other accounts'),rg:c.rg,cur:c.cur,ob:0,oc:0,w:0,da:0,c:0,ca:0,cb:0,cc:0});VALS.forEach(k2=>x[k2]+=c[k2])});cats=[...mm.values()]}
    else cats=rows.map(r=>({n:r.n,g:r.g||r.n,rg:r.rg,cur:r.cur,...Object.fromEntries(VALS.map(k=>[k,r3(r[k])]))}));
    const pv=new Date(Date.UTC(+asOf.slice(0,4),+asOf.slice(5,7)-1,0)).toISOString().slice(0,10);
    return {T:'ledger',asOf,prev:pv,sheet:sh.name,cats,custs,stated:{}}}}
  return null}

/* ---------- reading the fuel value report (BPMC-FIN-ACC-F01) ---------- */
const FUEL={p:/^(نوع المنتوج|نوع المنتج|المنتج|المنتوج)$/,g:/^(اسم الزبون|الزبون|الجهه)$/,t:/بالطن/,l:/باللتر/,k:/بالعدد/,cv:/المبيعات النقديه/,kv:/المبيعات الاجله/,tv:/^اجمالي قيمه المبيعات/,
  sb:/^حصه البريقه/,snc:/^حصه الم[ؤو]سسه\s*النقديه/,snf:/^حصه الم[ؤو]سسه\s*الجهات/,sr:/^حصه النهر/,tc:/^مصروفات النقل/};
function fuelMonth(s){const t=H(s);const x=t.match(/شهر\s+(.+?)\s+(?:لسنه|لعام|سنه|عام)\s+(\d{4})/);if(x){const mn=x[1].trim();const i=MONTHS.findIndex(a=>a.map(hn).includes(hn(mn)));if(i>=0)return monthEnd(+x[2],i+1);const k=+AD(mn);if(k>=1&&k<=12)return monthEnd(+x[2],k)}return ''}
function parseFuel(sheets,file){const rows=[];let month='',stated=null;
  for(const sh of sheets){const g=sh.grid;let m=null,fund='N',prod='';
    for(let i=0;i<g.length;i++){const r=g[i]||[];const h=r.map(H);
      if(h.some(x=>FUEL.p.test(x))&&h.some(x=>FUEL.tv.test(x))){m={};for(const k in FUEL){const ix=h.findIndex(x=>FUEL[k].test(x));if(ix>=0)m[k]=ix}prod='';
        for(let j=i-1;j>=Math.max(0,i-3);j--){const t=H((g[j]||[]).map(txt).join(' '));if(/غير مموله|الغير مموله/.test(t)){fund='N';break}if(/مموله/.test(t)){fund='F';break}}
        for(let j=i-1;j>=Math.max(0,i-3);j--){const d=fuelMonth((g[j]||[]).map(txt).join(' '));if(d){month=month||d;break}}continue}
      if(!m)continue;const pv=txt(r[m.p]);if(pv)prod=pv.replace(/\s+/g,' ');const gn=txt(r[m.g]);
      if(/^الاجمالي العام/.test(H(pv))&&m.tv!=null){stated=num(r[m.tv]);continue}
      if(!gn||/^(المجموع|الاجمالي)/.test(H(pv)))continue;
      const v=k=>m[k]!=null?num(r[m[k]]):0;const o={p:prod.replace(/\d+\s*$/,s=>' '+s.trim()).replace(/\s+/g,' ').trim(),g:gn.replace(/\s+/g,' '),f:fund,t:r3(v('t')),l:r3(v('l')),k:r3(v('k')),cv:r3(v('cv')),kv:r3(v('kv')),tv:r3(v('tv')),sb:r3(v('sb')),sn:r3(v('snc')+v('snf')),sr:r3(v('sr')),tc:r3(v('tc'))};
      if(!o.tv&&!o.cv&&!o.kv&&!o.l&&!o.t)continue;rows.push(o)}}
  if(!rows.length)return null;
  if(!month){const x=AD(file||'').match(/(?:^|\D)(\d{1,2})\s*[-_.\/ ]\s*(20\d\d)(?:\D|$)/);if(x)month=monthEnd(+x[2],+x[1])}
  if(!month)throw new Error(tr('لم نجد الشهر في عنوان التقرير («عن شهر … لسنة …») ولا في اسم الملف.','The month was not found in the report title («for the month of … year …») nor in the file name.'));
  return {T:'fuel',asOf:month,rows,stated}}

async function parseFile(file){const sheets=await readGrids(file);const out=[];
  const fu=parseFuel(sheets,file.name);const lg=parseLedger(sheets,file.name)||(fu?null:parseFlat(sheets,file.name));
  if(lg)out.push(lg);if(fu)out.push(fu);
  if(!out.length)throw new Error(tr('لم نتعرّف على الملف. المطلوب كشف «أرصدة حسابات المدينون والدائنون التجاريون» (الرصيد في، المسحوبات، التحصيلات، الرصيد في) أو «بيان بقيمة المحروقات» (نوع المنتوج، اسم الزبون، إجمالي قيمة المبيعات)، أو جدول بحسابات الزبائن فيه عمود الرصيد الحالي.',
    'The file was not recognised. Expected the «trade debtors and creditors balances» statement (opening balance, withdrawals, collections, closing balance), the «fuel value statement» (product, customer, total sales value), or a table of customer accounts with a closing balance column.'));
  out.forEach(p=>p.file=file.name);return out}

/* ---------- storage ---------- */
const ST={loaded:false,loading:null,err:'',batches:[],snaps:[],local:null,pending:null,canImport:false};
async function load(force){if(ST.loading&&!force)return ST.loading;
  ST.loading=(async()=>{const FS=window.__fs&&window.__fs();if(!FS){ST.loaded=true;return}
    try{const q=await FS.collection(COL).get();const docs=[];q.forEach(d=>docs.push(Object.assign({id:d.id},d.data())));
      const parts={};docs.filter(d=>d.kind==='part').forEach(p=>{(parts[p.batch]=parts[p.batch]||[]).push(p)});
      const batches=docs.filter(d=>d.kind==='batch').sort((a,b)=>(a.to||'').localeCompare(b.to||''));const snaps=[];
      batches.forEach(b=>{const ps=(parts[b.id]||[]).sort((x,y)=>x.n-y.n);b.ok=ps.length===b.parts;if(!b.ok)return;try{const o=JSON.parse(ps.map(p=>p.d).join(''));o.b=b.id;o.file=b.file;snaps.push(o)}catch(e){b.ok=false}});
      ST.batches=batches;ST.snaps=snaps;ST.err=''}
    catch(e){ST.err=e&&e.code==='permission-denied'?'denied':(e&&e.message)||'error';ST.batches=[];ST.snaps=[]}
    ST.loaded=true;
    try{const u=await recMyUnit();const m=me();ST.canImport=m.role==='admin'||(!!S.canWrite&&m.role!=='viewer'&&(u===UNIT||u==='gm'))}catch(e){ST.canImport=false}
  })();return ST.loading}
const overlaps=P=>ST.batches.filter(b=>b.sheet===P.T&&b.to===P.asOf);
const pValue=P=>P.T==='ledger'?P.cats.filter(c=>c.cur==='L').reduce((s,c)=>s+c.cb,0):P.rows.reduce((s,r)=>s+r.tv,0);
const pReturns=P=>P.T==='ledger'?P.cats.filter(c=>c.cur==='L').reduce((s,c)=>s+c.c+c.ca,0):P.rows.reduce((s,r)=>s+r.kv,0);
async function saveOne(P,replace){const FS=window.__fs(),m=me();const bid='b'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
  const body=Object.assign({},P);delete body.file;const s=JSON.stringify(body);const chunks=[];for(let i=0;i<s.length;i+=CHUNK)chunks.push(s.slice(i,i+CHUNK));
  for(let i=0;i<chunks.length;i+=4){const b=FS.batch();chunks.slice(i,i+4).forEach((d,j)=>b.set(FS.collection(COL).doc(bid+'_p'+(i+j)),{kind:'part',batch:bid,n:i+j,d,createdBy:m.email}));await b.commit()}
  const old=replace?overlaps(P):[];
  await FS.collection(COL).doc(bid).set({kind:'batch',file:String(P.file||'').slice(0,200),sheet:P.T,from:P.asOf.slice(0,8)+'01',to:P.asOf,rows:P.T==='ledger'?P.cats.length+P.custs.length:P.rows.length,parts:chunks.length,
    value:Math.round(pValue(P)*100)/100,returns:Math.round(pReturns(P)*100)/100,createdBy:m.email,by:String(m.name||m.email||'').slice(0,120),at:new Date().toISOString()});
  for(const o of old)await delBatch(o,true);
  try{await FS.collection('log').add({at:firebase.firestore.FieldValue.serverTimestamp(),ts:new Date().toISOString(),user:m.email,name:m.name||'',action:'استيراد '+(P.T==='ledger'?'كشف الديون':'بيان قيمة المحروقات'),col:COL,id:bid,summary:`${P.file} · ${P.asOf}`+(old.length?` · استُبدل ${old.length} ملف`:'')})}catch(e){}
  return bid}
async function delBatch(b,quiet){const FS=window.__fs();const ops=[];for(let i=0;i<(b.parts||0);i++)ops.push(FS.collection(COL).doc(b.id+'_p'+i));
  for(let i=0;i<ops.length;i+=400){const bt=FS.batch();ops.slice(i,i+400).forEach(r=>bt.delete(r));await bt.commit()}
  await FS.collection(COL).doc(b.id).delete();
  if(!quiet){const m=me();try{await FS.collection('log').add({at:firebase.firestore.FieldValue.serverTimestamp(),ts:new Date().toISOString(),user:m.email,name:m.name||'',action:'حذف ملف الديون',col:COL,id:b.id,summary:`${b.file||''} · ${b.to}`})}catch(e){}}}

/* ---------- analysis ---------- */
function UI(){return S.ui.debts||(S.ui.debts={at:'',cur:'L',rg:'',grp:'',q:'',sec:'',sort:'cb',dir:'desc',lim:25,tab:'cust'})}
function snaps(){return ST.local?ST.local:ST.snaps}
const ledgers=()=>snaps().filter(s=>s.T==='ledger').sort((a,b)=>a.asOf.localeCompare(b.asOf));
const fuels=()=>snaps().filter(s=>s.T==='fuel').sort((a,b)=>a.asOf.localeCompare(b.asOf));
function sumOf(list){const o={n:list.length,ob:0,oc:0,w:0,da:0,c:0,ca:0,cb:0,cc:0};list.forEach(x=>VALS.forEach(k=>o[k]+=x[k]||0));o.out=o.w+o.da;o.in=o.c+o.ca;o.net=o.cb-o.cc;o.chg=o.cb-o.ob;return o}
function catsOf(L1){const u=UI();return L1.cats.filter(c=>c.cur===u.cur&&(!u.rg||c.rg===u.rg)&&(!u.grp||c.g===u.grp))}
function custsOf(L1){const u=UI();return L1.custs.filter(c=>c.cur===u.cur&&(!u.rg||c.rg===u.rg))}
function groupsOf(cats){const m=new Map();cats.forEach(c=>{let x=m.get(c.g);if(!x)m.set(c.g,x={l:c.g,list:[]});x.list.push(c)});return [...m.values()].map(x=>Object.assign(x,sumOf(x.list))).sort((a,b)=>b.cb-a.cb)}
const isFunded=g=>/مموله/.test(hn(g));
const dormant=c=>c.cb>0&&!c.w&&!c.da&&!c.c&&!c.ca;
const keyCat=c=>c.n+'|'+c.g+'|'+c.rg+'|'+c.cur,keyCust=c=>c.a+'|'+c.cur+'|'+c.rg;
const mIdx=d=>+d.slice(0,4)*12+ +d.slice(5,7);
/* Estimated aging. The statements carry no invoice dates, so the balance is aged first-in-first-out from the monthly
   withdrawals: what was drawn this month is 0–30 days old, last month 31–60, and so on; collections settle the oldest
   debt first. Up to six consecutive monthly statements are used; whatever the history does not explain is «older than»
   the months covered. With one statement the split is 0–30 days / older than 30 days. */
function agingOf(LS,Lc,list,kind){const key=kind==='custs'?keyCust:keyCat;const chain=[Lc];
  for(let i=LS.indexOf(Lc)-1;i>=0&&chain.length<6;i--){if(mIdx(chain[chain.length-1].asOf)-mIdx(LS[i].asOf)!==1)break;chain.push(LS[i])}
  const maps=chain.map(l=>new Map(l[kind].map(x=>[key(x),x])));const k=chain.length,M=new Array(k).fill(0);let rest=0;const per=new Map();
  list.forEach(x=>{let r=Math.max(0,x.cb);const v=maps.map(m=>{const y=m.get(key(x));const o=y?Math.max(0,y.w+y.da):0;const t=Math.min(r,o);r-=t;return t});
    v.forEach((t,j)=>M[j]+=t);rest+=r;let oldest=-1;v.forEach((t,j)=>{if(t>0)oldest=j});per.set(key(x),{v,rest:r,old:Math.max(0,x.cb)-v[0],age:r>0?30*k:oldest*30})});
  const B=[{l:tr('0–30 يومًا','0–30 days'),v:M[0]}];if(k>1)B.push({l:tr('31–60 يومًا','31–60 days'),v:M[1]});if(k>2)B.push({l:tr('61–90 يومًا','61–90 days'),v:M[2]});
  if(k>3)B.push({l:k>=6?tr('91–180 يومًا','91–180 days'):tr(`91–${30*k} يومًا`,`91–${30*k} days`),v:M.slice(3).reduce((a,b)=>a+b,0)});
  B.push({l:tr(`أكثر من ${30*k} يومًا`,`over ${30*k} days`),v:rest,old:true});
  const tot=B.reduce((a,b)=>a+b.v,0);return {k,B,tot,over30:tot-M[0],over90:k>=3?rest+M.slice(3).reduce((a,b)=>a+b,0):null,per,from:chain[chain.length-1].asOf}}
/* the follow-up step suggested for an estimated age (the company's reminder ladder); government and state-funded
   customers are followed by official letters and visits, old accounts by a settlement or legal review */
function nextStep(age,c){const s=hn((c.sec||'')+' '+(c.g||''));
  if(/قديم|موقوف|بدون حركه/.test(s))return tr('مراجعة الحساب القديم: تسوية أو إحالة للشؤون القانونية','Review the old account: settle it or refer it to legal');
  const gov=/القطاع العام|حكومي|مموله|الجيش|وزاره|المجلس|مستشفي|الامن|الصحه/.test(s+' '+hn(c.n||''));
  if(age>=90)return gov?tr('مراسلة رسمية للجهة وتصعيد للإدارة العامة','Official letter to the entity and escalation to the General Administration'):tr('إنذار نهائي وإحالة لملف قانوني','Final notice and referral to a legal file');
  if(age>=60)return gov?tr('مراسلة رسمية وزيارة متابعة','Official letter and a follow-up visit'):tr('إنذار نهائي وتصعيد للإدارة','Final notice and escalation to management');
  if(age>=30)return gov?tr('مراسلة رسمية مع كشف الحساب','Official letter with the statement'):tr('خطاب رسمي من مدير المالية وإيقاف البيع الآجل','Formal letter from the finance manager and a credit hold');
  return tr('تذكير ودّي مع كشف الحساب','Friendly reminder with the statement')}

/* ---------- page ---------- */
I.debts='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="12" height="17" rx="2"/><path d="M7.5 8h5M7.5 11.5h5M7.5 15h3"/><circle cx="17.5" cy="16.5" r="4" fill="var(--surface,#fff)"/><path d="M15.8 16.5h3.4"/></svg>';
function heroHtml(sub,v,vlabel,delta,extra){return `<div class="sm-hero"><div><span class="sm-eyebrow">${esc(tr(DEPT[0],DEPT[1]))}</span>
  <h2>${esc(tr('لوحة مؤشرات الديون','Debts dashboard'))}</h2><p>${sub}</p>${extra||''}</div>${v==null?'':`<div class="sm-hero-v"><b>${v}</b><span>${esc(vlabel)}</span>${delta||''}</div>`}</div>`}
function toolbar(){const has=snaps().length;return `<div class="toolbar sm-acts">
  ${ST.canImport||!ST.snaps.length||ST.err?`<button class="btn primary" data-dbt="import">${I.up}${esc(tr('استيراد ملف Excel','Import Excel file'))}</button>`:''}
  ${has?`<button class="btn" data-dbt="export">${I.down}${esc(tr('تصدير التحليل Excel','Export analysis (Excel)'))}</button><button class="btn" data-dbt="print">${esc(tr('طباعة / PDF','Print / PDF'))}</button>`:''}
  ${ST.batches.length?`<button class="btn ghost" data-dbt="files">${esc(tr('الملفات المستوردة','Imported files'))} <span class="num">${ST.batches.length}</span></button>`:''}
  ${ST.local?`<button class="btn ghost" data-dbt="drop-local">${esc(tr('إغلاق العرض المؤقت','Close temporary view'))}</button>`:''}
  <input type="file" id="db-file" accept=".xlsx,.csv,.htm,.html" hidden></div>`}
function emptyView(head){const denied=ST.err==='denied';
  return `<div class="db-page">`+head+heroHtml(esc(tr('حوّل كشف أرصدة حسابات المدينين (المديونية الشهرية) إلى مؤشرات: إجمالي الديون وتغيّرها، المسحوبات والتحصيلات ونسبة التغطية، التوزيع على القطاعات والمناطق، أكبر المدينين والحسابات الراكدة، مع قراءة تحليلية مكتوبة.','Turn the monthly debtors balances statement into KPIs: total debt and its change, withdrawals, collections and coverage, sectors and regions, the largest debtors and dormant accounts, with a written reading.')),null)+
  `<div class="panel sm-empty">${I.debts.replace('<svg','<svg style="width:46px;height:46px;color:var(--accent)"')}<h3>${esc(denied?tr('هذه اللوحة لإدارة الشؤون التجارية والتحصيلات','This dashboard belongs to Commercial Affairs & Collections'):tr('لم يُستورد أي ملف بعد','No file imported yet'))}</h3>
   <p>${esc(denied?tr('لا تملك صلاحية الاطلاع على البيانات المحفوظة. يمكنك استيراد ملف وتحليله مؤقتًا على جهازك دون حفظه.','You cannot view the saved data. You can still import a file and analyse it on this device without saving it.'):tr('استورد ملف «مديونية كاملة» الشهري كما هو (الخلاصة العامة، ملخص المحلية والأجنبية، المنطقة الغربية، المنطقة الشرقية)، ويمكن أيضًا استيراد «بيان قيمة المحروقات» للشهر نفسه لمطابقة المسحوبات. يتعرّف الاستيراد على الأوراق والأعمدة تلقائيًا.','Import the monthly full debts workbook as it is (general summary, local and foreign summary, western and eastern region sheets). The fuel value statement of the same month can be imported too, to check the withdrawals. Sheets and columns are recognised automatically.'))}</p>
   <button class="btn primary" data-dbt="import">${I.up}${esc(tr('استيراد ملف Excel','Import Excel file'))}</button></div></div>`}

function view(){
  if(!ST.loaded){load().then(()=>{if(S.view===ID)render()});return `<div class="db-page">`+heroHtml(esc(tr('جارٍ تحميل البيانات…','Loading data…')),null)+'<div class="panel muted">'+esc(tr('جارٍ التحميل…','Loading…'))+'</div></div>'}
  const head=`<div class="page-head" style="margin-bottom:8px"><div><h2 style="margin:0">${esc(tr('مخرجات مديونية الزبائن','Customer debts outputs'))}</h2></div>${toolbar()}</div>`;
  const LS=ledgers(),FU=fuels();if(!LS.length&&!FU.length)return emptyView(head);
  const banner=ST.local?`<div class="banner info">${esc(tr(`عرض مؤقت للملف «${ST.local[0].file}» على هذا الجهاز فقط، ولم يُحفظ في المنظومة.`,`Temporary view of “${ST.local[0].file}” on this device only; not saved.`))}</div>`:'';
  if(!LS.length)return `<div class="db-page">`+head+banner+fuelOnly(FU)+`</div>`;
  const u=UI();if(!LS.some(l=>l.asOf===u.at))u.at=LS[LS.length-1].asOf;
  const Lc=LS.find(l=>l.asOf===u.at),Li=LS.indexOf(Lc),Lp=Li>0?LS[Li-1]:null;
  if(!Lc.cats.some(c=>c.cur===u.cur))u.cur=Lc.cats.some(c=>c.cur==='L')?'L':'F';
  const U=curU(u.cur),cats=catsOf(Lc),A=sumOf(cats),G=groupsOf(cats),custs=custsOf(Lc),Ca=sumOf(custs),tabCat=!custs.length||u.tab==='cat';
  const allCur=sumOf(Lc.cats.filter(c=>c.cur===u.cur));
  const months=A.out>0?A.cb/A.out:null,cov=A.out?A.in*100/A.out:null,eff=(A.ob+A.out)?A.in*100/(A.ob+A.out):0;
  const mDays=+Lc.asOf.slice(8,10)||30,dso=A.out>0?A.cb/A.out*mDays:null;const AG=agingOf(LS,Lc,cats,'cats');
  const AGc=custs.length?agingOf(LS,Lc,custs,'custs'):null;
  const prio=AGc?custs.map(c=>{const a=AGc.per.get(keyCust(c));return Object.assign({},c,{old:a.old,age:a.age,score:a.old*(1+a.age/90)*(dormant(c)?1.5:1)})}).filter(c=>c.old>0).sort((a,b)=>b.score-a.score):[];
  const P=Lp?sumOf(catsOf(Lp)):null;
  const dChg=A.ob?A.chg*100/Math.abs(A.ob):null;
  const deltaHtml=dChg==null?'':`<span class="sm-delta">${dChg>=0?'▲':'▼'} ${Math.abs(Math.round(dChg*100)/100)}% ${esc(tr('عن رصيد '+fdi(Lc.prev),'vs '+fdi(Lc.prev)))}</span>`;
  const funded=G.filter(g=>isFunded(g.l)).reduce((s,g)=>s+g.cb,0);
  const dorm=custs.filter(dormant).sort((a,b)=>b.cb-a.cb),dormV=dorm.reduce((s,c)=>s+c.cb,0);
  const rgs=['W','E',''].map(k=>({k,...sumOf(cats.filter(c=>c.rg===k))})).filter(x=>x.n);
  const filtered=u.rg||u.grp||u.cur!=='L';
  const sub=esc(tr(`الأرصدة كما في ${fdi(Lc.asOf)} (${mLabel(Lc.asOf)}) · ${G.length} قطاع · ${cats.length} فئة · ${custs.length} حساب زبون تفصيلي · الملف: ${Lc.file||'—'}`,`Balances as of ${fdi(Lc.asOf)} (${mLabel(Lc.asOf)}) · ${G.length} sectors · ${cats.length} categories · ${custs.length} detailed customer accounts · file: ${Lc.file||'—'}`));
  const heroExtra=`<div class="db-sub"><span>${esc(tr('صافي المديونية','Net debt'))} <b>${big(A.net)}</b></span><span>${esc(tr('المسحوبات','Withdrawals'))} <b>${big(A.out)}</b></span><span>${esc(tr('التحصيلات','Collections'))} <b>${big(A.in)}</b></span>${u.cur==='L'&&Lc.cats.some(c=>c.cur==='F')?`<span>${esc(tr('ديون بالعملة الأجنبية','Foreign-currency debt'))} <b>${big(sumOf(Lc.cats.filter(c=>c.cur==='F')).cb)}</b></span>`:''}</div>`;

  /* written reading */
  const ins=[];const sh=g=>pct(g.cb,A.cb);
  ins.push([A.chg>0?'w':'o',A.chg>0?'▲':'▼',tr(`إجمالي الديون المدينة <b>${big(A.cb)}</b> ${U} في ${fdi(Lc.asOf)}، ${A.chg>=0?'بزيادة':'بانخفاض'} <b>${big(Math.abs(A.chg))}</b> (${Math.abs(Math.round((dChg||0)*100)/100)}%) عن رصيد ${fdi(Lc.prev)}: مسحوبات وتسويات مدينة <b>${big(A.out)}</b> مقابل تحصيلات وتسويات دائنة <b>${big(A.in)}</b>.`,
    `Total debtor balances <b>${big(A.cb)}</b> ${U} on ${fdi(Lc.asOf)}, ${A.chg>=0?'up':'down'} <b>${big(Math.abs(A.chg))}</b> (${Math.abs(Math.round((dChg||0)*100)/100)}%) on ${fdi(Lc.prev)}: withdrawals and debit adjustments <b>${big(A.out)}</b> against collections and credit adjustments <b>${big(A.in)}</b>.`)]);
  if(cov!=null)ins.push([cov<80?'c':cov<100?'w':'o','%',tr(`التحصيلات غطّت <b>${Math.round(cov*10)/10}%</b>${cov<100?' فقط':''} من مسحوبات الشهر${cov<100?'، أي أن الدين يتراكم':''}. ونسبة ما حُصّل من إجمالي المستحق (الرصيد الافتتاحي + المسحوبات) <b>${Math.round(eff*100)/100}%</b>.`,
    `Collections covered <b>${Math.round(cov*10)/10}%</b> of the month's withdrawals${cov<100?', so debt is building up':''}. Collected share of everything due (opening balance + withdrawals): <b>${Math.round(eff*100)/100}%</b>.`)]);
  if(G.length>1)ins.push([sh(G[0])>=60?'w':'','1',tr(`أكبر قطاع مدين: <b>${esc(G[0].l)}</b> بنسبة <b>${sh(G[0])}%</b> من الديون (${big(G[0].cb)})${G[1]?`، يليه <b>${esc(G[1].l)}</b> (${sh(G[1])}%)`:''}.`,`Largest debtor sector: <b>${esc(G[0].l)}</b>, <b>${sh(G[0])}%</b> of the debt (${big(G[0].cb)})${G[1]?`, then <b>${esc(G[1].l)}</b> (${sh(G[1])}%)`:''}.`)]);
  if(funded&&u.cur==='L'&&!u.grp)ins.push(['w','$',tr(`ديون الجهات الممولة من وزارة المالية <b>${big(funded)}</b> تمثل <b>${pct(funded,A.cb)}%</b> من الإجمالي؛ تحصيلها مرتبط بالتسويات مع وزارة المالية والمؤسسة الوطنية للنفط.`,`Debt of entities funded by the Ministry of Finance, <b>${big(funded)}</b>, is <b>${pct(funded,A.cb)}%</b> of the total; collecting it depends on settlements with the Ministry of Finance and the NOC.`)]);
  const noCol=G.filter(g=>g.out>0&&g.in<g.out*0.05);if(noCol.length)ins.push(['c','!',tr(`قطاعات سحبت هذا الشهر دون تحصيل يُذكر (أقل من 5% من مسحوباتها): <b>${noCol.slice(0,4).map(g=>esc(g.l)).join('، ')}</b>.`,`Sectors that drew this month with almost no collection (under 5% of their withdrawals): <b>${noCol.slice(0,4).map(g=>esc(g.l)).join(', ')}</b>.`)]);
  const goodCol=G.filter(g=>g.out>0&&g.in>=g.out*0.9);if(goodCol.length)ins.push(['o','✓',tr(`قطاعات غطّت تحصيلاتها 90% أو أكثر من مسحوباتها: <b>${goodCol.slice(0,4).map(g=>esc(g.l)).join('، ')}</b>.`,`Sectors whose collections covered 90% or more of their withdrawals: <b>${goodCol.slice(0,4).map(g=>esc(g.l)).join(', ')}</b>.`)]);
  if(dso!=null&&isFinite(dso))ins.push([dso>90?'w':'','⏱',tr(`متوسط فترة التحصيل (DSO) <b>${fn(Math.round(dso))}</b> يومًا = الرصيد المدين ÷ مسحوبات الشهر × ${mDays} يومًا، أي أن الرصيد يعادل نحو ${Math.round(months)} شهرًا من المسحوبات.`,`Days sales outstanding (DSO) <b>${fn(Math.round(dso))}</b> days = debtor balance ÷ the month's withdrawals × ${mDays} days, i.e. about ${Math.round(months)} months of withdrawals.`)]);
  if(AG.tot)ins.push([pct(AG.over30,AG.tot)>50?'w':'','◷',tr(`أعمار تقديرية (الوارد أولًا يُسدَّد أولًا، من ${AG.k} كشف شهري): <b>${pct(AG.B[0].v,AG.tot)}%</b> من الرصيد عمره 30 يومًا أو أقل، و<b>${pct(AG.over30,AG.tot)}%</b> أقدم من 30 يومًا${AG.over90!=null?`، و<b>${pct(AG.over90,AG.tot)}%</b> أقدم من 90 يومًا`:''}.${AG.k<3?' استورد كشوف الأشهر السابقة لتظهر شرائح 31–60 و61–90 وما بعدها.':''}`,`Estimated aging (first in, first out, from ${AG.k} monthly statement${AG.k>1?'s':''}): <b>${pct(AG.B[0].v,AG.tot)}%</b> of the balance is 30 days old or less, <b>${pct(AG.over30,AG.tot)}%</b> is older than 30 days${AG.over90!=null?`, <b>${pct(AG.over90,AG.tot)}%</b> older than 90 days`:''}.${AG.k<3?' Import the previous months to see the 31–60, 61–90 and older buckets.':''}`)]);
  if(rgs.length>1)ins.push(['','⇄',tr(`التوزيع على المناطق: ${rgs.map(x=>`${esc(rgName(x.k))} <b>${pct(x.cb,A.cb)}%</b>`).join('، ')}.`,`By region: ${rgs.map(x=>`${esc(rgName(x.k))} <b>${pct(x.cb,A.cb)}%</b>`).join(', ')}.`)]);
  if(custs.length){const t10=custs.slice().sort((a,b)=>b.cb-a.cb).slice(0,10),s10=t10.reduce((s,c)=>s+c.cb,0);ins.push(['','10',tr(`في أوراق المناطق (${custs.length} حسابًا بإجمالي ${big(Ca.cb)}) أعلى 10 حسابات تمثل <b>${pct(s10,Ca.cb)}%</b>، أكبرها <b>${esc(t10[0].n)}</b> (${big(t10[0].cb)}).`,`In the region sheets (${custs.length} accounts, ${big(Ca.cb)} in total) the top 10 accounts are <b>${pct(s10,Ca.cb)}%</b>; the largest is <b>${esc(t10[0].n)}</b> (${big(t10[0].cb)}).`)])}
  if(dorm.length)ins.push(['w','⏸',tr(`<b>${dorm.length}</b> حسابًا عليها رصيد مدين دون أي حركة هذا الشهر (لا سحب ولا تحصيل) بإجمالي <b>${big(dormV)}</b>؛ مرشّحة للمطالبة أو المراجعة.`,`<b>${dorm.length}</b> accounts carry a debit balance with no movement at all this month (no withdrawal, no collection), <b>${big(dormV)}</b> in total; candidates for a claim or a review.`)]);
  if(A.cc>0)ins.push(['','↺',tr(`أرصدة دائنة (دفعات مقدّمة أو زيادات سداد) <b>${big(A.cc)}</b>؛ صافي المديونية بعد خصمها <b>${big(A.net)}</b>.`,`Credit balances (advance payments or overpayments) <b>${big(A.cc)}</b>; net debt after them <b>${big(A.net)}</b>.`)]);
  if(P){const d=A.cb-P.cb;ins.push([d>0?'w':'o','↔',tr(`مقارنة بكشف ${mLabel(Lp.asOf)}: الرصيد ${d>=0?'ارتفع':'انخفض'} <b>${big(Math.abs(d))}</b>.`,`Against the ${mLabel(Lp.asOf)} statement the balance went ${d>=0?'up':'down'} <b>${big(Math.abs(d))}</b>.`)]);
    if(!filtered&&!near(A.ob,P.cb))ins.push(['c','≠',tr(`الرصيد الافتتاحي في هذا الكشف (${big(A.ob)}) لا يطابق الرصيد الختامي في كشف ${mLabel(Lp.asOf)} (${big(P.cb)}) بفرق ${big(A.ob-P.cb)}. راجع الكشفين.`,`The opening balance in this statement (${big(A.ob)}) does not match the closing balance of ${mLabel(Lp.asOf)} (${big(P.cb)}), a difference of ${big(A.ob-P.cb)}. Check both statements.`)])}
  const st=Lc.stated&&Lc.stated[u.cur];if(st&&!u.rg&&!u.grp){const ok=near(allCur.cb,st.cb)&&near(allCur.w,st.w);ins.push([ok?'o':'c',ok?'✓':'≠',ok?tr('مجموع الفئات يطابق «إجمالي ديون الحسابات» المذكور في الكشف.','The categories add up to the statement\'s stated total.'):tr(`مجموع الفئات (${big(allCur.cb)}) لا يطابق الإجمالي المذكور في الكشف (${big(st.cb)}).`,`The categories (${big(allCur.cb)}) do not add up to the stated total (${big(st.cb)}).`)])}
  const F1=FU.find(f=>f.asOf.slice(0,7)===Lc.asOf.slice(0,7));
  if(F1&&u.cur==='L'){const ff=F1.rows.filter(r=>r.f==='F').reduce((s,r)=>s+r.tv,0),fw=G.filter(g=>isFunded(g.l)).reduce((s,g)=>s+g.w,0);if(ff&&fw){const d=(fw-ff)*100/ff;ins.push([Math.abs(d)<=2?'o':'w','⛽',tr(`مطابقة مع «بيان قيمة المحروقات» لشهر ${mLabel(F1.asOf)}: قيمة محروقات الجهات الممولة <b>${big(ff)}</b> ومسحوباتها في الكشف <b>${big(fw)}</b> (فرق ${Math.round(d*100)/100}%).`,`Check against the ${mLabel(F1.asOf)} fuel value statement: fuel value for funded entities <b>${big(ff)}</b>, their withdrawals in the ledger <b>${big(fw)}</b> (difference ${Math.round(d*100)/100}%).`)])}}

  /* charts */
  const flow=`<div class="db-flow">
    <div><span>${esc(tr('الرصيد الافتتاحي','Opening balance'))} ${fdi(Lc.prev)}</span><b>${big(A.ob)}</b></div>
    <div class="up"><span>${esc(tr('المسحوبات','Withdrawals'))}</span><b>${big(A.w)}</b><i>+</i></div>
    <div class="up"><span>${esc(tr('التسويات المدينة','Debit adjustments'))}</span><b>${big(A.da)}</b><i>+</i></div>
    <div class="dn"><span>${esc(tr('التحصيلات','Collections'))}</span><b>${big(A.c)}</b><i>−</i></div>
    <div class="dn"><span>${esc(tr('التسويات الدائنة','Credit adjustments'))}</span><b>${big(A.ca)}</b><i>−</i></div>
    <div class="end"><span>${esc(tr('الرصيد الختامي','Closing balance'))} ${fdi(Lc.asOf)}</span><b>${big(A.cb)}</b><i style="color:${A.chg>0?'var(--crit)':'var(--ok)'}">${A.chg>=0?'▲':'▼'} ${big(Math.abs(A.chg))}</i></div></div>`;
  const pts=[];if(LS.length){const first=LS[0];const fc=sumOf(catsOf(first));pts.push({l:mLabel(first.prev),y:fc.ob,tip:`${fdi(first.prev)} · ${big(fc.ob)} ${U}`});
    LS.forEach(l=>{const x=sumOf(catsOf(l));pts.push({l:mLabel(l.asOf),y:x.cb,tip:`${fdi(l.asOf)} · ${big(x.cb)} ${U} · ${tr('مسحوبات','withdrawals')} ${big(x.out)} · ${tr('تحصيلات','collections')} ${big(x.in)}`})})}
  const stackU=h=>h.replace(/ د\.ل \(/g,' '+U+' (').replace(/ LYD \(/g,' '+U+' (');
  const stackOf=list=>stackU(stack(list.slice(0,3).map((t,i)=>({l:t.l,v:t.cb,k:'sm-k'+(i+1)})).concat(list.length>3?[{l:tr('أخرى','Other'),v:list.slice(3).reduce((s,t)=>s+t.cb,0),k:'sm-k4'}]:[])));
  const fixGo=h=>h.replace(/data-sm-cust=/g,'data-db-acct=');
  const wc=G.filter(g=>g.out>0||g.in>0).slice(0,10);const wcMax=Math.max(1,...wc.map(g=>Math.max(g.out,g.in)));
  const wcHtml=wc.length?`<div class="db-wc">${wc.map(g=>{const cv=g.out?Math.round(g.in*1000/g.out)/10:null;return `<div class="db-wc-row" data-tip="${esc(`${g.l}: ${tr('مسحوبات','withdrawals')} ${big(g.out)} · ${tr('تحصيلات','collections')} ${big(g.in)}`)}"><span class="an-lbl" title="${esc(g.l)}">${esc(g.l)}</span>
     <span class="db-wc-bars"><span class="an-track"><span class="an-fill w" style="width:${g.out>0?Math.max(1.5,g.out*100/wcMax):0}%"></span></span><span class="an-track"><span class="an-fill c" style="width:${g.in>0?Math.max(1.5,g.in*100/wcMax):0}%"></span></span></span>
     <span class="cov${cv!=null&&cv<50?' low':''}">${cv==null?'—':cv+'%'}</span></div>`}).join('')}
     <div class="sm-legend"><span><i class="sm-k1"></i>${esc(tr('المسحوبات والتسويات المدينة','Withdrawals & debit adj.'))}</span><span><i class="sm-k3"></i>${esc(tr('التحصيلات والتسويات الدائنة','Collections & credit adj.'))}</span><span class="muted">${esc(tr('النسبة = التغطية','% = coverage'))}</span></div></div>`:`<div class="empty" style="padding:20px">${esc(tr('لا حركة هذا الشهر','No movement this month'))}</div>`;
  const topC=custs.slice().sort((a,b)=>b.cb-a.cb).slice(0,10);const key=c=>c.a+'|'+c.cur+'|'+c.rg;
  const inc=custs.filter(c=>c.cb-c.ob>0).sort((a,b)=>(b.cb-b.ob)-(a.cb-a.ob)).slice(0,10);
  const colt=custs.filter(c=>c.c+c.ca>0).sort((a,b)=>(b.c+b.ca)-(a.c+a.ca)).slice(0,10);

  /* tables */
  const q=norm(u.q||'');const secs=uniq(custs.map(c=>c.sec));
  let rows=tabCat?cats.map(c=>Object.assign({},c,{key:''})):custs.filter(c=>(!u.sec||c.sec===u.sec)).map(c=>Object.assign({},c,{key:key(c)}));
  rows=rows.filter(c=>!q||norm(c.n+' '+(c.a||'')+' '+(c.sec||c.g||'')).includes(q));
  const K={name:c=>c.n,ob:c=>c.ob,out:c=>c.w+c.da,in:c=>c.c+c.ca,cb:c=>c.cb,chg:c=>c.cb-c.ob,cc:c=>c.cc}[u.sort]||(c=>c.cb);
  rows.sort((a,b)=>{const x=K(a),y=K(b);const r=typeof x==='string'?x.localeCompare(y,'ar'):x-y;return u.dir==='asc'?r:-r});const tblN=rows.length;const tbl=rows.slice(0,u.lim);
  const totT=sumOf(rows);
  const th=(k,l,cls='')=>`<th class="${cls}" data-db-sort="${k}" ${u.sort===k?`aria-sort="${u.dir==='asc'?'ascending':'descending'}"`:''}>${esc(l)}</th>`;
  const tblHtml=`<div class="tablewrap" style="max-height:none;min-height:0"><table class="sm-tbl"><thead><tr><th class="nosort">#</th>${th('name',tabCat?tr('الفئة','Category'):tr('الزبون','Customer'))}<th class="nosort">${esc(tabCat?tr('القطاع','Sector'):tr('التصنيف','Section'))}</th><th class="nosort">${esc(tr('المنطقة','Region'))}</th>${th('ob',tr('الرصيد الافتتاحي','Opening'),'n')}${th('out',tr('المسحوبات','Withdrawals'),'n')}${th('in',tr('التحصيلات','Collections'),'n')}${th('cb',tr('الرصيد الختامي','Closing'),'n')}${th('chg',tr('التغير','Change'),'n')}<th class="nosort n">${esc(tr('الحصة','Share'))}</th>${th('cc',tr('رصيد دائن','Credit bal.'),'n')}</tr></thead>
    <tbody>${tbl.map((c,i)=>{const ch=c.cb-c.ob;return `<tr ${c.key?`data-db-acct="${esc(c.key)}" tabindex="0"`:''}><td class="n">${i+1}</td><td class="t-strong">${esc(c.n)}${c.a&&c.a!==c.n?` <small class="muted num">${esc(c.a)}</small>`:''}${c.key&&dormant(c)?`<span class="db-tag">${esc(tr('راكد','dormant'))}</span>`:''}</td><td>${esc(tabCat?c.g:c.sec)}</td><td>${esc(rgName(c.rg))}</td><td class="n">${n0(c.ob)}</td><td class="n">${n0(c.w+c.da)}</td><td class="n">${n0(c.c+c.ca)}</td><td class="n"><b>${n0(c.cb)}</b></td><td class="n ${ch>0?'up':ch<0?'dn':''}">${ch>0?'+':''}${n0(ch)}</td><td class="n">${pct(c.cb,tabCat?A.cb:Ca.cb)}%</td><td class="n">${c.cc?n0(c.cc):'—'}</td></tr>`}).join('')}</tbody>
    <tfoot><tr><td></td><td class="t-strong">${esc(tr('الإجمالي','Total'))} (${fn(tblN)})</td><td></td><td></td><td class="n">${n0(totT.ob)}</td><td class="n">${n0(totT.out)}</td><td class="n">${n0(totT.in)}</td><td class="n"><b>${n0(totT.cb)}</b></td><td class="n">${n0(totT.chg)}</td><td></td><td class="n">${n0(totT.cc)}</td></tr></tfoot></table></div>`;

  const curs=[...new Set(Lc.cats.map(c=>c.cur))];const grps=uniq(Lc.cats.filter(c=>c.cur===u.cur).map(c=>c.g));
  return `<div class="db-page">`+head+banner+heroHtml(sub,big(A.cb),tr(`إجمالي الديون المدينة · ${U}`,`Total debtor balances · ${U}`),deltaHtml,heroExtra)+
  `<div class="sm-bar">
    <label class="an-f">${esc(tr('الكشف','Statement'))}<select id="db-at">${LS.slice().reverse().map(l=>`<option value="${esc(l.asOf)}" ${l.asOf===Lc.asOf?'selected':''}>${esc(mLabel(l.asOf))} (${fdi(l.asOf)})</option>`).join('')}</select></label>
    ${curs.length>1?`<label class="an-f">${esc(tr('العملة','Currency'))}<select id="db-cur">${curs.sort().reverse().map(c=>`<option value="${c}" ${c===u.cur?'selected':''}>${esc(c==='F'?tr('العملة الأجنبية','Foreign currency'):tr('العملة المحلية (د.ل)','Local currency (LYD)'))}</option>`).join('')}</select></label>`:''}
    <label class="an-f">${esc(tr('المنطقة','Region'))}<select id="db-rg"><option value="">${esc(tr('كل المناطق','All regions'))}</option>${['W','E'].filter(k=>Lc.cats.some(c=>c.rg===k)).map(k=>`<option value="${k}" ${u.rg===k?'selected':''}>${esc(rgName(k))}</option>`).join('')}</select></label>
    <label class="an-f">${esc(tr('القطاع','Sector'))}<select id="db-grp"><option value="">${esc(tr('كل القطاعات','All sectors'))}</option>${grps.map(g=>`<option ${u.grp===g?'selected':''}>${esc(g)}</option>`).join('')}</select></label>
    ${filtered?`<button class="btn sm ghost" data-dbt="clear">${esc(tr('مسح التصفية','Clear filters'))}</button>`:''}
  </div>
  ${!cats.length?`<div class="panel empty"><b>${esc(tr('لا توجد أرصدة','No balances'))}</b>${esc(tr('ضمن التصفية الحالية.','for the current filter.'))}</div>`:`
  <div class="kpis an-kpis">
   ${anKpi(tr('إجمالي الديون المدينة','Total debtor balances'),big(A.cb),esc(`${U} · ${tr('كما في','as of')} ${fdi(Lc.asOf)}`))}
   ${anKpi(tr('صافي المديونية','Net debt'),big(A.net),esc(tr(`بعد خصم أرصدة دائنة ${big(A.cc)}`,`after credit balances of ${big(A.cc)}`)))}
   ${anKpi(tr('المسحوبات خلال الشهر','Withdrawals this month'),big(A.out),esc(tr(`منها تسويات مدينة ${big(A.da)}`,`incl. debit adjustments ${big(A.da)}`)))}
   ${anKpi(tr('التحصيلات خلال الشهر','Collections this month'),big(A.in),esc(cov==null?'':tr(`نسبة التحصيل = التحصيلات ÷ المسحوبات = ${Math.round(cov*10)/10}%`,`collection rate = collections ÷ withdrawals = ${Math.round(cov*10)/10}%`)),cov!=null&&cov<50?'crit':'')}
   ${anKpi(tr('التغير الشهري','Monthly change'),(A.chg>=0?'+':'')+big(A.chg),esc(dChg==null?'':`${dChg>=0?'▲':'▼'} ${Math.abs(Math.round(dChg*100)/100)}% ${tr('عن','vs')} ${fdi(Lc.prev)}`))}
   ${anKpi(tr('متوسط فترة التحصيل DSO','Days sales outstanding'),dso!=null&&isFinite(dso)?fn(Math.round(dso))+' '+tr('يوم','days'):'—',esc(tr(`الرصيد ÷ مسحوبات الشهر × ${mDays} · ≈ ${months!=null&&isFinite(months)?Math.round(months):'—'} شهر`,`balance ÷ withdrawals × ${mDays} · ≈ ${months!=null&&isFinite(months)?Math.round(months):'—'} months`)),dso>180?'crit':'')}
   ${AG.tot?anKpi(tr(AG.over90!=null?'أقدم من 90 يومًا':'أقدم من 30 يومًا',AG.over90!=null?'Older than 90 days':'Older than 30 days'),pct(AG.over90!=null?AG.over90:AG.over30,AG.tot)+'%',esc(tr(`${big(AG.over90!=null?AG.over90:AG.over30)} · أعمار تقديرية`,`${big(AG.over90!=null?AG.over90:AG.over30)} · estimated aging`))):''}
   ${funded&&u.cur==='L'&&!u.grp?anKpi(tr('حصة الجهات الممولة','Funded entities share'),pct(funded,A.cb)+'%',esc(big(funded)+' '+U)):''}
   ${custs.length?anKpi(tr('الحسابات الراكدة','Dormant accounts'),fn(dorm.length),esc(tr(`رصيدها ${big(dormV)} · من ${custs.length} حساب`,`${big(dormV)} · of ${custs.length} accounts`))):''}
  </div>
  <div class="an-grid sm-root">
   <section class="panel an-wide"><h3 class="section-title">${esc(tr('قراءة تحليلية','Reading'))} <small>${esc(tr('تُكتب تلقائيًا من البيانات المصفّاة','written from the filtered data'))}</small></h3><ul class="sm-ins">${ins.map(x=>`<li><span class="ic ${x[0]}">${x[1]}</span><span>${x[2]}</span></li>`).join('')}</ul></section>
   <section class="panel an-wide"><h3 class="section-title">${esc(tr('حركة الرصيد خلال الشهر','Balance movement this month'))} <small>${esc(U)}</small></h3>${flow}</section>
   <section class="panel an-wide"><h3 class="section-title">${esc(tr('أعمار الديون (تقديرية)','Debt aging (estimated)'))} <small>${esc(tr(`الوارد أولًا يُسدَّد أولًا من المسحوبات الشهرية · ${AG.k} كشف (${mLabel(AG.from)} – ${mLabel(Lc.asOf)})`,`first in, first out from the monthly withdrawals · ${AG.k} statement(s) (${mLabel(AG.from)} – ${mLabel(Lc.asOf)})`))}</small></h3>
    ${stackU(stack(AG.B.map((b,i)=>({l:b.l,v:b.v,k:b.old?'sm-k1':['sm-k3','sm-k2','sm-k4','sm-k4'][i]||'sm-k4'}))))}
    <p class="sm-note" style="margin:8px 0 0">${esc(tr('الكشوف الشهرية لا تحمل تواريخ فواتير، فتُقدَّر الأعمار بافتراض أن التحصيلات تسدّد أقدم دين أولًا: مسحوبات هذا الشهر عمرها 0–30 يومًا، ومسحوبات الشهر السابق 31–60، وهكذا حتى ستة أشهر. ما لا تفسّره الكشوف المتاحة يظهر في الشريحة الأقدم.','The monthly statements carry no invoice dates, so aging is estimated assuming collections settle the oldest debt first: this month\'s withdrawals are 0–30 days old, last month\'s 31–60, and so on up to six months. Whatever the available statements do not explain falls in the oldest bucket.'))}</p></section>
   <section class="panel an-wide"><h3 class="section-title">${esc(tr('تطوّر الرصيد المدين','Debtor balance over time'))} <small>${esc(U)} · ${esc(LS.length>1?tr('من الكشوف المستوردة','from the imported statements'):tr('استورد كشوف أشهر أخرى ليمتد المنحنى','import other months to extend the curve'))}</small></h3>${colChart(pts,tr('الرصيد المدين حسب الشهر','Debtor balance by month'))}</section>
   <section class="panel"><h3 class="section-title">${esc(tr('الديون حسب القطاع','Debt by sector'))} <small>${esc(U)}</small></h3>${stackOf(G)}${bars(G.slice(0,10).map(g=>({l:g.l,v:g.cb,tip:`${g.l}: ${n0(g.cb)} ${U} · ${pct(g.cb,A.cb)}%`})),{fmt:big})}</section>
   <section class="panel"><h3 class="section-title">${esc(tr('المسحوبات مقابل التحصيلات','Withdrawals vs collections'))} <small>${esc(tr('حسب القطاع','by sector'))}</small></h3>${wcHtml}</section>
   ${rgs.length>1?`<section class="panel"><h3 class="section-title">${esc(tr('حسب المنطقة','By region'))} <small>${esc(U)}</small></h3>${stackU(stack(rgs.map((x,i)=>({l:rgName(x.k),v:x.cb,k:'sm-k'+(i+1)}))))}
     <div class="tablewrap" style="max-height:none;min-height:0;margin-top:8px"><table class="sm-tbl"><thead><tr><th class="nosort">${esc(tr('المنطقة','Region'))}</th><th class="nosort n">${esc(tr('المسحوبات','Withdrawals'))}</th><th class="nosort n">${esc(tr('التحصيلات','Collections'))}</th><th class="nosort n">${esc(tr('الرصيد الختامي','Closing'))}</th></tr></thead><tbody>${rgs.map(x=>`<tr><td>${esc(rgName(x.k))}</td><td class="n">${big(x.out)}</td><td class="n">${big(x.in)}</td><td class="n"><b>${big(x.cb)}</b></td></tr>`).join('')}</tbody></table></div></section>`:''}
   ${(()=>{const cr=cats.filter(c=>c.cc>0).sort((a,b)=>b.cc-a.cc);return cr.length?`<section class="panel"><h3 class="section-title">${esc(tr('الأرصدة الدائنة','Credit balances'))} <small>${esc(tr('دفعات مقدّمة أو زيادات سداد','advances or overpayments'))}</small></h3>${bars(cr.slice(0,8).map(c=>({l:c.n+(c.rg?' · '+rgName(c.rg):''),v:c.cc,tip:`${c.n}: ${n0(c.cc)} ${U}`})),{fmt:big,tone:'fl'})}</section>`:''})()}
   ${custs.length?`<section class="panel"><h3 class="section-title">${esc(tr('أكبر 10 مدينين','Top 10 debtors'))} <small>${esc(tr('من أوراق المناطق · اضغط للتفاصيل','from the region sheets · click for details'))}</small></h3>${fixGo(bars(topC.map(c=>({l:c.n,v:c.cb,go:key(c),tip:`${c.n} (${c.a}): ${n0(c.cb)} ${U} · ${rgName(c.rg)}`})),{fmt:big}))}</section>
   <section class="panel"><h3 class="section-title">${esc(tr('أكبر زيادة في المديونية','Largest debt increases'))} <small>${esc(tr('الرصيد الختامي − الافتتاحي','closing − opening'))}</small></h3>${inc.length?fixGo(bars(inc.map(c=>({l:c.n,v:c.cb-c.ob,go:key(c),tip:`${c.n}: +${n0(c.cb-c.ob)} ${U}`})),{fmt:big,tone:'fl'})):`<div class="empty" style="padding:20px">${esc(tr('لا زيادات هذا الشهر','No increases this month'))}</div>`}</section>
   <section class="panel"><h3 class="section-title">${esc(tr('أكبر التحصيلات','Largest collections'))} <small>${esc(U)}</small></h3>${colt.length?fixGo(bars(colt.map(c=>({l:c.n,v:c.c+c.ca,go:key(c),tip:`${c.n}: ${n0(c.c+c.ca)} ${U}`})),{fmt:big})):`<div class="empty" style="padding:20px">${esc(tr('لا تحصيلات مسجلة للحسابات التفصيلية','No collections on the detailed accounts'))}</div>`}</section>
   <section class="panel"><h3 class="section-title">${esc(tr('حسابات راكدة عليها أرصدة','Dormant accounts with a balance'))} <small>${esc(tr('بلا سحب ولا تحصيل هذا الشهر','no withdrawal or collection this month'))}</small></h3>${dorm.length?fixGo(bars(dorm.slice(0,10).map(c=>({l:c.n,v:c.cb,go:key(c),tip:`${c.n} (${c.a}): ${n0(c.cb)} ${U} · ${c.sec}`})),{fmt:big,tone:'fl'})):`<div class="empty" style="padding:20px">${esc(tr('كل الحسابات تحرّكت','Every account moved'))}</div>`}</section>`:''}
   ${prio.length?`<section class="panel an-wide"><h3 class="section-title">${esc(tr('أولويات المتابعة والتحصيل','Collection follow-up priorities'))} <small>${esc(tr('الرصيد الأقدم × العمر التقديري، والحسابات الراكدة أولًا · الإجراء المقترح من سلّم المطالبة','older balance × estimated age, dormant accounts first · step suggested by the reminder ladder'))}</small></h3>
    <div class="tablewrap" style="max-height:none;min-height:0"><table class="sm-tbl"><thead><tr><th class="nosort">#</th><th class="nosort">${esc(tr('الزبون','Customer'))}</th><th class="nosort">${esc(tr('التصنيف','Section'))}</th><th class="nosort n">${esc(tr('الرصيد الختامي','Closing'))}</th><th class="nosort n">${esc(tr('أقدم من 30 يومًا','Older than 30 days'))}</th><th class="nosort n">${esc(tr('العمر التقديري','Est. age'))}</th><th class="nosort">${esc(tr('الإجراء المقترح','Suggested step'))}</th></tr></thead>
    <tbody>${prio.slice(0,15).map((c,i)=>`<tr data-db-acct="${esc(keyCust(c))}" tabindex="0"><td class="n">${i+1}</td><td class="t-strong">${esc(c.n)} <small class="muted num">${esc(c.a)}</small>${dormant(c)?`<span class="db-tag">${esc(tr('راكد','dormant'))}</span>`:''}</td><td>${esc(c.sec)}</td><td class="n">${n0(c.cb)}</td><td class="n"><b>${n0(c.old)}</b></td><td class="n">${esc(c.age>=30*AGc.k?tr(`أكثر من ${c.age} يومًا`,`over ${c.age} days`):tr(`${c.age+1}–${c.age+30} يومًا`,`${c.age+1}–${c.age+30} days`))}</td><td>${esc(nextStep(c.age,c))}</td></tr>`).join('')}</tbody></table></div></section>`:''}
   ${F1&&u.cur==='L'?fuelPanel(F1,true):''}
   <section class="panel an-wide"><h3 class="section-title">${esc(tabCat?tr('الفئات حسب المنطقة','Categories by region'):tr('حسابات الزبائن','Customer accounts'))} <small>${fn(tblN)} ${esc(tabCat?tr('فئة','categories'):tr('حساب · اضغط على الصف للتفاصيل','accounts · click a row for details'))}</small></h3>
    <div class="db-tabs" role="group">${custs.length?`<button type="button" data-db-tab="cust" aria-pressed="${!tabCat}">${esc(tr('حسابات الزبائن','Customer accounts'))}</button>`:''}<button type="button" data-db-tab="cat" aria-pressed="${tabCat}">${esc(tr('الفئات والقطاعات','Categories & sectors'))}</button></div>
    <div class="toolbar" style="margin:0 0 8px"><div class="grow od-search">${I.search}<input type="search" id="db-q" value="${esc(u.q||'')}" placeholder="${esc(tr('بحث بالاسم أو رقم الحساب…','Search by name or account…'))}" aria-label="${esc(tr('بحث','Search'))}"></div>
     ${!tabCat&&secs.length>1?`<label class="an-f" style="margin:0">${esc(tr('التصنيف','Section'))}<select id="db-sec"><option value="">${esc(tr('كل التصنيفات','All sections'))}</option>${secs.map(s=>`<option ${u.sec===s?'selected':''}>${esc(s)}</option>`).join('')}</select></label>`:''}</div>
    ${tblHtml}
    ${tblN>u.lim?`<div style="text-align:center;margin-top:8px"><button class="btn sm" data-dbt="more">${esc(tr(`عرض المزيد (${tblN-u.lim} متبقٍ)`,`Show more (${tblN-u.lim} left)`))}</button></div>`:''}</section>
  </div>`}</div>`}

/* ---------- the fuel value statement ---------- */
function fuelAgg(F){const by=(k,f)=>{const m=new Map();F.rows.filter(f||(()=>true)).forEach(r=>{const x=m.get(r[k])||{l:r[k],tv:0,kv:0,cv:0,l2:0};x.tv+=r.tv;x.kv+=r.kv;x.cv+=r.cv;x.l2+=r.l;m.set(r[k],x)});return [...m.values()].sort((a,b)=>b.tv-a.tv)};
  const s=k=>F.rows.reduce((a,r)=>a+(r[k]||0),0);return {tv:s('tv'),kv:s('kv'),cv:s('cv'),sb:s('sb'),sn:s('sn'),sr:s('sr'),tc:s('tc'),l:s('l'),prod:by('p'),grp:by('g'),fund:s2(F)}}
function s2(F){const f=F.rows.filter(r=>r.f==='F').reduce((a,r)=>a+r.tv,0);return {F:f,N:F.rows.reduce((a,r)=>a+r.tv,0)-f}}
function fuelPanel(F,inLedger){const A=fuelAgg(F);const U=tr('د.ل','LYD');
  const stackU=h=>h;
  return `<section class="panel an-wide"><h3 class="section-title">${esc(tr(`بيان قيمة المحروقات — ${mLabel(F.asOf)}`,`Fuel value statement — ${mLabel(F.asOf)}`))} <small>${esc(tr('القيمة حسب المنتج والجهة، ممولة وغير ممولة','value by product and customer group, funded and non-funded'))}</small></h3>
   <div class="sm-mini"><div><b class="num">${big(A.tv)}</b><span>${esc(tr('إجمالي قيمة المبيعات','Total sales value'))}</span></div><div><b class="num">${big(A.kv)}</b><span>${esc(tr('المبيعات الآجلة','Credit sales'))} · ${pct(A.kv,A.tv)}%</span></div><div><b class="num">${big(A.cv)}</b><span>${esc(tr('المبيعات النقدية','Cash sales'))}</span></div><div><b class="num">${big(A.fund.F)}</b><span>${esc(tr('الجهات الممولة من الدولة','State-funded entities'))}</span></div><div><b class="num">${big(A.l/1000)}</b><span>${esc(tr('م³ (متر مكعب)','m³ (cubic metres)'))}</span></div></div>
   <div class="an-grid" style="margin-top:6px">
    <div><h4 style="margin:4px 0">${esc(tr('ممولة / غير ممولة','Funded / non-funded'))}</h4>${stackU(stack([{l:tr('الجهات الممولة','Funded'),v:A.fund.F,k:'sm-k1'},{l:tr('باقي الزبائن غير الممولة','Non-funded customers'),v:A.fund.N,k:'sm-k2'}]))}
     <h4 style="margin:12px 0 4px">${esc(tr('توزيع القيمة','Value split'))}</h4>${stack([{l:tr('حصة البريقة','Brega share'),v:A.sb,k:'sm-k1'},{l:tr('حصة المؤسسة','NOC share'),v:A.sn,k:'sm-k2'},{l:tr('حصة النهر','River share'),v:A.sr,k:'sm-k3'}].concat(A.tc?[{l:tr('مصروفات النقل','Transport'),v:A.tc,k:'sm-k4'}]:[]))}</div>
    <div><h4 style="margin:4px 0">${esc(tr('حسب المنتج','By product'))}</h4>${bars(A.prod.filter(p=>p.tv>0).slice(0,8).map(p=>({l:p.l,v:p.tv,tip:`${p.l}: ${n0(p.tv)} ${U} · ${tr('آجل','credit')} ${big(p.kv)}`})),{fmt:big})}</div>
    <div class="an-wide"><h4 style="margin:4px 0">${esc(tr('حسب الجهة (الآجل يولّد الدين)','By customer group (credit sales become debt)'))}</h4>${bars(A.grp.filter(p=>p.tv>0).slice(0,10).map(p=>({l:p.l,v:p.kv||p.tv,tip:`${p.l}: ${tr('آجل','credit')} ${n0(p.kv)} · ${tr('نقدي','cash')} ${n0(p.cv)} ${U}`})),{fmt:big})}</div>
   </div>${F.stated&&!near(A.tv,F.stated)?`<p class="db-check" style="color:var(--warn)">${esc(tr(`مجموع الصفوف ${big(A.tv)} لا يطابق «الإجمالي العام» ${big(F.stated)}.`,`Rows add up to ${big(A.tv)}, not the stated grand total ${big(F.stated)}.`))}</p>`:''}</section>`}
function fuelOnly(FU){const F=FU[FU.length-1],A=fuelAgg(F);
  return heroHtml(esc(tr(`بيان قيمة المحروقات لشهر ${mLabel(F.asOf)}. استورد كشف «مديونية كاملة» للشهر نفسه لتظهر مؤشرات الديون والمطابقة.`,`Fuel value statement for ${mLabel(F.asOf)}. Import the full debts workbook of the same month to see the debt KPIs and the check.`)),big(A.tv),tr('إجمالي قيمة المبيعات · د.ل','Total sales value · LYD'))+
   `<div class="kpis an-kpis">${anKpi(tr('المبيعات الآجلة','Credit sales'),big(A.kv),esc(pct(A.kv,A.tv)+'%'))}${anKpi(tr('المبيعات النقدية','Cash sales'),big(A.cv),'')}${anKpi(tr('الجهات الممولة','Funded entities'),big(A.fund.F),esc(pct(A.fund.F,A.tv)+'%'))}${anKpi(tr('حصة البريقة','Brega share'),big(A.sb),esc(pct(A.sb,A.tv)+'%'))}</div>
   <div class="an-grid sm-root">${fuelPanel(F,false)}</div>`}

function after(){const u=UI();
  const bind=(sel,f)=>{const e=document.getElementById(sel);if(e)e.addEventListener('change',()=>{f(e);u.lim=25;render()})};
  bind('db-at',e=>{u.at=e.value});bind('db-cur',e=>{u.cur=e.value;u.grp=''});bind('db-rg',e=>{u.rg=e.value});bind('db-grp',e=>{u.grp=e.value});bind('db-sec',e=>{u.sec=e.value});
  const q=document.getElementById('db-q');if(q)q.addEventListener('input',debounce(()=>{u.q=q.value;u.lim=25;const p=q.selectionStart;render();const n=document.getElementById('db-q');if(n){n.focus();try{n.setSelectionRange(p,p)}catch(e){}}},250));
  const f=document.getElementById('db-file');if(f)f.addEventListener('change',()=>{const file=f.files&&f.files[0];f.value='';if(file)importFile(file)})}

/* ---------- import ---------- */
async function importFile(file){toast(tr('جارٍ قراءة الملف…','Reading the file…'));let PS;
  try{PS=await parseFile(file)}catch(e){modal(tr('تعذّر الاستيراد','Import failed'),`<p style="line-height:1.8">${esc(e.message||String(e))}</p>`,`<button type="button" class="btn" data-act="close-dlg">${esc(tr('إغلاق','Close'))}</button>`);return}
  ST.pending=PS;const ov=ST.local?[]:PS.flatMap(overlaps);
  const block=P=>{if(P.T==='fuel'){const A=fuelAgg(P);return `<h4 style="margin:10px 0 4px">${esc(tr('بيان قيمة المحروقات','Fuel value statement'))} — ${esc(mLabel(P.asOf))}</h4>
     <div class="sm-mini"><div><b class="num">${fn(P.rows.length)}</b><span>${esc(tr('صف (منتج × جهة)','rows (product × group)'))}</span></div><div><b class="num">${big(A.tv)}</b><span>${esc(tr('إجمالي القيمة','Total value'))}</span></div><div><b class="num">${big(A.kv)}</b><span>${esc(tr('الآجل','Credit'))}</span></div><div><b class="num">${big(A.fund.F)}</b><span>${esc(tr('الجهات الممولة','Funded'))}</span></div></div>
     ${P.stated!=null?`<p class="db-check">${near(A.tv,P.stated)?'✓ ':'✗ '}${esc(tr(`مجموع الصفوف ${n0(A.tv)} · الإجمالي العام في البيان ${n0(P.stated)}`,`Rows ${n0(A.tv)} · stated grand total ${n0(P.stated)}`))}</p>`:''}`}
    const Lsum=sumOf(P.cats.filter(c=>c.cur==='L')),Fsum=sumOf(P.cats.filter(c=>c.cur==='F'));const st=P.stated.L;
    return `<h4 style="margin:10px 0 4px">${esc(tr('كشف أرصدة المدينين','Debtors balances statement'))} — ${esc(tr('كما في','as of'))} ${fdi(P.asOf)}</h4>
     <div class="sm-mini"><div><b class="num">${big(Lsum.cb)}</b><span>${esc(tr('إجمالي الديون (د.ل)','Total debt (LYD)'))}</span></div><div><b class="num">${fn(new Set(P.cats.map(c=>c.g)).size)}</b><span>${esc(tr('قطاع','sectors'))}</span></div><div><b class="num">${fn(P.cats.length)}</b><span>${esc(tr('فئة','categories'))}</span></div><div><b class="num">${fn(P.custs.length)}</b><span>${esc(tr('حساب زبون','customer accounts'))}</span></div>${Fsum.n?`<div><b class="num">${big(Fsum.cb)}</b><span>${esc(tr('بالعملة الأجنبية','foreign currency'))}</span></div>`:''}</div>
     <p class="muted" style="font-size:12.5px;margin:2px 0">${esc(tr(`الفترة ${fdi(P.prev)} – ${fdi(P.asOf)} · الورقة الأساسية: ${P.sheet}`,`Period ${fdi(P.prev)} – ${fdi(P.asOf)} · base sheet: ${P.sheet}`))}</p>
     ${st?`<p class="db-check">${near(Lsum.cb,st.cb)?'✓ ':'✗ '}${esc(tr(`مجموع الفئات ${n0(Lsum.cb)} · الإجمالي المذكور في الكشف ${n0(st.cb)}`,`Categories ${n0(Lsum.cb)} · stated total ${n0(st.cb)}`))}</p>`:''}`};
  modal(tr('مراجعة الملف قبل الحفظ','Review the file before saving'),`<p class="muted" style="margin:0;font-size:12.5px">${esc(tr('الملف: ','File: ')+file.name)}</p>${PS.map(block).join('')}
   ${ov.length?`<div class="banner warn" style="margin-top:8px">${esc(tr(`يوجد ملف محفوظ للشهر نفسه:`,`A file for the same month is already saved:`))} ${ov.map(b=>esc(`${b.file} (${fdi(b.to)})`)).join('، ')}
     <label style="display:flex;gap:6px;align-items:center;margin-top:6px"><input type="checkbox" id="db-replace" checked> ${esc(tr('استبداله بهذا الملف (يمنع تكرار الأرقام)','Replace it with this file (avoids double counting)'))}</label></div>`:''}
   ${!ST.canImport?`<p class="muted" style="font-size:12.5px">${esc(tr('الحفظ في المنظومة متاح لمحرري إدارة الشؤون التجارية والتحصيلات والإدارة العامة ومدير النظام. يمكنك عرض التحليل مؤقتًا على جهازك.','Saving is for editors of Commercial Affairs & Collections, the General Administration and the administrator. You can view the analysis on this device.'))}</p>`:''}
   <p id="db-msg" style="font-size:12.5px;margin:6px 0 0"></p>`,
   `${ST.canImport?`<button type="button" class="btn primary" data-dbt="save">${esc(tr('حفظ في المنظومة','Save to the system'))}</button>`:''}<button type="button" class="btn" data-dbt="view-local">${esc(tr('عرض دون حفظ','View without saving'))}</button><button type="button" class="btn ghost" data-act="close-dlg">${esc(tr('إلغاء','Cancel'))}</button>`)}

/* ---------- account detail ---------- */
function acctDetail(k){const u=UI();const LS=ledgers();const Lc=LS.find(l=>l.asOf===u.at)||LS[LS.length-1];if(!Lc)return;const [a,cur,rg]=k.split('|');
  const c=Lc.custs.find(x=>x.a===a&&x.cur===cur&&x.rg===rg);if(!c)return;const U=curU(cur);
  const hist=LS.map(l=>({d:l.asOf,x:l.custs.find(x=>x.a===a&&x.cur===cur&&x.rg===rg)})).filter(h=>h.x);
  modal(`${c.n} (${c.a})`,`<div class="sm-mini"><div><b class="num">${n0(c.cb)}</b><span>${esc(tr('الرصيد الختامي','Closing'))} · ${esc(U)}</span></div><div><b class="num">${n0(c.ob)}</b><span>${esc(tr('الرصيد الافتتاحي','Opening'))}</span></div><div><b class="num">${n0(c.w+c.da)}</b><span>${esc(tr('المسحوبات والتسويات المدينة','Withdrawals & debit adj.'))}</span></div><div><b class="num">${n0(c.c+c.ca)}</b><span>${esc(tr('التحصيلات والتسويات الدائنة','Collections & credit adj.'))}</span></div>${c.cc?`<div><b class="num">${n0(c.cc)}</b><span>${esc(tr('رصيد دائن','Credit balance'))}</span></div>`:''}</div>
   <p class="muted" style="font-size:12.5px;margin:4px 0">${esc(`${c.sec||''} · ${rgName(c.rg)} · ${cur==='F'?tr('العملة الأجنبية','Foreign currency'):tr('العملة المحلية','Local currency')}`)}${dormant(c)?` · <b style="color:var(--warn)">${esc(tr('لا حركة هذا الشهر','no movement this month'))}</b>`:''}</p>
   <h4 style="margin:10px 0 4px">${esc(tr('حسب الكشف الشهري','By monthly statement'))}</h4><div class="tablewrap" style="max-height:260px;min-height:0"><table class="sm-tbl"><thead><tr><th class="nosort">${esc(tr('الشهر','Month'))}</th><th class="nosort n">${esc(tr('الافتتاحي','Opening'))}</th><th class="nosort n">${esc(tr('المسحوبات','Withdrawals'))}</th><th class="nosort n">${esc(tr('التحصيلات','Collections'))}</th><th class="nosort n">${esc(tr('الختامي','Closing'))}</th></tr></thead><tbody>${hist.slice().reverse().map(h=>`<tr><td>${esc(mLabel(h.d))}</td><td class="n">${n0(h.x.ob)}</td><td class="n">${n0(h.x.w+h.x.da)}</td><td class="n">${n0(h.x.c+h.x.ca)}</td><td class="n"><b>${n0(h.x.cb)}</b></td></tr>`).join('')}</tbody></table></div>`,
   `<button type="button" class="btn" data-act="close-dlg">${esc(tr('إغلاق','Close'))}</button>`)}

/* ---------- export, files ---------- */
function exportXlsx(){const u=UI(),LS=ledgers(),FU=fuels();const Lc=LS.find(l=>l.asOf===u.at)||LS[LS.length-1];const sheets=[];const K=tr('البند','Item'),V=tr('القيمة','Value');
  if(Lc){const cats=catsOf(Lc),A=sumOf(cats),custs=custsOf(Lc);const rgN=k=>RG[k]?RG[k][0]:'';const curN=c=>c==='F'?'أجنبية':'محلية';
    sheets.push([tr('ملخص','Summary'),[{[K]:'كما في',[V]:Lc.asOf},{[K]:'الرصيد الافتتاحي في',[V]:Lc.prev},{[K]:'العملة',[V]:curN(u.cur)},{[K]:'إجمالي الديون المدينة',[V]:r3(A.cb)},{[K]:'الأرصدة الدائنة',[V]:r3(A.cc)},{[K]:'صافي المديونية',[V]:r3(A.net)},
      {[K]:'الرصيد الافتتاحي المدين',[V]:r3(A.ob)},{[K]:'المسحوبات',[V]:r3(A.w)},{[K]:'التسويات المدينة',[V]:r3(A.da)},{[K]:'التحصيلات',[V]:r3(A.c)},{[K]:'التسويات الدائنة',[V]:r3(A.ca)},{[K]:'تغطية التحصيلات للمسحوبات %',[V]:A.out?Math.round(A.in*1000/A.out)/10:''},{[K]:'الحسابات الراكدة',[V]:custs.filter(dormant).length}]]);
    const row=(c,extra)=>Object.assign(extra,{'المنطقة':rgN(c.rg),'العملة':curN(c.cur),'كما في':Lc.asOf,'الرصيد الافتتاحي مدين':c.ob,'الرصيد الافتتاحي دائن':c.oc,'المسحوبات':c.w,'التسويات المدينة':c.da,'التحصيلات':c.c,'التسويات الدائنة':c.ca,'الرصيد الختامي مدين':c.cb,'الرصيد الختامي دائن':c.cc,'التغير':r3(c.cb-c.ob)});
    sheets.push([tr('القطاعات','Sectors'),groupsOf(cats).map(g=>({'القطاع':g.l,'الفئات':g.n,'الرصيد الافتتاحي':r3(g.ob),'المسحوبات':r3(g.out),'التحصيلات':r3(g.in),'الرصيد الختامي':r3(g.cb),'الأرصدة الدائنة':r3(g.cc),'الحصة %':pct(g.cb,A.cb),'التغطية %':g.out?Math.round(g.in*1000/g.out)/10:''}))]);
    sheets.push([tr('الفئات','Categories'),cats.map(c=>row(c,{'البيان':c.n,'القطاع':c.g}))]);
    sheets.push([tr('الحسابات','Accounts'),custs.map(c=>row(c,{'رقم الحساب':c.a,'اسم الزبون':c.n,'القسم':c.sec}))]);
    const AG=agingOf(LS,Lc,cats,'cats');sheets.push([tr('الأعمار','Aging'),AG.B.map(b=>({'الشريحة':b.l,'المبلغ':r3(b.v),'الحصة %':pct(b.v,AG.tot)})).concat([{'الشريحة':'الطريقة','المبلغ':'تقديرية: الوارد أولًا يُسدَّد أولًا من المسحوبات الشهرية · '+AG.k+' كشف'}])]);
    if(custs.length){const AC=agingOf(LS,Lc,custs,'custs');sheets.push([tr('أولويات التحصيل','Priorities'),custs.map(c=>{const a=AC.per.get(keyCust(c));return {'رقم الحساب':c.a,'اسم الزبون':c.n,'القسم':c.sec,'المنطقة':rgN(c.rg),'الرصيد الختامي':c.cb,'أقدم من 30 يومًا':r3(a.old),'العمر التقديري (يوم)':a.age,'راكد':dormant(c)?'نعم':'','الإجراء المقترح':nextStep(a.age,c),_s:a.old*(1+a.age/90)*(dormant(c)?1.5:1)}}).filter(x=>x['أقدم من 30 يومًا']>0).sort((a,b)=>b._s-a._s).map(x=>{delete x._s;return x})])}
    sheets.push([tr('الأشهر','Months'),LS.map(l=>{const x=sumOf(catsOf(l));const dd=+l.asOf.slice(8,10)||30;return {'كما في':l.asOf,'الرصيد الافتتاحي':r3(x.ob),'المسحوبات':r3(x.out),'التحصيلات':r3(x.in),'الرصيد الختامي':r3(x.cb),'نسبة التحصيل %':x.out?Math.round(x.in*1000/x.out)/10:'','DSO (يوم)':x.out?Math.round(x.cb/x.out*dd):''}})])}
  const F=Lc?FU.find(f=>f.asOf.slice(0,7)===Lc.asOf.slice(0,7)):FU[FU.length-1];
  if(F)sheets.push([tr('المحروقات','Fuel'),F.rows.map(r=>({'الشهر':F.asOf.slice(0,7),'المنتج':r.p,'الجهة':r.g,'ممولة':r.f==='F'?'نعم':'لا','الكمية بالمتر المكعب':r3(r.l/1000),'الكمية بالطن':r.t,'الكمية بالعدد':r.k,'المبيعات النقدية':r.cv,'المبيعات الآجلة':r.kv,'إجمالي القيمة':r.tv,'حصة البريقة':r.sb,'حصة المؤسسة':r.sn,'حصة النهر':r.sr,'مصروفات النقل':r.tc}))]);
  saveXlsx(sheets,`Debts-analysis-${(Lc||F).asOf}.xlsx`)}
function filesDlg(){modal(tr('ملفات الديون المستوردة','Imported debts files'),`<div class="tablewrap" style="max-height:none;min-height:0"><table class="sm-tbl"><thead><tr><th class="nosort">${esc(tr('الملف','File'))}</th><th class="nosort">${esc(tr('النوع','Kind'))}</th><th class="nosort">${esc(tr('الشهر','Month'))}</th><th class="nosort n">${esc(tr('القيمة','Value'))}</th><th class="nosort">${esc(tr('استورده','Imported by'))}</th>${ST.canImport?'<th class="nosort"></th>':''}</tr></thead>
  <tbody>${ST.batches.slice().reverse().map(b=>`<tr><td>${esc(b.file||'—')}${b.ok===false?` <span class="pill p-crit">${esc(tr('غير مكتمل','incomplete'))}</span>`:''}</td><td>${esc(b.sheet==='fuel'?tr('قيمة المحروقات','Fuel value'):tr('كشف الأرصدة','Balances'))}</td><td class="n">${esc(mLabel(b.to))}</td><td class="n">${big(b.value||0)}</td><td><small>${esc(b.by||'')}<br>${fdi(b.at)}</small></td>${ST.canImport?`<td><button type="button" class="btn sm ghost danger" data-db-del="${esc(b.id)}">${esc(tr('حذف','Delete'))}</button></td>`:''}</tr>`).join('')}</tbody></table></div>`,
  `<button type="button" class="btn" data-dbt="reload">${esc(tr('تحديث','Refresh'))}</button><button type="button" class="btn ghost" data-act="close-dlg">${esc(tr('إغلاق','Close'))}</button>`)}

/* ---------- events ---------- */
document.addEventListener('click',async e=>{
  const tab=e.target.closest('[data-db-tab]');if(tab){const u=UI();u.tab=tab.dataset.dbTab;u.sort='cb';u.dir='desc';u.lim=25;render();return}
  const so=e.target.closest('[data-db-sort]');if(so&&S.view===ID){const u=UI(),k=so.dataset.dbSort;if(u.sort===k)u.dir=u.dir==='asc'?'desc':'asc';else{u.sort=k;u.dir=k==='name'?'asc':'desc'}render();return}
  const ac=e.target.closest('[data-db-acct]');if(ac&&document.getElementById('view').contains(ac)){acctDetail(ac.dataset.dbAcct);return}
  const del=e.target.closest('[data-db-del]');if(del){if(!del.classList.contains('armed')){del.classList.add('armed');del.textContent=tr('تأكيد الحذف','Confirm delete');setTimeout(()=>{del.classList.remove('armed');del.textContent=tr('حذف','Delete')},4000);return}
    const b=ST.batches.find(x=>x.id===del.dataset.dbDel);if(!b)return;del.disabled=true;try{await delBatch(b);toast(tr('تم حذف الملف','File deleted'));await load(true);filesDlg();render()}catch(err){toast(tr('تعذّر الحذف: ','Could not delete: ')+(err.message||''));del.disabled=false}return}
  const a=e.target.closest('[data-dbt]');if(!a)return;const act=a.dataset.dbt;
  if(act==='import'){const f=document.getElementById('db-file');if(f)f.click();return}
  if(act==='export'){exportXlsx();return}
  if(act==='print'){try{window.print()}catch(e2){}return}
  if(act==='files'){filesDlg();return}
  if(act==='more'){UI().lim+=50;render();return}
  if(act==='clear'){Object.assign(UI(),{cur:'L',rg:'',grp:'',sec:'',q:''});render();return}
  if(act==='drop-local'){ST.local=null;UI().at='';render();return}
  if(act==='reload'){a.disabled=true;await load(true);dlg.close();render();toast(tr('تم تحديث البيانات','Data refreshed'));return}
  if(act==='view-local'){ST.local=ST.pending;ST.pending=null;dlg.close();Object.assign(UI(),{at:'',rg:'',grp:'',sec:'',q:''});render();return}
  if(act==='save'){const PS=ST.pending;if(!PS)return;const msg=document.getElementById('db-msg');a.disabled=true;msg.style.color='';msg.textContent=tr('جارٍ الحفظ…','Saving…');
    try{const rep=document.getElementById('db-replace');for(const P of PS)await saveOne(P,!!(rep&&rep.checked));ST.pending=null;ST.local=null;await load(true);dlg.close();Object.assign(UI(),{at:'',rg:'',grp:'',sec:'',q:''});render();toast(tr('تم حفظ الملف','File saved'))}
    catch(err){a.disabled=false;msg.style.color='var(--crit)';msg.textContent=(err&&err.code==='permission-denied')?tr('لا تملك صلاحية الحفظ في هذه اللوحة','You are not allowed to save to this dashboard'):(tr('تعذّر الحفظ: ','Could not save: ')+(err.message||''))}}
});
document.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const ac=e.target.closest&&e.target.closest('[data-db-acct]');if(ac&&document.getElementById('view').contains(ac)){e.preventDefault();acctDetail(ac.dataset.dbAcct)}});

/* ---------- navigation: a task of Commercial Affairs & Collections, next to SMS055 ---------- */
if(window.I18N&&I18N.add)I18N.add({[LABEL[0]]:LABEL[1]});
VIEWS.push({id:ID,label:LABEL[0],icon:'debts',group:'مهام إدارة الشؤون التجارية والتحصيلات',nav:false});
ORG_TASKS.ca=(ORG_TASKS.ca||[]).concat([ID]);
const __render=render;
render=function(){if(S.view===ID){recompute();document.getElementById('view').innerHTML=dbBanner()+view();after();return}__render()};
const __rp=recPanel;
recPanel=function(unit){const h=__rp(unit);if(unit!==UNIT)return h;let body;
  if(!ST.loaded){load().then(()=>{if(S.view==='org')render()});body=`<span class="muted">${esc(tr('جارٍ التحميل…','Loading…'))}</span>`}
  else{const LS=ST.snaps.filter(s=>s.T==='ledger').sort((a,b)=>a.asOf.localeCompare(b.asOf));const Lc=LS[LS.length-1];
    if(!Lc)body=`<span class="muted">${esc(ST.err==='denied'?tr('البيانات متاحة للإدارة والإدارة العامة.','Data is available to the department and the General Administration.'):tr('لم يُستورد أي كشف بعد.','No statement imported yet.'))}</span>`;
    else{const A=sumOf(Lc.cats.filter(c=>c.cur==='L'));body=`<b class="num">${big(A.cb)}</b> ${esc(tr('د.ل','LYD'))} · ${esc(tr('تحصيلات','collections'))} ${big(A.in)} <small class="muted">(${esc(mLabel(Lc.asOf))})</small>`}}
  return `<section class="panel"><h3 class="section-title">${esc(tr('لوحة الديون','Debts dashboard'))} <small>${esc(tr('أرصدة الزبائن والمسحوبات والتحصيلات','customer balances, withdrawals and collections'))}</small></h3><div style="font-size:13px">${body}</div>
   <div class="cx-links"><button type="button" class="btn sm primary" data-org-go="${ID}">${esc(tr('فتح لوحة الديون','Open the debts dashboard'))}</button></div></section>`+h};
const __vod=viewOrgDuties;
viewOrgDuties=function(el){__vod(el);const sec=el.querySelector('#od-'+UNIT+' .od-acts');if(sec&&!sec.querySelector(`[data-org-go="${ID}"]`))sec.insertAdjacentHTML('afterbegin',`<button type="button" class="btn sm" data-org-go="${ID}">${esc(tr('لوحة الديون','Debts dashboard'))}</button>`)};
window.__debts={ST,parseFile,ledgers,fuels};
})();
