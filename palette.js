/* ===== لوحة الأوامر والاختصارات والمساعدة (command palette, keyboard shortcuts, help) =====
   Ctrl/⌘+K opens a palette that reaches every screen, the common actions and any record by number or name.
   `?` opens the help dialog (shortcuts and a tip per screen). Alt+1…9 jumps to the n-th menu item; `g` then a letter jumps
   to a screen (g d dashboard, g c contracts, g k calendar, g t assignments, g m meetings, g s settings). `/` already focuses search. */
"use strict";
(function(){
const EN=()=>{if(window.I18N&&I18N.lang)return I18N.lang==='en';try{return localStorage.getItem('cm_lang')==='en'}catch(e){return false}};
const tr=(a,b)=>EN()&&b?b:a;
const me=()=>(window.__me&&window.__me())||null;
const canWrite=()=>{const m=me();return !!m&&(m.role==='admin'||m.role==='editor')};
const say=m=>{try{toast(m)}catch(e){}};
const nz=s=>{try{return norm(s)}catch(e){return String(s||'').toLowerCase()}};
const typing=e=>{const t=e.target;return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'||t.isContentEditable)};
const after=(sel,wait)=>setTimeout(()=>{const b=document.querySelector(sel);if(b)b.click()},wait||120);
const MAC=/Mac|iPhone|iPad/.test(navigator.platform);const MOD=MAC?'⌘':'Ctrl';
const SV={cmd:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 17V7l8 10V7"/><path d="M16 7v10M16 12h4"/></svg>',
 help:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7"/><path d="M12 17h.01"/></svg>'};

/* ---------- catalogue ---------- */
function viewItems(){return VIEWS.map((v,i)=>({k:'view:'+v.id,sec:'screens',t:(window.I18N&&I18N.t?I18N.t(v.label):v.label),s:v.group,hint:v.nav!==false?`Alt+${VIEWS.filter(x=>x.nav!==false).indexOf(v)+1}`:'',run:()=>go(v.id)}))}
function actionItems(){const w=canWrite(),m=me()||{},p=window.__pwa;const A=[];
  const add=(k,t,e,run,hint,cond)=>{if(cond===false)return;A.push({k:'act:'+k,sec:'actions',t:tr(t,e),hint:hint||'',run})};
  add('contract','عقد جديد','New contract',()=>{go('contracts');after('[data-act="add-contract"]')},'',w);
  add('ticket','طلب زبون جديد','New customer request',()=>{go('cs');after('[data-act="tk-new"]')},'',w);
  add('need','إضافة منشأة إلى كشف الاحتياجات','Add facility to needs sheet',()=>{go('needs');after('[data-act="add-need"]')},'',w);
  add('task','تكليف جديد','New assignment',()=>{go('duties');after('[data-dt-tab="tasks"]');after('[data-dt="new"]',320)},'',w&&VIEWS.some(v=>v.id==='duties'));
  add('meeting','اجتماع جديد','New meeting',()=>{go('meetings');after('[data-mt="new"]',200)},'',w&&VIEWS.some(v=>v.id==='meetings'));
  add('quick','الإضافة السريعة','Quick add',()=>{const b=document.getElementById('quick-add');if(b)b.click()},'',w);
  add('search','البحث الشامل','Global search',()=>{const q=document.getElementById('gq');if(q){q.focus();q.select()}},'/');
  add('theme','تبديل المظهر الفاتح/الداكن','Toggle light/dark theme',()=>{const b=document.getElementById('theme-btn');if(b)b.click()});
  add('lang',EN()?'العربية':'English',EN()?'العربية':'English',()=>{const b=document.querySelector('[data-lang-toggle]');if(b)b.click()},'',!!document.querySelector('[data-lang-toggle]'));
  add('print','طباعة الشاشة الحالية','Print this screen',()=>window.print(),MOD+'+P');
  add('export','تصدير كل البيانات إلى Excel','Export everything to Excel',()=>{go('settings');after('[data-act="export-all"],#export-all,[data-export-all]',200)},'',w);
  add('install','تثبيت المنظومة كتطبيق','Install as an app',()=>p.install().then(ok=>say(ok?tr('جارٍ التثبيت…','Installing…'):tr('أُلغي التثبيت','Install cancelled'))),'',!!(p&&p.canInstall()));
  add('update','التحقق من وجود تحديث','Check for updates',()=>p.checkUpdate().then(wt=>say(wt?tr('يتوفر تحديث، اضغط «تحديث الآن»','Update ready: press “Update now”'):tr('لديك أحدث إصدار','You have the latest version'))).catch(()=>say(tr('تعذّر التحقق','Could not check'))),'',!!p);
  add('new','ما الجديد في هذا الإصدار','What’s new',()=>window.__whatsNew&&window.__whatsNew(),'',!!window.__whatsNew);
  add('about','عن المنظومة','About the system',()=>window.__about&&window.__about(),'',!!window.__about);
  add('help','المساعدة والاختصارات','Help & shortcuts',()=>help(),'?');
  add('notif','الإشعارات','Notifications',()=>{const b=document.getElementById('nt-btn');if(b)b.click()},'',!!document.getElementById('nt-btn'));
  add('out','تسجيل الخروج','Sign out',()=>{const a=window.__auth&&window.__auth();if(a)a.signOut().then(()=>location.reload())},'',!!m.email);
  return A}
function recordItems(q){if(!q||q.length<2)return[];const out=[];const push=(sec,t,s,run)=>{if(out.filter(x=>x.sec===sec).length<6)out.push({k:sec+':'+t+s,sec,t,s,run})};
  const hit=(...f)=>f.some(x=>nz(x).includes(q));
  (S.contracts||[]).forEach(c=>{if(hit(c.no,c.company,c.location,c.subject))push('contracts',(c.no||'')+' — '+(c.company||''),[c.type,c.location].filter(Boolean).join(' · '),()=>{go('contracts');setTimeout(()=>openContract(c.id),80)})});
  (S.tickets||[]).forEach(t=>{if(hit(t.no,t.customer,t.subject))push('tickets',(t.no?t.no+' — ':'')+(t.customer||''),[t.subject,t.status].filter(Boolean).join(' · '),()=>{go('cs');setTimeout(()=>openTicket(t.id),80)})});
  (S.needs||[]).forEach(n=>{if(hit(n.company,n.tradeName,n.project,n.licensee,n.region))push('needs',n.company||n.tradeName||'',[n.region,n.activity].filter(Boolean).join(' · '),()=>{go('needs');setTimeout(()=>openNeed(n.id),80)})});
  ((window.__assignments&&window.__assignments())||[]).forEach(a=>{if(hit(a.title,a.no,a.assignee))push('tasks',a.title||'',[a.no,a.status].filter(Boolean).join(' · '),()=>{go('duties');after('[data-dt-tab="tasks"]');after('[data-dt-open="'+CSS.escape(a.id)+'"]',260)})});
  ((window.__meetings&&window.__meetings())||[]).forEach(mt=>{if(hit(mt.title,mt.no))push('meetings',mt.title||'',[mt.date,mt.status].filter(Boolean).join(' · '),()=>{go('meetings');after('[data-mt-open="'+CSS.escape(mt.id)+'"]',200)})});
  (S.records||[]).forEach(r=>{if(hit(r.title,r.ref,r.notes))push('records',r.title||'',[r.date,r.ref].filter(Boolean).join(' · '),()=>go('org',{focus:r.unit}))});
  (S.companies||[]).forEach(x=>{if(hit(x.name))push('companies',x.name||'',x.phone||'',()=>{go('cs');setTimeout(()=>{try{openCustomer(x.name)}catch(e){}},80)})});
  return out}
const SEC={screens:['الشاشات','Screens'],actions:['إجراءات','Actions'],contracts:['عقود','Contracts'],tickets:['طلبات الزبائن','Customer requests'],needs:['كشوفات الاحتياجات','Needs sheets'],tasks:['تكليفات','Assignments'],meetings:['اجتماعات','Meetings'],records:['سجلات الإدارات','Department records'],companies:['جهات','Entities']};
let RECENT=[];try{RECENT=JSON.parse(localStorage.getItem('cm_cp_recent')||'[]')}catch(e){}
function remember(k){RECENT=[k].concat(RECENT.filter(x=>x!==k)).slice(0,8);try{localStorage.setItem('cm_cp_recent',JSON.stringify(RECENT))}catch(e){}}
function score(it,q){const t=nz(it.t),s=nz(it.s||'');if(!q)return RECENT.includes(it.k)?3:it.sec==='screens'?2:1;if(t.startsWith(q))return 10;if(t.split(' ').some(w=>w.startsWith(q)))return 7;if(t.includes(q))return 5;if(s.includes(q))return 2;return 0}

/* ---------- palette dialog ---------- */
let CP=null,cur=0,items=[];
function ensure(){if(CP)return CP;CP=document.createElement('dialog');CP.id='cp';CP.className='cp';CP.setAttribute('aria-label',tr('لوحة الأوامر','Command palette'));
  CP.innerHTML=`<div class="cp-in"><span class="cp-ic">${SV.cmd}</span><input id="cp-q" type="text" autocomplete="off" spellcheck="false" placeholder="${esc(tr('اكتب شاشة أو إجراءً أو رقم عقد أو اسم شركة…','Type a screen, an action, a contract number or a company…'))}" aria-label="${esc(tr('أمر','Command'))}"><kbd>Esc</kbd></div><div id="cp-list" class="cp-list" role="listbox"></div><div class="cp-foot"><span><kbd>↑</kbd><kbd>↓</kbd> ${esc(tr('تنقل','move'))}</span><span><kbd>Enter</kbd> ${esc(tr('فتح','open'))}</span><span><kbd>?</kbd> ${esc(tr('المساعدة','help'))}</span></div>`;
  document.body.appendChild(CP);const q=CP.querySelector('#cp-q');
  q.addEventListener('input',()=>list(q.value));
  q.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();move(1)}else if(e.key==='ArrowUp'){e.preventDefault();move(-1)}else if(e.key==='Enter'){e.preventDefault();pick(cur)}});
  CP.addEventListener('click',e=>{if(e.target===CP)CP.close();const b=e.target.closest('[data-cp-i]');if(b)pick(+b.dataset.cpI)});
  CP.addEventListener('close',()=>{document.documentElement.classList.remove('cp-open');try{q.blur();if(document.activeElement&&CP.contains(document.activeElement))document.activeElement.blur()}catch(e){}});return CP}
function openPalette(prefill){if(!me())return;ensure();if(dlg&&dlg.open)return;if(!CP.open)CP.showModal();document.documentElement.classList.add('cp-open');const q=CP.querySelector('#cp-q');q.value=prefill||'';list(q.value);q.focus();q.select()}
function list(raw){const q=nz(raw);const all=viewItems().concat(actionItems()).map(it=>({it,sc:score(it,q)})).filter(x=>x.sc>0).sort((a,b)=>b.sc-a.sc).map(x=>x.it).slice(0,q?14:12).concat(recordItems(q));
  items=all;cur=0;const L=CP.querySelector('#cp-list');if(!all.length){L.innerHTML=`<div class="cp-empty">${esc(tr('لا نتائج. جرّب رقم العقد أو جزءًا من اسم الشركة.','No results. Try the contract number or part of the company name.'))}</div>`;return}
  let sec='',h='';all.forEach((it,i)=>{if(it.sec!==sec){sec=it.sec;h+=`<div class="cp-sec">${esc(tr(...SEC[sec]))}</div>`}h+=`<button type="button" class="cp-it${i===cur?' on':''}" role="option" aria-selected="${i===cur}" data-cp-i="${i}"><span class="cp-t" dir="auto">${esc(it.t)}</span>${it.s?`<span class="cp-s" dir="auto">${esc(it.s)}</span>`:''}${it.hint?`<kbd>${esc(it.hint)}</kbd>`:''}</button>`});L.innerHTML=h}
function move(d){if(!items.length)return;cur=(cur+d+items.length)%items.length;CP.querySelectorAll('.cp-it').forEach((b,i)=>{b.classList.toggle('on',i===cur);b.setAttribute('aria-selected',i===cur);if(i===cur)b.scrollIntoView({block:'nearest'})})}
function pick(i){const it=items[i];if(!it)return;remember(it.k);CP.close();try{it.run()}catch(e){console.warn(e)}}
window.__palette=openPalette;

/* ---------- help ---------- */
const TIPS={dash:['اضغط على أي مؤشر أو شريحة للانتقال إلى السجلات التي تكوّنه.','Click any indicator or slice to open the records behind it.'],contracts:['اكتب في البحث رقم العقد أو اسم الشركة. حالات العقود وتنبيهات الانتهاء تُحسب تلقائيًا من التواريخ والتمديدات.','Search by contract number or company. Statuses and expiry alerts are computed from dates and extensions.'],cs:['كل طلب له رقم ومدة استجابة؛ الطلبات المتأخرة تظهر في جرس الإشعارات.','Every request has a number and a response time; overdue ones appear in the bell.'],needs:['يمكن التصفية حسب الدفعة والقسم والمنطقة ونوع الوقود، والمجاميع في أسفل الجدول.','Filter by batch, section, region and fuel type; totals are in the table footer.'],org:['اختر إدارة من الشجرة لعرض مهامها وسجلاتها ومرفقاتها.','Pick a department in the tree to see its duties, records and attachments.'],duties:['التكليف يمر: جديد → قيد التنفيذ → بانتظار الاعتماد → معتمد. الجهة المكلَّفة لا تعتمد عملها بنفسها.','An assignment moves: new → in progress → awaiting approval → approved. The assigned department cannot approve its own work.'],meetings:['الاجتماع لا يراه إلا مدير النظام ومنشئه والإدارات المدعوة.','Only the administrator, the creator and the invited departments can see a meeting.'],calendar:['السبت أول الأسبوع، والجمعة والسبت عطلة. صدّر الشهر إلى تقويم هاتفك من زر .ics.','The week starts on Saturday; export the month to your phone calendar with the .ics button.'],settings:['من هنا تُدار الصلاحيات والاستيراد والتصدير والتطبيق.','Roles, import/export and the app are managed here.'],ana:['غيّر المحاور والتجميع لاستخراج مقارنات مختلفة، ثم اطبع أو صدّر.','Change the axes and grouping for different comparisons, then print or export.']};
function help(){const rows=[[MOD+'+K',tr('لوحة الأوامر: أي شاشة أو إجراء أو سجل','Command palette: any screen, action or record')],['/',tr('البحث الشامل','Global search')],['?',tr('هذه النافذة','This dialog')],['Alt+1 … 9',tr('الانتقال إلى عنصر القائمة بترتيبه','Jump to the n-th menu item')],['g ثم d / c / k / t / m / s',tr('لوحة المؤشرات / العقود / التقويم / التكليفات / الاجتماعات / الإعدادات','Dashboard / contracts / calendar / assignments / meetings / settings')],['Esc',tr('إغلاق النافذة أو اللوحة الجانبية','Close the dialog or side panel')],[MOD+'+P',tr('طباعة الشاشة الحالية','Print this screen')],['Enter',tr('فتح العنصر المحدد في الجداول والشجرة','Open the focused row or tree item')]];
  const tip=TIPS[S.view];
  modal(tr('المساعدة والاختصارات','Help & shortcuts'),`${tip?`<div class="cp-tip"><b>${esc(tr('نصيحة لهذه الشاشة','Tip for this screen'))}</b><p>${esc(tr(...tip))}</p></div>`:''}
   <table class="cp-keys"><tbody>${rows.map(r=>`<tr><td><kbd>${esc(r[0])}</kbd></td><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table>
   <p class="muted" style="font-size:12.5px;margin:10px 0 0">${esc(tr('على الهاتف: افتح لوحة الأوامر من زر ⌘ أعلى الشاشة، وثبّت المنظومة كتطبيق من الإعدادات.','On a phone: open the palette from the ⌘ button at the top and install the system as an app from Settings.'))}</p>`,
   `<button class="btn ghost" type="button" data-cp="about">${esc(tr('عن المنظومة','About'))}</button><button class="btn primary" value="ok">${esc(tr('إغلاق','Close'))}</button>`);
  const a=dlg.querySelector('[data-cp="about"]');if(a)a.onclick=()=>{dlg.close();window.__about&&window.__about()}}
window.__help=help;

/* ---------- keys ---------- */
let gAt=0;const G={d:'dash',c:'contracts',k:'calendar',t:'duties',m:'meetings',s:'settings',a:'ana',o:'org'};
document.addEventListener('keydown',e=>{if(!me())return;const k=e.key;
  if((e.ctrlKey||e.metaKey)&&!e.altKey&&(k==='k'||k==='K')){e.preventDefault();if(CP&&CP.open)CP.close();else openPalette();return}
  if(CP&&CP.open)return;if(typing(e))return;if(k!=='?'&&dlg&&dlg.open)return;
  if(k==='?'&&!e.ctrlKey&&!e.metaKey){e.preventDefault();if(!(dlg&&dlg.open))help();return}
  if(e.altKey&&!e.ctrlKey&&!e.metaKey&&/^[1-9]$/.test(k)){const nav=VIEWS.filter(v=>v.nav!==false);const v=nav[+k-1];if(v){e.preventDefault();go(v.id)}return}
  if(!e.ctrlKey&&!e.metaKey&&!e.altKey){if(k==='g'){gAt=Date.now();return}if(gAt&&Date.now()-gAt<1200&&G[k]&&VIEWS.some(v=>v.id===G[k])){e.preventDefault();go(G[k])}gAt=0}},true);

/* ---------- button in the header ---------- */
function mount(){const box=document.querySelector('.top-actions');if(!box||document.getElementById('cp-btn')||!me())return;
  const b=document.createElement('button');b.id='cp-btn';b.className='iconbtn';b.type='button';b.title=tr('لوحة الأوامر','Command palette')+' ('+MOD+'+K)';b.setAttribute('aria-label',b.title);b.innerHTML=SV.cmd;b.onclick=()=>openPalette();
  const h=document.createElement('button');h.id='help-btn';h.className='iconbtn';h.type='button';h.title=tr('المساعدة','Help')+' (?)';h.setAttribute('aria-label',h.title);h.innerHTML=SV.help;h.onclick=help;
  const first=document.getElementById('nt-btn')||document.getElementById('theme-btn');box.insertBefore(h,first||null);box.insertBefore(b,h)}
(function wait(n){if(me()){mount();return}if(n<120)setTimeout(()=>wait(n+1),500)})(0);
const __render=render;render=function(){__render();mount()};
const css=document.createElement('style');css.textContent=`
.cp{border:none;border-radius:14px;padding:0;width:min(640px,calc(100vw - 24px));max-height:min(70vh,560px);background:var(--surface);color:var(--ink);box-shadow:0 20px 60px rgba(15,34,54,.28);margin:8vh auto auto;display:flex;flex-direction:column;overflow:hidden}.cp[open]{display:flex}.cp::backdrop{background:rgba(15,34,54,.35);backdrop-filter:blur(2px)}
.cp-in{display:flex;align-items:center;gap:10px;padding:12px 14px;border-bottom:1px solid var(--line)}.cp-ic{color:var(--muted);display:grid}.cp-ic svg{width:18px;height:18px}.cp-in input{all:unset;flex:1;font:inherit;font-size:15px;min-width:0}.cp kbd{font:inherit;font-size:11px;border:1px solid var(--line);border-radius:5px;padding:1px 6px;color:var(--muted);background:var(--surface2)}
.cp-list{overflow:auto;padding:6px;flex:1}.cp-sec{font-size:11px;color:var(--muted);padding:8px 10px 3px;text-transform:uppercase;letter-spacing:.03em}
.cp-it{all:unset;box-sizing:border-box;display:flex;align-items:center;gap:10px;width:100%;padding:8px 10px;border-radius:8px;cursor:pointer;font:inherit;color:var(--ink)}.cp-it.on,.cp-it:hover{background:var(--accent-soft)}.cp-t{font-size:14px}.cp-s{color:var(--muted);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1;min-width:0}.cp-it kbd{margin-inline-start:auto}
.cp-foot{display:flex;gap:16px;padding:8px 14px;border-top:1px solid var(--line);font-size:11.5px;color:var(--muted)}.cp-foot kbd{margin-inline-end:3px}.cp-empty{padding:28px 14px;text-align:center;color:var(--muted);font-size:13.5px}
.cp-tip{background:var(--accent-soft);border-radius:10px;padding:10px 12px;margin-bottom:10px;font-size:13.5px}.cp-tip p{margin:4px 0 0}.cp-keys{width:100%;border-collapse:collapse}.cp-keys td{padding:7px 6px;border-bottom:1px solid var(--line2);font-size:13.5px}.cp-keys td:first-child{white-space:nowrap;width:1%}.cp-keys kbd{font:inherit;font-size:12px;border:1px solid var(--line);border-radius:5px;padding:1px 7px;background:var(--surface2)}
@media (max-width:720px){.cp{margin:4vh auto auto;max-height:80vh}.cp-foot{display:none}}`;document.head.appendChild(css);
})();
