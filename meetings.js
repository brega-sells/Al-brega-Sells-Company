/* ===== الاجتماعات المغلقة بين الإدارات (Closed online meetings between departments) =====
   Loaded after the main app script. Data lives in the Firestore collection `meetings`;
   a meeting is visible only to the administrator, its creator, and users whose roles/<email>.unit
   is one of the meeting's invited units (enforced in firestore.rules, mirrored here). */
"use strict";
(function(){
const EN=()=>{if(window.I18N&&I18N.lang)return I18N.lang==='en';try{return localStorage.getItem('cm_lang')==='en'}catch(e){return false}};
const tr=(ar,en)=>EN()&&en?en:ar;
/* The seven units shown in the org chart that can meet with each other */
const MT_UNITS=['board','gm','e','w','ca','gm-fo','gm-rep'];
const MT_SHORT={board:['عضو مجلس الإدارة','Board member'],gm:['الإدارة العامة','General Administration'],e:['المبيعات و.ش','Sales (Central & East)'],w:['المبيعات غ.ج','Sales (West & South)'],ca:['الشؤون التجارية والتحصيلات','Commercial Affairs & Collections'],'gm-fo':['مكتب متابعة المبيعات','Sales Follow-up Office'],'gm-rep':['قسم المتابعة والتقارير','Follow-up & Reports Section']};
const uName=id=>{const s=MT_SHORT[id];return s?tr(s[0],s[1]):(ORG_BY.get(id)||{}).title||id||'—'};
const uFull=id=>(ORG_BY.get(id)||{}).title||uName(id);
const uHead=id=>(ORG_BY.get(id)||{}).head||'';
const STATUS={scheduled:['مجدول','Scheduled','p-info'],live:['منعقد الآن','In progress','p-ok'],closed:['مغلق · اعتُمد المحضر','Closed · minutes approved','p-neutral'],cancelled:['ملغى','Cancelled','p-crit']};
const stPill=s=>{const x=STATUS[s]||STATUS.scheduled;return `<span class="pill ${x[2]}">${esc(tr(x[0],x[1]))}</span>`};
const RSVP={yes:['سيحضر','Attending','p-ok'],maybe:['ربما','Maybe','p-warn'],no:['معتذر','Declined','p-crit']};
const MI={meet:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="m15.5 10.5 6-3.5v10l-6-3.5"/></svg>',
 lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
 wa:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a5 5 0 0 1-2.7-2.7l.8-1-1-2z"/></svg>',
 print:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v7H8z"/></svg>'};
I.meet=MI.meet;
/* شعارا Zoom وواتساب */
const LOGO={zoom:'<svg viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="12" fill="#0B5CFF"/><rect x="8.5" y="16" width="21" height="16" rx="4" fill="#fff"/><path d="M31.5 21.6 39.5 16.5v15l-8-5.1z" fill="#fff"/></svg>',
 whatsapp:'<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#25D366" d="M24 3.5A20.4 20.4 0 0 0 6.4 34.2L3.6 44.5l10.6-2.8A20.4 20.4 0 1 0 24 3.5z"/><path fill="#fff" d="M34.7 29.5c-.5-.3-3.1-1.5-3.5-1.7-.5-.2-.8-.3-1.2.3-.3.5-1.3 1.7-1.6 2-.3.3-.6.4-1.1.1-.5-.3-2.2-.8-4.2-2.6a15.6 15.6 0 0 1-2.9-3.6c-.3-.5 0-.8.2-1.1l.8-.9c.2-.3.3-.5.5-.9.2-.3.1-.7 0-.9l-1.6-3.8c-.4-1-.8-.9-1.2-.9h-1c-.3 0-.9.1-1.4.6-.5.5-1.8 1.8-1.8 4.3s1.8 5 2.1 5.3c.3.3 3.6 5.5 8.7 7.7 1.2.5 2.2.8 2.9 1.1 1.2.4 2.4.3 3.2.2 1-.1 3.1-1.3 3.5-2.5.4-1.2.4-2.3.3-2.5-.1-.2-.5-.3-1-.6z"/></svg>'};
const logo=(k,sz=20)=>LOGO[k]?LOGO[k].replace('<svg',`<svg style="width:${sz}px;height:${sz}px;flex:none"`):MI.meet.replace('<svg',`<svg style="width:${sz}px;height:${sz}px;flex:none"`);
(function(){const st=document.createElement('style');st.textContent=`
.mt-brands{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:12px}
.mt-brand{all:unset;box-sizing:border-box;cursor:pointer;position:relative;display:flex;gap:14px;align-items:center;padding:16px 18px;border-radius:14px;border:2px solid var(--line);background:var(--surface);color:var(--ink);transition:border-color .15s,box-shadow .15s,transform .15s}
.mt-brand:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(15,23,42,.10)}
.mt-brand:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.mt-brand svg{width:46px;height:46px;flex:none}
.mt-brand b{display:block;font-size:16px;line-height:1.35}.mt-brand small{display:block;color:var(--muted);font-size:12.5px;line-height:1.5;margin-top:2px}
.mt-brand.zoom:hover,.mt-brand.zoom[aria-pressed="true"]{border-color:#0B5CFF;background:color-mix(in srgb,#0B5CFF 7%,var(--surface))}
.mt-brand.whatsapp:hover,.mt-brand.whatsapp[aria-pressed="true"]{border-color:#25D366;background:color-mix(in srgb,#25D366 9%,var(--surface))}
.mt-brand[aria-pressed="true"]::after{content:"✓";position:absolute;top:10px;inset-inline-end:12px;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:700;color:#fff;background:var(--accent)}
.mt-brand.zoom[aria-pressed="true"]::after{background:#0B5CFF}.mt-brand.whatsapp[aria-pressed="true"]::after{background:#1DA851}
.mt-others{display:flex;flex-wrap:wrap;gap:6px;align-items:center;font-size:12.5px;color:var(--muted)}
.btn.b-zoom{border-color:#0B5CFF}.btn.b-whatsapp{border-color:#25D366}
.btn.b-zoom:hover{background:color-mix(in srgb,#0B5CFF 8%,var(--surface))}.btn.b-whatsapp:hover{background:color-mix(in srgb,#25D366 10%,var(--surface))}
.btn.s-zoom{background:#0B5CFF;border-color:#0B5CFF;color:#fff}.btn.s-whatsapp{background:#25D366;border-color:#25D366;color:#06301a}
.btn.s-zoom:hover,.btn.s-whatsapp:hover{filter:brightness(1.06)}
.btn.lg{height:44px;padding-inline:18px;font-size:14.5px;border-radius:10px}
.mt-pl{display:inline-flex;align-items:center;gap:5px;font-size:12px;color:var(--muted);font-weight:500;margin-top:3px}
.mt-empty{padding:28px 20px;display:flex;flex-direction:column;gap:16px;align-items:center;text-align:center}
.mt-empty .mt-brands{width:min(640px,100%);text-align:start}
.mt-hero{position:relative;overflow:hidden;border-radius:18px;padding:28px 30px;display:grid;grid-template-columns:minmax(0,1fr) minmax(240px,320px);gap:24px;align-items:center;color:#fff;
  background:radial-gradient(600px 300px at 0% 0%,rgba(37,211,102,.22),transparent 60%),radial-gradient(700px 360px at 100% 100%,rgba(11,92,255,.35),transparent 60%),linear-gradient(135deg,#0a1a2b 0%,#0d2c4a 55%,#0b4a73 100%);
  box-shadow:0 18px 40px rgba(10,26,43,.25);animation:mtIn .5s ease both}
.mt-hero::before{content:"";position:absolute;inset:0;background-image:radial-gradient(rgba(255,255,255,.07) 1px,transparent 1.2px);background-size:16px 16px;pointer-events:none;mask-image:linear-gradient(90deg,transparent,#000 70%)}
.mt-hero>*{position:relative}
.mt-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:12px;letter-spacing:.3px;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18)}
.mt-hero h2{margin:12px 0 6px;font-size:clamp(22px,3vw,30px);line-height:1.3;color:#fff}
.mt-hero p{margin:0;max-width:62ch;color:rgba(255,255,255,.78);font-size:14px;line-height:1.8}
.mt-hero-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:20px;align-items:center}
.mt-cta{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:12px;padding:10px 18px 10px 14px;border-radius:14px;background:#fff;color:#0a1a2b;min-width:210px;box-shadow:0 8px 20px rgba(0,0,0,.18);transition:transform .18s,box-shadow .18s}
.mt-cta svg{width:38px;height:38px;flex:none}.mt-cta b{display:block;font-size:15px}.mt-cta small{display:block;font-size:12px;color:#51606f;margin-top:1px}
.mt-cta:hover{transform:translateY(-2px);box-shadow:0 14px 28px rgba(0,0,0,.25)}
.mt-cta.zoom:hover{box-shadow:0 14px 28px rgba(11,92,255,.45)}.mt-cta.whatsapp:hover{box-shadow:0 14px 28px rgba(37,211,102,.4)}
.mt-cta:focus-visible,.mt-cta-other:focus-visible,.mt-next-btn:focus-visible{outline:2px solid #fff;outline-offset:3px}
.mt-cta-other{all:unset;cursor:pointer;color:rgba(255,255,255,.85);font-size:13px;padding:8px 6px;border-bottom:1px dashed rgba(255,255,255,.4)}
.mt-cta-other:hover{color:#fff}
.mt-trust{display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:18px;font-size:12px;color:rgba(255,255,255,.7)}.mt-trust span{display:inline-flex;align-items:center;gap:5px}
.mt-next{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:6px;backdrop-filter:blur(6px);min-width:0}
.mt-next-l{font-size:12px;color:rgba(255,255,255,.7)}.mt-next-when{font-size:24px;font-weight:700;line-height:1.3}
.mt-next-t{font-size:15px;line-height:1.5;overflow:hidden;text-overflow:ellipsis}.mt-next-d{font-size:12.5px;color:rgba(255,255,255,.72)}
.mt-next-act{display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap}
.mt-next-btn{all:unset;cursor:pointer;font-size:13px;padding:7px 14px;border-radius:9px;border:1px solid rgba(255,255,255,.35);color:#fff}
.mt-next-btn:hover{background:rgba(255,255,255,.12)}.mt-next-btn.solid{background:#fff;color:#0a1a2b;border-color:#fff}
.mt-next-btn.solid.zoom{background:#0B5CFF;border-color:#0B5CFF;color:#fff}.mt-next-btn.solid.whatsapp{background:#25D366;border-color:#25D366;color:#06301a}
@keyframes mtIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.mt-anim>*{animation:mtIn .45s ease both}.mt-anim>*:nth-child(2){animation-delay:.05s}.mt-anim>*:nth-child(3){animation-delay:.1s}.mt-anim>*:nth-child(4){animation-delay:.15s}.mt-anim>*:nth-child(5){animation-delay:.2s}
@media (prefers-reduced-motion:reduce){.mt-hero,.mt-anim>*,.mt-cta,.mt-brand{animation:none!important;transition:none!important}}
@media (max-width:760px){.mt-hero{grid-template-columns:1fr;padding:22px 18px}.mt-cta{flex:1 1 100%}}
.mt-join{display:flex;flex-wrap:wrap;gap:10px;align-items:center;border-inline-start:4px solid var(--accent)}
.mt-join.zoom{border-inline-start-color:#0B5CFF}.mt-join.whatsapp{border-inline-start-color:#25D366}
`;document.head.appendChild(st)})();
const BRAND_TXT={zoom:['اجتماع مرئي عبر Zoom','Video meeting on Zoom','صوت وصورة ومشاركة شاشة بحساب Zoom للشركة','Audio, video and screen share on the company Zoom account'],
 whatsapp:['اجتماع عبر واتساب','Meeting on WhatsApp','مجموعة أو مكالمة جماعية على واتساب من الهاتف','A WhatsApp group or group call from the phone']};
const brandCard=(k,act,pressed)=>`<button type="button" class="mt-brand ${k}" ${act} ${pressed!=null?`aria-pressed="${pressed}"`:''}>${LOGO[k]}<span><b>${tr(BRAND_TXT[k][0],BRAND_TXT[k][1])}</b><small>${tr(BRAND_TXT[k][2],BRAND_TXT[k][3])}</small></span></button>`;
if(window.I18N&&I18N.add)I18N.add({'الاجتماعات المغلقة':'Closed meetings'});

const M={list:new Map(),unit:'',myRole:null,loaded:false,subs:[],ui:{f:'upcoming',q:'',u:''},open:null,roles:null};
S.meetings=M;
const me=()=>(window.__me&&window.__me())||null;
const FS=()=>window.__fs&&window.__fs();
const isAdmin=()=>(me()||{}).role==='admin';
const canWrite=()=>{const m=me();return !!m&&m.role!=='viewer'};
const nowISO=()=>new Date().toISOString();
const startOf=m=>new Date((m.date||'1970-01-01')+'T'+(m.time||'00:00'));
const endOf=m=>new Date(startOf(m).getTime()+(Number(m.duration)||60)*60000);
function effStatus(m){if(m.status==='closed'||m.status==='cancelled'||m.status==='live')return m.status;return 'scheduled'}
function isUpcoming(m){const s=effStatus(m);return s==='live'||(s==='scheduled'&&endOf(m)>=new Date())}
function isMine(m){const e=(me()||{}).email;return isAdmin()||m.createdBy===e||(M.unit&&(m.units||[]).includes(M.unit))}
function canManage(m){const e=(me()||{}).email;return isAdmin()||m.createdBy===e||(canWrite()&&M.unit&&M.unit===m.organizer)}
function canContribute(m){return canManage(m)||(canWrite()&&M.unit&&(m.units||[]).includes(M.unit))}
const fdt=m=>`${fd(m.date)} · <span dir="ltr">${esc(m.time||'')}</span>`;
function genLink(){const a='abcdefghjkmnpqrstuvwxyz23456789';let s='';const r=crypto.getRandomValues(new Uint8Array(18));r.forEach(b=>s+=a[b%a.length]);return 'https://meet.jit.si/BregaSales-'+s}
const PLAT={zoom:{l:'Zoom',re:/^https:\/\/([\w-]+\.)?zoom\.(us|com)\//i,start:'https://zoom.us/meeting/schedule'},
 meet:{l:'Google Meet',re:/^https:\/\/meet\.google\.com\//i,start:'https://meet.google.com/new'},
 teams:{l:'Microsoft Teams',re:/^https:\/\/teams\.(microsoft|live)\.com\//i,start:'https://teams.microsoft.com/'},
 whatsapp:{l:'WhatsApp',re:/^https:\/\/(chat\.whatsapp\.com|wa\.me|call\.whatsapp\.com)\//i,start:'https://web.whatsapp.com/'},
 jitsi:{l:'Jitsi',re:/^https:\/\/meet\.jit\.si\//i}};
function platOf(m){if(m.platform&&PLAT[m.platform])return m.platform;const k=Object.keys(PLAT).find(k=>PLAT[k].re.test(m.link||''));return k||''}
const WA={};
function waNum(n){return String(n||'').replace(/[^\d]/g,'').replace(/^00/,'')}
function inviteText(m){const p=platOf(m);return [tr('دعوة لاجتماع مغلق','Closed meeting invitation')+': '+m.title,
  tr('الجهة الداعية','Organizer')+': '+uFull(m.organizer),
  tr('الموعد','When')+': '+fd(m.date)+' '+tr('الساعة','at')+' '+(m.time||'')+' ('+(m.duration||60)+' '+tr('دقيقة','min')+')',
  (m.agenda||[]).length?tr('جدول الأعمال','Agenda')+':\n'+m.agenda.map((a,i)=>(i+1)+'. '+a.t).join('\n'):'',
  m.link?(p?PLAT[p].l+': ':'')+m.link:'',m.meetingId?tr('رقم الاجتماع','Meeting ID')+': '+m.meetingId:'',m.passcode?tr('رمز الدخول','Passcode')+': '+m.passcode:'',
  tr('الدعوة خاصة بالإدارات المدعوة، يُرجى عدم إعادة إرسالها.','This invitation is for the invited departments only; please do not forward it.')].filter(Boolean).join('\n')}
function waLink(m,num){return 'https://wa.me/'+(num?waNum(num):'')+'?text='+encodeURIComponent(inviteText(m))}
function safeUrl(u){u=(u||'').trim();return /^https:\/\/[^\s"'<>]+$/i.test(u)?u:''}
async function logM(action,id,summary){try{if(canWrite())await FS().collection('log').add({ts:nowISO(),user:me().email,name:me().name||'',action,col:'meetings',id,summary:summary||''})}catch(e){}}
function errMsg(e){return e&&e.code==='permission-denied'?tr('لا تملك صلاحية هذا الإجراء على الاجتماع','You do not have permission for this action'):((e&&e.message)||tr('تعذّر الحفظ','Could not save'))}

/* ---------- live data ---------- */
function apply(qs,tag){
  qs.docChanges().forEach(ch=>{const id=ch.doc.id;if(ch.type==='removed'){const o=M.list.get(id);if(o){o._t.delete(tag);if(!o._t.size)M.list.delete(id)}}else{const prev=M.list.get(id);const t=prev?prev._t:new Set();t.add(tag);M.list.set(id,Object.assign({id,_t:t},ch.doc.data()))}});
  M.loaded=true;refresh();
}
async function start(){
  await window.claude.use('db');const m=me();if(!m||!FS())return;
  try{const r=await FS().collection('roles').doc(m.email).get();M.unit=(r.exists&&r.data().unit)||''}catch(e){}
  M.subs.forEach(u=>u());M.subs=[];
  M.subs.push(FS().collection('config').doc('meetings').onSnapshot(d=>{Object.keys(WA).forEach(k=>delete WA[k]);Object.assign(WA,(d.exists&&d.data().whatsapp)||{});refresh()},()=>{}));
  const col=FS().collection('meetings');const onErr=e=>{console.warn('meetings',e);M.loaded=true;M.err=e.code||e.message;refresh()};
  if(isAdmin())M.subs.push(col.onSnapshot(qs=>apply(qs,'all'),onErr));
  else{M.subs.push(col.where('createdBy','==',m.email).onSnapshot(qs=>apply(qs,'own'),onErr));
    if(M.unit)M.subs.push(col.where('units','array-contains',M.unit).onSnapshot(qs=>apply(qs,'unit'),onErr))}
  if(!isAdmin()&&!M.unit){M.loaded=true}
  refresh();
  try{if(localStorage.getItem('cm_view')==='meetings'&&S.view!=='meetings')go('meetings')}catch(e){}
}
const refresh=debounce(()=>{renderNav();
  const ae=document.activeElement,typing=ae&&/INPUT|TEXTAREA|SELECT/.test(ae.tagName)&&(ae.closest('.drawer')||ae.id==='mt-q'||ae.id==='xd-q');
  if((S.view==='meetings'||S.view==='dash')&&!dlg.open&&!typing)render();
  if(M.open&&document.querySelector('.drawer[data-mt]')&&!typing&&!dlg.open){if(M.list.has(M.open))openMeeting(M.open,true);else closeDrawer()}
},120);

/* ---------- navigation ---------- */
const sIdx=VIEWS.findIndex(v=>v.id==='settings');
VIEWS.splice(sIdx<0?VIEWS.length:sIdx,0,{id:'meetings',label:'الاجتماعات المغلقة',icon:'meet',group:'مشترك',count:()=>[...M.list.values()].filter(m=>isMine(m)&&isUpcoming(m)).length||''});
const __render=render;
render=function(){
  if(S.view!=='meetings')return __render();
  recompute();document.getElementById('view').innerHTML=dbBanner()+viewMeetings();afterMeetings();
};

/* ---------- page ---------- */
function filtered(){
  const u=M.ui,q=norm(u.q);let rows=[...M.list.values()].filter(isMine);
  if(u.f==='upcoming')rows=rows.filter(isUpcoming);
  else if(u.f==='closed')rows=rows.filter(m=>m.status==='closed');
  else if(u.f==='past')rows=rows.filter(m=>!isUpcoming(m)&&m.status!=='closed'&&m.status!=='cancelled');
  else if(u.f==='cancelled')rows=rows.filter(m=>m.status==='cancelled');
  if(u.u)rows=rows.filter(m=>(m.units||[]).includes(u.u));
  if(q)rows=rows.filter(m=>norm([m.title,m.place,m.minutes,(m.agenda||[]).map(a=>a.t).join(' '),(m.decisions||[]).map(d=>d.t).join(' '),(m.units||[]).map(uName).join(' ')].join(' ')).includes(q));
  rows.sort((a,b)=>u.f==='upcoming'?startOf(a)-startOf(b):startOf(b)-startOf(a));
  return rows;
}
function viewMeetings(){
  const all=[...M.list.values()].filter(isMine),now=new Date(),td=iso(now);
  const up=all.filter(isUpcoming),todayN=up.filter(m=>m.date===td).length,live=all.filter(m=>m.status==='live').length;
  const openD=all.reduce((n,m)=>n+(m.decisions||[]).filter(d=>!d.done).length,0);
  const lateD=all.reduce((n,m)=>n+(m.decisions||[]).filter(d=>!d.done&&d.due&&d.due<td).length,0);
  const pendingRsvp=M.unit?up.filter(m=>m.organizer!==M.unit&&(m.units||[]).includes(M.unit)&&!(m.rsvp||{})[M.unit]).length:0;
  const kp=(l,v,c,s,f)=>`<button class="kpi ${c}" data-mt-f="${f}"><span class="l">${l}</span><span class="v">${v}</span><span class="s">${s||''}</span></button>`;
  const chips=[['upcoming',tr('القادمة والجارية','Upcoming')],['closed',tr('المغلقة (محاضر معتمدة)','Closed')],['past',tr('انتهى وقتها دون إغلاق','Past, not closed')],['cancelled',tr('الملغاة','Cancelled')],['all',tr('الكل','All')]];
  const noUnit=!isAdmin()&&!M.unit;
  const canNew=canWrite()&&(isAdmin()||M.unit);
  const next=up.slice().sort((a,b)=>startOf(a)-startOf(b))[0];
  const until=m=>{const ms=startOf(m)-new Date();if(m.status==='live'||ms<=0&&endOf(m)>=new Date())return tr('منعقد الآن','Happening now');const mi=Math.round(ms/60000),h=Math.floor(mi/60),d=Math.floor(h/24);
    return d?tr(`بعد ${d} يوم${h%24?' و'+(h%24)+' ساعة':''}`,`in ${d}d${h%24?' '+(h%24)+'h':''}`):h?tr(`بعد ${h} ساعة${mi%60?' و'+(mi%60)+' دقيقة':''}`,`in ${h}h${mi%60?' '+(mi%60)+'m':''}`):tr(`بعد ${mi} دقيقة`,`in ${mi} min`)};
  const nk=next?platOf(next):'';
  return `<section class="mt-hero">
   <div class="mt-hero-main">
    <span class="mt-eyebrow">${MI.lock.replace('<svg','<svg style="width:13px;height:13px"')} ${tr('مساحة آمنة للإدارات','A private space for departments')}</span>
    <h2>${tr('الاجتماعات المغلقة بين الإدارات','Closed meetings between departments')}</h2>
    <p>${tr('اجتمعوا عن بُعد عبر Zoom أو واتساب، بجدول أعمال ومحضر معتمد وقرارات تُتابَع حتى التنفيذ. لا يرى الاجتماع ولا ينضم إليه إلا المدعوون.','Meet remotely on Zoom or WhatsApp with an agenda, approved minutes and tracked decisions. Only invitees can see or join.')}</p>
    ${canNew?`<div class="mt-hero-cta"><button class="mt-cta zoom" data-mt="new" data-p="zoom">${LOGO.zoom}<span><b>${tr('اجتماع Zoom','Zoom meeting')}</b><small>${tr('صوت وصورة ومشاركة شاشة','Video & screen share')}</small></span></button>
      <button class="mt-cta whatsapp" data-mt="new" data-p="whatsapp">${LOGO.whatsapp}<span><b>${tr('اجتماع واتساب','WhatsApp meeting')}</b><small>${tr('مجموعة أو مكالمة جماعية','Group or group call')}</small></span></button>
      <button class="mt-cta-other" data-mt="new">${tr('منصة أخرى','Other platform')} ←</button></div>`:''}
    <div class="mt-trust"><span>${MI.lock.replace('<svg','<svg style="width:13px;height:13px"')} ${tr('مرئي للمدعوين فقط','Invitees only')}</span><span>✓ ${tr('محضر معتمد ومقفل','Locked approved minutes')}</span><span>✓ ${tr('دعوة بضغطة عبر واتساب','One-tap WhatsApp invite')}</span></div>
   </div>
   <div class="mt-next">${next?`<span class="mt-next-l">${tr('الاجتماع القادم','Next meeting')}</span>
     <div class="mt-next-when">${until(next)}</div>
     <b class="mt-next-t">${esc(next.title)}</b>
     <span class="mt-next-d">${fdt(next)} · ${esc(uName(next.organizer))}</span>
     <div class="mt-next-act">${nk?logo(nk,30):''}<button class="mt-next-btn" data-mt-open="${esc(next.id)}">${tr('عرض الاجتماع','Open meeting')}</button>${next.link&&next.status!=='cancelled'?`<a class="mt-next-btn solid ${nk}" href="${esc(next.link)}" target="_blank" rel="noopener" data-mt="join">${tr('انضمام','Join')}</a>`:''}</div>`
     :`<span class="mt-next-l">${tr('الاجتماع القادم','Next meeting')}</span><div class="mt-next-when" style="font-size:20px">${tr('لا توجد اجتماعات مجدولة','Nothing scheduled')}</div><span class="mt-next-d">${canNew?tr('اختر Zoom أو واتساب لبدء أول اجتماع.','Pick Zoom or WhatsApp to start one.'):tr('ستظهر هنا اجتماعات إدارتك.','Your department’s meetings appear here.')}</span>`}</div>
  </section>
  ${noUnit?`<div class="banner">${tr('حسابك غير مربوط بأي إدارة بعد، لذلك لا تظهر لك اجتماعات الإدارات. اطلب من مدير النظام ربط بريدك بإدارتك من أسفل هذه الصفحة.','Your account is not linked to a department yet. Ask the administrator to link it at the bottom of this page.')}</div>`:''}
  ${M.err&&M.err!=='failed-precondition'?`<div class="banner">${tr('تعذّر تحميل الاجتماعات','Could not load meetings')} (${esc(M.err)}). ${isAdmin()?tr('تأكد من نشر قواعد Firestore الجديدة (firestore.rules) في لوحة Firebase.','Make sure the new firestore.rules are published in the Firebase console.'):''}</div>`:''}
  ${M.unit?`<div class="muted" style="font-size:13px">${tr('إدارتك','Your department')}: <b>${esc(uFull(M.unit))}</b></div>`:''}
  <div class="kpis org-kpis mt-anim">
   ${kp(tr('القادمة والجارية','Upcoming'),up.length,'',tr(`اليوم: ${todayN}`,`Today: ${todayN}`),'upcoming')}
   ${kp(tr('منعقدة الآن','In progress'),live,live?'ok':'','','upcoming')}
   ${kp(tr('بانتظار تأكيد حضوركم','Awaiting your reply'),pendingRsvp,pendingRsvp?'warn':'','','upcoming')}
   ${kp(tr('قرارات قيد التنفيذ','Open decisions'),openD,lateD?'crit':'',lateD?tr(`متأخرة: ${lateD}`,`Overdue: ${lateD}`):'','all')}
   ${kp(tr('محاضر معتمدة','Approved minutes'),all.filter(m=>m.status==='closed').length,'','','closed')}
  </div>
  <div class="toolbar"><div class="grow">${I.search}<input type="search" id="mt-q" value="${esc(M.ui.q)}" placeholder="${tr('بحث في العنوان وجدول الأعمال والمحضر والقرارات…','Search title, agenda, minutes, decisions…')}"></div>
   <select id="mt-u"><option value="">${tr('كل الإدارات','All departments')}</option>${MT_UNITS.map(u=>`<option value="${u}" ${M.ui.u===u?'selected':''}>${esc(uName(u))}</option>`).join('')}</select></div>
  <div class="chips" id="mt-chips">${chips.map(([k,l])=>`<button class="chip" data-mt-f="${k}" aria-pressed="${M.ui.f===k}">${l}</button>`).join('')}</div>
  <div id="mt-list">${listHTML()}</div>
  ${isAdmin()?`<div class="panel"><h3 class="section-title">${logo('whatsapp',22)} ${tr('أرقام واتساب الإدارات','Department WhatsApp numbers')} <small>${tr('لإرسال دعوات الاجتماعات مباشرة','Used to send meeting invitations directly')}</small></h3>
   <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:10px">${MT_UNITS.map(u=>`<div class="field"><label for="mt-wa-${u}">${esc(uName(u))}</label><input id="mt-wa-${u}" dir="ltr" inputmode="tel" placeholder="2189XXXXXXXX" value="${esc(WA[u]||'')}"></div>`).join('')}</div>
   <div style="margin-top:10px;display:flex;gap:10px;align-items:center"><button class="btn" data-mt="save-wa">${tr('حفظ الأرقام','Save numbers')}</button><span class="muted" style="font-size:12px">${tr('بالصيغة الدولية بدون + (مثال ليبيا: 218912345678).','International format without + (Libya e.g. 218912345678).')}</span></div></div>`:''}
  ${isAdmin()?`<div class="panel"><h3 class="section-title">${tr('ربط المستخدمين بالإدارات','Link users to departments')} <small>${tr('يحدد الاجتماعات التي يراها كل مستخدم','Decides which meetings each user can see')}</small></h3><div id="mt-roles"><div class="muted">${tr('جارٍ التحميل…','Loading…')}</div></div></div>`:''}`;
}
function listHTML(){
  if(!M.loaded)return `<div class="tablewrap"><div class="empty">${tr('جارٍ تحميل الاجتماعات…','Loading meetings…')}</div></div>`;
  const rows=filtered();
  const canNew=canWrite()&&(isAdmin()||M.unit);
  if(!rows.length&&canNew&&![...M.list.values()].some(isMine))return `<div class="panel mt-empty"><div><h3 class="section-title" style="justify-content:center;font-size:17px;margin:0">${tr('ابدأ أول اجتماع مغلق','Start your first closed meeting')}</h3><p class="muted" style="margin:6px 0 0;font-size:13px">${tr('اختر المنصة، ثم حدد الإدارات المدعوة وجدول الأعمال. لن يرى الاجتماع إلا المدعوون.','Pick a platform, then the invited departments and agenda. Only invitees will see it.')}</p></div>
   <div class="mt-brands">${brandCard('zoom','data-mt="new" data-p="zoom"')}${brandCard('whatsapp','data-mt="new" data-p="whatsapp"')}</div>
   <button class="btn sm ghost" data-mt="new">${tr('أو استخدم Google Meet أو Teams أو Jitsi','Or use Google Meet, Teams or Jitsi')}</button></div>`;
  if(!rows.length)return `<div class="tablewrap"><div class="empty"><b>${tr('لا توجد اجتماعات هنا','No meetings here')}</b>${canWrite()&&(isAdmin()||M.unit)?tr('أنشئ اجتماعًا بزر «اجتماع جديد» وادعُ الإدارات المعنية.','Create one with “New meeting” and invite the departments.'):''}</div></div>`;
  return `<div class="tablewrap" style="max-height:none"><table><thead><tr><th class="nosort">${tr('الموعد','When')}</th><th class="nosort">${tr('الاجتماع','Meeting')}</th><th class="nosort">${tr('الجهة الداعية','Organizer')}</th><th class="nosort">${tr('الإدارات المدعوة','Invited')}</th><th class="nosort">${tr('الحضور','Replies')}</th><th class="nosort">${tr('الحالة','Status')}</th><th class="nosort">${tr('القرارات','Decisions')}</th></tr></thead><tbody>
  ${rows.map(m=>{const r=m.rsvp||{},inv=(m.units||[]).filter(u=>u!==m.organizer),yes=inv.filter(u=>(r[u]||{}).s==='yes').length,ds=m.decisions||[],dd=ds.filter(d=>d.done).length;
   return `<tr data-mt-open="${esc(m.id)}"><td>${fdt(m)}</td><td class="wrap"><div class="t-strong">${esc(m.title)}</div>${platOf(m)?`<span class="mt-pl">${logo(platOf(m),16)}${esc(PLAT[platOf(m)].l)}</span>`:''}</td><td>${esc(uName(m.organizer))}</td><td class="wrap">${inv.map(u=>`<span class="tag">${esc(uName(u))}</span>`).join(' ')}</td><td>${yes}/${inv.length}</td><td>${stPill(effStatus(m))}</td><td>${ds.length?`${dd}/${ds.length}`:'—'}</td></tr>`}).join('')}
  </tbody></table></div>`;
}
function afterMeetings(){
  const q=document.getElementById('mt-q');if(q)q.addEventListener('input',debounce(()=>{M.ui.q=q.value;document.getElementById('mt-list').innerHTML=listHTML()},200));
  const u=document.getElementById('mt-u');if(u)u.addEventListener('change',()=>{M.ui.u=u.value;document.getElementById('mt-list').innerHTML=listHTML()});
  if(isAdmin())loadRoles();
}
async function loadRoles(){
  const box=document.getElementById('mt-roles');if(!box)return;
  try{const qs=await FS().collection('roles').get();M.roles=[];qs.forEach(d=>M.roles.push(Object.assign({email:d.id},d.data())))}catch(e){box.innerHTML=`<div class="muted">${esc(errMsg(e))}</div>`;return}
  M.roles.sort((a,b)=>(a.name||a.email).localeCompare(b.name||b.email,'ar'));
  box.innerHTML=`<div class="tablewrap" style="max-height:420px;min-height:0"><table><thead><tr><th class="nosort">${tr('المستخدم','User')}</th><th class="nosort">${tr('البريد','Email')}</th><th class="nosort">${tr('الصلاحية','Role')}</th><th class="nosort">${tr('الإدارة','Department')}</th></tr></thead><tbody>
   ${M.roles.map(r=>`<tr style="cursor:default"><td>${esc(r.name||'')}</td><td dir="ltr">${esc(r.email)}</td><td>${esc((window.__roleAr||{})[r.role]||r.role)}</td><td><select data-mt-unit="${esc(r.email)}"><option value="">${tr('— غير مربوط —','— none —')}</option>${MT_UNITS.map(u=>`<option value="${u}" ${r.unit===u?'selected':''}>${esc(uName(u))}</option>`).join('')}</select></td></tr>`).join('')}
  </tbody></table></div><p class="muted" style="font-size:12.5px;margin:8px 0 0">${tr('المستخدم المربوط بإدارة يرى اجتماعاتها فقط، ويستطيع (إن كانت صلاحيته محرر) إنشاء اجتماعات باسمها.','A linked user sees only that department’s meetings and, as an editor, can create meetings on its behalf.')}</p>`;
}

/* ---------- create / edit ---------- */
function meetingForm(m,preset){
  const isNew=!m;const d=new Date(Date.now()+86400000);
  m=m||{date:iso(d),time:'10:00',duration:60,organizer:M.unit||'gm',units:[],agenda:[],platform:preset||'zoom',link:''};
  const plat=platOf(m)||'zoom';
  const unitBox=MT_UNITS.map(u=>`<label style="display:flex;gap:8px;align-items:flex-start;font-size:13px;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface2)"><input type="checkbox" name="mt-inv" value="${u}" ${(m.units||[]).includes(u)?'checked':''} style="margin-top:3px"><span><b>${esc(uName(u))}</b><br><span class="muted" style="font-size:12px">${esc(uHead(u))}</span></span></label>`).join('');
  modal(isNew?tr('اجتماع مغلق جديد','New closed meeting'):tr('تعديل الاجتماع','Edit meeting'),`
   <fieldset><legend>${tr('الاجتماع','Meeting')}</legend>
    ${F('mt-title',tr('موضوع الاجتماع','Subject'),m.title,{req:1,full:1})}
    ${F('mt-date',tr('التاريخ','Date'),m.date,{t:'date',req:1})}
    ${F('mt-time',tr('الساعة','Time'),m.time,{t:'time',req:1})}
    <div class="field"><label for="mt-dur">${tr('المدة','Duration')}</label><select id="mt-dur">${[30,45,60,90,120,180].map(n=>`<option value="${n}" ${Number(m.duration)===n?'selected':''}>${n} ${tr('دقيقة','min')}</option>`).join('')}</select></div>
    <div class="field"><label for="mt-org">${tr('الجهة الداعية','Organizer')}</label><select id="mt-org" ${isAdmin()?'':'disabled'}>${MT_UNITS.map(u=>`<option value="${u}" ${m.organizer===u?'selected':''}>${esc(uName(u))}</option>`).join('')}</select></div>
   </fieldset>
   <fieldset><legend>${tr('الإدارات المدعوة','Invited departments')}</legend><div class="field full" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px">${unitBox}</div>
    <span class="hint field full" style="font-size:12px;color:var(--muted)">${tr('الاجتماع مغلق: لا يظهر إلا للجهة الداعية والإدارات المحددة هنا ومدير النظام.','Closed: visible only to the organizer, the departments ticked here, and the administrator.')}</span></fieldset>
   <fieldset><legend>${tr('جدول الأعمال','Agenda')}</legend>
    <div class="field full"><label for="mt-agenda">${tr('بند في كل سطر','One item per line')}</label><textarea id="mt-agenda" rows="5">${esc((m.agenda||[]).map(a=>a.t).join('\n'))}</textarea></div></fieldset>
   <fieldset><legend>${tr('منصة الاجتماع عن بُعد','Online meeting platform')}</legend>
    <input type="hidden" id="mt-plat" value="${plat}">
    <div class="field full"><div class="mt-brands" id="mt-brands">${brandCard('zoom','data-mt="pick" data-p="zoom"',plat==='zoom')}${brandCard('whatsapp','data-mt="pick" data-p="whatsapp"',plat==='whatsapp')}</div>
     <div class="mt-others" style="margin-top:8px">${tr('منصات أخرى','Other platforms')}: ${['meet','teams','jitsi'].map(k=>`<button type="button" class="chip" data-mt="pick" data-p="${k}" aria-pressed="${plat===k}">${PLAT[k].l}</button>`).join('')}</div></div>
    <div class="field full"><button type="button" class="btn" data-mt="plat-start" id="mt-start" style="align-self:flex-start"></button></div>
    <div class="field full"><label for="mt-link">${tr('رابط الانضمام','Join link')}</label><input id="mt-link" dir="ltr" value="${esc(m.link||'')}" placeholder="https://zoom.us/j/..."><span class="hint" id="mt-plat-hint"></span></div>
    ${F('mt-mid',tr('رقم الاجتماع (Meeting ID)','Meeting ID'),m.meetingId)}
    ${F('mt-pass',tr('رمز الدخول (Passcode)','Passcode'),m.passcode)}
   </fieldset>
   <div class="lg-msg" id="mt-msg" role="alert" style="color:var(--crit);font-size:13px"></div>`,
   `<button type="button" class="btn primary" data-mt="save" data-id="${esc(m.id||'')}">${tr('حفظ الاجتماع','Save meeting')}</button><button type="button" class="btn" data-act="close-dlg">${tr('إلغاء','Cancel')}</button>`);
  platUI();
}
function platUI(){const p=val('mt-plat'),h=document.getElementById('mt-plat-hint'),st=document.getElementById('mt-start'),li=document.getElementById('mt-link');if(!h)return;
  const H={zoom:tr('اضغط «جدولة الاجتماع في Zoom» بحساب الشركة، ثم الصق هنا رابط الدعوة (Invite Link) ورقم الاجتماع ورمز الدخول. يكفي رقم الاجتماع وحده وسيُكوَّن الرابط تلقائيًا.','Click “Schedule it in Zoom” with the company account, then paste the invite link, meeting ID and passcode. The meeting ID alone is enough.'),
   meet:tr('أنشئ اجتماعًا في Google Meet ثم الصق رابطه هنا.','Create a Google Meet and paste its link.'),
   teams:tr('أنشئ اجتماعًا في Teams ثم الصق رابط الانضمام هنا.','Create a Teams meeting and paste its join link.'),
   whatsapp:tr('أنشئ مجموعة واتساب للاجتماع أو رابط مكالمة واتساب، ثم الصق رابط الدعوة هنا (chat.whatsapp.com أو call.whatsapp.com).','Create a WhatsApp group or call link and paste it here.'),
   jitsi:tr('أُنشئ رابط غرفة Jitsi خاصة تلقائيًا (مجانية، بلا حساب).','A private Jitsi room link was generated (free, no account).')};
  h.textContent=H[p]||'';st.hidden=p==='jitsi';st.className='btn '+(p==='zoom'||p==='whatsapp'?'s-'+p:'');
  st.innerHTML=(p==='zoom'||p==='whatsapp'?logo(p,18).replace(/fill="#(0B5CFF|25D366)"/,'fill="rgba(255,255,255,.25)"'):I.plus)+({zoom:tr('جدولة الاجتماع في Zoom','Schedule it in Zoom'),whatsapp:tr('فتح واتساب لإنشاء المجموعة أو المكالمة','Open WhatsApp to create the group or call'),meet:tr('إنشاء اجتماع Google Meet','Create a Google Meet'),teams:tr('فتح Microsoft Teams','Open Microsoft Teams')}[p]||'');
  document.querySelectorAll('#mtform-plat [data-mt="pick"],.m-body [data-mt="pick"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.p===p)));
  if(p==='jitsi'&&!PLAT.jitsi.re.test(li.value))li.value=genLink();else if(p!=='jitsi'&&PLAT.jitsi.re.test(li.value))li.value='';
  li.placeholder={zoom:'https://zoom.us/j/...',meet:'https://meet.google.com/...',teams:'https://teams.microsoft.com/l/meetup-join/...',whatsapp:'https://chat.whatsapp.com/...',jitsi:''}[p]||'';
  document.getElementById('mt-mid').closest('.field').hidden=p!=='zoom'&&p!=='teams'}
document.addEventListener('change',e=>{if(e.target.id==='mt-plat')platUI()});
async function saveForm(id){
  const msg=document.getElementById('mt-msg');const old=id?M.list.get(id):null;
  const organizer=isAdmin()?val('mt-org'):(old?old.organizer:M.unit);
  const inv=[...document.querySelectorAll('input[name=mt-inv]:checked')].map(x=>x.value);
  const units=[organizer,...inv.filter(u=>u!==organizer)];
  const platform=val('mt-plat')||'zoom',mid=val('mt-mid').replace(/[^\d]/g,'');
  let link=safeUrl(val('mt-link'));if(!link&&platform==='zoom'&&mid)link='https://zoom.us/j/'+mid;
  if(!val('mt-title')||!val('mt-date')||!val('mt-time')){msg.textContent=tr('أكمل الموضوع والتاريخ والساعة','Fill subject, date and time');return}
  if(units.length<2){msg.textContent=tr('اختر إدارة واحدة على الأقل لدعوتها','Invite at least one department');return}
  if(val('mt-link')&&!link){msg.textContent=tr('الرابط يجب أن يبدأ بـ https://','The link must start with https://');return}
  if(link&&!PLAT[platform].re.test(link)){msg.textContent=tr(`الرابط لا يبدو رابط ${PLAT[platform].l}. غيّر المنصة أو صحّح الرابط.`,`This does not look like a ${PLAT[platform].l} link.`);return}
  const oldAgenda=new Map(((old&&old.agenda)||[]).map(a=>[a.t,a]));
  const o=Object.assign({},old||{},{title:val('mt-title'),date:val('mt-date'),time:val('mt-time'),duration:Number(val('mt-dur'))||60,organizer,units,
    agenda:val('mt-agenda').split('\n').map(s=>s.trim()).filter(Boolean).map(t=>oldAgenda.get(t)||{t}),link,platform,meetingId:(platform==='zoom'||platform==='teams')?val('mt-mid'):'',passcode:val('mt-pass'),updatedAt:nowISO()});
  delete o.id;delete o._t;
  if(!old){Object.assign(o,{status:'scheduled',createdBy:me().email,createdByName:me().name||'',createdAt:nowISO(),rsvp:{},decisions:[],minutes:''})}
  const ref=old?FS().collection('meetings').doc(id):FS().collection('meetings').doc();
  try{await ref.set(JSON.parse(JSON.stringify(o)));dlg.close();toast(tr('تم حفظ الاجتماع','Meeting saved'));logM(old?'تعديل':'إضافة',ref.id,o.title);openMeeting(ref.id)}catch(e){msg.textContent=errMsg(e)}
}
async function patch(id,data,okMsg,logAction){
  const m=M.list.get(id);if(!m)return;
  try{await FS().collection('meetings').doc(id).update(Object.assign({},data,{updatedAt:nowISO()}));if(okMsg)toast(okMsg);if(logAction)logM(logAction,id,m.title)}catch(e){toast(errMsg(e))}
}

/* ---------- meeting drawer ---------- */
function openMeeting(id,keepScroll){
  const m=M.list.get(id);if(!m)return;M.open=id;
  const st=effStatus(m),man=canManage(m),con=canContribute(m),closed=st==='closed'||st==='cancelled',r=m.rsvp||{};
  const prevScroll=keepScroll?(document.querySelector('.drawer-body')||{}).scrollTop:0;
  const link=safeUrl(m.link),mine=M.unit&&(m.units||[]).includes(M.unit)&&M.unit!==m.organizer;
  const inv=(m.units||[]).filter(u=>u!==m.organizer);
  const timeNote=(()=>{const s=startOf(m),e=endOf(m),n=new Date();if(st!=='scheduled')return '';if(n<s){const h=Math.round((s-n)/3600000);return h<48?tr(`يبدأ بعد ${h<1?'أقل من ساعة':h+' ساعة'}`,`Starts in ${h<1?'under an hour':h+' h'}`):''}if(n<=e)return tr('حان موعده','It is time');return tr('انتهى وقته ولم يُغلق المحضر','Time passed, minutes not closed')})();
  const head=`<div style="flex:1;min-width:0"><h3>${esc(m.title)}</h3><div class="sub">${stPill(st)} <span>${fdt(m)} · ${esc(m.duration||60)} ${tr('دقيقة','min')}</span>${timeNote?`<span class="tag">${esc(timeNote)}</span>`:''}<span class="tag">${MI.lock.replace('<svg','<svg style="width:11px;height:11px;vertical-align:-1px"')} ${tr('مغلق','Closed meeting')}</span></div></div>
   <button class="iconbtn" data-mt="print" data-id="${esc(id)}" aria-label="${tr('طباعة المحضر','Print minutes')}" title="${tr('طباعة المحضر','Print minutes')}">${MI.print}</button>
   ${man&&!closed?`<button class="iconbtn" data-mt="edit" data-id="${esc(id)}" aria-label="${tr('تعديل','Edit')}">${I.edit}</button>`:''}
   <button class="iconbtn" data-act="close-drawer" aria-label="${tr('إغلاق','Close')}">${I.close}</button>`;
  const pk=platOf(m),pl=pk?PLAT[pk].l:'';
  const waUnits=(m.units||[]).filter(u=>u!==M.unit&&WA[u]);
  const wa=!closed?`<div class="panel"><h3 class="section-title">${logo('whatsapp',22)} ${tr('إرسال الدعوة عبر واتساب','Send invitation on WhatsApp')}</h3><div class="toolbar">
     <a class="btn s-whatsapp" href="${esc(waLink(m))}" target="_blank" rel="noopener" data-mt="join">${MI.wa}${tr('اختيار جهة أو مجموعة','Choose chat or group')}</a>
     ${waUnits.map(u=>`<a class="btn sm b-whatsapp" href="${esc(waLink(m,WA[u]))}" target="_blank" rel="noopener" data-mt="join">${esc(uName(u))}</a>`).join('')}</div>
     ${!waUnits.length?`<p class="muted" style="font-size:12px;margin:8px 0 0">${tr('لإرسال الدعوة مباشرة لكل إدارة، يضيف مدير النظام أرقام واتساب الإدارات أسفل صفحة الاجتماعات.','To send directly to each department, the administrator adds department WhatsApp numbers at the bottom of the meetings page.')}</p>`:''}</div>`:'';
  const brandJ=pk==='zoom'||pk==='whatsapp';
  const join=!closed&&link?`<div class="panel mt-join ${pk}">${brandJ?logo(pk,40):''}
     <a class="btn lg ${brandJ?'s-'+pk:'primary'}" href="${esc(link)}" target="_blank" rel="noopener" data-mt="join" data-id="${esc(id)}">${pk==='whatsapp'?MI.wa:MI.meet}${pl?tr('انضمام عبر ','Join on ')+pl:tr('انضمام إلى الاجتماع','Join meeting')}</a>
     <button class="btn" data-mt="copy" data-id="${esc(id)}">${I.link}${tr('نسخ الدعوة','Copy invitation')}</button>
     ${m.meetingId?`<span class="muted" style="font-size:13px">${tr('رقم الاجتماع','Meeting ID')}: <b dir="ltr">${esc(m.meetingId)}</b></span>`:''}
     ${m.passcode?`<span class="muted" style="font-size:13px">${tr('رمز الدخول','Passcode')}: <b dir="ltr">${esc(m.passcode)}</b></span>`:''}
     <span class="muted" style="font-size:12px;flex-basis:100%">${tr('لا تشارك الرابط خارج الإدارات المدعوة.','Do not share this link outside the invited departments.')}</span></div>`:'';
  const actions=man?`<div class="toolbar">
     ${st==='scheduled'?`<button class="btn" data-mt="live" data-id="${esc(id)}">${tr('بدء الاجتماع الآن','Start now')}</button>`:''}
     ${!closed?`<button class="btn primary" data-mt="close" data-id="${esc(id)}">${MI.lock}${tr('إغلاق الاجتماع واعتماد المحضر','Close meeting & approve minutes')}</button>`:''}
     ${st==='scheduled'?`<button class="btn danger" data-mt="cancel" data-id="${esc(id)}">${tr('إلغاء الاجتماع','Cancel meeting')}</button>`:''}
     ${closed&&isAdmin()?`<button class="btn" data-mt="reopen" data-id="${esc(id)}">${tr('إعادة فتح','Reopen')}</button>`:''}
     ${isAdmin()||m.createdBy===(me()||{}).email?`<button class="btn danger" data-mt="del" data-id="${esc(id)}">${tr('حذف','Delete')}</button>`:''}</div>`:'';
  const myR=mine&&!closed?`<div class="panel"><h3 class="section-title">${tr('رد إدارتكم','Your department’s reply')}</h3><div class="chips">${Object.entries(RSVP).map(([k,v])=>`<button class="chip" data-mt="rsvp" data-s="${k}" data-id="${esc(id)}" aria-pressed="${(r[M.unit]||{}).s===k}">${tr(v[0],v[1])}</button>`).join('')}</div>${(r[M.unit]||{}).by?`<p class="muted" style="font-size:12px;margin:8px 0 0">${tr('آخر رد من','Last reply by')} ${esc(r[M.unit].name||r[M.unit].by)}</p>`:''}</div>`:'';
  const unitsT=`<div class="panel"><h3 class="section-title">${tr('الجهة الداعية والإدارات المدعوة','Organizer and invited departments')}</h3><table><tbody>
    <tr style="cursor:default"><td class="t-strong">${esc(uFull(m.organizer))}<div class="muted" style="font-size:12px">${esc(uHead(m.organizer))}</div></td><td><span class="pill p-fl">${tr('الجهة الداعية','Organizer')}</span></td></tr>
    ${inv.map(u=>{const x=r[u];const v=x&&RSVP[x.s];return `<tr style="cursor:default"><td>${esc(uFull(u))}<div class="muted" style="font-size:12px">${esc(uHead(u))}</div></td><td>${v?`<span class="pill ${v[2]}">${tr(v[0],v[1])}</span>`:`<span class="pill p-neutral">${tr('لم ترد بعد','No reply yet')}</span>`}</td></tr>`}).join('')}</tbody></table>
    <p class="muted" style="font-size:12px;margin:8px 0 0">${tr('أنشأه','Created by')} ${esc(m.createdByName||m.createdBy||'')}${m.closedAt?` · ${tr('أُغلق في','Closed on')} ${new Date(m.closedAt).toLocaleString('en-GB')} ${tr('بواسطة','by')} ${esc(m.closedByName||m.closedBy||'')}`:''}</p></div>`;
  const agenda=`<div class="panel"><h3 class="section-title">${tr('جدول الأعمال','Agenda')}</h3>${(m.agenda||[]).length?`<ol style="margin:0;padding-inline-start:20px;display:flex;flex-direction:column;gap:6px">${m.agenda.map(a=>`<li>${esc(a.t)}</li>`).join('')}</ol>`:`<div class="muted">${tr('لم يُحدد جدول أعمال.','No agenda yet.')}</div>`}</div>`;
  const minutes=`<div class="panel"><h3 class="section-title">${tr('محضر الاجتماع','Minutes')} ${closed?`<small>${tr('معتمد ومقفل','approved and locked')}</small>`:''}</h3>
    ${con&&!closed?`<textarea id="mt-min" rows="7" style="width:100%;border:1px solid var(--line);border-radius:8px;padding:10px;background:var(--surface);font:inherit;color:inherit" placeholder="${tr('ما دار في الاجتماع، الحضور بالأسماء، الملاحظات…','What was discussed, attendees, notes…')}">${esc(m.minutes||'')}</textarea><div style="margin-top:8px"><button class="btn sm" data-mt="save-min" data-id="${esc(id)}">${tr('حفظ المحضر','Save minutes')}</button></div>`
     :(m.minutes?`<div style="white-space:pre-wrap;line-height:1.8">${esc(m.minutes)}</div>`:`<div class="muted">${tr('لا يوجد محضر بعد.','No minutes yet.')}</div>`)}
    ${window.ATT&&((con&&!closed)||(m.attachments||[]).length)?`<h4 style="margin:16px 0 8px;font-size:13.5px">${tr('مرفقات المحضر','Minutes attachments')} <small class="muted" style="font-weight:400">${tr('المحضر الموقّع، كشف الحضور، المستندات المعروضة','Signed minutes, attendance sheet, documents presented')}</small></h4>${ATT.field('mt:'+id,m.attachments,{readonly:!(con&&!closed),name:m.title,onChange:list=>patch(id,{attachments:list})})}`:''}</div>`;
  const ds=m.decisions||[],td=TODAY_ISO;
  const decisions=`<div class="panel"><h3 class="section-title">${tr('القرارات والتكليفات','Decisions and assignments')} <small>${ds.filter(d=>d.done).length}/${ds.length} ${tr('منفّذ','done')}</small></h3>
    ${ds.length?`<div style="overflow-x:auto"><table><thead><tr><th class="nosort">${tr('القرار','Decision')}</th><th class="nosort">${tr('الجهة المكلفة','Owner')}</th><th class="nosort">${tr('الموعد','Due')}</th><th class="nosort">${tr('منفّذ','Done')}</th>${man&&!closed?'<th class="nosort"></th>':''}</tr></thead><tbody>
     ${ds.map((d,i)=>{const late=!d.done&&d.due&&d.due<td;const can=canWrite()&&(man||M.unit===d.unit);return `<tr style="cursor:default"><td class="wrap">${esc(d.t)}</td><td>${esc(uName(d.unit))}</td><td>${d.due?`<span class="${late?'pill p-crit':''}">${fd(d.due)}</span>`:'—'}</td><td><input type="checkbox" data-mt="done" data-id="${esc(id)}" data-i="${i}" ${d.done?'checked':''} ${can?'':'disabled'} aria-label="${tr('منفّذ','Done')}"></td>${man&&!closed?`<td><button class="btn sm ghost" data-mt="del-dec" data-id="${esc(id)}" data-i="${i}">${tr('حذف','Remove')}</button></td>`:''}</tr>`}).join('')}</tbody></table></div>`:`<div class="muted">${tr('لا توجد قرارات بعد.','No decisions yet.')}</div>`}
    ${con&&!closed?`<div class="toolbar" style="margin-top:10px"><div class="grow" style="min-width:180px"><input id="mt-dt" style="width:100%;height:36px;border:1px solid var(--line);border-radius:8px;padding-inline:10px;background:var(--surface);color:inherit" placeholder="${tr('نص القرار أو التكليف','Decision or task')}"></div>
      <select id="mt-du">${(m.units||[]).map(u=>`<option value="${u}">${esc(uName(u))}</option>`).join('')}</select><input type="date" id="mt-dd" style="height:36px;border:1px solid var(--line);border-radius:8px;padding-inline:8px;background:var(--surface);color:inherit"><button class="btn" data-mt="add-dec" data-id="${esc(id)}">${I.plus}${tr('إضافة قرار','Add')}</button></div>`:''}</div>`;
  drawer(head,join+wa+actions+myR+agenda+unitsT+minutes+decisions);
  const dr=document.querySelector('#drawer-root .drawer');if(dr){dr.dataset.mt=id;if(keepScroll)dr.querySelector('.drawer-body').scrollTop=prevScroll}
}

function printMinutes(id){
  const m=M.list.get(id);if(!m)return;const r=m.rsvp||{};const inv=(m.units||[]).filter(u=>u!==m.organizer);
  const w=window.open('','_blank');if(!w){toast(tr('اسمح بالنوافذ المنبثقة للطباعة','Allow pop-ups to print'));return}
  w.document.write(`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>${esc(m.title)}</title><style>body{font-family:Arial,Tahoma,sans-serif;font-weight:700;margin:32px;color:#111;line-height:1.7}h1{font-size:20px;margin:0 0 4px}h2{font-size:15px;border-bottom:1px solid #999;padding-bottom:4px;margin-top:22px}table{border-collapse:collapse;width:100%;font-size:13px}td,th{border:1px solid #bbb;padding:6px 8px;text-align:start}.m{color:#555;font-size:13px}.sig{display:flex;justify-content:space-between;margin-top:50px}</style></head><body>
   <div class="m">شركة البريقة لتسويق النفط · الإدارة العامة للمبيعات والشؤون التجارية · اجتماع مغلق</div>
   <h1>محضر اجتماع: ${esc(m.title)}</h1><div class="m">${fd(m.date)} · الساعة ${esc(m.time)} · ${esc(m.duration||60)} دقيقة · الحالة: ${esc(STATUS[effStatus(m)][0])}</div>
   <h2>الجهة الداعية والإدارات المدعوة</h2><table><tr><th>الجهة</th><th>المسؤول</th><th>الحضور</th></tr><tr><td>${esc(uFull(m.organizer))} (الداعية)</td><td>${esc(uHead(m.organizer))}</td><td>—</td></tr>${inv.map(u=>`<tr><td>${esc(uFull(u))}</td><td>${esc(uHead(u))}</td><td>${r[u]?esc(RSVP[r[u].s][0]):'لم ترد'}</td></tr>`).join('')}</table>
   <h2>جدول الأعمال</h2>${(m.agenda||[]).length?`<ol>${m.agenda.map(a=>`<li>${esc(a.t)}</li>`).join('')}</ol>`:'<p>—</p>'}
   ${m.link?`<p class="m">${esc(PLAT[platOf(m)]?PLAT[platOf(m)].l:'')} ${esc(m.link)}${m.meetingId?' · رقم الاجتماع '+esc(m.meetingId):''}</p>`:''}
   <h2>المحضر</h2><div style="white-space:pre-wrap">${esc(m.minutes||'—')}</div>
   <h2>القرارات والتكليفات</h2>${(m.decisions||[]).length?`<table><tr><th>#</th><th>القرار</th><th>الجهة المكلفة</th><th>الموعد</th><th>الحالة</th></tr>${m.decisions.map((d,i)=>`<tr><td>${i+1}</td><td>${esc(d.t)}</td><td>${esc(uFull(d.unit))}</td><td>${d.due?fd(d.due):'—'}</td><td>${d.done?'منفّذ':'قيد التنفيذ'}</td></tr>`).join('')}</table>`:'<p>—</p>'}
   <div class="sig"><div>مقرر الاجتماع: ................</div><div>رئيس الاجتماع: ................</div></div>
   <script>window.onload=()=>window.print()<\/script></body></html>`);
  w.document.close();
}

/* ---------- events ---------- */
document.addEventListener('click',async e=>{
  const f=e.target.closest('[data-mt-f]');if(f&&S.view==='meetings'){M.ui.f=f.dataset.mtF;render();return}
  const row=e.target.closest('[data-mt-open]');if(row){openMeeting(row.dataset.mtOpen);return}
  const b=e.target.closest('[data-mt]');if(!b)return;const a=b.dataset.mt,id=b.dataset.id,m=id?M.list.get(id):null;
  if(a==='join')return;
  if(a!=='done')e.preventDefault();
  if(a==='new')return meetingForm(null,b.dataset.p);
  if(a==='save-wa'){const o={};MT_UNITS.forEach(u=>{const v=waNum(val('mt-wa-'+u));if(v)o[u]=v});try{await FS().collection('config').doc('meetings').set({whatsapp:o},{merge:false});toast(tr('حُفظت أرقام واتساب','WhatsApp numbers saved'))}catch(err){toast(errMsg(err))}return}
  if(a==='pick'){document.getElementById('mt-plat').value=b.dataset.p;platUI();return}
  if(a==='plat-start'){const p=PLAT[val('mt-plat')];if(p&&p.start)window.open(p.start,'_blank','noopener');return}
  if(a==='save')return saveForm(id);
  if(!m)return;
  if(a==='edit')return meetingForm(m);
  if(a==='copy'){try{await navigator.clipboard.writeText(inviteText(m));toast(tr('نُسخ الرابط','Link copied'))}catch(err){toast(m.link)}return}
  if(a==='print')return printMinutes(id);
  if(a==='live')return patch(id,{status:'live',startedAt:nowISO()},tr('بدأ الاجتماع','Meeting started'),'بدء اجتماع');
  if(a==='rsvp'){const o={s:b.dataset.s,by:me().email,name:me().name||'',at:nowISO()};return patch(id,{['rsvp.'+M.unit]:o},tr('تم تسجيل ردّكم','Reply saved'))}
  if(a==='save-min')return patch(id,{minutes:document.getElementById('mt-min').value},tr('تم حفظ المحضر','Minutes saved'),'تعديل محضر');
  if(a==='add-dec'){const t=document.getElementById('mt-dt').value.trim();if(!t){document.getElementById('mt-dt').focus();return}
    const ds=(m.decisions||[]).concat([{t,unit:document.getElementById('mt-du').value,due:document.getElementById('mt-dd').value||'',done:false}]);return patch(id,{decisions:ds},tr('أُضيف القرار','Decision added'))}
  if(a==='del-dec'){const ds=(m.decisions||[]).filter((_,i)=>i!==Number(b.dataset.i));return patch(id,{decisions:ds})}
  if(a==='done'){const ds=(m.decisions||[]).map((d,i)=>i===Number(b.dataset.i)?Object.assign({},d,{done:b.checked,doneAt:b.checked?nowISO():'',doneBy:b.checked?me().email:''}):d);return patch(id,{decisions:ds},b.checked?tr('سُجّل التنفيذ','Marked done'):'')}
  if(a==='close'){const mt=document.getElementById('mt-min');const extra=mt?{minutes:mt.value}:{};
    if(!b.classList.contains('armed')){b.classList.add('armed');b.lastChild.textContent=tr('تأكيد الإغلاق؟ لن يُعدَّل المحضر بعدها','Confirm? Minutes will be locked');setTimeout(()=>{if(b.isConnected){b.classList.remove('armed');b.lastChild.textContent=tr('إغلاق الاجتماع واعتماد المحضر','Close meeting & approve minutes')}},5000);return}
    return patch(id,Object.assign(extra,{status:'closed',closedAt:nowISO(),closedBy:me().email,closedByName:me().name||''}),tr('أُغلق الاجتماع واعتُمد المحضر','Meeting closed, minutes approved'),'إغلاق اجتماع')}
  if(a==='cancel'||a==='del'){if(!b.classList.contains('armed')){b.classList.add('armed');const t=b.textContent;b.textContent=tr('اضغط للتأكيد','Click to confirm');setTimeout(()=>{if(b.isConnected){b.classList.remove('armed');b.textContent=t}},4000);return}
    if(a==='cancel')return patch(id,{status:'cancelled'},tr('أُلغي الاجتماع','Meeting cancelled'),'إلغاء اجتماع');
    try{await FS().collection('meetings').doc(id).delete();closeDrawer();M.open=null;toast(tr('حُذف الاجتماع','Meeting deleted'));logM('حذف',id,m.title)}catch(err){toast(errMsg(err))}return}
  if(a==='reopen')return patch(id,{status:'scheduled'},tr('أُعيد فتح الاجتماع','Meeting reopened'),'إعادة فتح اجتماع');
});
document.addEventListener('change',async e=>{
  const s=e.target.closest('[data-mt-unit]');if(!s)return;
  try{await FS().collection('roles').doc(s.dataset.mtUnit).set({unit:s.value},{merge:true});toast(tr('تم ربط المستخدم بالإدارة','User linked'));if(s.dataset.mtUnit===(me()||{}).email)start()}catch(err){toast(errMsg(err))}
});
document.addEventListener('click',e=>{if(e.target.closest('[data-act="close-drawer"]'))M.open=null},true);

if(window.claude&&window.claude.use)start();
setInterval(()=>{if(S.view==='meetings')refresh()},60000);
})();
