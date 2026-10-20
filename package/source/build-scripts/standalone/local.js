/* ===== Standalone adapter: data saved in this browser (localStorage), seeded from the embedded data ===== */
(function(){
"use strict";
const KEY='contracts_system_data_v1';
const ALL=['contracts','needs','batches','extensions','letters','companies','config'];
function seed(){const s=JSON.parse(document.getElementById('seed-data').textContent);const st={};ALL.forEach(c=>st[c]={});
  Object.keys(s).forEach(c=>{(s[c]||[]).forEach(o=>{const d=Object.assign({},o);const id=d.id;delete d.id;(st[c]||(st[c]={}))[id]=d})});return st}
let ST=null;
try{const raw=localStorage.getItem(KEY);if(raw)ST=JSON.parse(raw)}catch(e){}
let STORAGE_OK=true;
if(!ST){ST=seed();persist(true)}
ALL.forEach(c=>{if(!ST[c])ST[c]={}});
function persist(silent){try{localStorage.setItem(KEY,JSON.stringify(ST));STORAGE_OK=true;return true}catch(e){STORAGE_OK=false;if(!silent&&window.toast)toast('تعذّر الحفظ في المتصفح. احفظ نسخة من البيانات من صفحة الإعدادات.');return false}}
window.__store={get:()=>ST,replace:o=>{const n={};ALL.forEach(c=>n[c]=(o&&o[c])||{});ST=n;persist();ALL.forEach(emit)},reset:()=>{ST=seed();persist();ALL.forEach(emit)},ok:()=>STORAGE_OK,key:KEY};
const L={},DL={};
function snap(col){const docs=Object.entries(ST[col]||{}).map(([id,d])=>({id,exists:true,data:()=>d,metadata:{}}));return {docs,size:docs.length,empty:!docs.length,docChanges:()=>[],metadata:{}}}
function emit(col){(L[col]||[]).forEach(f=>{try{f(snap(col))}catch(e){console.error(e)}});Object.keys(DL).forEach(p=>{const [c,id]=p.split('/');if(c!==col)return;const d=(ST[c]||{})[id];DL[p].forEach(f=>f({id,exists:!!d,data:()=>d,metadata:{}}))})}
window.addEventListener('storage',e=>{if(e.key!==KEY||!e.newValue)return;try{ST=JSON.parse(e.newValue);ALL.forEach(emit)}catch(x){}});
function ref(col,id){return {id,path:col+'/'+id,
  set:async d=>{(ST[col]||(ST[col]={}))[id]=JSON.parse(JSON.stringify(d));if(!persist())throw {code:'quota_exceeded'};emit(col)},
  update:async d=>{ST[col][id]=Object.assign({},ST[col][id]||{},d);persist();emit(col)},
  delete:async()=>{if(ST[col])delete ST[col][id];persist();emit(col)},
  get:async()=>{const d=(ST[col]||{})[id];return {id,exists:!!d,data:()=>d}},
  onSnapshot(n){const p=col+'/'+id;(DL[p]||(DL[p]=[])).push(n);const d=(ST[col]||{})[id];setTimeout(()=>n({id,exists:!!d,data:()=>d,metadata:{}}),0);return()=>{}}}}
const db={collection(col){return {path:col,doc:id=>ref(col,id||('x'+Date.now().toString(36)+Math.random().toString(36).slice(2,7))),onSnapshot(n){(L[col]||(L[col]=[])).push(n);setTimeout(()=>n(snap(col)),0);return()=>{}}}},doc(p){const [c,id]=p.split('/');return ref(c,id)}};
const user={can:async()=>true,canEdit:async()=>true,isOwner:async()=>true,id:async()=>'local',me:async()=>({name:''})};
const downloads={save:async({filename,data})=>{const blob=data instanceof Blob?data:new Blob([data]);const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=filename;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(u);a.remove()},2000);return {status:'saved'}}};
window.claude={use:async n=>({db,user,downloads})[n]||null};
})();
