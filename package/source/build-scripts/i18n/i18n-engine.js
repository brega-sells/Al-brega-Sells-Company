/* ===== I18N: Arabic (default, RTL) / English (LTR). UI is written in Arabic; in English mode a DOM observer translates
   text nodes and placeholder/title/aria-label using the dictionary below. Data typed by users stays as entered. ===== */
(function(){
"use strict";
let lang='ar';try{lang=localStorage.getItem('cm_lang')==='en'?'en':'ar'}catch(e){}
const root=document.documentElement;root.lang=lang;root.dir=lang==='en'?'ltr':'rtl';
const DICT=new Map();
const AR=/[؀-ۿ]/;
const NUM=/\d+(?:[.,]\d+)*/g;
function key(s){let i=0;return s.replace(/\{\d+\}|\d+(?:[.,]\d+)*/g,()=>'{'+(i++)+'}')}
function add(o){for(const k in o)DICT.set(key(k.replace(/\s+/g,' ').trim()),o[k])}
function look(s){
  const r=look1(s);if(r!=null||!/[.:]$/.test(s))return r;
  const r2=look1(s.slice(0,-1));return r2==null?null:r2+s.slice(-1)}
function look1(s){
  if(DICT.has(s))return DICT.get(s);
  const nums=s.match(NUM);if(!nums)return null;
  const v=DICT.get(key(s));if(v==null)return null;
  return v.replace(/\{(\d+)\}/g,(m,i)=>nums[+i]!=null?nums[+i]:m)}
const RULES=[];
const SEP=/( · | — |: | \| |، | \+ )/;
function tr(raw){
  if(!raw||!AR.test(raw))return null;
  const lead=raw.match(/^\s*/)[0],trail=raw.match(/\s*$/)[0];
  let s=raw.trim().replace(/\s+/g,' ');
  let r=look(s);
  if(r==null)for(const [re,f] of RULES){const m=s.match(re);if(m){r=f(m);if(r!=null)break}}
  if(r==null){const pre=s.match(/^((?:— )+|[!•·:]\s*)/);if(pre){const x=tr(s.slice(pre[0].length));if(x!=null)r=pre[0]+x.trim()}}
  if(r==null){const suf=s.match(/\s*[·:—]$/);if(suf){const x=tr(s.slice(0,-suf[0].length));if(x!=null)r=x.trim()+suf[0]}}
  if(r==null&&SEP.test(s)){const parts=s.split(SEP);let hit=false;
    const out=parts.map((p,i)=>{if(i%2)return p;const t=p&&tr(p);if(t!=null){hit=true;return t.trim()}return p});
    if(hit)r=out.join('').replace(/، /g,', ')}
  if(r==null){const m=s.match(/^(.*?)\s*\(([^()]*)\)$/);if(m&&m[1]){const a=tr(m[1]),b=AR.test(m[2])?tr(m[2]):m[2];if(a!=null&&b!=null)r=a.trim()+' ('+b.trim()+')'}}
  return r==null?null:lead+r+trail}
function t(s){if(lang!=='en')return s;const r=tr(String(s));return r==null?s:r}
const SKIP=/^(SCRIPT|STYLE|TEXTAREA|INPUT|CODE|PRE)$/;
function skip(el){for(let e=el;e&&e!==root;e=e.parentElement){if(SKIP.test(e.tagName)||e.getAttribute('translate')==='no'||e.isContentEditable)return true}return false}
const ATTRS=['placeholder','title','aria-label','data-tip'];
function doText(n){const v=n.nodeValue;if(!AR.test(v))return;const p=n.parentElement;if(!p||skip(p))return;
  if(p.tagName==='OPTION'&&!p.hasAttribute('value'))p.setAttribute('value',p.textContent);
  const r=tr(v);if(r!=null&&r!==v)n.nodeValue=r}
function doEl(el){if(el.nodeType!==1||SKIP.test(el.tagName)&&el.tagName!=='INPUT'&&el.tagName!=='TEXTAREA')return;
  for(const a of ATTRS){const v=el.getAttribute(a);if(v&&AR.test(v)){const r=tr(v);if(r!=null)el.setAttribute(a,r)}}}
function walk(node){
  if(node.nodeType===3){doText(node);return}
  if(node.nodeType!==1)return;
  if(node.getAttribute('translate')==='no'||/^(SCRIPT|STYLE)$/.test(node.tagName))return;
  doEl(node);
  const w=document.createTreeWalker(node,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT,{acceptNode:n=>n.nodeType===1&&(n.getAttribute('translate')==='no'||/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.tagName))?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
  let n;while(n=w.nextNode()){if(n.nodeType===3)doText(n);else doEl(n)}}
function start(){
  if(lang!=='en')return;
  document.title=t(document.title);
  if(document.body)walk(document.body);
  new MutationObserver(ms=>{for(const m of ms){
    if(m.type==='characterData')doText(m.target);
    else if(m.type==='attributes')doEl(m.target);
    else m.addedNodes.forEach(walk)}})
  .observe(document.documentElement,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:ATTRS});
  const _alert=window.alert,_confirm=window.confirm,_prompt=window.prompt;
  window.alert=m=>_alert(t(m));window.confirm=m=>_confirm(t(m));window.prompt=(m,d)=>_prompt(t(m),d);
}
function setLang(l){try{localStorage.setItem('cm_lang',l)}catch(e){}location.reload()}
window.I18N={lang,dir:root.dir,t,add,setLang,rule:(re,f)=>RULES.push([re,f]),tr};
/* language toggle: floating button on login screen, top-bar button in the app */
function btnHtml(){return `<button type="button" class="lang-btn" data-lang-toggle translate="no" title="${lang==='en'?'العربية':'English'}">${lang==='en'?'العربية':'English'}</button>`}
document.addEventListener('click',e=>{if(e.target.closest('[data-lang-toggle]')){e.preventDefault();setLang(lang==='en'?'ar':'en')}});
function placeToggle(){
  const top=document.querySelector('.top-actions');
  if(top&&!top.querySelector('[data-lang-toggle]'))top.insertAdjacentHTML('afterbegin',btnHtml());
  const lg=document.querySelector('#login .lg-card');
  if(lg&&!lg.querySelector('[data-lang-toggle]'))lg.insertAdjacentHTML('afterbegin',`<div style="display:flex;justify-content:flex-end">${btnHtml()}</div>`);
}
new MutationObserver(placeToggle).observe(document.documentElement,{childList:true,subtree:true});
if(document.readyState!=='loading')start();else document.addEventListener('DOMContentLoaded',start);
document.addEventListener('DOMContentLoaded',placeToggle);
/*__DICT__*/
})();
