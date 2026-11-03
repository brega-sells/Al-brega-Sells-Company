/* Dashboard and executive overview of all departments.
   Classic script: shares the global scope with the other app files; load order is set in index.html. */
"use strict";
/* ============ Dashboard ============ */
function viewDash(){
  const cs=S.contracts.map(c=>({c,d:D.get(c.id)}));
  const cnt=s=>cs.filter(x=>x.d.status===s).length;
  const active=cs.filter(x=>x.d.status==='ساري'||x.d.status==='قريب الانتهاء');
  const w=n=>active.filter(x=>x.d.remain<=n).length;
  const N=S.needs;
  const fuel={dg:sumBy(N,n=>n.dieselGen),do:sumBy(N,n=>n.dieselOp),gas:sumBy(N,n=>n.gas),ho:sumBy(N,n=>n.heavyOil),ke:sumBy(N,n=>n.kerosene),pq:sumBy(N,n=>n.projQty)};
  const matched=N.filter(n=>MATCH.byNeed.has(n.id)).length;
  // by type
  const byType={};cs.forEach(x=>{const k=x.c.type||'غير محدد';byType[k]=(byType[k]||0)+1});
  const typeRows=Object.entries(byType).sort((a,b)=>b[1]-a[1]);
  const maxT=Math.max(1,...typeRows.map(r=>r[1]));
  // expiry months next 12
  const months=[];for(let i=0;i<12;i++){const d=new Date(today.getFullYear(),today.getMonth()+i,1);months.push({y:d.getFullYear(),m:d.getMonth(),n:0})}
  cs.forEach(x=>{const e=pd(x.d.effEnd);if(!e)return;const mm=months.find(o=>o.y===e.getFullYear()&&o.m===e.getMonth());if(mm)mm.n++});
  const maxM=Math.max(1,...months.map(m=>m.n));
  const MN=['ينا','فبر','مار','أبر','ماي','يون','يول','أغس','سبت','أكت','نوف','ديس'];
  // needs by batch
  const bb=batchesSorted().map(b=>{const r=N.filter(n=>n.batch===b.id);return {b,c:r.length,d:sumBy(r,n=>(n.dieselGen||0)+(n.dieselOp||0))}});
  const maxB=Math.max(1,...bb.map(x=>x.d));
  // region
  const reg={};N.forEach(n=>{const k=cleanRegion(n.region)||'غير محدد';reg[k]=(reg[k]||0)+1});
  const regRows=Object.entries(reg).sort((a,b)=>b[1]-a[1]).slice(0,10);const maxR=Math.max(1,...regRows.map(r=>r[1]));
  const soon=active.filter(x=>x.d.remain<=S.settings.t1).sort((a,b)=>a.d.remain-b.d.remain).slice(0,8);
  const upcoming=cs.filter(x=>x.d.status==='لم يبدأ بعد').sort((a,b)=>(a.c.startDate||'').localeCompare(b.c.startDate||'')).slice(0,6);
  return `
  ${xdExec()}
  <div>
   <h3 class="section-title">عقود البريقة</h3>
   <div class="kpis">
    ${kpi('إجمالي العقود',S.contracts.length,'',`مسجلة في المنظومة`,"contracts",{})}
    ${kpi('سارية حاليًا',active.length,'ok','ساري + قريب الانتهاء',"contracts",{st:'active'})}
    ${kpi(`تنتهي خلال ${S.settings.t3} يومًا`,w(S.settings.t3),'crit','تحتاج إجراء عاجل',"contracts",{st:'a30'})}
    ${kpi(`تنتهي خلال ${S.settings.t1} يومًا`,w(S.settings.t1),'warn',`منها ${w(S.settings.t2)} خلال ${S.settings.t2} يومًا`,"contracts",{st:'a90'})}
    ${kpi('لم يبدأ سريانها',cnt('لم يبدأ بعد'),'','بانتظار تاريخ البداية',"contracts",{st:'لم يبدأ بعد'})}
    ${kpi('منتهية',cnt('منتهٍ')+cnt('منتهٍ قبل موعده'),'',`معلقة: ${cnt('معلق')}`,"contracts",{st:'منتهٍ'})}
   </div>
  </div>
  <div>
   <h3 class="section-title">كشوفات وزارة الصناعة والمعادن <small>احتياجات شهر أكتوبر 2026</small></h3>
   <div class="kpis">
    ${kpi('المنشآت في الكشوفات',N.length,'',`ضمن ${S.batches.length} دفعات`,"needs",{})}
    ${kpi('ديزل مطلوب (لتر)',fn(fuel.dg+fuel.do),'fl',`مولدات ${fn(fuel.dg)} · تشغيلية ${fn(fuel.do)}`,"needs",{fuel:'diesel'})}
    ${kpi('غاز (طن)',fn(fuel.gas),'','',"needs",{fuel:'gas'})}
    ${kpi('زيت ثقيل (لتر)',fn(fuel.ho),'','',"needs",{fuel:'ho'})}
    ${kpi('كيروسين (لتر)',fn(fuel.ke),'','',"needs",{fuel:'ke'})}
    ${kpi('لها عقد مع البريقة',matched,'ok',`من أصل ${N.length} منشأة (مطابقة بالاسم)`,"needs",{link:'yes'})}
   </div>
  </div>
  <div class="grid2">
   <div class="panel"><h3 class="section-title">تنبيهات الانتهاء <small>خلال ${S.settings.t1} يومًا</small></h3>
    ${soon.length?`<div class="alerts">${soon.map(x=>`<div class="alert-row" data-open-c="${x.c.id}"><span class="days ${x.d.remain<=S.settings.t3?'p-crit':x.d.remain<=S.settings.t2?'p-warn':'p-info'}">${x.d.remain} يوم</span><span class="nm">${esc(x.c.company)}<small>${esc(x.c.no)} · ينتهي ${fd(x.d.effEnd)}</small></span>${statusPill(x.d.status)}</div>`).join('')}</div>`
      :`<div class="empty"><b>لا توجد عقود قريبة الانتهاء</b>كل العقود السارية تنتهي بعد أكثر من ${S.settings.t1} يومًا.${upcoming.length?'':''}</div>`}
    ${upcoming.length?`<h3 class="section-title" style="margin-top:14px">عقود تبدأ قريبًا</h3><div class="alerts">${upcoming.map(x=>`<div class="alert-row" data-open-c="${x.c.id}"><span class="days p-info">${days(TODAY_ISO,x.c.startDate)} يوم</span><span class="nm">${esc(x.c.company)}<small>${esc(x.c.no)} · يبدأ ${fd(x.c.startDate)}</small></span>${statusPill(x.d.status)}</div>`).join('')}</div>`:''}
   </div>
   <div class="panel"><h3 class="section-title">مواعيد انتهاء العقود <small>الأشهر الاثنا عشر القادمة</small></h3>
    <div class="cols">${months.map(m=>`<div class="col"><span class="cv">${m.n||''}</span><div class="c ${m.n&&m.y===today.getFullYear()&&m.m-today.getMonth()<3?'hot':''}" style="height:${m.n/maxM*100}%"></div></div>`).join('')}</div>
    <div class="col-labels">${months.map(m=>`<span>${MN[m.m]}${m.m===0||m===months[0]?' '+String(m.y).slice(2):''}</span>`).join('')}</div>
    <h3 class="section-title" style="margin-top:18px">العقود حسب النوع</h3>
    <div class="bars">${typeRows.map(([k,v])=>`<div class="bar-row"><span class="lab" title="${esc(k)}">${esc(k)}</span><div class="bar-track"><div class="bar-fill" style="width:${v/maxT*100}%"></div></div><span class="val">${v}</span></div>`).join('')||'<div class="muted">لا توجد بيانات</div>'}</div>
   </div>
   <div class="panel"><h3 class="section-title">الديزل المطلوب حسب الدفعة <small>لتر شهريًا (مولدات + تشغيلية)</small></h3>
    <div class="bars">${bb.map(x=>`<div class="bar-row"><span class="lab">${esc(x.b.name)} <span class="muted">(${x.c})</span></span><div class="bar-track"><div class="bar-fill" style="width:${x.d/maxB*100}%;background:var(--flame)"></div></div><span class="val">${fn(x.d)}</span></div>`).join('')||'<div class="muted">لا توجد دفعات</div>'}</div>
    <div class="fuel-grid" style="margin-top:16px">
      <div class="fuel"><div class="l">ديزل مولدات</div><div class="v">${fn(fuel.dg)}</div><div class="u">لتر</div></div>
      <div class="fuel"><div class="l">ديزل تشغيلية</div><div class="v">${fn(fuel.do)}</div><div class="u">لتر</div></div>
      <div class="fuel"><div class="l">غاز</div><div class="v">${fn(fuel.gas)}</div><div class="u">طن</div></div>
      <div class="fuel"><div class="l">زيت ثقيل</div><div class="v">${fn(fuel.ho)}</div><div class="u">لتر</div></div>
      <div class="fuel"><div class="l">كيروسين</div><div class="v">${fn(fuel.ke)}</div><div class="u">لتر</div></div>
      <div class="fuel"><div class="l">كميات المشروعات</div><div class="v">${fn(fuel.pq)}</div><div class="u">لتر (نوع الوقود غير محدد)</div></div>
    </div>
   </div>
   <div class="panel"><h3 class="section-title">المنشآت حسب المنطقة <small>أعلى 10 مناطق</small></h3>
    <div class="bars">${regRows.map(([k,v])=>`<div class="bar-row" data-region="${esc(k)}" style="cursor:pointer"><span class="lab">${esc(k)}</span><div class="bar-track"><div class="bar-fill" style="width:${v/maxR*100}%"></div></div><span class="val">${v}</span></div>`).join('')||'<div class="muted">لا توجد بيانات</div>'}</div>
   </div>
  </div>`;
}
function kpi(l,v,cls,s,view,f){return `<button class="kpi ${cls}" data-kpi='${esc(JSON.stringify({view,f}))}'><span class="l">${esc(l)}</span><span class="v">${typeof v==='number'?fn(v):v}</span><span class="s">${esc(s)}</span></button>`}
afterRender.dash=()=>{const q=document.getElementById('xd-q');if(q){xdFilter();q.addEventListener('input',debounce(()=>{S.ui.xq=q.value;xdFilter()},120))}};
/* ============ Executive overview: all departments ============ */
const XD_ORDER=['e','w','ca','gm-fo','gm-rep'];
const XD_REG={'المنطقتان الوسطى والشرقية':'e','المنطقتان الغربية والجنوبية':'w'};
const XD_METRICS=[['pos','المناصب'],['tk','طلبات الزبائن المفتوحة'],['nt','إشعارات البيع الجارية'],['mt','الاجتماعات القادمة']];
function xdDept(id){const p=orgPath(id),i=p.findIndex(o=>o.id==='gm');return i<0?'':p[i+1]?p[i+1].id:'gm'}
function xdRing(pct,sz=64){const p=Math.max(0,Math.min(100,pct)),r=(sz-10)/2,C=2*Math.PI*r;
  return `<svg class="xd-ring" viewBox="0 0 ${sz} ${sz}" width="${sz}" height="${sz}" aria-hidden="true"><circle cx="${sz/2}" cy="${sz/2}" r="${r}" class="xd-ring-t"/>${p?`<circle cx="${sz/2}" cy="${sz/2}" r="${r}" class="xd-ring-v" style="stroke-dasharray:${C*p/100} ${C}" transform="rotate(-90 ${sz/2} ${sz/2})"/>`:''}</svg>`}
function xdData(){
  const byT=new Map();ORG.forEach(o=>byT.set(norm(o.title),o.id));
  const tk=S.tickets.map(t=>({t,dp:(()=>{const id=byT.get(norm(t.assignee||''));return id?xdDept(id):''})()}));
  const mts=(typeof M!=='undefined'&&M.list)?[...M.list.values()]:[];const up=typeof isUpcoming==='function'?mts.filter(m=>{try{return isUpcoming(m)}catch(e){return false}}):[];
  const cs=S.contracts.map(c=>({c,d:D.get(c.id)})),act=cs.filter(x=>x.d.status==='ساري'||x.d.status==='قريب الانتهاء');
  const N=S.notices,run=N.filter(n=>n.status==='جارٍ'),unpaid=N.filter(n=>n.status!=='موقوف'&&n.payment!=='تم السداد');
  const deps=XD_ORDER.map(id=>ORG_BY.get(id)).filter(Boolean).map(o=>{
    const pos=[o,...orgAll(o.id)],vac=pos.filter(x=>x.vacant).length,unc=pos.filter(x=>x.uncertain).length;
    const T=tk.filter(x=>x.dp===o.id).map(x=>x.t),open=T.filter(t=>t.status!=='مغلق'),late=open.filter(tkLate);
    const myM=up.filter(m=>(m.units||[]).includes(o.id)||m.organizer===o.id);
    const myN=N.filter(n=>XD_REG[n.region]===o.id),myRun=myN.filter(n=>n.status==='جارٍ');
    let core=[];
    if(o.id==='e'||o.id==='w')core=[['إشعارات بيع جارية',myRun.length,'',{v:'nt',nst:'جارٍ'}],['إشعارات مكتملة',myN.filter(n=>n.status==='مكتمل').length,'ok',{v:'nt',nst:'مكتمل'}],['مشرفون ووحدات',orgAll(o.id).length,'',{org:o.id}]];
    if(o.id==='ca'){const cl=S.tickets.filter(t=>t.status!=='مغلق'&&t.type==='مطالبة مالية أو فواتير').length,val=sumBy(act,x=>x.c.value||0);
      core=[['إشعارات بانتظار السداد',unpaid.length,unpaid.length?'warn':'',{v:'nt'}],['مطالبات مالية مفتوحة',cl,cl?'warn':'',{v:'cs',type:'مطالبة مالية أو فواتير'}],['قيمة العقود السارية',val?anShort(val):'—','',{v:'contracts',st:'active'}]]}
    if(o.id==='gm-fo'){const rg=uniq(S.needs.map(n=>cleanRegion(n.region)).filter(Boolean)).length;
      core=[['منشآت في الكشوفات',S.needs.length,'',{v:'needs'}],['مناطق مغطاة',rg,'',{v:'needs'}],['مشرفو المتابعة',orgKids(o.id).filter(x=>x.type==='super').length||orgKids(o.id).length,'',{org:o.id}]]}
    if(o.id==='gm-rep'){const w1=act.filter(x=>x.d.remain<=S.settings.t1).length;
      core=[['عقود سارية',act.length,'ok',{v:'contracts',st:'active'}],[`تنتهي خلال ${S.settings.t1} يومًا`,w1,w1?'warn':'',{v:'contracts',st:'a90'}],['تمديدات ومراسلات',S.extensions.length+S.letters.length,'',{v:'ext'}]]}
    return {o,pos:pos.length,vac,unc,fillPct:ocPct(pos.length-vac,pos.length),T,open,late,mt:myM.length,nt:myRun.length,core}});
  return {deps,tk,up,act,run,unpaid,cs};
}
function xdExec(){
  const X=xdData(),gm=ORG_BY.get('gm'),all=[gm,...orgAll('gm')],vac=all.filter(o=>o.vacant).length,fill=ocPct(all.length-vac,all.length);
  const openT=S.tickets.filter(t=>t.status!=='مغلق'),lateT=openT.filter(tkLate);
  const m=S.ui.xm&&XD_METRICS.some(x=>x[0]===S.ui.xm)?S.ui.xm:'pos';
  const val=d=>m==='pos'?d.pos:m==='tk'?d.open.length:m==='nt'?d.nt:d.mt;
  const rows=X.deps.map(d=>({d,v:val(d)})).sort((a,b)=>b.v-a.v),mx=Math.max(1,...rows.map(r=>r.v)),tot=rows.reduce((s,r)=>s+r.v,0);
  const mLbl=XD_METRICS.find(x=>x[0]===m)[1];
  const attn=[];
  X.deps.forEach(d=>{if(d.late.length)attn.push(['crit',`${d.o.title}: ${d.late.length} طلب متأخر عن موعده`,{v:'cs',st:'late'}]);if(d.vac)attn.push(['warn',`${d.o.title}: ${d.vac} منصب شاغر`,{org:d.o.id}])});
  const a30=X.act.filter(x=>x.d.remain<=S.settings.t3).length;if(a30)attn.unshift(['crit',`${a30} عقد ينتهي خلال ${S.settings.t3} يومًا`,{v:'contracts',st:'a30'}]);
  const xd=o=>`data-xd='${esc(JSON.stringify(o))}' role="button" tabindex="0"`;
  const hk=(l,v,s,o,c='')=>`<div class="xd-hk ${c}" ${xd(o)}><span class="l">${l}</span><b class="num">${typeof v==='number'?fn(v):v}</b><span class="s">${s}</span></div>`;
  return `<section class="xd-hero">
   <div class="xd-hero-main">
    <span class="xd-eyebrow">لوحة المؤشرات التنفيذية</span>
    <h2>${esc(gm.title)}</h2>
    <p class="xd-sub">${gm.vacant?'':`<b>${esc(gm.head)}</b>${ORG_ROLE.gm?` · <span>${esc(ORG_ROLE.gm)}</span>`:''}`}</p>
    <p class="xd-date">بيانات محدّثة حتى ${fd(TODAY_ISO)}</p>
    <div class="xd-hero-gauge" ${xd({org:'gm'})} data-tip="${esc('نسبة إشغال المناصب: '+fill+'%')}">${xdRing(fill,84)}<b class="num">${fill}%</b><span>إشغال المناصب<small>${all.length-vac} من ${all.length}</small></span></div>
   </div>
   <div class="xd-hks">
    ${hk('العقود السارية',X.act.length,`من ${fn(S.contracts.length)} عقد مسجّل`,{v:'contracts',st:'active'})}
    ${hk('منشآت الكشوفات',S.needs.length,`ضمن ${fn(S.batches.length)} دفعات`,{v:'needs'})}
    ${hk('طلبات الزبائن المفتوحة',openT.length,lateT.length?`${lateT.length} متأخرة عن موعدها`:'لا توجد طلبات متأخرة',{v:'cs',st:'open'},lateT.length?'crit':'')}
    ${hk('إشعارات بيع جارية',X.run.length,`${fn(X.unpaid.length)} بانتظار السداد`,{v:'nt',nst:'جارٍ'})}
    ${hk('الاجتماعات القادمة',X.up.length,'بين الإدارات',{v:'meetings'})}
    ${hk('الإدارات والجهات',all.length-1,`${orgKids('gm').length} جهات رئيسية · ${vac} شاغر`,{org:'board'},vac?'warn':'')}
   </div>
  </section>
  <div class="xd-head"><h3 class="section-title">الإدارات <small>اضغط على أي إدارة لفتح لوحتها التفصيلية</small></h3>
   <div class="grow xd-search">${I.search}<input type="search" id="xd-q" value="${esc(S.ui.xq||'')}" placeholder="بحث باسم الإدارة أو المسؤول…" aria-label="بحث في الإدارات"></div></div>
  <div class="xd-cards" id="xd-cards">${X.deps.map(d=>{const st=d.late.length?['crit','! طلبات متأخرة']:d.vac?['warn','! شواغر']:['ok','✓ مستقرة'];
   return `<article class="xd-card" data-q="${esc(norm(d.o.title+' '+(d.o.head||'')))}">
    <header ${xd({org:d.o.id})}><div class="xd-ct"><span class="xd-type">${esc((ORG_TYPES.find(t=>t.k===d.o.type)||{}).l||'')}</span><h4>${esc(d.o.title)}</h4><p>${d.o.vacant?'شاغرة':esc(d.o.head)}</p></div>
     <div class="xd-cg" data-tip="${esc('إشغال المناصب: '+d.fillPct+'%')}">${xdRing(d.fillPct,62)}<b class="num">${d.fillPct}%</b></div></header>
    <div class="xd-core">${d.core.map(c=>`<div class="xd-m ${c[2]}" ${xd(c[3])}><b class="num">${typeof c[1]==='number'?fn(c[1]):esc(c[1])}</b><span>${esc(c[0])}</span></div>`).join('')}</div>
    <div class="xd-foot"><span>${I.org||''}<b class="num">${d.pos}</b> منصب</span><span ${xd({v:'cs',st:'open'})}><b class="num">${d.open.length}</b> طلب مفتوح</span><span ${xd({v:'meetings'})}><b class="num">${d.mt}</b> اجتماع قادم</span>${ORG_DUTIES[d.o.id]?`<span ${xd({od:d.o.id})}><b class="num">${ORG_DUTIES[d.o.id].items.length}</b> مهام</span>`:''}<span ${xd({org:d.o.id})}><b class="num">${(S.records||[]).filter(x=>x.unit===d.o.id).length}</b> سجل</span><span class="pill p-${st[0]==='ok'?'ok':st[0]==='warn'?'warn':'crit'}">${st[1]}</span></div>
   </article>`}).join('')}<div class="empty xd-none" hidden><b>لا توجد إدارة مطابقة</b>جرّب كلمة بحث أخرى.</div></div>
  <div class="grid2 xd-grid">
   <section class="panel"><div class="xd-ph"><h3 class="section-title">مقارنة بين الإدارات <small>${esc(mLbl)} · الإجمالي <span class="num">${fn(tot)}</span></small></h3>
    <div class="xd-seg" role="tablist">${XD_METRICS.map(([k,l])=>`<button role="tab" aria-selected="${k===m}" data-xd-m="${k}">${l}</button>`).join('')}</div></div>
    ${tot?`<div class="ocd-bars">${rows.map(r=>`<div class="ocd-row go" ${xd({org:r.d.o.id})}><span class="ocd-lbl" title="${esc(r.d.o.title)}">${esc(r.d.o.title)}</span><span class="ocd-track">${r.v?`<span class="ocd-seg f" style="width:${r.v*100/mx}%" data-tip="${esc(r.d.o.title+' · '+mLbl+': '+r.v)}"></span>`:''}</span><span class="ocd-val num">${fn(r.v)}</span></div>`).join('')}</div>`
      :`<div class="empty"><b>لا توجد بيانات بعد</b>ستظهر المقارنة فور تسجيل البيانات.</div>`}
   </section>
   <section class="panel"><h3 class="section-title">إشغال المناصب حسب الإدارة <small>مشغولة مقابل شاغرة</small></h3>
    <div class="ocd-legend"><span><i class="f"></i>مشغولة</span><span><i class="v"></i>شاغرة</span></div>
    <div class="ocd-bars">${X.deps.slice().sort((a,b)=>b.pos-a.pos).map(d=>{const mxp=Math.max(...X.deps.map(x=>x.pos));return `<div class="ocd-row go" ${xd({org:d.o.id})}><span class="ocd-lbl" title="${esc(d.o.title)}">${esc(d.o.title)}</span><span class="ocd-track"><span class="ocd-seg f" style="width:${(d.pos-d.vac)*100/mxp}%" data-tip="${esc(d.o.title+' · مشغولة '+(d.pos-d.vac))}"></span>${d.vac?`<span class="ocd-seg v" style="width:${d.vac*100/mxp}%" data-tip="${esc(d.o.title+' · شاغرة '+d.vac)}"></span>`:''}</span><span class="ocd-val num">${d.pos}</span></div>`}).join('')}</div>
   </section>
  </div>
  <section class="panel xd-attn"><h3 class="section-title">يحتاج انتباه الإدارة العامة <small>${attn.length?`<span class="num">${attn.length}</span> بند`:''}</small></h3>
   ${attn.length?`<div class="alerts">${attn.slice(0,8).map(a=>`<div class="alert-row" ${xd(a[2])}><span class="days p-${a[0]}">${a[0]==='crit'?'! عاجل':'! متابعة'}</span><span class="nm">${esc(a[1])}</span></div>`).join('')}</div>`
     :`<div class="empty"><b>✓ لا توجد بنود عاجلة</b>كل الإدارات مستقرة حسب البيانات الحالية.</div>`}
  </section>
  <h3 class="xd-ops">التفاصيل التشغيلية <small>العقود والكشوفات · مهام قسم المتابعة والتقارير</small></h3>`;
}
document.addEventListener('click',e=>{if(S.view!=='dash')return;
  const mb=e.target.closest('[data-xd-m]');if(mb){S.ui.xm=mb.dataset.xdM;const y=window.scrollY;render();window.scrollTo(0,y);return}
  const g=e.target.closest('[data-xd]');if(!g)return;e.stopPropagation();const o=JSON.parse(g.dataset.xd);
  if(o.org){go('org',{om:'dash',of:o.org==='board'?'':o.org});return}
  if(o.od){go('org',{om:'duties',od:o.od});return}
  if(o.v==='contracts'){S.ui.c={q:'',st:o.st||'all',type:'',dept:'',sort:'remain',dir:'asc'};go('contracts');return}
  if(o.v==='needs'){S.ui.n={q:'',batch:'',region:'',fuel:'',link:'',act:'',sec:'',sort:'seq',dir:'asc'};go('needs');return}
  if(o.v==='cs'){S.ui.cs=Object.assign(csUI(),{tab:'tk',q:'',st:o.st||'',type:o.type||'',pri:'',as:''});go('cs');return}
  if(o.v==='nt'){S.ui.cs=Object.assign(csUI(),{tab:'nt',nq:'',nst:o.nst||'',nsg:'',nstg:''});go('cs');return}
  go(o.v)},true);
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&S.view==='dash'&&e.target.closest&&e.target.closest('[data-xd],[data-xd-m]'))e.target.click()});
function xdFilter(){const q=norm(S.ui.xq||'');let n=0;document.querySelectorAll('#xd-cards .xd-card').forEach(c=>{const h=q&&!c.dataset.q.includes(q);c.hidden=h;if(!h)n++});const e=document.querySelector('.xd-none');if(e)e.hidden=!!n}
document.addEventListener('click',e=>{
  const k=e.target.closest('[data-kpi]');if(k){const o=JSON.parse(k.dataset.kpi);if(o.view==='contracts'){S.ui.c={q:'',st:o.f.st||'all',type:'',dept:'',sort:S.ui.c?.sort||'remain',dir:'asc'}}else{S.ui.n={q:'',batch:'',region:'',fuel:o.f.fuel||'',link:o.f.link||'',act:'',sec:'',sort:'seq',dir:'asc'}}go(o.view);return}
  const r=e.target.closest('[data-region]');if(r&&S.view==='dash'){S.ui.n={q:'',batch:'',region:r.dataset.region,fuel:'',link:'',sort:'seq',dir:'asc'};go('needs');return}
  const oc=e.target.closest('[data-open-c]');if(oc){openContract(oc.dataset.openC);return}
  const on=e.target.closest('[data-open-n]');if(on){openNeed(on.dataset.openN);return}
});
