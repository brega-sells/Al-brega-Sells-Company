/* ===== أسماء المسؤولين في الهيكل التنظيمي (org people) =====
   The repository and the site are public, so the names and staff numbers of the people who hold each
   position are not in the code. They live in one Firestore document, config/orgPeople, that only signed-in
   users with a role can read (firestore.rules) and only the administrator can write:
     { v:1, people:{ [org id]:{ head, empNo } }, holder:{ [org id]: job-card holder name }, updatedAt, by }
   After sign-in this file listens to the document and fills ORG[].head / ORG[].empNo and ORG_HOLDER in place,
   then re-renders. The administrator imports or replaces the document from a JSON file on the settings page. */
"use strict";
(function(){
const EN=()=>{if(window.I18N&&I18N.lang)return I18N.lang==='en';try{return localStorage.getItem('cm_lang')==='en'}catch(e){return false}};
const tr=(a,b)=>EN()&&b?b:a;
const me=()=>(window.__me&&window.__me())||null;
const FS=()=>window.__fs&&window.__fs();
const say=m=>{try{toast(m)}catch(e){}};
const isAdmin=()=>{const m=me();return !!m&&m.role==='admin'};
const ST={state:'wait',count:0,at:'',by:''};/* wait | ok | missing | denied */
window.__orgPeople=()=>Object.assign({},ST);

/* keep only known positions and short strings; anything else in the file is dropped */
function clean(doc){
  const out={v:1,people:{},holder:{}};const P=(doc&&doc.people)||{},H=(doc&&doc.holder)||{};
  const s=(x,n)=>typeof x==='string'?x.trim().slice(0,n):(typeof x==='number'?String(x).slice(0,n):'');
  Object.keys(P).forEach(id=>{if(!ORG_BY.has(id))return;const p=P[id]||{};const head=s(p.head,120),empNo=s(p.empNo,20);if(head||empNo)out.people[id]={head,empNo}});
  Object.keys(H).forEach(id=>{if(!ORG_BY.has(id))return;const h=s(H[id],120);if(h)out.holder[id]=h});
  return out}
function apply(doc){
  const c=clean(doc);
  ORG.forEach(o=>{const p=c.people[o.id];o.head=p?p.head:'';o.empNo=p?p.empNo:''});
  Object.keys(ORG_HOLDER).forEach(k=>delete ORG_HOLDER[k]);Object.assign(ORG_HOLDER,c.holder);
  ST.count=Object.keys(c.people).length;ST.at=(doc&&doc.updatedAt)||'';ST.by=(doc&&doc.by)||''}
function repaint(){try{if(typeof rerender==='function')rerender();else render()}catch(e){}}

let unsub=null;
async function start(){
  if(!window.appRuntime||!window.appRuntime.use)return;
  await window.appRuntime.use('db');const fs=FS();if(!fs||!me())return;
  if(unsub)unsub();
  unsub=fs.collection('config').doc('orgPeople').onSnapshot(d=>{
    if(d.exists){apply(d.data());ST.state='ok'}else{apply(null);ST.state='missing'}repaint()},
    e=>{console.warn('orgPeople',e);ST.state='denied';repaint()});
}
start();

/* settings panel (administrator) */
function panel(){
  const st=ST.state==='ok'?`<p class="op-st ok">${esc(tr(`محمّلة: ${ST.count} جهة`,`Loaded: ${ST.count} positions`))}${ST.at?` · ${esc(String(ST.at).slice(0,10))}`:''}${ST.by?` · <span dir="ltr">${esc(ST.by)}</span>`:''}</p>`
    :`<p class="op-st over">${esc(tr('لم تُستورد أسماء المسؤولين بعد: الهيكل يظهر بالمسميات فقط.','Position holders have not been imported yet: the chart shows titles only.'))}</p>`;
  return `<div class="panel" id="op-panel"><h3 class="section-title">${esc(tr('أسماء المسؤولين في الهيكل','Position holders in the org chart'))} <small>${esc(tr('خلف الدخول','behind sign-in'))}</small></h3>
   <p class="muted" style="margin:0 0 8px;font-size:13px">${esc(tr('الأسماء والأرقام الوظيفية لا تُحفظ في كود الموقع العام. تُحفظ في قاعدة البيانات ولا يقرؤها إلا من له صلاحية. استورد ملف JSON بالصيغة {people:{معرّف الجهة:{head,empNo}}}.','Names and staff numbers are not kept in the public site code. They are stored in the database and only users with a role can read them. Import a JSON file shaped {people:{unit id:{head,empNo}}}.'))}</p>
   ${st}
   <div style="display:flex;gap:8px;flex-wrap:wrap"><label class="btn">${esc(tr('استيراد ملف JSON','Import JSON file'))}<input type="file" id="op-file" accept=".json,application/json" hidden></label>
   ${ST.state==='ok'?`<button class="btn ghost" type="button" data-op="export">${esc(tr('تنزيل نسخة','Download a copy'))}</button>`:''}</div><div id="op-res" class="muted" style="margin-top:8px;font-size:13px"></div></div>`}

async function importFile(f){
  const res=document.getElementById('op-res');
  let j;try{j=JSON.parse(await f.text())}catch(e){res.textContent=tr('الملف ليس JSON صالحًا','Not a valid JSON file');return}
  const c=clean(j),n=Object.keys(c.people).length;
  if(!n){res.textContent=tr('لم يُعثر على أي جهة معروفة في الملف','No known positions found in the file');return}
  const m=me(),fs=FS();const ts=new Date().toISOString();
  try{
    await fs.collection('config').doc('orgPeople').set(Object.assign(c,{updatedAt:ts,by:m.email}));
    try{await fs.collection('log').add({at:firebase.firestore.FieldValue.serverTimestamp(),ts,user:m.email,name:m.name||'',action:'استيراد أسماء المسؤولين في الهيكل',col:'config',id:'orgPeople',summary:n+' جهة'})}catch(e){}
    say(tr(`تم استيراد ${n} جهة`,`Imported ${n} positions`));
  }catch(e){res.textContent=(typeof writeErr==='function'?writeErr(e):(e.code||e.message))}
}
function exportCopy(){
  const people={};ORG.forEach(o=>{if(o.head||o.empNo)people[o.id]={head:o.head,empNo:o.empNo}});
  const blob=new Blob([JSON.stringify({v:1,people,holder:Object.assign({},ORG_HOLDER)},null,1)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='org-people.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}

const __render=render;render=function(){__render();
  const v=document.getElementById('view');if(!v)return;
  if(S.view==='settings'&&isAdmin()&&!document.getElementById('op-panel')){v.insertAdjacentHTML('beforeend',panel());
    const fi=document.getElementById('op-file');if(fi)fi.addEventListener('change',()=>{if(fi.files[0])importFile(fi.files[0]);fi.value=''})}
  if(S.view==='org'&&(ST.state==='missing'||ST.state==='denied')&&!document.getElementById('op-note'))
    v.insertAdjacentHTML('afterbegin',`<div class="op-st over" id="op-note" role="status">${esc(ST.state==='denied'
      ?tr('أسماء المسؤولين متاحة لمن له صلاحية في المنظومة فقط.','Position holders are shown only to users with a role.')
      :tr('لم يستورد مدير النظام أسماء المسؤولين بعد: الهيكل يظهر بالمسميات فقط.','The administrator has not imported position holders yet: the chart shows titles only.'))}</div>`)};
document.addEventListener('click',e=>{const b=e.target.closest('[data-op="export"]');if(b&&isAdmin())exportCopy()});

const css=document.createElement('style');css.textContent=`
.op-st{border-radius:10px;padding:9px 12px;font-size:13.5px;margin:0 0 10px}.op-st.over{background:var(--warn-soft);color:var(--warn)}.op-st.ok{background:var(--ok-soft);color:var(--ok)}`;document.head.appendChild(css);
})();
