/* ===== قراءة ملفات الاستيراد بكل الصيغ الشائعة (FileImport) =====
   One reader for every import button (SMS055, sales analysis, transfers, receipts, debts, profit margin and the
   contracts import in Settings). Loaded right after settings.js (which provides unzip()).
   The format is recognised from the file's content, not only its extension:
     ZIP  → .xlsx .xlsm .xltx .xltm (and WPS .et/.ett saved in the new format) · .xlsb · .ods .ots
     OLE2 → .xls .xlt and WPS .et .ett (BIFF8, and Excel 5/95 BIFF5)
     text → .csv .tsv .tab .txt (comma, semicolon, tab or pipe; UTF-8, UTF-16 or Windows-1256 Arabic)
            .htm .html (tables, including the «.xls» files that are really HTML), Excel 2003 XML (.xml),
            flat OpenDocument (.fods) and .json (array of rows, array of arrays, or {sheet:[rows]})
   FileImport.readGrids(file) → [{name, grid}] where grid is rows of cells: number, string, boolean, or {serial:n}
   for a date-formatted cell (Excel serial day, 1900 system). FileImport.readWorkbook(file) → {SheetNames, rows(name)}
   with the first row as the header (dates as yyyy-mm-dd). Errors are thrown with a clear message in the page language. */
"use strict";
(function(){
const EN=()=>{if(window.I18N&&I18N.lang)return I18N.lang==='en';try{return localStorage.getItem('cm_lang')==='en'}catch(e){return false}};
const tr=(ar,en)=>EN()&&en?en:ar;
const ACCEPT='.xlsx,.xlsm,.xltx,.xltm,.xlsb,.xls,.xlt,.et,.ett,.ods,.ots,.fods,.csv,.tsv,.tab,.txt,.htm,.html,.xml,.json,'+
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,application/vnd.oasis.opendocument.spreadsheet,text/csv,text/tab-separated-values';
const LIST='Excel (xlsx · xlsm · xlsb · xls) · WPS (et · ett) · OpenDocument (ods) · CSV · TSV · TXT · HTML · XML · JSON';
const MAX=200*1024*1024,MAX_CELLS=5e6;
const fail=(ar,en)=>{const e=new Error(tr(ar,en));e.importError=true;return e};
const unsupported=()=>fail('صيغة الملف غير مدعومة. الصيغ المقبولة: '+LIST+'. افتح الملف في Excel أو WPS واحفظه بإحدى هذه الصيغ ثم أعد المحاولة.','This file type is not supported. Accepted: '+LIST+'. Open the file in Excel or WPS, save it in one of these formats and try again.');
const damaged=()=>fail('تعذّرت قراءة الملف: يبدو أنه تالف أو غير مكتمل. افتحه في Excel أو WPS واحفظه من جديد ثم أعد المحاولة.','Could not read the file: it looks damaged or incomplete. Open it in Excel or WPS, save it again and retry.');
const locked=()=>fail('الملف محمي بكلمة مرور. أزل الحماية (ملف ← معلومات ← حماية المصنف) واحفظه ثم أعد الاستيراد.','The file is password-protected. Remove the protection, save it and import again.');
const isDateCode=code=>{const c=String(code||'').toLowerCase().replace(/"[^"]*"|\\.|\[[^\]]*\]/g,'');return /[dy]/.test(c)&&!/[#0?]/.test(c)};
/* built-in number formats that are dates: 14–22, 45–47, and the East-Asian locale dates 27–36, 50–58 (WPS writes these) */
const isDateId=id=>(id>=14&&id<=22)||(id>=27&&id<=36)||(id>=45&&id<=47)||(id>=50&&id<=58);
const isDateFmt=(id,custom)=>custom[id]!=null?isDateCode(custom[id]):isDateId(id);
const serialOf=(y,m,d,hh,mi,ss)=>(Date.UTC(y,m-1,d,hh||0,mi||0,ss||0)-Date.UTC(1899,11,30))/86400000;
const isoSerial=s=>{const x=String(s||'').match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?)?/);return x?serialOf(+x[1],+x[2],+x[3],+(x[4]||0),+(x[5]||0),+(x[6]||0)):null};
const trimGrid=grid=>{while(grid.length&&!grid[grid.length-1].some(c=>c!==''&&c!=null))grid.pop();return grid.map(r=>{let n=r.length;while(n&&(r[n-1]===''||r[n-1]==null))n--;return Array.from({length:n},(_,i)=>r[i]==null?'':r[i])})};
const colIdx=ref=>{const L=(String(ref).match(/^[A-Z]+/)||[''])[0];let c=0;for(const ch of L)c=c*26+(ch.charCodeAt(0)-64);return L?c-1:-1};
const XP=s=>{const d=new DOMParser().parseFromString(s,'application/xml');if(d.getElementsByTagName('parsererror').length)throw damaged();return d};

/* ---------- Office Open XML (.xlsx .xlsm .xltx .xltm, WPS et/ett in the new format) ---------- */
async function readXlsx(z){const M='http://schemas.openxmlformats.org/spreadsheetml/2006/main',R='http://schemas.openxmlformats.org/officeDocument/2006/relationships';
  const wbx=await z.text('xl/workbook.xml');const wb=XP(wbx);const pr=wb.getElementsByTagNameNS(M,'workbookPr')[0];const d1904=!!pr&&/^(1|true)$/.test(pr.getAttribute('date1904')||'');
  const rels={};const rx=await z.text('xl/_rels/workbook.xml.rels');if(rx)[...XP(rx).getElementsByTagName('Relationship')].forEach(r=>rels[r.getAttribute('Id')]=r.getAttribute('Target'));
  const path=t=>{t=String(t||'');return t.startsWith('/')?t.slice(1):'xl/'+t.replace(/^\.\//,'')};
  const ssName=Object.values(rels).find(t=>/sharedStrings/i.test(t));
  const shared=[];const ss=await z.text(ssName?path(ssName):'xl/sharedStrings.xml');
  if(ss){const d=XP(ss);[...d.getElementsByTagNameNS(M,'si')].forEach(si=>{const ts=[...si.getElementsByTagNameNS(M,'t')].filter(t=>!(t.parentNode&&t.parentNode.localName==='rPh'));shared.push(ts.map(t=>t.textContent).join(''))})}
  const dateSt=new Set();const sty=await z.text('xl/styles.xml');
  if(sty){const d=XP(sty);const custom={};[...d.getElementsByTagNameNS(M,'numFmt')].forEach(f=>custom[+f.getAttribute('numFmtId')]=f.getAttribute('formatCode')||'');
    const xfs=d.getElementsByTagNameNS(M,'cellXfs')[0];if(xfs)[...xfs.getElementsByTagNameNS(M,'xf')].forEach((xf,i)=>{if(isDateFmt(+(xf.getAttribute('numFmtId')||0),custom))dateSt.add(i)})}
  const out=[];let cells=0;
  for(const sh of [...wb.getElementsByTagNameNS(M,'sheet')]){const xml=await z.text(path(rels[sh.getAttributeNS(R,'id')]));if(!xml)continue;
    const d=XP(xml);const grid=[];
    [...d.getElementsByTagNameNS(M,'row')].forEach((row,ri)=>{const rn=+(row.getAttribute('r')||0);const at=rn>0?rn-1:grid.length;while(grid.length<at)grid.push([]);
      const vals=[];[...row.getElementsByTagNameNS(M,'c')].forEach((c,j)=>{let ci=colIdx(c.getAttribute('r')||'');if(ci<0)ci=vals.length;
        const ty=c.getAttribute('t'),s=+(c.getAttribute('s')||0),v=c.getElementsByTagNameNS(M,'v')[0];let val='';
        if(ty==='s'&&v)val=shared[+v.textContent]??'';
        else if(ty==='inlineStr')val=[...c.getElementsByTagNameNS(M,'t')].map(x=>x.textContent).join('');
        else if(ty==='str'||ty==='e')val=v?v.textContent:'';
        else if(ty==='b')val=v?v.textContent==='1':'';
        else if(ty==='d'){const n=v?isoSerial(v.textContent):null;val=n==null?(v?v.textContent:''):{serial:n}}
        else if(v){const n=parseFloat(v.textContent);if(isNaN(n))val=v.textContent;else if(dateSt.has(s))val={serial:d1904?n+1462:n};else val=n}
        vals[ci]=val;cells++});
      if(cells>MAX_CELLS)throw fail('الملف أكبر من أن يُقرأ في المتصفح. قسّمه إلى ملفات أصغر.','The file is too large to read in the browser. Split it into smaller files.');
      grid[at]=Array.from(vals,x=>x===undefined?'':x)});
    out.push({name:sh.getAttribute('name')||('Sheet'+(out.length+1)),grid:trimGrid(grid)})}
  return out}

/* ---------- Excel binary workbook (.xlsb) ---------- */
async function readXlsb(z){
  const recs=u8=>{const out=[];let p=0;const vi=()=>{let v=0,s=0,b;do{b=u8[p++];v|=(b&127)<<s;s+=7}while(b&128&&s<28);return v};
    while(p<u8.length){const t=vi(),n=vi();out.push([t,u8.subarray(p,p+n)]);p+=n}return out};
  const dv=b=>new DataView(b.buffer,b.byteOffset,b.byteLength);
  const wstr=(b,o)=>{const n=dv(b).getUint32(o,true);let s='';for(let i=0;i<n;i++)s+=String.fromCharCode(dv(b).getUint16(o+4+i*2,true));return [s,o+4+n*2]};
  const rk=x=>{let v;if(x&2)v=x>>2;else{const b=new DataView(new ArrayBuffer(8));b.setUint32(4,x&0xFFFFFFFC,true);v=b.getFloat64(0,true)}return x&1?v/100:v};
  const rels={};const rx=await z.text('xl/_rels/workbook.bin.rels');if(rx)[...XP(rx).getElementsByTagName('Relationship')].forEach(r=>rels[r.getAttribute('Id')]=r.getAttribute('Target'));
  const sheets=[];recs(await z.bytes('xl/workbook.bin')).forEach(([t,b])=>{if(t===156){const [rid,o]=wstr(b,8);const [nm]=wstr(b,o);sheets.push([nm,rels[rid]])}});
  const shared=[];const sb=await z.bytes('xl/sharedStrings.bin');if(sb)recs(sb).forEach(([t,b])=>{if(t===19)shared.push(wstr(b,1)[0])});
  const custom={},xfs=[];const st=await z.bytes('xl/styles.bin');let inXf=false;
  if(st)recs(st).forEach(([t,b])=>{if(t===44)custom[dv(b).getUint16(0,true)]=wstr(b,2)[0];else if(t===617)inXf=true;else if(t===618)inXf=false;else if(t===47&&inXf)xfs.push(dv(b).getUint16(2,true))});
  const out=[];
  for(const [nm,target] of sheets){const b=await z.bytes('xl/'+String(target||'').replace(/^\//,'').replace(/^xl\//,''));if(!b)continue;const grid=[];let row=0;
    recs(b).forEach(([t,c])=>{if(t===0){row=dv(c).getUint32(0,true);return}if(t<1||t>11)return;const d=dv(c);const col=d.getUint32(0,true),xf=d.getUint32(4,true)&0xFFFFFF;let v='';
      if(t===2||t===5||t===9){const n=t===2?rk(d.getUint32(8,true)):d.getFloat64(8,true);v=isDateFmt(xfs[xf]||0,custom)?{serial:n}:n}
      else if(t===7)v=shared[d.getUint32(8,true)]??'';else if(t===6||t===8)v=wstr(c,8)[0];else if(t===4||t===10)v=!!c[8];else return;
      (grid[row]||(grid[row]=[]))[col]=v});
    out.push({name:nm,grid:trimGrid(Array.from(grid,r=>r?Array.from(r,x=>x===undefined?'':x):[]))})}
  return out}

/* ---------- OpenDocument spreadsheet (.ods .ots, and flat .fods) ---------- */
function readOdsXml(xml){const T='urn:oasis:names:tc:opendocument:xmlns:table:1.0',O='urn:oasis:names:tc:opendocument:xmlns:office:1.0',X='urn:oasis:names:tc:opendocument:xmlns:text:1.0';
  const d=XP(xml);const out=[];
  for(const tb of [...d.getElementsByTagNameNS(T,'table')]){const grid=[];let blankRows=0;
    const rows=[...tb.getElementsByTagNameNS(T,'table-row')];
    for(const r of rows){const rr=Math.min(+(r.getAttributeNS(T,'number-rows-repeated')||1),100000);const vals=[];let blank=0;
      for(const c of [...r.children].filter(n=>n.namespaceURI===T&&/^(covered-)?table-cell$/.test(n.localName))){const rep=Math.min(+(c.getAttributeNS(T,'number-columns-repeated')||1),16384);
        const ty=c.getAttributeNS(O,'value-type')||'';let v='';
        if(ty==='float'||ty==='percentage'||ty==='currency')v=parseFloat(c.getAttributeNS(O,'value'));
        else if(ty==='date'){const n=isoSerial(c.getAttributeNS(O,'date-value'));v=n==null?'':{serial:n}}
        else if(ty==='boolean')v=c.getAttributeNS(O,'boolean-value')==='true';
        else{const ps=[...c.getElementsByTagNameNS(X,'p')];v=ps.length?ps.map(p=>p.textContent).join('\n'):'';if(ty==='time'&&!v)v=c.getAttributeNS(O,'time-value')||''}
        if(typeof v==='number'&&isNaN(v))v='';
        if(v===''){blank+=rep;continue}
        while(blank){vals.push('');blank--}for(let i=0;i<rep;i++)vals.push(v)}
      if(!vals.length){blankRows+=rr;continue}
      while(blankRows){grid.push([]);blankRows--}for(let i=0;i<rr;i++)grid.push(vals.slice())
      if(grid.length*Math.max(1,vals.length)>MAX_CELLS)throw fail('الملف أكبر من أن يُقرأ في المتصفح. قسّمه إلى ملفات أصغر.','The file is too large to read in the browser. Split it into smaller files.')}
    out.push({name:tb.getAttributeNS(T,'name')||('Sheet'+(out.length+1)),grid:trimGrid(grid)})}
  return out}

/* ---------- OLE2 compound file → BIFF8 / BIFF5 (.xls .xlt, WPS .et .ett) ---------- */
function cfbStreams(buf){const u8=new Uint8Array(buf),d=new DataView(buf);if(u8.length<512)throw damaged();
  const ss=1<<d.getUint16(30,true),ms=1<<d.getUint16(32,true),nFat=d.getUint32(44,true),dir0=d.getUint32(48,true),cutoff=d.getUint32(56,true),mf0=d.getUint32(60,true),nMf=d.getUint32(64,true);let dif=d.getUint32(68,true),nDif=d.getUint32(72,true);
  if(ss!==512&&ss!==4096)throw damaged();
  const off=s=>(s+1)*ss;const END=0xFFFFFFFE;
  const fatSecs=[];for(let i=0;i<109&&fatSecs.length<nFat;i++)fatSecs.push(d.getUint32(76+i*4,true));
  while(dif<END&&nDif-->0&&fatSecs.length<nFat){for(let i=0;i<ss/4-1&&fatSecs.length<nFat;i++)fatSecs.push(d.getUint32(off(dif)+i*4,true));dif=d.getUint32(off(dif)+ss-4,true)}
  const fat=new Uint32Array(fatSecs.length*ss/4);fatSecs.forEach((s,i)=>{for(let j=0;j<ss/4;j++){const o=off(s)+j*4;fat[i*ss/4+j]=o+4<=u8.length?d.getUint32(o,true):END}});
  const chain=(s,t)=>{const out=[];let g=0;while(s<END&&s<t.length&&g++<t.length){out.push(s);s=t[s]}return out};
  const read=(s,size)=>{const c=chain(s,fat);const b=new Uint8Array(c.length*ss);c.forEach((x,i)=>b.set(u8.subarray(off(x),off(x)+ss),i*ss));return size==null?b:b.subarray(0,size)};
  const dir=read(dir0);const dd=new DataView(dir.buffer);const ents=[];
  for(let o=0;o+128<=dir.length;o+=128){const nl=dd.getUint16(o+64,true);if(!nl)continue;let nm='';for(let i=0;i<nl/2-1;i++)nm+=String.fromCharCode(dd.getUint16(o+i*2,true));
    ents.push({nm,type:dir[o+66],start:dd.getUint32(o+116,true),size:dd.getUint32(o+120,true)})}
  const root=ents.find(e=>e.type===5);let mini=null,mfat=null;
  const get=name=>{const e=ents.find(x=>x.type===2&&x.nm.toLowerCase()===name.toLowerCase());if(!e)return null;
    if(e.size>=cutoff||!root)return read(e.start,e.size);
    if(!mini){mini=read(root.start,root.size);const mb=read(mf0);mfat=new Uint32Array(mb.buffer,0,Math.min(nMf*ss/4,mb.length/4|0))}
    const c=chain(e.start,mfat);const b=new Uint8Array(c.length*ms);c.forEach((x,i)=>b.set(mini.subarray(x*ms,x*ms+ms),i*ms));return b.subarray(0,e.size)};
  return {names:ents.map(e=>e.nm),get}}
function readBiff(b){const d=new DataView(b.buffer,b.byteOffset,b.byteLength);const n=b.length;
  let biff=8,cp='windows-1252',d1904=false;const sheets=[],sst=[],custom={},xfFmt=[];
  const dec=(bytes)=>{try{return new TextDecoder(cp).decode(bytes)}catch(e){return new TextDecoder('windows-1252').decode(bytes)}};
  const u16s=(o,len)=>{let s='';for(let i=0;i<len;i++)s+=String.fromCharCode(d.getUint16(o+i*2,true));return s};
  /* string with a 16-bit (or 8-bit) count followed by an options byte (BIFF8), or plain code-page bytes (BIFF5) */
  const xstr=(o,wide)=>{const cch=wide?d.getUint16(o,true):b[o];o+=wide?2:1;if(biff<8)return dec(b.subarray(o,o+cch));const f=b[o++];
    if(f&8)o+=2;if(f&4)o+=4;return f&1?u16s(o,cch):dec8(o,cch)};
  const dec8=(o,len)=>{let s='';for(let i=0;i<len;i++)s+=String.fromCharCode(b[o+i]);return s};
  const rk=x=>{let v;if(x&2)v=x>>2;else{const t=new DataView(new ArrayBuffer(8));t.setUint32(4,x&0xFFFFFFFC,true);v=t.getFloat64(0,true)}return x&1?v/100:v};
  const num=(v,xf)=>isDateFmt(xfFmt[xf]??0,custom)?{serial:d1904?v+1462:v}:v;
  /* the shared string table can run over several CONTINUE records; a string cut at a boundary restarts with a new options byte */
  const readSst=segs=>{let si=0,p=0;
    const byte=()=>{while(si<segs.length&&p>=segs[si].length){si++;p=0}if(si>=segs.length)throw damaged();return segs[si][p++]};
    const rd=k=>{let v=0;for(let i=0;i<k;i++)v+=byte()*2**(8*i);return v};
    rd(4);const uniq=rd(4);
    for(let i=0;i<uniq;i++){while(si<segs.length&&p>=segs[si].length){si++;p=0}if(si>=segs.length)break;
      const cch=rd(2);let f=byte();const runs=f&8?rd(2):0,ext=f&4?rd(4):0;let s='';
      for(let k=0;k<cch;k++){if(p>=segs[si].length){si++;p=0;if(si>=segs.length)break;f=segs[si][p++]}s+=String.fromCharCode(f&1?byte()|(byte()<<8):byte())}
      for(let k=runs*4+ext;k>0;k--){if(si>=segs.length)break;if(p<segs[si].length)p++;else{si++;p=0;k++}}
      sst.push(s)}};
  let p=0,ws=null,pendingFormula=null,sstSegs=null,first=true;const stack=[];
  while(p+4<=n){const t=d.getUint16(p,true),len=d.getUint16(p+2,true),o=p+4;p=o+len;if(p>n)break;
    if(sstSegs&&t!==0x3C){readSst(sstSegs);sstSegs=null}
    switch(t){
      case 0x0809:case 0x0409:case 0x0209:case 0x0009:{const ver=d.getUint16(o,true),dt=d.getUint16(o+2,true);if(first){biff=ver===0x0600?8:ver===0x0500?5:t===0x0809?8:5;first=false}
        stack.push(ws);
        if(dt===0x10){const i=sheets.findIndex(s=>s.pos===o-4);ws=i>=0?sheets[i]:{name:'Sheet'+(sheets.length+1),grid:[]};if(i<0)sheets.push(ws);ws.grid=ws.grid||[]}else ws=null;break}
      case 0x000A:ws=stack.length?stack.pop():null;break;
      case 0x002F:throw locked();
      case 0x0042:{const c=d.getUint16(o,true);cp=c===1200?'utf-16le':c===1256?'windows-1256':c===1252||c===32769?'windows-1252':c>=874&&c<=1258?'windows-'+c:c===10000?'macintosh':'windows-1252';break}
      case 0x0022:d1904=d.getUint16(o,true)===1;break;
      case 0x0085:{const pos=d.getUint32(o,true),kind=b[o+5];const name=biff<8?dec(b.subarray(o+7,o+7+b[o+6])):xstr(o+6,false);if(kind===0)sheets.push({pos,name,grid:null});break}
      case 0x041E:case 0x001E:{if(biff>=8){custom[d.getUint16(o,true)]=xstr(o+2,true)}else{custom[d.getUint16(o,true)]=dec(b.subarray(o+3,o+3+b[o+2]))}break}
      case 0x00E0:xfFmt.push(d.getUint16(o+2,true));break;
      case 0x00FC:sstSegs=[b.subarray(o,o+len)];break;
      case 0x003C:if(sstSegs)sstSegs.push(b.subarray(o,o+len));break;
      default:if(ws){const g=ws.grid,r=d.getUint16(o,true),c=d.getUint16(o+2,true),xf=d.getUint16(o+4,true);const put=(rr,cc,v)=>{(g[rr]||(g[rr]=[]))[cc]=v};
        if(t===0x0203)put(r,c,num(d.getFloat64(o+6,true),xf));
        else if(t===0x027E)put(r,c,num(rk(d.getUint32(o+6,true)),xf));
        else if(t===0x00BD){const last=d.getUint16(o+len-2,true);for(let k=0,cc=c;cc<=last;cc++,k++){const q=o+4+k*6;put(r,cc,num(rk(d.getUint32(q+2,true)),d.getUint16(q,true)))}}
        else if(t===0x00FD)put(r,c,sst[d.getUint32(o+6,true)]??'');
        else if(t===0x0204||t===0x00D6)put(r,c,xstr(o+6,true));
        else if(t===0x0205){const v=b[o+6],err=b[o+7];put(r,c,err?'':!!v)}
        else if(t===0x0006||t===0x0406||t===0x0206){const tag=d.getUint16(o+12,true);if(tag===0xFFFF){const k=b[o+6];if(k===0)pendingFormula=[r,c];else if(k===1)put(r,c,!!b[o+8]);else put(r,c,'')}else put(r,c,num(d.getFloat64(o+6,true),xf))}
        else if(t===0x0207&&pendingFormula){put(pendingFormula[0],pendingFormula[1],biff<8?dec(b.subarray(o+2,o+2+d.getUint16(o,true))):xstr(o,true));pendingFormula=null}
        }}}
  if(sstSegs)readSst(sstSegs);
  return sheets.filter(s=>s.grid).map(s=>({name:s.name,grid:trimGrid(Array.from(s.grid,r=>r?Array.from(r,x=>x===undefined?'':x):[]))}))}

/* ---------- text: delimited, HTML tables, Excel 2003 XML, flat ODS, JSON ---------- */
function wideText(u8){if(u8[0]===0xFF&&u8[1]===0xFE||u8[0]===0xFE&&u8[1]===0xFF)return true;let z=0;const k=Math.min(u8.length,400);for(let i=1;i<k;i+=2)if(u8[i]===0)z++;return k>8&&z>k/4}
function decodeText(u8){
  if(u8[0]===0xFF&&u8[1]===0xFE)return new TextDecoder('utf-16le').decode(u8.subarray(2));
  if(u8[0]===0xFE&&u8[1]===0xFF)return new TextDecoder('utf-16be').decode(u8.subarray(2));
  if(u8[0]===0xEF&&u8[1]===0xBB&&u8[2]===0xBF)return new TextDecoder('utf-8').decode(u8.subarray(3));
  /* UTF-16 without a mark (WPS «Unicode text»): every other byte is zero */
  if(wideText(u8))return new TextDecoder('utf-16le').decode(u8);
  try{return new TextDecoder('utf-8',{fatal:true}).decode(u8)}catch(e){}
  /* Excel and WPS save «CSV» on Arabic Windows in the ANSI code page */
  return new TextDecoder('windows-1256').decode(u8)}
function delimGrid(text,name){const lines=text.split(/\r\n|\n|\r/).filter(l=>l.trim()).slice(0,30);
  const score=ch=>{const c=lines.map(l=>{let n=0,q=false;for(const x of l){if(x==='"')q=!q;else if(x===ch&&!q)n++}return n});const nz=c.filter(x=>x>0);if(!nz.length)return -1;const m=Math.max(...nz),same=c.filter(x=>x===m).length;return same*100+m};
  const sep=['\t',',',';','|'].map(c=>[c,score(c)]).sort((a,b)=>b[1]-a[1])[0];const d=sep[1]>0?sep[0]:'\t';
  const rows=[];let row=[],f='',q=false,quoted=false;
  for(let i=0;i<text.length;i++){const c=text[i];
    if(q){if(c==='"'){if(text[i+1]==='"'){f+='"';i++}else q=false}else f+=c;continue}
    if(c==='"'&&f.trim()===''&&!quoted){q=true;quoted=true;f='';continue}
    if(c===d){row.push(quoted?f:f.trim());f='';quoted=false;continue}
    if(c==='\n'||c==='\r'){if(c==='\r'&&text[i+1]==='\n')i++;row.push(quoted?f:f.trim());rows.push(row);row=[];f='';quoted=false;continue}
    f+=c}
  if(f!==''||row.length){row.push(quoted?f:f.trim());rows.push(row)}
  return [{name,grid:trimGrid(rows),text:true}]}
function htmlGrids(text){const d=new DOMParser().parseFromString(text,'text/html');const out=[];
  [...d.querySelectorAll('table')].forEach((t,i)=>{if(t.querySelector('table'))return;const grid=[];
    [...t.rows].forEach((r,ri)=>{const row=grid[ri]||(grid[ri]=[]);let ci=0;
      [...r.cells].forEach(c=>{while(row[ci]!==undefined)ci++;const v=(c.innerText!=null&&c.innerText!==''?c.innerText:c.textContent).replace(/ /g,' ').trim();
        const cs=Math.min(+c.colSpan||1,200),rs=Math.min(+c.rowSpan||1,500);row[ci]=v;for(let k=1;k<cs;k++)row[ci+k]='';
        for(let k=1;k<rs;k++){const rr=grid[ri+k]||(grid[ri+k]=[]);for(let j=0;j<cs;j++)rr[ci+j]=''}ci+=cs})});
    out.push({name:(t.caption&&t.caption.textContent.trim())||('table'+(out.length+1)),grid:trimGrid(grid.map(r=>Array.from(r,x=>x===undefined?'':x))),text:true})});
  return out}
function spreadsheetMl(text){const S='urn:schemas-microsoft-com:office:spreadsheet';const d=XP(text);const out=[];
  for(const w of [...d.getElementsByTagNameNS(S,'Worksheet')]){const grid=[];let r=0;
    for(const row of [...w.getElementsByTagNameNS(S,'Row')]){const ix=+(row.getAttributeNS(S,'Index')||0);if(ix)r=ix-1;const vals=[];let c=0;
      for(const cell of [...row.getElementsByTagNameNS(S,'Cell')]){const cx=+(cell.getAttributeNS(S,'Index')||0);if(cx)c=cx-1;const dt=cell.getElementsByTagNameNS(S,'Data')[0];let v='';
        if(dt){const ty=dt.getAttributeNS(S,'Type'),s=dt.textContent;v=ty==='Number'?parseFloat(s):ty==='DateTime'?(isoSerial(s)!=null?{serial:isoSerial(s)}:s):ty==='Boolean'?s==='1':s;if(typeof v==='number'&&isNaN(v))v=''}
        vals[c]=v;c+=1+(+(cell.getAttributeNS(S,'MergeAcross')||0))}
      grid[r++]=Array.from(vals,x=>x===undefined?'':x)}
    out.push({name:w.getAttributeNS(S,'Name')||('Sheet'+(out.length+1)),grid:trimGrid(Array.from(grid,x=>x||[]))})}
  return out}
function jsonGrids(text,name){let j;try{j=JSON.parse(text)}catch(e){throw fail('ملف JSON غير صالح: تأكد أنه مصفوفة صفوف مثل [{"العمود":"القيمة"}].','Invalid JSON file: it should be an array of rows such as [{"column":"value"}].')}
  const toGrid=a=>{if(!Array.isArray(a))return null;if(a.every(Array.isArray))return a.map(r=>r.map(cellJ));if(!a.every(r=>r&&typeof r==='object'))return null;
    const keys=[];a.forEach(r=>Object.keys(r).forEach(k=>{if(!keys.includes(k))keys.push(k)}));return [keys,...a.map(r=>keys.map(k=>cellJ(r[k])))]};
  const cellJ=v=>v==null?'':typeof v==='number'||typeof v==='boolean'?v:typeof v==='object'?JSON.stringify(v):String(v);
  const g=toGrid(j);if(g)return [{name,grid:trimGrid(g)}];
  if(j&&typeof j==='object'){const out=Object.entries(j).map(([k,v])=>{const gg=toGrid(v);return gg?{name:k,grid:trimGrid(gg)}:null}).filter(Boolean);if(out.length)return out}
  throw fail('ملف JSON لا يحتوي جدولًا: المطلوب مصفوفة صفوف مثل [{"العمود":"القيمة"}].','The JSON file has no table: expected an array of rows such as [{"column":"value"}].')}

/* ---------- entry points ---------- */
const EXT=f=>(String(f&&f.name||'').match(/\.([a-z0-9]+)$/i)||['',''])[1].toLowerCase();
async function readGrids(file){
  if(!file||!file.size)throw fail('الملف فارغ.','The file is empty.');
  if(file.size>MAX)throw fail('الملف أكبر من 200 ميغابايت. قسّمه إلى ملفات أصغر.','The file is over 200 MB. Split it into smaller files.');
  const ext=EXT(file);const buf=await file.arrayBuffer();const u8=new Uint8Array(buf);const base=String(file.name||'sheet').replace(/\.[^.]+$/,'')||'sheet';
  let out;
  if(u8[0]===0x50&&u8[1]===0x4B){
    if(typeof DecompressionStream==='undefined')throw fail('المتصفح قديم ولا يدعم قراءة ملفات Excel. استخدم Chrome أو Edge حديثًا.','This browser cannot read Excel files. Use a recent Chrome or Edge.');
    let z;try{z=await unzip(buf)}catch(e){throw damaged()}
    const has=n=>z.names.includes(n);
    try{
      if(has('xl/workbook.xml'))out=await readXlsx(z);
      else if(has('xl/workbook.bin'))out=await readXlsb(z);
      else if(has('content.xml')&&/spreadsheet/.test((await z.text('mimetype'))||'spreadsheet'))out=readOdsXml(await z.text('content.xml'));
      else if(z.names.some(n=>/^Index\/.*\.iwa$/.test(n)))throw fail('ملفات Apple Numbers لا تُقرأ مباشرة. من Numbers اختر ملف ← تصدير إلى ← Excel، ثم استورد الملف الناتج.','Apple Numbers files cannot be read directly. In Numbers choose File → Export To → Excel, then import that file.');
      else if(has('word/document.xml')||has('ppt/presentation.xml')||(has('content.xml')))throw fail('هذا مستند نصي أو عرض تقديمي وليس جدول بيانات. اختر ملف الجدول (Excel أو WPS أو CSV).','This is a document or presentation, not a spreadsheet. Choose the spreadsheet file (Excel, WPS or CSV).');
      else throw unsupported();
    }catch(e){if(e.importError)throw e;console.error(e);throw damaged()}}
  else if(u8[0]===0xD0&&u8[1]===0xCF&&u8[2]===0x11&&u8[3]===0xE0){let c;try{c=cfbStreams(buf)}catch(e){throw damaged()}
    const lower=c.names.map(x=>x.toLowerCase());
    if(lower.includes('encryptedpackage')||lower.includes('encryptioninfo'))throw locked();
    const wb=c.get('Workbook')||c.get('Book');
    if(!wb){if(lower.includes('worddocument'))throw fail('هذا مستند Word وليس جدول بيانات.','This is a Word document, not a spreadsheet.');throw unsupported()}
    try{out=readBiff(wb)}catch(e){if(e.importError)throw e;console.error(e);throw damaged()}}
  else{
    /* binary that is none of the above (pdf, images, archives…) */
    const bin=[[0x25,0x50,0x44,0x46],[0x89,0x50,0x4E,0x47],[0xFF,0xD8,0xFF],[0x52,0x61,0x72,0x21],[0x37,0x7A,0xBC,0xAF],[0x1F,0x8B]];
    if(bin.some(m=>m.every((x,i)=>u8[i]===x)))throw unsupported();
    if(!wideText(u8)){let ctrl=0;const k=Math.min(u8.length,4000);for(let i=0;i<k;i++){const x=u8[i];if(x<9||(x>13&&x<32&&x!==27))ctrl++}if(ctrl>k*0.02)throw unsupported()}
    const text=decodeText(u8);
    const head=text.replace(/^﻿/,'').trimStart();
    if(ext==='json'||/^[\[{]/.test(head)&&ext!=='csv'&&ext!=='txt'&&ext!=='tsv')out=jsonGrids(head,base);
    else if(/^</.test(head)){
      if(/urn:schemas-microsoft-com:office:spreadsheet/.test(head.slice(0,4000)))out=spreadsheetMl(head);
      else if(/<office:document[\s>]/.test(head.slice(0,4000)))out=readOdsXml(head);
      else if(/<table[\s>]/i.test(head))out=htmlGrids(head);
      else throw unsupported()}
    else out=delimGrid(head,base)}
  out=(out||[]).filter(s=>s&&s.grid);
  if(!out.length||out.every(s=>!s.grid.length))throw fail('لم أجد بيانات في الملف: كل الأوراق فارغة.','No data found: every sheet in the file is empty.');
  return out}
/* text-sourced cells: numbers written as text become numbers (except codes with a leading zero); an apostrophe guard is removed */
const NUMS=/^-?\d+(\.\d+)?$/;
const cellIn=v=>{if(typeof v!=='string')return v;const s=v.trim().replace(/^'(?=[=+@\-])/,'');return NUMS.test(s)&&!/^-?0\d/.test(s)?Number(s):s};
const serialIso=n=>new Date(Date.UTC(1899,11,30)+Math.round(n*86400000)).toISOString().slice(0,10);
async function readWorkbook(file){const sheets=await readGrids(file);const names=[],rows={};
  sheets.forEach(s=>{let nm=s.name;while(rows[nm])nm+='_';const g=s.grid;const out=[];
    if(g.length){const h=g[0].map(x=>String(x&&typeof x==='object'?'':x).trim());g.slice(1).forEach(r=>{if(!r.some(x=>String(x&&typeof x==='object'?'1':x).trim()))return;const o={};
      h.forEach((k,i)=>{if(!k)return;let v=r[i]??'';if(v&&typeof v==='object'&&'serial' in v)v=serialIso(v.serial);else if(s.text)v=cellIn(v);o[k]=v});out.push(o)})}
    names.push(nm);rows[nm]=out});
  return {SheetNames:names,rows:n=>rows[n]||[]}}
window.FileImport={ACCEPT,LIST,readGrids,readWorkbook,decodeText,_:{readBiff,cfbStreams,readOdsXml,delimGrid,htmlGrids,spreadsheetMl,jsonGrids,isDateCode}};
/* the contracts and needs import in Settings (app.js) calls readWorkbook() */
window.readWorkbook=readWorkbook;
})();
