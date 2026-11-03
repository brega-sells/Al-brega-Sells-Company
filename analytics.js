/* Data analysis screen.
   Classic script: shares the global scope with the other app files; load order is set in index.html. */
"use strict";
/* ============ تحليل البيانات ============ */
function anShort(v){if(v==null||isNaN(v))return'—';const a=Math.abs(v);if(a>=1e6)return +(v/1e6).toFixed(a>=1e7?0:1)+' مليون';if(a>=1e4)return Math.round(v/1e3)+' ألف';return fn(Math.round(v*10)/10)}
function anBars(rows,opt={}){
  if(!rows.length)return '<div class="empty" style="padding:20px">لا توجد بيانات ضمن التصفية الحالية</div>';
  const max=Math.max(1,...rows.map(r=>r.v)),f=opt.fmt||anShort,u=opt.unit?' '+opt.unit:'';
  return `<div class="an-bars">${rows.map(r=>`<div class="an-row${r.go?' go':''}" ${r.go?`data-an-go='${esc(JSON.stringify(r.go))}' role="button" tabindex="0"`:''} data-tip="${esc((r.full||r.l)+': '+fn(Math.round(r.v*10)/10)+u+(r.note?' · '+r.note:''))}">
   <span class="an-lbl" title="${esc(r.full||r.l)}">${esc(r.l)}</span><span class="an-track"><span class="an-fill${opt.tone?' '+opt.tone:''}" style="width:${r.v?Math.max(1.5,r.v*100/max):0}%"></span></span><span class="an-val num">${f(r.v)}</span></div>`).join('')}</div>`}
function anCols(rows,opt={}){ // rows:{l,v,v2?,full}
  if(!rows.some(r=>r.v||r.v2))return '<div class="empty" style="padding:20px">لا توجد بيانات ضمن التصفية الحالية</div>';
  const max=Math.max(1,...rows.map(r=>Math.max(r.v||0,r.v2||0)));
  return `<div class="an-cols${opt.pair?' pair':''}">${rows.map(r=>`<div class="an-col" data-tip="${esc(r.full+': '+(opt.pair?`${opt.pair[0]} ${r.v} · ${opt.pair[1]} ${r.v2}`:fn(r.v)+(opt.unit?' '+opt.unit:'')))}"><span class="num">${r.v||''}</span><div class="an-colbars"><i style="height:${r.v?Math.max(3,r.v*100/max):0}%"></i>${opt.pair?`<i class="b" style="height:${r.v2?Math.max(3,r.v2*100/max):0}%"></i>`:''}</div><small>${esc(r.l)}</small></div>`).join('')}</div>`}
function anStack(parts){const tot=parts.reduce((s,p)=>s+p.v,0)||1;
  return `<div class="an-stack">${parts.filter(p=>p.v).map(p=>`<span class="${p.c}" style="width:${p.v*100/tot}%" data-tip="${esc(p.l+': '+p.v+' ('+Math.round(p.v*100/tot)+'%)')}" ${p.go?`data-an-go='${esc(JSON.stringify(p.go))}' role="button" tabindex="0"`:''}></span>`).join('')}</div>
   <div class="an-legend">${parts.map(p=>`<span><i class="${p.c}"></i>${esc(p.l)} <b class="num">${p.v}</b> <small class="muted">${Math.round(p.v*100/tot)}%</small></span>`).join('')}</div>`}
function anGroup(arr,kf,vf=()=>1){const m=new Map();arr.forEach(x=>{const k=kf(x);const kk=(k==null||String(k).trim()==='')?'غير محدد':String(k).trim();m.set(kk,(m.get(kk)||0)+(Number(vf(x))||0))});return [...m.entries()].map(([l,v])=>({l,v})).sort((a,b)=>b.v-a.v)}
function anKpi(l,v,s='',cls=''){return `<div class="kpi ${cls}" style="cursor:default"><span class="l">${esc(l)}</span><span class="v">${v}</span>${s?`<span class="s">${s}</span>`:''}</div>`}
const anDiesel=n=>(n.dieselGen||0)+(n.dieselOp||0);
const AN_MN=['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
function anUI(){return S.ui.an||(S.ui.an={tab:'contracts',type:'',from:'',to:'',batch:'',region:'',ds:'contracts',dim:'type',me:'count'})}
function anContracts(){const u=anUI();return S.contracts.map(c=>({c,d:D.get(c.id)})).filter(({c})=>{
  const dt=c.signDate||c.startDate||'';if(u.type&&c.type!==u.type)return false;if(u.from&&(!dt||dt<u.from))return false;if(u.to&&(!dt||dt>u.to))return false;return true})}
function anNeeds(){const u=anUI();return S.needs.filter(n=>(!u.batch||n.batch===u.batch)&&(!u.region||cleanRegion(n.region)===u.region))}
const AN_TABS=[['contracts','العقود'],['needs','الاحتياجات والوقود'],['opp','الفرص البيعية'],['cs','خدمة الزبائن'],['custom','تحليل مخصّص']];
function viewAna(){const u=anUI();
  const hasC=['contracts','custom'].includes(u.tab),hasN=['needs','opp','custom'].includes(u.tab);
  return `<div class="page-head"><div><h2>تحليل البيانات</h2><p>قراءة تحليلية لعقود البريقة وكشوفات الاحتياجات وطلبات الزبائن، تتحدّث تلقائيًا مع كل تعديل في المنظومة.</p></div>
   <div class="toolbar"><button class="btn" data-act="an-export">${I.down}تصدير التحليل Excel</button></div></div>
  <div class="tabs" role="tablist">${AN_TABS.map(([k,l])=>`<button role="tab" data-an-tab="${k}" aria-selected="${u.tab===k}">${l}</button>`).join('')}</div>
  ${hasC||hasN?`<div class="toolbar an-filters">
   ${hasC?`<label class="an-f">نوع العقد<select id="an-type"><option value="">كل الأنواع</option>${uniq(S.contracts.map(c=>c.type)).map(t=>`<option ${u.type===t?'selected':''}>${esc(t)}</option>`).join('')}</select></label>
   <label class="an-f">التوقيع من<input type="date" id="an-from" value="${esc(u.from)}"></label><label class="an-f">إلى<input type="date" id="an-to" value="${esc(u.to)}"></label>`:''}
   ${hasN?`<label class="an-f">الدفعة<select id="an-batch"><option value="">كل الدفعات</option>${batchesSorted().map(b=>`<option value="${b.id}" ${u.batch===b.id?'selected':''}>${esc(b.name)}</option>`).join('')}</select></label>
   <label class="an-f">المنطقة<select id="an-region"><option value="">كل المناطق</option>${uniq(S.needs.map(n=>cleanRegion(n.region))).map(r=>`<option ${u.region===r?'selected':''}>${esc(r)}</option>`).join('')}</select></label>`:''}
   ${u.type||u.from||u.to||u.batch||u.region?'<button class="btn sm ghost" data-act="an-clear">مسح التصفية</button>':''}
  </div>`:'<div style="height:14px"></div>'}
  <div id="an-body"></div>`}
afterRender.ana=()=>{const u=anUI();const b=document.getElementById('an-body');if(!b)return;
  b.innerHTML=({contracts:anTabContracts,needs:anTabNeeds,opp:anTabOpp,cs:anTabCs,custom:anTabCustom}[u.tab]||anTabContracts)();
  [['an-type','type'],['an-from','from'],['an-to','to'],['an-batch','batch'],['an-region','region']].forEach(([id,k])=>{const e=document.getElementById(id);if(e)e.addEventListener('change',()=>{u[k]=e.value;render()})});
  if(u.tab==='custom')anCustomBind();if(u.tab==='opp')anOppTable()};
function anTabContracts(){
  const cs=anContracts();if(!cs.length)return '<div class="empty"><b>لا توجد عقود</b>ضمن التصفية الحالية.</div>';
  const st=s=>cs.filter(x=>x.d.status===s).length;const active=st('ساري')+st('قريب الانتهاء');
  const lyd=cs.filter(x=>!x.c.currency||x.c.currency==='دينار ليبي');const val=sumBy(lyd,x=>x.c.value);
  const durs=cs.map(x=>x.d.dur).filter(v=>v!=null&&v>0);const avgDur=durs.length?durs.reduce((a,b)=>a+b,0)/durs.length:0;
  const types=anGroup(cs,x=>x.c.type).map(r=>({...r,go:{v:'contracts',f:{type:r.l==='غير محدد'?'':r.l}}}));
  const valT=anGroup(lyd,x=>x.c.type,x=>x.c.value);
  const dept=anGroup(cs,x=>x.c.dept).map(r=>({...r,go:{v:'contracts',f:{dept:r.l==='غير محدد'?'':r.l}}}));
  const loc=anGroup(cs,x=>cleanRegion(x.c.location)).slice(0,10).map(r=>({...r,go:r.l==='غير محدد'?null:{v:'contracts',f:{loc:r.l}}}));
  const topCo=anGroup(lyd,x=>x.c.company,x=>x.c.value).slice(0,10);
  // العقود الموقعة شهريًا: آخر 12 شهرًا منتهية بآخر شهر فيه توقيع أو الشهر الحالي
  const ds=cs.map(x=>x.c.signDate||x.c.startDate).filter(Boolean).sort();const last=pd(ds[ds.length-1])||today;const end=last>today?last:today;
  const months=[];for(let i=11;i>=0;i--){const d=new Date(end.getFullYear(),end.getMonth()-i,1);months.push({y:d.getFullYear(),m:d.getMonth()})}
  const mrows=months.map(o=>{const k=o.y+'-'+String(o.m+1).padStart(2,'0');return {l:AN_MN[o.m].slice(0,3),full:AN_MN[o.m]+' '+o.y,v:cs.filter(x=>(x.c.signDate||x.c.startDate||'').startsWith(k)).length}});
  // محفظة الانتهاء حسب الربع القادم
  const qs=[];for(let i=0;i<6;i++){const d=new Date(today.getFullYear(),Math.floor(today.getMonth()/3)*3+i*3,1);qs.push({y:d.getFullYear(),q:Math.floor(d.getMonth()/3)+1})}
  const qrows=qs.map(o=>({l:'ر'+o.q+' '+o.y,full:'الربع '+o.q+' من '+o.y,v:cs.filter(x=>{const e=pd(x.d.effEnd);return e&&e>=today&&e.getFullYear()===o.y&&Math.floor(e.getMonth()/3)+1===o.q}).length}));
  const durB=[['أقل من 6 أشهر',0,6],['6–12 شهرًا',6,12.5],['1–2 سنة',12.5,24.5],['أكثر من سنتين',24.5,1e9]].map(([l,a,b])=>({l,v:durs.filter(v=>v>=a&&v<b).length}));
  return `<div class="kpis an-kpis">${anKpi('عدد العقود',fn(cs.length),`${active} سارية الآن`)}${anKpi('نسبة العقود السارية',Math.round(active*100/cs.length)+'%',`${st('منتهٍ')} منتهية`,active/cs.length>=.5?'ok':'warn')}
   ${anKpi('القيمة الإجمالية',anShort(val),'دينار ليبي'+(lyd.length<cs.length?` · ${cs.length-lyd.length} بعملة أخرى`:''))}${anKpi('متوسط قيمة العقد',anShort(lyd.length?val/lyd.length:0),'دينار ليبي')}
   ${anKpi('متوسط مدة العقد',avgDur?avgDur.toFixed(1):'—','شهرًا')}${anKpi('تنتهي خلال '+S.settings.t1+' يومًا',fn(cs.filter(x=>x.d.alert).length),'تحتاج متابعة للتجديد',cs.some(x=>x.d.alert)?'warn':'')}</div>
  <div class="an-grid">
   <section class="panel an-wide"><h3 class="section-title">حالة العقود <small>اضغط على جزء لفتح العقود</small></h3>${anStack([
     {l:'ساري',v:st('ساري'),c:'s-ok',go:{v:'contracts',f:{st:'ساري'}}},{l:'قريب الانتهاء',v:st('قريب الانتهاء'),c:'s-warn',go:{v:'contracts',f:{st:'قريب الانتهاء'}}},
     {l:'منتهٍ',v:st('منتهٍ')+st('منتهٍ قبل موعده'),c:'s-crit',go:{v:'contracts',f:{st:'منتهٍ'}}},{l:'لم يبدأ بعد',v:st('لم يبدأ بعد'),c:'s-info',go:{v:'contracts',f:{st:'لم يبدأ بعد'}}},
     {l:'معلق / غير محدد',v:st('معلق')+st('غير محدد'),c:'s-neutral'}])}</section>
   <section class="panel"><h3 class="section-title">عدد العقود حسب النوع <small>اضغط للتصفية</small></h3>${anBars(types,{fmt:fn,unit:'عقد'})}</section>
   <section class="panel"><h3 class="section-title">قيمة العقود حسب النوع <small>دينار ليبي</small></h3>${anBars(valT,{unit:'د.ل',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">العقود الموقّعة شهريًا <small>آخر 12 شهرًا</small></h3>${anCols(mrows,{unit:'عقد'})}</section>
   <section class="panel"><h3 class="section-title">العقود التي تنتهي في الأرباع القادمة</h3>${anCols(qrows,{unit:'عقد'})}</section>
   <section class="panel"><h3 class="section-title">حسب الإدارة المختصة</h3>${anBars(dept,{fmt:fn,unit:'عقد'})}</section>
   <section class="panel"><h3 class="section-title">حسب الموقع <small>أعلى 10</small></h3>${anBars(loc,{fmt:fn,unit:'عقد'})}</section>
   <section class="panel"><h3 class="section-title">أكبر 10 زبائن حسب قيمة العقود <small>دينار ليبي</small></h3>${anBars(topCo,{unit:'د.ل',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">توزيع مدد العقود</h3>${anBars(durB,{fmt:fn,unit:'عقد'})}</section>
  </div>`}
function anTabNeeds(){
  const N=anNeeds();if(!N.length)return '<div class="empty"><b>لا توجد منشآت</b>ضمن التصفية الحالية.</div>';
  const dsl=sumBy(N,anDiesel),linked=N.filter(n=>MATCH.byNeed.has(n.id)).length;
  const fuel=[{l:'ديزل مولدات',v:sumBy(N,n=>n.dieselGen),go:{v:'needs',f:{fuel:'diesel'}}},{l:'ديزل تشغيلية',v:sumBy(N,n=>n.dieselOp),go:{v:'needs',f:{fuel:'diesel'}}},{l:'زيت ثقيل',v:sumBy(N,n=>n.heavyOil),go:{v:'needs',f:{fuel:'ho'}}},{l:'كيروسين',v:sumBy(N,n=>n.kerosene),go:{v:'needs',f:{fuel:'ke'}}},{l:'مشاريع (نوع الوقود غير محدد)',v:sumBy(N,n=>n.projQty),go:{v:'needs',f:{fuel:'proj'}}}].filter(r=>r.v);
  const byB=batchesSorted().map(b=>{const r=N.filter(n=>n.batch===b.id);return {l:b.name,v:sumBy(r,anDiesel),note:r.length+' منشأة',go:{v:'needs',f:{batch:b.id}}}}).filter(r=>r.v);
  const byR=anGroup(N,n=>cleanRegion(n.region),anDiesel).filter(r=>r.v).slice(0,12).map(r=>({...r,go:r.l==='غير محدد'?null:{v:'needs',f:{region:r.l}}}));
  const byA=anGroup(N,n=>n.activity,anDiesel).filter(r=>r.v).slice(0,10).map(r=>({...r,go:r.l==='غير محدد'?null:{v:'needs',f:{act:r.l}}}));
  const cntR=anGroup(N,n=>cleanRegion(n.region)).slice(0,12);
  const top=[...N].sort((a,b)=>anDiesel(b)-anDiesel(a)).slice(0,10).filter(n=>anDiesel(n)).map(n=>({l:n.company,v:anDiesel(n),go:{open:n.id},note:cleanRegion(n.region)}));
  const sz=[['حتى 5 آلاف',0,5e3],['5–20 ألف',5e3,2e4],['20–50 ألف',2e4,5e4],['50–100 ألف',5e4,1e5],['أكثر من 100 ألف',1e5,1e12]].map(([l,a,b])=>({l,v:N.filter(n=>{const d=anDiesel(n);return d>0&&d>=a&&d<b}).length}));
  return `<div class="kpis an-kpis">${anKpi('عدد المنشآت',fn(N.length),`${uniq(N.map(n=>cleanRegion(n.region))).length} منطقة`)}${anKpi('إجمالي الديزل الشهري',anShort(dsl),'لتر/شهر','fl')}
   ${anKpi('متوسط الديزل للمنشأة',anShort(dsl/(N.filter(anDiesel).length||1)),'لتر/شهر للمنشآت المستهلكة')}${anKpi('الغاز',anShort(sumBy(N,n=>n.gas)),'طن')}
   ${anKpi('الزيت الثقيل',anShort(sumBy(N,n=>n.heavyOil)),'لتر')}${anKpi('منشآت مرتبطة بعقد',Math.round(linked*100/N.length)+'%',`${linked} من ${N.length}`,linked*2>=N.length?'ok':'warn')}</div>
  <div class="an-grid">
   <section class="panel"><h3 class="section-title">الكميات المعتمدة حسب نوع الوقود <small>لتر</small></h3>${anBars(fuel,{unit:'لتر'})}</section>
   <section class="panel"><h3 class="section-title">الديزل حسب الدفعة <small>لتر/شهر · اضغط لفتح الدفعة</small></h3>${anBars(byB,{unit:'لتر',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">الديزل حسب المنطقة <small>أعلى 12</small></h3>${anBars(byR,{unit:'لتر',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">عدد المنشآت حسب المنطقة <small>أعلى 12</small></h3>${anBars(cntR,{fmt:fn,unit:'منشأة'})}</section>
   <section class="panel"><h3 class="section-title">الديزل حسب نوع النشاط <small>أعلى 10</small></h3>${anBars(byA,{unit:'لتر',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">المنشآت حسب حجم الاستهلاك الشهري للديزل</h3>${anBars(sz,{fmt:fn,unit:'منشأة'})}</section>
   <section class="panel an-wide"><h3 class="section-title">أكبر 10 منشآت استهلاكًا للديزل <small>اضغط لفتح بطاقة المنشأة</small></h3>${anBars(top,{unit:'لتر/شهر',tone:'fl'})}</section>
  </div>`}
function anOppRows(){return anNeeds().filter(n=>!MATCH.byNeed.has(n.id)&&(anDiesel(n)||n.gas||n.heavyOil||n.kerosene||n.projQty)).sort((a,b)=>anDiesel(b)-anDiesel(a)||(b.gas||0)-(a.gas||0))}
function anTabOpp(){
  const N=anNeeds(),O=anOppRows(),tot=sumBy(N,anDiesel),od=sumBy(O,anDiesel);
  const byR=anGroup(O,n=>cleanRegion(n.region),anDiesel).filter(r=>r.v).slice(0,10).map(r=>({...r,go:r.l==='غير محدد'?null:{v:'needs',f:{region:r.l,link:'no'}}}));
  const byA=anGroup(O,n=>n.activity,anDiesel).filter(r=>r.v).slice(0,10);
  return `<div class="banner info" style="margin-bottom:12px">منشآت معتمدة في كشوفات وزارة الصناعة ولا يوجد لها عقد مسجّل مع شركة البريقة: فرص تعاقد مباشرة، مرتّبة حسب حجم احتياجها الشهري.</div>
  <div class="kpis an-kpis">${anKpi('منشآت بلا عقد',fn(O.length),`من ${N.length} منشأة في الكشوفات`,'warn')}${anKpi('ديزل غير متعاقد عليه',anShort(od),'لتر/شهر','fl')}
   ${anKpi('نسبتها من إجمالي الديزل',tot?Math.round(od*100/tot)+'%':'—','من الاحتياج المعتمد')}${anKpi('غاز غير متعاقد عليه',anShort(sumBy(O,n=>n.gas)),'طن')}</div>
  <div class="an-grid">
   <section class="panel"><h3 class="section-title">الديزل غير المتعاقد عليه حسب المنطقة</h3>${anBars(byR,{unit:'لتر/شهر',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">حسب نوع النشاط</h3>${anBars(byA,{unit:'لتر/شهر',tone:'fl'})}</section>
   <section class="panel an-wide"><h3 class="section-title" style="justify-content:space-between">قائمة الفرص <button class="btn sm" data-act="an-export-opp">${I.down}تصدير القائمة</button></h3><div id="an-opp"></div></section>
  </div>`}
function anOppTable(){const el=document.getElementById('an-opp');if(!el)return;const O=anOppRows();const lim=S.ui.anOppAll?O.length:25;
  el.innerHTML=O.length?`<div class="tablewrap"><table><thead><tr><th class="nosort">#</th><th class="nosort">المنشأة</th><th class="nosort">المنطقة</th><th class="nosort">النشاط</th><th class="nosort">الدفعة</th><th class="nosort">صاحب الترخيص / المفوض</th><th class="nosort">ديزل لتر/شهر</th><th class="nosort">غاز طن</th><th class="nosort">زيت ثقيل</th></tr></thead><tbody>
  ${O.slice(0,lim).map((n,i)=>`<tr data-open-n="${n.id}"><td class="n">${i+1}</td><td class="t-strong">${esc(n.company)}</td><td>${esc(cleanRegion(n.region)||'—')}</td><td>${esc(n.activity||'—')}</td><td><span class="tag">${esc(batchName(n.batch))}</span></td><td>${esc(n.licensee||'—')}</td><td class="n">${fn(anDiesel(n)||null)}</td><td class="n">${fn(n.gas)}</td><td class="n">${fn(n.heavyOil)}</td></tr>`).join('')}</tbody></table></div>
  ${O.length>lim?`<button class="btn sm" style="margin-top:10px" data-act="an-opp-all">عرض كل الفرص (${O.length})</button>`:''}`:'<div class="empty"><b>لا توجد فرص</b>كل المنشآت ضمن التصفية مرتبطة بعقود.</div>'}
function anTabCs(){
  const T=S.tickets;if(!T.length)return `<div class="empty"><b>لا توجد طلبات زبائن بعد</b>سجّل الطلبات والشكاوى من بند «خدمة الزبائن» وستظهر تحليلاتها هنا.<br><br><button class="btn primary" data-v-go="cs">فتح خدمة الزبائن</button></div>`;
  const open=T.filter(t=>t.status!=='مغلق'),closed=T.filter(t=>t.status==='مغلق'),late=open.filter(tkLate);
  const res=closed.map(tkAge).filter(v=>v!=null),avg=res.length?res.reduce((a,b)=>a+b,0)/res.length:null;
  const inTime=closed.filter(t=>!t.dueDate||!t.closedAt||t.closedAt.slice(0,10)<=t.dueDate).length;
  const months=[];for(let i=5;i>=0;i--){const d=new Date(today.getFullYear(),today.getMonth()-i,1);const k=iso(d).slice(0,7);months.push({l:AN_MN[d.getMonth()].slice(0,3),full:AN_MN[d.getMonth()]+' '+d.getFullYear(),v:T.filter(t=>(t.date||'').startsWith(k)).length,v2:T.filter(t=>(t.closedAt||'').startsWith(k)).length})}
  const go=f=>({v:'cs',f});
  const avgBy=(kf)=>{const g=new Map();closed.forEach(t=>{const a=tkAge(t);if(a==null)return;const k=kf(t)||'غير محدد';const o=g.get(k)||{s:0,n:0};o.s+=a;o.n++;g.set(k,o)});return [...g.entries()].map(([l,o])=>({l,v:o.s/o.n,note:o.n+' طلب'})).sort((a,b)=>b.v-a.v)};
  return `<div class="kpis an-kpis">${anKpi('إجمالي الطلبات',fn(T.length),`${open.length} مفتوحة`)}${anKpi('متأخرة عن موعدها',fn(late.length),'طلبات مفتوحة تجاوزت موعد الإنجاز',late.length?'crit':'ok')}
   ${anKpi('متوسط زمن المعالجة',avg==null?'—':avg.toFixed(1),'يومًا للطلبات المغلقة')}${anKpi('الإنجاز في الموعد',closed.length?Math.round(inTime*100/closed.length)+'%':'—',`${inTime} من ${closed.length} مغلقة`,closed.length&&inTime/closed.length>=.8?'ok':'warn')}
   ${anKpi('الشكاوى',fn(T.filter(t=>t.type==='شكوى').length),`${T.filter(t=>t.type==='شكوى'&&t.status!=='مغلق').length} مفتوحة`)}</div>
  <div class="an-grid">
   <section class="panel an-wide"><h3 class="section-title">حالة الطلبات <small>اضغط لفتح القائمة</small></h3>${anStack(TK_ST.map(s=>({l:s,v:T.filter(t=>t.status===s).length,c:TK_STC[s].replace('p-','s-'),go:go({st:s})})))}</section>
   <section class="panel"><h3 class="section-title">الطلبات الواردة والمغلقة شهريًا</h3><div class="an-legend" style="margin:-4px 0 8px"><span><i class="s-info"></i>واردة</span><span><i class="s-ok"></i>مغلقة</span></div>${anCols(months,{pair:['واردة','مغلقة']})}</section>
   <section class="panel"><h3 class="section-title">حسب نوع الطلب</h3>${anBars(anGroup(T,t=>t.type).map(r=>({...r,go:go({type:r.l})})),{fmt:fn,unit:'طلب'})}</section>
   <section class="panel"><h3 class="section-title">حسب قناة الورود</h3>${anBars(anGroup(T,t=>t.channel),{fmt:fn,unit:'طلب'})}</section>
   <section class="panel"><h3 class="section-title">حسب الأولوية</h3>${anBars(TK_PRI.map(p=>({l:p,v:T.filter(t=>t.priority===p).length,go:go({pri:p})})),{fmt:fn,unit:'طلب'})}</section>
   <section class="panel"><h3 class="section-title">متوسط أيام المعالجة حسب النوع</h3>${anBars(avgBy(t=>t.type),{unit:'يوم',tone:'fl'})}</section>
   <section class="panel"><h3 class="section-title">الطلبات المفتوحة حسب الجهة المسؤولة</h3>${anBars(anGroup(open,t=>t.assignee),{fmt:fn,unit:'طلب'})}</section>
   <section class="panel an-wide"><h3 class="section-title">أكثر الزبائن تواصلًا <small>أعلى 10</small></h3>${anBars(anGroup(T,t=>t.customer).slice(0,10),{fmt:fn,unit:'طلب'})}</section>
  </div>`}
/* تحليل مخصّص: اختيار مصدر البيانات وطريقة التجميع والمقياس */
const AN_DS={
 contracts:{l:'عقود البريقة',rows:()=>anContracts(),
  dims:{type:['نوع العقد',x=>x.c.type],status:['الحالة',x=>x.d.status],dept:['الإدارة المختصة',x=>x.c.dept],loc:['الموقع',x=>cleanRegion(x.c.location)],company:['الشركة المتعاقدة',x=>x.c.company],officer:['المسؤول',x=>x.c.officer],currency:['العملة',x=>x.c.currency],year:['سنة التوقيع',x=>(x.c.signDate||'').slice(0,4)],month:['شهر التوقيع',x=>(x.c.signDate||'').slice(0,7)],alert:['تنبيه الانتهاء',x=>x.d.alert||'لا يوجد']},
  meas:{count:['عدد العقود',()=>1],value:['مجموع القيمة',x=>x.c.value],avgValue:['متوسط القيمة',x=>x.c.value,'avg'],dur:['متوسط المدة (شهر)',x=>x.d.dur,'avg'],exts:['عدد التمديدات',x=>x.d.exts]}},
 needs:{l:'كشوفات الاحتياجات',rows:()=>anNeeds(),
  dims:{batch:['الدفعة',n=>batchName(n.batch)],region:['المنطقة',n=>cleanRegion(n.region)],activity:['نوع النشاط',n=>n.activity],section:['القسم في الكشف',n=>n.section],link:['الارتباط بعقد',n=>MATCH.byNeed.has(n.id)?'مرتبطة بعقد':'بلا عقد']},
  meas:{count:['عدد المنشآت',()=>1],diesel:['ديزل إجمالي (لتر/شهر)',anDiesel],dieselGen:['ديزل مولدات',n=>n.dieselGen],dieselOp:['ديزل تشغيلية',n=>n.dieselOp],gas:['غاز (طن)',n=>n.gas],heavyOil:['زيت ثقيل',n=>n.heavyOil],kerosene:['كيروسين',n=>n.kerosene],avgDiesel:['متوسط الديزل للمنشأة',anDiesel,'avg']}},
 tickets:{l:'طلبات الزبائن',rows:()=>S.tickets,
  dims:{status:['الحالة',t=>t.status],type:['نوع الطلب',t=>t.type],channel:['قناة الورود',t=>t.channel],priority:['الأولوية',t=>t.priority],assignee:['الجهة المسؤولة',t=>t.assignee],customer:['الزبون',t=>t.customer],month:['شهر الورود',t=>(t.date||'').slice(0,7)],late:['الالتزام بالموعد',t=>tkLate(t)?'متأخر':'ضمن الموعد']},
  meas:{count:['عدد الطلبات',()=>1],age:['متوسط أيام المعالجة',t=>tkAge(t),'avg']}}};
function anCustomData(){const u=anUI();const ds=AN_DS[u.ds]||AN_DS.contracts;const dim=ds.dims[u.dim]||Object.values(ds.dims)[0];const me=ds.meas[u.me]||ds.meas.count;
  const g=new Map();ds.rows().forEach(x=>{let k=dim[1](x);k=(k==null||String(k).trim()==='')?'غير محدد':String(k).trim();const v=me[1](x);const o=g.get(k)||{s:0,n:0,c:0};o.c++;if(v!=null&&v!==''&&!isNaN(v)){o.s+=Number(v);o.n++}g.set(k,o)});
  const rows=[...g.entries()].map(([l,o])=>({l,v:me[2]==='avg'?(o.n?o.s/o.n:0):o.s,c:o.c}));
  if(/month|year/.test(u.dim))rows.sort((a,b)=>a.l.localeCompare(b.l));else rows.sort((a,b)=>b.v-a.v);
  return {ds,dim,me,rows}}
function anTabCustom(){const u=anUI();const ds=AN_DS[u.ds]||AN_DS.contracts;if(!ds.dims[u.dim])u.dim=Object.keys(ds.dims)[0];if(!ds.meas[u.me])u.me='count';
  return `<section class="panel"><h3 class="section-title">اختر ما تريد تحليله</h3>
   <div class="toolbar"><label class="an-f">البيانات<select id="an-ds">${Object.entries(AN_DS).map(([k,d])=>`<option value="${k}" ${u.ds===k?'selected':''}>${d.l}</option>`).join('')}</select></label>
   <label class="an-f">التجميع حسب<select id="an-dim">${Object.entries(ds.dims).map(([k,d])=>`<option value="${k}" ${u.dim===k?'selected':''}>${d[0]}</option>`).join('')}</select></label>
   <label class="an-f">المقياس<select id="an-me">${Object.entries(ds.meas).map(([k,d])=>`<option value="${k}" ${u.me===k?'selected':''}>${d[0]}</option>`).join('')}</select></label>
   <button class="btn sm" data-act="an-export-custom" style="align-self:flex-end">${I.down}تصدير النتيجة</button></div></section>
  <div id="an-custom" style="margin-top:14px"></div>`}
function anCustomRender(){const el=document.getElementById('an-custom');if(!el)return;const {ds,dim,me,rows}=anCustomData();const tot=rows.reduce((s,r)=>s+r.v,0);const isAvg=me[2]==='avg';
  el.innerHTML=`<div class="an-grid"><section class="panel"><h3 class="section-title">${esc(me[0])} حسب ${esc(dim[0])} <small>${esc(ds.l)}${rows.length>25?' · أعلى 25':''}</small></h3>${anBars(rows.slice(0,25),{fmt:isAvg?(v=>fn(Math.round(v*10)/10)):anShort})}</section>
   <section class="panel"><h3 class="section-title">الجدول <small>${rows.length} مجموعة</small></h3><div class="tablewrap an-tw"><table><thead><tr><th class="nosort">${esc(dim[0])}</th><th class="nosort">عدد السجلات</th><th class="nosort">${esc(me[0])}</th>${isAvg?'':'<th class="nosort">النسبة</th>'}</tr></thead><tbody>
   ${rows.map(r=>`<tr><td class="t-strong">${esc(r.l)}</td><td class="n">${fn(r.c)}</td><td class="n">${fn(Math.round(r.v*10)/10)}</td>${isAvg?'':`<td class="n">${tot?(r.v*100/tot).toFixed(1)+'%':'—'}</td>`}</tr>`).join('')}</tbody>
   ${isAvg?'':`<tfoot><tr><td>الإجمالي</td><td class="n">${fn(rows.reduce((s,r)=>s+r.c,0))}</td><td class="n">${fn(Math.round(tot*10)/10)}</td><td class="n">100%</td></tr></tfoot>`}</table></div></section></div>`}
function anCustomBind(){const u=anUI();anCustomRender();
  document.getElementById('an-ds').addEventListener('change',e=>{u.ds=e.target.value;u.dim='';u.me='count';render()});
  document.getElementById('an-dim').addEventListener('change',e=>{u.dim=e.target.value;anCustomRender()});
  document.getElementById('an-me').addEventListener('change',e=>{u.me=e.target.value;anCustomRender()})}
function anExport(){recompute();const cs=anContracts(),N=anNeeds();
  const g=(arr,kf,vf,l1,l2)=>anGroup(arr,kf,vf).map(r=>({[l1]:r.l,[l2]:Math.round(r.v*10)/10}));
  saveXlsx([['العقود حسب النوع',anGroup(cs,x=>x.c.type).map(r=>({'نوع العقد':r.l,'عدد العقود':r.v,'القيمة (د.ل)':sumBy(cs.filter(x=>(x.c.type||'غير محدد')===r.l&&(!x.c.currency||x.c.currency==='دينار ليبي')),x=>x.c.value)}))],
   ['العقود حسب الحالة',g(cs,x=>x.d.status,()=>1,'الحالة','عدد العقود')],['العقود حسب الإدارة',g(cs,x=>x.c.dept,()=>1,'الإدارة','عدد العقود')],
   ['الديزل حسب المنطقة',anGroup(N,n=>cleanRegion(n.region),anDiesel).map(r=>({'المنطقة':r.l,'ديزل لتر/شهر':r.v,'عدد المنشآت':N.filter(n=>(cleanRegion(n.region)||'غير محدد')===r.l).length}))],
   ['الديزل حسب النشاط',g(N,n=>n.activity,anDiesel,'النشاط','ديزل لتر/شهر')],['الفرص البيعية',anOppRows().map(anOppRow)],
   ...(S.tickets.length?[['الطلبات حسب النوع',g(S.tickets,t=>t.type,()=>1,'نوع الطلب','العدد')],['الطلبات حسب الحالة',g(S.tickets,t=>t.status,()=>1,'الحالة','العدد')]]:[])],'تحليل-البيانات-'+TODAY_ISO+'.xlsx')}
function anOppRow(n,i){return {'#':i+1,'المنشأة':n.company,'المنطقة':cleanRegion(n.region)||'','النشاط':n.activity||'','الدفعة':batchName(n.batch),'صاحب الترخيص / المفوض':n.licensee||'','ديزل لتر/شهر':anDiesel(n)||'','غاز طن':n.gas??'','زيت ثقيل':n.heavyOil??'','كيروسين':n.kerosene??''}}
function anGo(o){
  if(o.open){openNeed(o.open);return}
  if(o.v==='contracts'){S.ui.c={q:'',st:o.f.st||'all',type:o.f.type||'',dept:o.f.dept||'',loc:o.f.loc||'',sort:'remain',dir:'asc'};go('contracts');return}
  if(o.v==='needs'){S.ui.n={q:'',batch:o.f.batch||'',region:o.f.region||'',fuel:o.f.fuel||'',link:o.f.link||'',act:o.f.act||'',sec:'',sort:o.f.batch?'seq':'dg',dir:o.f.batch?'asc':'desc'};go('needs');return}
  if(o.v==='cs'){S.ui.cs=Object.assign(csUI(),{tab:'tk',q:'',st:'',type:'',pri:'',as:''},o.f);go('cs')}}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-an-tab]');if(t){anUI().tab=t.dataset.anTab;render();return}
  const g=e.target.closest('[data-an-go]');if(g){anGo(JSON.parse(g.dataset.anGo));return}
  const v=e.target.closest('[data-v-go]');if(v){go(v.dataset.vGo);return}
  const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act;
  if(act==='an-clear'){Object.assign(anUI(),{type:'',from:'',to:'',batch:'',region:''});render()}
  if(act==='an-export')anExport();
  if(act==='an-export-opp')saveXlsx([['الفرص البيعية',anOppRows().map(anOppRow)]],'الفرص-البيعية-'+TODAY_ISO+'.xlsx');
  if(act==='an-export-custom'){const {dim,me,rows}=anCustomData();saveXlsx([['تحليل مخصص',rows.map(r=>({[dim[0]]:r.l,'عدد السجلات':r.c,[me[0]]:Math.round(r.v*10)/10}))]],'تحليل-مخصص-'+TODAY_ISO+'.xlsx')}
  if(act==='an-opp-all'){S.ui.anOppAll=true;anOppTable()}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.closest&&e.target.closest('[data-an-go]'))e.target.click()});
