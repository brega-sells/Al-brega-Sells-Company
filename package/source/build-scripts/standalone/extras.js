/* ===== Standalone extras: Excel read/write without libraries, data backup file, articles inline ===== */
"use strict";
try{Object.assign(ARTICLES,JSON.parse(document.getElementById('articles-data').textContent))}catch(e){}
loadArticles=async function(){};
/* ---- ZIP helpers ---- */
const CRC_T=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(b){let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=CRC_T[(c^b[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}
function zipStore(files){const enc=new TextEncoder();const parts=[],cd=[];let off=0;
  files.forEach(([name,str])=>{const nb=enc.encode(name),db=enc.encode(str),crc=crc32(db);
    const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint32(14,crc,true);h.setUint32(18,db.length,true);h.setUint32(22,db.length,true);h.setUint16(26,nb.length,true);
    parts.push(new Uint8Array(h.buffer),nb,db);
    const c=new DataView(new ArrayBuffer(46));c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint32(16,crc,true);c.setUint32(20,db.length,true);c.setUint32(24,db.length,true);c.setUint16(28,nb.length,true);c.setUint32(42,off,true);
    cd.push(new Uint8Array(c.buffer),nb);off+=30+nb.length+db.length});
  const cdSize=cd.reduce((s,a)=>s+a.length,0);const e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cdSize,true);e.setUint32(16,off,true);
  return new Blob([...parts,...cd,new Uint8Array(e.buffer)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
async function unzip(buf){const u8=new Uint8Array(buf),dv=new DataView(buf);let e=u8.length-22;while(e>=0&&dv.getUint32(e,true)!==0x06054b50)e--;if(e<0)throw new Error('zip');
  const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const out={};const dec=new TextDecoder();
  for(let i=0;i<n;i++){const method=dv.getUint16(p+10,true),csize=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lo=dv.getUint32(p+42,true);
    const name=dec.decode(u8.subarray(p+46,p+46+nl));const lnl=dv.getUint16(lo+26,true),lxl=dv.getUint16(lo+28,true);const data=u8.subarray(lo+30+lnl+lxl,lo+30+lnl+lxl+csize);
    out[name]={method,data};p+=46+nl+xl+cl}
  return {names:Object.keys(out),async text(name){const f=out[name];if(!f)return null;if(f.method===0)return dec.decode(f.data);
    const ds=new DecompressionStream('deflate-raw');const s=new Blob([f.data]).stream().pipeThrough(ds);return await new Response(s).text()}}}
/* ---- XLSX write ---- */
function xe(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'')}
function colL(i){let s='';i++;while(i){const r=(i-1)%26;s=String.fromCharCode(65+r)+s;i=Math.floor((i-1)/26)}return s}
function buildXlsx(sheets){const n=sheets.length;const names=[];
  sheets.forEach(([nm],i)=>{let x=String(nm).replace(/[\[\]\*\?\/\\:]/g,' ').slice(0,31)||('Sheet'+(i+1));while(names.includes(x))x=x.slice(0,28)+i;names.push(x)});
  const files=[['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+sheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')+'</Types>'],
   ['_rels/.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
   ['xl/workbook.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><bookViews><workbookView/></bookViews><sheets>'+names.map((nm,i)=>`<sheet name="${xe(nm)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')+'</sheets></workbook>'],
   ['xl/_rels/workbook.xml.rels','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+sheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')+`<Relationship Id="rId${n+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
   ['xl/styles.xml','<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Arial"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF0B5C8A"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="3" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>']];
  sheets.forEach(([,rows],si)=>{const keys=[];rows.forEach(r=>Object.keys(r).forEach(k=>{if(!keys.includes(k))keys.push(k)}));
    const cell=(ref,v,st)=>{if(v==null||v==='')return'';if(typeof v==='number'&&isFinite(v))return `<c r="${ref}" s="${st||2}"><v>${v}</v></c>`;return `<c r="${ref}" t="inlineStr"${st?` s="${st}"`:''}><is><t xml:space="preserve">${xe(v)}</t></is></c>`};
    let x='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView rightToLeft="1" workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>';
    keys.forEach((k,i)=>{const w=Math.max(k.length,...rows.slice(0,300).map(r=>String(r[k]??'').length));x+=`<col min="${i+1}" max="${i+1}" width="${Math.min(50,Math.max(10,w+2))}" customWidth="1"/>`});
    x+='</cols><sheetData><row r="1">'+keys.map((k,i)=>cell(colL(i)+'1',k,1)).join('')+'</row>';
    rows.forEach((r,ri)=>{x+=`<row r="${ri+2}">`+keys.map((k,i)=>cell(colL(i)+(ri+2),r[k])).join('')+'</row>'});
    x+='</sheetData>'+(keys.length&&rows.length?`<autoFilter ref="A1:${colL(keys.length-1)}${rows.length+1}"/>`:'')+'</worksheet>';
    files.push([`xl/worksheets/sheet${si+1}.xml`,x])});
  return zipStore(files)}
saveXlsx=async function(sheets,filename){try{const blob=buildXlsx(sheets.map(([n,r])=>[n,r.length?r:[{'':'لا توجد بيانات'}]]));await S.downloads.save({filename,data:blob});toast('تم تنزيل الملف')}catch(e){console.error(e);toast('تعذّر تجهيز الملف')}};
/* ---- XLSX read ---- */
async function readWorkbook(file){
  if(typeof DecompressionStream==='undefined')throw new Error('المتصفح قديم ولا يدعم قراءة ملفات Excel. استخدم Chrome أو Edge حديثًا.');
  let z;try{z=await unzip(await file.arrayBuffer())}catch(e){throw new Error('تعذّرت قراءة الملف. تأكد أنه ملف Excel بصيغة xlsx.')}
  const P=s=>new DOMParser().parseFromString(s,'application/xml');const M='http://schemas.openxmlformats.org/spreadsheetml/2006/main';
  const shared=[];const ss=await z.text('xl/sharedStrings.xml');if(ss){const d=P(ss);[...d.getElementsByTagNameNS(M,'si')].forEach(si=>shared.push([...si.getElementsByTagNameNS(M,'t')].map(t=>t.textContent).join('')))}
  const dateSt=new Set();const sty=await z.text('xl/styles.xml');if(sty){const d=P(sty);const custom={};[...d.getElementsByTagNameNS(M,'numFmt')].forEach(f=>custom[+f.getAttribute('numFmtId')]=f.getAttribute('formatCode')||'');
    const xfs=d.getElementsByTagNameNS(M,'cellXfs')[0];if(xfs)[...xfs.getElementsByTagNameNS(M,'xf')].forEach((xf,i)=>{const id=+(xf.getAttribute('numFmtId')||0),code=(custom[id]||'').toLowerCase();if((id>=14&&id<=22)||(id>=45&&id<=47)||(code&&/[dy]/.test(code)&&!/[#0]/.test(code)))dateSt.add(i)})}
  const wb=P(await z.text('xl/workbook.xml'));const rels=P(await z.text('xl/_rels/workbook.xml.rels'));const rel={};[...rels.getElementsByTagName('Relationship')].forEach(r=>rel[r.getAttribute('Id')]=r.getAttribute('Target'));
  const names=[],sheets={};
  for(const sh of [...wb.getElementsByTagNameNS(M,'sheet')]){const nm=sh.getAttribute('name');const rid=sh.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id');let t=rel[rid]||'';t=t.startsWith('/')?t.slice(1):'xl/'+t;const xml=await z.text(t);if(!xml)continue;
    const d=P(xml);const grid=[];
    [...d.getElementsByTagNameNS(M,'row')].forEach(row=>{const vals=[];[...row.getElementsByTagNameNS(M,'c')].forEach(c=>{const ref=c.getAttribute('r')||'';const L=(ref.match(/[A-Z]+/)||[''])[0];let ci=0;for(const ch of L)ci=ci*26+(ch.charCodeAt(0)-64);ci--;
      const ty=c.getAttribute('t'),s=+(c.getAttribute('s')||0),v=c.getElementsByTagNameNS(M,'v')[0];let val='';
      if(ty==='s'&&v)val=shared[+v.textContent]??'';else if(ty==='inlineStr')val=[...c.getElementsByTagNameNS(M,'t')].map(x=>x.textContent).join('');else if(ty==='str'||ty==='e')val=v?v.textContent:'';else if(ty==='b')val=v?v.textContent==='1':'';
      else if(v){const num=parseFloat(v.textContent);if(isNaN(num))val=v.textContent;else if(dateSt.has(s)){const dt=new Date(Date.UTC(1899,11,30)+Math.round(num*86400000));val=dt.toISOString().slice(0,10)}else val=num}
      if(ci>=0)vals[ci]=val});if(vals.length)grid.push(Array.from(vals,x=>x===undefined?'':x))});
    const rows=[];if(grid.length){const h=grid[0].map(x=>String(x).trim());grid.slice(1).forEach(g=>{if(!g.some(x=>String(x).trim()))return;const o={};h.forEach((k,i)=>{if(k)o[k]=g[i]??''});rows.push(o)})}
    names.push(nm);sheets[nm]=rows}
  return {SheetNames:names,rows:n=>sheets[n]||[]}}
/* ---- banner + settings: backup ---- */
dbBanner=function(){return window.__store.ok()?'':`<div class="banner">تعذّر الحفظ في هذا المتصفح (ربما تعمل في نافذة خاصة). احفظ نسخة من البيانات من صفحة الإعدادات قبل الإغلاق.</div>`};
const __vs=viewSettings;
viewSettings=function(){const st=window.__store.get();const n=Object.values(st).reduce((s,o)=>s+Object.keys(o).length,0);
  return __vs()+`<div class="panel"><h3 class="section-title">حفظ البيانات ونقلها بين الأجهزة</h3>
   <p class="muted" style="margin:0 0 10px;font-size:13px">هذه النسخة تحفظ كل التعديلات داخل هذا المتصفح على هذا الجهاز تلقائيًا (${n} سجل حاليًا). لنقل بياناتك إلى زميل أو جهاز آخر، أو للاحتفاظ بنسخة احتياطية: احفظ «ملف بيانات المنظومة» ثم افتحه من «استعادة» على الجهاز الآخر.</p>
   <div class="toolbar"><button class="btn primary" data-act="backup-save">${I.down}حفظ ملف بيانات المنظومة</button>
   <label class="btn">${I.up}استعادة من ملف بيانات<input type="file" id="restore-file" accept=".json,application/json" hidden></label>
   <button class="btn danger" data-act="reset-data">إرجاع البيانات الأصلية</button></div><div id="bk-msg" style="margin-top:10px"></div></div>`};
const __as=afterRender.settings;
afterRender.settings=()=>{__as();const f=document.getElementById('restore-file');if(f)f.addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;const m=document.getElementById('bk-msg');
  try{const j=JSON.parse(await file.text());if(!j||j.app!=='contracts-system'||!j.data)throw 0;window.__store.replace(j.data);toast('تمت استعادة البيانات');m.innerHTML=`<div class="banner info">تمت استعادة البيانات من ملف بتاريخ ${esc((j.savedAt||'').slice(0,16).replace('T',' '))}.</div>`}
  catch(err){m.innerHTML='<div class="banner">الملف غير صالح. اختر ملف بيانات محفوظًا من هذه المنظومة.</div>'}e.target.value=''})};
document.addEventListener('click',e=>{const a=e.target.closest('[data-act]');if(!a)return;
  if(a.dataset.act==='backup-save'){const j={app:'contracts-system',version:1,savedAt:new Date().toISOString(),data:window.__store.get()};S.downloads.save({filename:'بيانات-المنظومة-'+TODAY_ISO+'.json',data:new Blob([JSON.stringify(j)],{type:'application/json'})});toast('تم حفظ ملف البيانات')}
  if(a.dataset.act==='reset-data'){if(!a.classList.contains('armed')){a.classList.add('armed');a.textContent='سيُحذف كل ما أضفته. اضغط للتأكيد';setTimeout(()=>{a.classList.remove('armed');a.textContent='إرجاع البيانات الأصلية'},4000);return}window.__store.reset();toast('تم إرجاع البيانات الأصلية')}
});
