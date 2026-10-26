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

/* ============ خدمة الزبائن ============ */
const TK_ST=['جديد','قيد المعالجة','بانتظار الزبون','مغلق'];
const TK_STC={'جديد':'p-info','قيد المعالجة':'p-warn','بانتظار الزبون':'p-neutral','مغلق':'p-ok'};
const TK_PRI=['عاجلة','مهمة','عادية'];const TK_SLA={'عاجلة':2,'مهمة':5,'عادية':10};
const TK_TYPES=['استفسار','طلب تزويد بالوقود','طلب تعاقد جديد','طلب تجديد أو تمديد عقد','شكوى','تأخر في التوريد','ملاحظة على الجودة أو الكمية','مطالبة مالية أو فواتير','أخرى'];
const TK_CH=['هاتف','زيارة للمقر','بريد إلكتروني','رسالة رسمية','واتساب','أخرى'];
const CU_KINDS=['شركة','مصنع','جهة عامة','فرد'];
function csUI(){return S.ui.cs||(S.ui.cs={tab:'tk',q:'',st:'',type:'',pri:'',as:'',cq:'',cf:''})}
function tkAge(t){const a=t.date;if(!a)return null;const b=t.status==='مغلق'?(t.closedAt||'').slice(0,10)||TODAY_ISO:TODAY_ISO;return Math.max(0,days(a,b))}
function tkLate(t){return t.status!=='مغلق'&&!!t.dueDate&&t.dueDate<TODAY_ISO}
function tkPill(s){return `<span class="pill ${TK_STC[s]||'p-neutral'}">${esc(s||'—')}</span>`}
function tkPri(p){return p==='عاجلة'?'<span class="pill p-crit">عاجلة</span>':p==='مهمة'?'<span class="pill p-warn">مهمة</span>':`<span class="muted">${esc(p||'عادية')}</span>`}
function tkNext(){const y=TODAY_ISO.slice(0,4);const n=Math.max(0,...S.tickets.filter(t=>(t.no||'').startsWith(y+'/')).map(t=>parseInt((t.no||'').split('/').pop())||0))+1;return y+'/'+String(n).padStart(3,'0')}
// يفتح البطاقة بعد وصول السجل المحفوظ من قاعدة البيانات
function whenReady(test,f,tries=40){if(test())f();else if(tries>0)setTimeout(()=>whenReady(test,f,tries-1),100)}
function csDenied(){return window.__denied&&window.__denied.tickets}
function csRulesBanner(){if(!csDenied())return '';
  return `<div class="banner" style="margin-bottom:12px"><b>بند خدمة الزبائن يحتاج تفعيلًا في Firebase.</b> قاعدة البيانات لا تسمح بعد بحفظ الطلبات. على مدير المنظومة فتح Firebase ← Firestore ← Rules واستبدال القواعد بمحتوى الملف <code>firestore.rules</code> المحدَّث (يضيف <code>tickets</code> إلى قائمة المجموعات) ثم الضغط على Publish.</div>`}
function csFiltered(){const u=csUI();const q=norm(u.q);let r=S.tickets.slice();
  if(u.st==='late')r=r.filter(tkLate);else if(u.st==='open')r=r.filter(t=>t.status!=='مغلق');else if(u.st)r=r.filter(t=>t.status===u.st);
  if(u.type)r=r.filter(t=>t.type===u.type);if(u.pri)r=r.filter(t=>t.priority===u.pri);if(u.as)r=r.filter(t=>(t.assignee||'')===u.as);
  if(q)r=r.filter(t=>norm([t.no,t.customer,t.phone,t.subject,t.details,t.contractNo,t.assignee,t.resolution].join(' ')).includes(q));
  const pr={'عاجلة':0,'مهمة':1,'عادية':2};
  return r.sort((a,b)=>(a.status==='مغلق')-(b.status==='مغلق')||(tkLate(b)-tkLate(a))||((pr[a.priority]??2)-(pr[b.priority]??2))||(b.date||'').localeCompare(a.date||'')||(b.no||'').localeCompare(a.no||''))}
function viewCs(){const u=csUI();const T=S.tickets;const open=T.filter(t=>t.status!=='مغلق');const mk=TODAY_ISO.slice(0,7);
  const closedM=T.filter(t=>t.status==='مغلق'&&(t.closedAt||'').startsWith(mk));const res=T.filter(t=>t.status==='مغلق').map(tkAge).filter(v=>v!=null);
  const chip=(k,l,n)=>`<button data-cs-st="${k}" aria-pressed="${u.st===k}">${l} <b class="num">${n}</b></button>`;
  return `<div class="page-head"><div><h2>خدمة الزبائن</h2><p>تسجيل طلبات الزبائن واستفساراتهم وشكاواهم، وإسنادها للجهة المسؤولة، ومتابعة حالتها حتى الإغلاق.</p></div>
   <div class="toolbar">${S.canWrite?`<button class="btn primary" data-act="tk-new">${I.plus}طلب / شكوى جديدة</button><button class="btn" data-act="cu-new">${I.plus}زبون جديد</button>`:''}<button class="btn" data-act="tk-export">${I.down}تصدير Excel</button></div></div>
  ${csRulesBanner()}
  <div class="kpis an-kpis">
   <button class="kpi" data-cs-st="open"><span class="l">طلبات مفتوحة</span><span class="v">${fn(open.length)}</span><span class="s">${open.filter(t=>t.status==='جديد').length} جديدة لم تُباشَر</span></button>
   <button class="kpi ${open.filter(tkLate).length?'crit':''}" data-cs-st="late"><span class="l">متأخرة عن موعدها</span><span class="v">${fn(open.filter(tkLate).length)}</span><span class="s">تجاوزت موعد الإنجاز</span></button>
   <button class="kpi ${open.some(t=>t.priority==='عاجلة')?'warn':''}" data-cs-pri="عاجلة"><span class="l">عاجلة مفتوحة</span><span class="v">${fn(open.filter(t=>t.priority==='عاجلة').length)}</span><span class="s">أولوية قصوى</span></button>
   <button class="kpi ok" data-cs-st="مغلق"><span class="l">أُغلقت هذا الشهر</span><span class="v">${fn(closedM.length)}</span><span class="s">من ${fn(T.filter(t=>t.status==='مغلق').length)} مغلقة إجمالًا</span></button>
   <div class="kpi" style="cursor:default"><span class="l">متوسط زمن المعالجة</span><span class="v">${res.length?(res.reduce((a,b)=>a+b,0)/res.length).toFixed(1):'—'}</span><span class="s">يومًا</span></div></div>
  <div class="tabs" role="tablist" style="margin-top:14px"><button role="tab" data-cs-tab="tk" aria-selected="${u.tab==='tk'}">الطلبات والشكاوى (${T.length})</button><button role="tab" data-cs-tab="cu" aria-selected="${u.tab==='cu'}">الزبائن</button></div>
  ${u.tab==='cu'?`<div class="toolbar" style="margin-top:12px"><div class="grow">${I.search}<input type="search" id="cu-q" value="${esc(u.cq)}" placeholder="بحث باسم الزبون أو المنطقة أو الهاتف…"></div>
    <select id="cu-f"><option value="">كل الزبائن</option><option value="c" ${u.cf==='c'?'selected':''}>لهم عقود مع البريقة</option><option value="n" ${u.cf==='n'?'selected':''}>في الكشوفات بلا عقد</option><option value="t" ${u.cf==='t'?'selected':''}>لهم طلبات مفتوحة</option><option value="m" ${u.cf==='m'?'selected':''}>مسجّلون يدويًا</option></select></div><div id="cu-table"></div>`
  :`<div class="an-chips">${chip('','الكل',T.length)}${chip('open','المفتوحة',open.length)}${TK_ST.map(s=>chip(s,s,T.filter(t=>t.status===s).length)).join('')}${chip('late','المتأخرة',open.filter(tkLate).length)}</div>
   <div class="toolbar"><div class="grow">${I.search}<input type="search" id="tk-q" value="${esc(u.q)}" placeholder="بحث برقم الطلب أو الزبون أو الموضوع أو رقم العقد…"></div>
    <select id="tk-type"><option value="">كل الأنواع</option>${uniq([...TK_TYPES,...T.map(t=>t.type)]).map(t=>`<option ${u.type===t?'selected':''}>${esc(t)}</option>`).join('')}</select>
    <select id="tk-pri"><option value="">كل الأولويات</option>${TK_PRI.map(p=>`<option ${u.pri===p?'selected':''}>${p}</option>`).join('')}</select>
    <select id="tk-as"><option value="">كل الجهات المسؤولة</option>${uniq(T.map(t=>t.assignee)).map(a=>`<option ${u.as===a?'selected':''}>${esc(a)}</option>`).join('')}</select></div>
   <div id="tk-table"></div>`}`}
function renderTk(){const el=document.getElementById('tk-table');if(!el)return;const r=csFiltered();
  el.innerHTML=r.length?`<div class="count-line">${r.length} طلب</div><div class="tablewrap"><table><thead><tr><th class="nosort">الرقم</th><th class="nosort">التاريخ</th><th class="nosort">الزبون</th><th class="nosort">النوع</th><th class="nosort">الموضوع</th><th class="nosort">الأولوية</th><th class="nosort">الجهة المسؤولة</th><th class="nosort">موعد الإنجاز</th><th class="nosort">الحالة</th><th class="nosort">العمر</th></tr></thead><tbody>
  ${r.map(t=>`<tr data-tk="${t.id}"><td class="t-strong num">${esc(t.no||'—')}</td><td class="n">${fd(t.date)}</td><td>${esc(t.customer||'—')}</td><td>${esc(t.type||'—')}</td><td>${esc(t.subject||'—')}</td><td>${tkPri(t.priority)}</td><td>${esc(t.assignee||'—')}</td><td class="n">${t.dueDate?`<span style="${tkLate(t)?'color:var(--crit);font-weight:600':''}">${fd(t.dueDate)}</span>`:'—'}</td><td>${tkPill(t.status)}${tkLate(t)?' <span class="tag dup">متأخر</span>':''}</td><td class="n">${tkAge(t)??'—'} يوم</td></tr>`).join('')}</tbody></table></div>`
  :`<div class="empty"><b>${S.tickets.length?'لا نتائج':'لا توجد طلبات بعد'}</b>${S.tickets.length?'غيّر التصفية أو البحث.':'اضغط «طلب / شكوى جديدة» لتسجيل أول طلب.'}</div>`}
function csCustomers(){const ents=buildDir();
  // الزبائن المسجّلون يدويًا يُدمجون بالاسم، والطلبات تُربط بالاسم
  S.companies.forEach(co=>{const e=ents.find(x=>nameMatch(x.name,co.name)>=0.8||norm(x.name)===norm(co.name));if(e){e.manual=co;e.phone=co.phone||e.phone;e.person=co.person||e.person;e.email=co.email||e.email}});
  ents.forEach(e=>{e.tickets=S.tickets.filter(t=>norm(t.customer)===norm(e.name)||nameMatch(t.customer,e.name)>=0.8)});
  S.tickets.forEach(t=>{if(t.customer&&!ents.some(e=>e.tickets.includes(t))){let e=ents.find(x=>x.tkOnly&&norm(x.name)===norm(t.customer));if(!e){e={name:t.customer,phone:t.phone||'',contracts:[],needs:[],tickets:[],tkOnly:true};ents.push(e)}e.tickets.push(t)}});
  return ents}
function renderCu(){const el=document.getElementById('cu-table');if(!el)return;const u=csUI();const q=norm(u.cq);let r=csCustomers();
  if(q)r=r.filter(e=>norm([e.name,e.region,e.person,e.phone,e.activity].join(' ')).includes(q));
  if(u.cf==='c')r=r.filter(e=>e.contracts.length);if(u.cf==='n')r=r.filter(e=>!e.contracts.length&&e.needs.length);if(u.cf==='t')r=r.filter(e=>e.tickets.some(t=>t.status!=='مغلق'));if(u.cf==='m')r=r.filter(e=>e.manual);
  r.sort((a,b)=>b.tickets.filter(t=>t.status!=='مغلق').length-a.tickets.filter(t=>t.status!=='مغلق').length||b.tickets.length-a.tickets.length);
  S._cuRows=r;const lim=S.ui.cuAll?r.length:100;
  el.innerHTML=`<div class="count-line">${r.length} زبون</div><div class="tablewrap"><table><thead><tr><th class="nosort">الزبون</th><th class="nosort">المنطقة</th><th class="nosort">جهة الاتصال</th><th class="nosort">الهاتف</th><th class="nosort">العقود</th><th class="nosort">في الكشوفات</th><th class="nosort">الطلبات</th><th class="nosort">مفتوحة</th></tr></thead><tbody>
  ${r.slice(0,lim).map((e,i)=>{const o=e.tickets.filter(t=>t.status!=='مغلق').length;return `<tr data-cu="${i}"><td class="t-strong">${esc(e.name)}${e.manual?' <span class="tag">مسجّل</span>':''}</td><td>${esc(e.region||e.manual?.address||'—')}</td><td>${esc(e.person||'—')}</td><td class="n">${esc(e.phone||'—')}</td><td>${e.contracts.map(c=>`<span class="tag link">${esc(c.no)}</span>`).join(' ')||'—'}</td><td class="n">${e.needs.length||'—'}</td><td class="n">${e.tickets.length||'—'}</td><td>${o?`<span class="pill p-warn">${o}</span>`:'—'}</td></tr>`}).join('')}</tbody></table></div>
  ${r.length>lim?`<button class="btn sm" style="margin-top:10px" data-act="cu-all">عرض الكل (${r.length})</button>`:''}`}
afterRender.cs=()=>{const u=csUI();
  if(u.tab==='cu'){renderCu();const q=document.getElementById('cu-q');q.addEventListener('input',debounce(()=>{u.cq=q.value;renderCu()},150));document.getElementById('cu-f').addEventListener('change',e=>{u.cf=e.target.value;renderCu()});return}
  renderTk();const q=document.getElementById('tk-q');q.addEventListener('input',debounce(()=>{u.q=q.value;renderTk()},150));
  [['tk-type','type'],['tk-pri','pri'],['tk-as','as']].forEach(([id,k])=>document.getElementById(id).addEventListener('change',e=>{u[k]=e.target.value;renderTk()}))};
function openTicket(id){const t=S.tickets.find(x=>x.id===id);if(!t)return;
  const row=(l,v,full)=>`<div class="${full?'full':''}"><dt>${esc(l)}</dt><dd>${v==null||v===''?'—':v}</dd></div>`;
  const c=t.contractNo?S.contracts.find(x=>normNo(x.no)===normNo(t.contractNo)):null;
  const hist=(t.history||[]).slice().sort((a,b)=>(b.ts||'').localeCompare(a.ts||''));
  drawer(`<div style="flex:1;min-width:0"><h3>${esc(t.subject||t.type||'طلب')}</h3><div class="sub"><span class="tag num">${esc(t.no||'')}</span>${tkPill(t.status)}${tkPri(t.priority)}${tkLate(t)?'<span class="tag dup">متأخر</span>':''}</div></div>
   ${S.canWrite?`<button class="btn sm" data-act="tk-edit" data-id="${t.id}">${I.edit}تعديل</button>`:''}<button class="iconbtn" data-act="close-drawer" aria-label="إغلاق">${I.close}</button>`,
  `${S.canWrite&&t.status!=='مغلق'?`<div class="panel tk-upd"><h3 class="section-title">تحديث الحالة</h3><div class="toolbar">
     <select id="tu-st">${TK_ST.map(s=>`<option ${s===(t.status==='جديد'?'قيد المعالجة':t.status)?'selected':''}>${s}</option>`).join('')}</select>
     <div class="grow" style="min-width:180px"><input id="tu-note" type="text" placeholder="ما الذي تم؟ (يُحفظ في سجل المتابعة، وعند الإغلاق يُعتبر الحل)" style="width:100%;height:36px;border:1px solid var(--line);border-radius:8px;padding-inline:10px;background:var(--surface)"></div>
     <button class="btn primary sm" data-act="tk-upd" data-id="${t.id}">حفظ التحديث</button></div><span id="tu-err" style="color:var(--crit);font-size:12.5px"></span></div>`:''}
   ${S.canWrite&&t.status==='مغلق'?`<div><button class="btn sm" data-act="tk-reopen" data-id="${t.id}">إعادة فتح الطلب</button></div>`:''}
   <div><h3 class="section-title">بيانات الطلب</h3><dl class="dl">
    ${row('الزبون',`<a href="#" data-cu-name="${esc(t.customer||'')}">${esc(t.customer||'')}</a>`,true)}${row('جهة الاتصال',esc(t.contact))}${row('الهاتف',esc(t.phone))}
    ${row('تاريخ الورود',fd(t.date))}${row('قناة الورود',esc(t.channel))}${row('نوع الطلب',esc(t.type))}${row('الجهة المسؤولة',esc(t.assignee))}
    ${row('موعد الإنجاز',t.dueDate?fd(t.dueDate):'')}${row('عمر الطلب',(tkAge(t)??'—')+' يوم')}
    ${c?row('العقد المرتبط',`<a href="#" data-open-c="${c.id}">${esc(c.no)} — ${esc(c.company)}</a>`,true):t.contractNo?row('رقم العقد',esc(t.contractNo)):''}
    ${row('التفاصيل',esc(t.details).replace(/\n/g,'<br>'),true)}
    ${t.status==='مغلق'?row('الحل / نتيجة المعالجة',esc(t.resolution),true)+row('تاريخ الإغلاق',fd(t.closedAt)):''}
   </dl></div>
   <div><h3 class="section-title">سجل المتابعة</h3>${hist.length?`<div class="tk-hist">${hist.map(h=>`<div class="tl"><span class="d num">${fd(h.ts)}</span><span style="flex:1">${h.status?tkPill(h.status)+' ':''}${esc(h.note||'')}<br><span class="muted" style="font-size:12px">${esc(h.by||'')}</span></span></div>`).join('')}</div>`:'<div class="muted">لا توجد تحديثات بعد.</div>'}</div>`)}
async function csMe(){try{const m=S.user&&S.user.me?await S.user.me():null;if(m)return m.name||m.email||'';const n=S.user&&S.user.name?await S.user.name():null;return n||''}catch(e){return ''}}
function tkForm(t,pre){const isNew=!t;t=t||Object.assign({date:TODAY_ISO,status:'جديد',priority:'عادية',channel:'هاتف',type:'استفسار'},pre||{});
  const custs=csCustomers().map(e=>e.name);const asg=uniq([...ORG.filter(o=>o.id!=='board').map(o=>o.title),...S.tickets.map(x=>x.assignee)]);
  modal(isNew?'تسجيل طلب / شكوى':'تعديل الطلب '+(t.no||''),`<fieldset><legend>الزبون</legend>
    ${F('t-cust','اسم الزبون (شركة / مصنع / جهة)',t.customer,{req:1,list:'dl-cust',full:1})}${F('t-contact','اسم المتصل / جهة الاتصال',t.contact)}${F('t-phone','الهاتف',t.phone,{type:'tel'})}${F('t-cno','رقم العقد (إن وجد)',t.contractNo,{list:'dl-no'})}</fieldset>
   <fieldset><legend>الطلب</legend>${F('t-date','تاريخ الورود',t.date,{type:'date',req:1})}${F('t-ch','قناة الورود',t.channel,{type:'select',options:uniq([...TK_CH,t.channel])})}${F('t-type','نوع الطلب',t.type,{type:'select',options:uniq([...TK_TYPES,t.type]),req:1})}
    ${F('t-pri','الأولوية',t.priority,{type:'select',options:TK_PRI})}${F('t-subj','الموضوع',t.subject,{req:1,full:1})}${F('t-det','التفاصيل',t.details,{type:'textarea',full:1})}</fieldset>
   <fieldset><legend>المعالجة</legend>${F('t-as','الجهة المسؤولة',t.assignee,{list:'dl-as'})}${F('t-due','موعد الإنجاز',t.dueDate,{type:'date',hint:'يُقترح تلقائيًا حسب الأولوية: عاجلة يومان، مهمة 5 أيام، عادية 10 أيام'})}${isNew?'':F('t-st','الحالة',t.status,{type:'select',options:TK_ST})}</fieldset>
   ${dl('dl-cust',custs)}${dl('dl-no',S.contracts.map(c=>c.no))}${dl('dl-as',asg)}`,
  `<button type="submit" class="btn primary" data-act="tk-save" data-id="${t.id||''}">حفظ</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button>${!isNew&&S.canWrite?`<button type="button" class="btn danger" data-act="del" data-col="tickets" data-id="${t.id}" style="margin-inline-start:auto">حذف</button>`:''}<span id="f-err" style="color:var(--crit);font-size:12.5px;margin-inline-start:8px"></span>`);
  const due=document.getElementById('t-due'),pri=document.getElementById('t-pri'),dt=document.getElementById('t-date');let touched=!!t.dueDate;
  const sug=()=>{if(touched)return;const d=pd(dt.value)||today;const x=new Date(d);x.setDate(x.getDate()+(TK_SLA[pri.value]||10));due.value=iso(x)};
  due.addEventListener('input',()=>{touched=true});pri.addEventListener('change',sug);dt.addEventListener('change',sug);sug();
  document.getElementById('t-cust').addEventListener('change',e=>{const ent=csCustomers().find(x=>norm(x.name)===norm(e.target.value));if(!ent)return;const ph=document.getElementById('t-phone'),ct=document.getElementById('t-contact'),cn=document.getElementById('t-cno');
    if(!ph.value&&ent.phone)ph.value=ent.phone;if(!ct.value&&ent.person)ct.value=ent.person;if(!cn.value&&ent.contracts.length===1)cn.value=ent.contracts[0].no})}
async function tkSave(id){const old=id?S.tickets.find(x=>x.id===id):null;
  const o={customer:val('t-cust'),contact:val('t-contact'),phone:val('t-phone'),contractNo:val('t-cno'),date:val('t-date'),channel:val('t-ch'),type:val('t-type'),priority:val('t-pri')||'عادية',subject:val('t-subj'),details:val('t-det'),assignee:val('t-as'),dueDate:val('t-due')};
  if(!o.customer||!o.subject||!o.date||!o.type){document.getElementById('f-err').textContent='اسم الزبون والتاريخ والنوع والموضوع مطلوبة.';return}
  const by=await csMe();const now=new Date().toISOString();
  if(old){const st=val('t-st')||old.status;Object.assign(o,{no:old.no,status:st,history:(old.history||[]).concat(st!==old.status?[{ts:now,by,status:st,note:'تغيير الحالة من نموذج التعديل'}]:[]),resolution:old.resolution||'',closedAt:st==='مغلق'?(old.closedAt||now):''})}
  else Object.assign(o,{no:tkNext(),status:'جديد',history:[{ts:now,by,status:'جديد',note:'تسجيل الطلب'}]});
  const nid=id||uid('t');await write('tickets',nid,o,!id);dlg.close();toast(old?'تم حفظ التعديل':'تم تسجيل الطلب رقم '+o.no);const v0=old&&old.updatedAt;whenReady(()=>{const x=S.tickets.find(t=>t.id===nid);return x&&x.updatedAt!==v0},()=>openTicket(nid))}
async function tkUpdate(id,st,note){const t=S.tickets.find(x=>x.id===id);if(!t)return;const by=await csMe();const now=new Date().toISOString();
  const o=Object.assign(stripId(t),{status:st,history:(t.history||[]).concat([{ts:now,by,status:st,note}])});
  if(st==='مغلق'){o.closedAt=now;o.resolution=note||t.resolution||''}else{delete o.closedAt}
  await write('tickets',id,o,false);toast(st==='مغلق'?'تم إغلاق الطلب':'تم حفظ التحديث');const n0=(t.history||[]).length;whenReady(()=>{const x=S.tickets.find(y=>y.id===id);return x&&(x.history||[]).length>n0},()=>openTicket(id))}
function openCustomer(name){const e=csCustomers().find(x=>norm(x.name)===norm(name));if(!e)return;const m=e.manual||{};
  const row=(l,v,full)=>`<div class="${full?'full':''}"><dt>${esc(l)}</dt><dd>${v==null||v===''?'—':v}</dd></div>`;
  drawer(`<div style="flex:1;min-width:0"><h3>${esc(e.name)}</h3><div class="sub">${e.contracts.length?`<span class="tag link">${e.contracts.length} عقد</span>`:''}${e.needs.length?`<span class="tag">${e.needs.length} منشأة في الكشوفات</span>`:''}${m.kind?`<span class="tag">${esc(m.kind)}</span>`:''}</div></div>
   ${S.canWrite?`<button class="btn sm" data-act="cu-edit" data-name="${esc(e.name)}">${I.edit}${e.manual?'تعديل البيانات':'إضافة بيانات اتصال'}</button>`:''}<button class="iconbtn" data-act="close-drawer" aria-label="إغلاق">${I.close}</button>`,
  `${S.canWrite?`<div><button class="btn primary sm" data-act="tk-new" data-name="${esc(e.name)}">${I.plus}طلب / شكوى لهذا الزبون</button></div>`:''}
   <div><h3 class="section-title">بيانات الاتصال</h3><dl class="dl">${row('جهة الاتصال',esc(e.person))}${row('الهاتف',esc(e.phone))}${row('البريد الإلكتروني',esc(e.email||m.email))}${row('العنوان / المنطقة',esc(m.address||e.region))}${e.activity?row('النشاط',esc(e.activity)):''}${m.notes?row('ملاحظات',esc(m.notes),true):''}</dl></div>
   ${e.contracts.length?`<div><h3 class="section-title">العقود مع البريقة</h3>${e.contracts.map(c=>{const d=D.get(c.id);return `<div class="tl" data-open-c="${c.id}" style="cursor:pointer;margin-bottom:6px"><span class="d">${esc(c.no)}</span><span style="flex:1">${esc(c.type||'')}<br><span class="muted" style="font-size:12.5px">ينتهي ${fd(d&&d.effEnd)}</span></span>${d?statusPill(d.status):''}</div>`}).join('')}</div>`:''}
   <div><h3 class="section-title">الطلبات والشكاوى (${e.tickets.length})</h3>${e.tickets.length?e.tickets.slice().sort((a,b)=>(b.date||'').localeCompare(a.date||'')).map(t=>`<div class="tl" data-tk="${t.id}" style="cursor:pointer;margin-bottom:6px"><span class="d num">${esc(t.no||'')}</span><span style="flex:1">${esc(t.subject||t.type||'')}<br><span class="muted" style="font-size:12.5px">${fd(t.date)} · ${esc(t.type||'')}</span></span>${tkPill(t.status)}</div>`).join(''):'<div class="muted">لا توجد طلبات مسجّلة لهذا الزبون.</div>'}</div>
   ${e.needs.length?`<div><h3 class="section-title">في كشوفات وزارة الصناعة</h3>${e.needs.map(n=>`<div class="tl" data-open-n="${n.id}" style="cursor:pointer;margin-bottom:6px"><span class="d">${esc(batchName(n.batch))}</span><span style="flex:1">${esc(n.activity||'')} · ${esc(cleanRegion(n.region)||'')}</span><span class="num">${fn(anDiesel(n)||null)} لتر</span></div>`).join('')}</div>`:''}`)}
function cuForm(name){const ent=name?csCustomers().find(x=>norm(x.name)===norm(name)):null;const co=(ent&&ent.manual)||{name:name||'',person:ent?.person||'',phone:ent?.phone||'',address:ent?.region||''};
  modal(co.id?'تعديل بيانات الزبون':'تسجيل زبون',`<fieldset><legend>بيانات الزبون</legend>${F('cu-name','اسم الزبون',co.name,{req:1,full:1})}${F('cu-kind','الصفة',co.kind,{type:'select',options:CU_KINDS})}${F('cu-person','جهة الاتصال / المفوض',co.person)}${F('cu-phone','الهاتف',co.phone,{type:'tel'})}${F('cu-email','البريد الإلكتروني',co.email,{type:'email'})}${F('cu-addr','العنوان / المنطقة',co.address)}${F('cu-notes','ملاحظات',co.notes,{type:'textarea',full:1})}</fieldset>`,
  `<button type="submit" class="btn primary" data-act="cu-save" data-id="${co.id||''}">حفظ</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button>${co.id?`<button type="button" class="btn danger" data-act="del" data-col="companies" data-id="${co.id}" style="margin-inline-start:auto">حذف</button>`:''}<span id="f-err" style="color:var(--crit);font-size:12.5px;margin-inline-start:8px"></span>`)}
async function cuSave(id){const o={name:val('cu-name'),kind:val('cu-kind'),person:val('cu-person'),phone:val('cu-phone'),email:val('cu-email'),address:val('cu-addr'),notes:val('cu-notes')};
  if(!o.name){document.getElementById('f-err').textContent='اسم الزبون مطلوب.';return}
  await write('companies',id||uid('co'),o,!id);dlg.close();toast('تم حفظ بيانات الزبون');whenReady(()=>S.companies.some(c=>c.name===o.name),()=>openCustomer(o.name))}
function tkExport(){const r=csFiltered();saveXlsx([['الطلبات',r.map(t=>({'الرقم':t.no||'','التاريخ':t.date||'','الزبون':t.customer||'','جهة الاتصال':t.contact||'','الهاتف':t.phone||'','رقم العقد':t.contractNo||'','القناة':t.channel||'','النوع':t.type||'','الأولوية':t.priority||'','الموضوع':t.subject||'','التفاصيل':t.details||'','الجهة المسؤولة':t.assignee||'','موعد الإنجاز':t.dueDate||'','الحالة':t.status||'','متأخر':tkLate(t)?'نعم':'','عمر الطلب (يوم)':tkAge(t)??'','تاريخ الإغلاق':(t.closedAt||'').slice(0,10),'الحل':t.resolution||''}))]],'طلبات-الزبائن-'+TODAY_ISO+'.xlsx')}
document.addEventListener('click',async e=>{
  const tb=e.target.closest('[data-cs-tab]');if(tb){csUI().tab=tb.dataset.csTab;render();return}
  const sc=e.target.closest('[data-cs-st]');if(sc){Object.assign(csUI(),{tab:'tk',st:sc.dataset.csSt,pri:''});render();return}
  const sp=e.target.closest('[data-cs-pri]');if(sp){Object.assign(csUI(),{tab:'tk',st:'open',pri:sp.dataset.csPri});render();return}
  const tr=e.target.closest('[data-tk]');if(tr){openTicket(tr.dataset.tk);return}
  const cr=e.target.closest('[data-cu]');if(cr&&S._cuRows){openCustomer(S._cuRows[+cr.dataset.cu].name);return}
  const cn=e.target.closest('[data-cu-name]');if(cn){e.preventDefault();openCustomer(cn.dataset.cuName);return}
  const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act,id=a.dataset.id;
  if(act==='tk-new'){if(!S.canWrite)return;if(dlg.open)dlg.close();tkForm(null,a.dataset.name?{customer:a.dataset.name}:null);if(a.dataset.name)document.getElementById('t-cust').dispatchEvent(new Event('change'))}
  else if(act==='tk-edit')tkForm(S.tickets.find(x=>x.id===id));
  else if(act==='cu-new'){if(dlg.open)dlg.close();cuForm()}
  else if(act==='cu-edit')cuForm(a.dataset.name);
  else if(act==='tk-export')tkExport();
  else if(act==='cu-all'){S.ui.cuAll=true;renderCu()}
  else if(act==='tk-save'||act==='cu-save'){e.preventDefault();if(!S.canWrite)return;a.disabled=true;try{await(act==='tk-save'?tkSave:cuSave)(id||null)}catch(err){const fe=document.getElementById('f-err');if(fe)fe.textContent=writeErr(err)}finally{a.disabled=false}}
  else if(act==='tk-upd'||act==='tk-reopen'){const st=act==='tk-reopen'?'قيد المعالجة':document.getElementById('tu-st').value;const note=act==='tk-reopen'?'إعادة فتح الطلب':val('tu-note');
    if(st==='مغلق'&&!note){document.getElementById('tu-err').textContent='اكتب الحل أو نتيجة المعالجة قبل الإغلاق.';return}
    a.disabled=true;try{await tkUpdate(id,st,note)}catch(err){toast(writeErr(err))}finally{a.disabled=false}}
});
/* English labels for the two modules (used by the language switch) */
if(window.I18N&&I18N.add){I18N.add({
 'تحليل البيانات':'Data analysis','خدمة الزبائن':'Customer service','قراءة تحليلية لعقود البريقة وكشوفات الاحتياجات وطلبات الزبائن، تتحدّث تلقائيًا مع كل تعديل في المنظومة.':'Analysis of Brega contracts, needs sheets and customer requests, updated automatically with every change in the system.',
 'تصدير التحليل Excel':'Export analysis to Excel','العقود':'Contracts','الاحتياجات والوقود':'Needs & fuel','الفرص البيعية':'Sales opportunities','تحليل مخصّص':'Custom analysis',
 'نوع العقد':'Contract type','كل الأنواع':'All types','التوقيع من':'Signed from','إلى':'To','الدفعة':'Batch','كل الدفعات':'All batches','المنطقة':'Region','كل المناطق':'All regions','مسح التصفية':'Clear filters',
 'لا توجد بيانات ضمن التصفية الحالية':'No data for the current filters','لا توجد عقود':'No contracts','لا توجد منشآت':'No facilities','ضمن التصفية الحالية.':'for the current filters.',
 'عدد العقود':'Contracts','{0} سارية الآن':'{0} active now','نسبة العقود السارية':'Active contracts share','{0} منتهية':'{0} expired','القيمة الإجمالية':'Total value','دينار ليبي':'LYD','{0} بعملة أخرى':'{0} in another currency',
 'متوسط قيمة العقد':'Average contract value','متوسط مدة العقد':'Average contract term','شهرًا':'months','تنتهي خلال {0} يومًا':'Expiring within {0} days','تحتاج متابعة للتجديد':'Need renewal follow-up',
 '{0} مليون':'{0}M','{0} ألف':'{0}K','حالة العقود':'Contract status','اضغط على جزء لفتح العقود':'click a segment to open the contracts','ساري':'Active','قريب الانتهاء':'Expiring soon','منتهٍ':'Expired','لم يبدأ بعد':'Not started','معلق / غير محدد':'Suspended / unspecified',
 'عدد العقود حسب النوع':'Contracts by type','اضغط للتصفية':'click to filter','قيمة العقود حسب النوع':'Contract value by type','العقود الموقّعة شهريًا':'Contracts signed per month','آخر 12 شهرًا':'last 12 months',
 'العقود التي تنتهي في الأرباع القادمة':'Contracts expiring in the coming quarters','حسب الإدارة المختصة':'By department','حسب الموقع':'By location','أعلى 10':'top 10','أعلى 12':'top 12','أعلى 25':'top 25',
 'أكبر 10 زبائن حسب قيمة العقود':'Top 10 customers by contract value','توزيع مدد العقود':'Contract term distribution','أقل من 6 أشهر':'Under 6 months','6–12 شهرًا':'6–12 months','1–2 سنة':'1–2 years','أكثر من سنتين':'Over 2 years',
 'عدد المنشآت':'Facilities','{0} منطقة':'{0} regions','إجمالي الديزل الشهري':'Monthly diesel total','لتر/شهر':'liters/month','متوسط الديزل للمنشأة':'Average diesel per facility','لتر/شهر للمنشآت المستهلكة':'liters/month for consuming facilities',
 'الغاز':'Gas','الزيت الثقيل':'Heavy oil','منشآت مرتبطة بعقد':'Facilities with a contract','{0} من {1}':'{0} of {1}','الكميات المعتمدة حسب نوع الوقود':'Approved quantities by fuel type','ديزل مولدات':'Diesel (generators)','ديزل تشغيلية':'Diesel (operations)','زيت ثقيل':'Heavy oil','كيروسين':'Kerosene','مشاريع (نوع الوقود غير محدد)':'Projects (fuel type unspecified)',
 'الديزل حسب الدفعة':'Diesel by batch','اضغط لفتح الدفعة':'click to open the batch','الديزل حسب المنطقة':'Diesel by region','عدد المنشآت حسب المنطقة':'Facilities by region','الديزل حسب نوع النشاط':'Diesel by activity',
 'المنشآت حسب حجم الاستهلاك الشهري للديزل':'Facilities by monthly diesel consumption','حتى 5 آلاف':'Up to 5K','5–20 ألف':'5K–20K','20–50 ألف':'20K–50K','50–100 ألف':'50K–100K','أكثر من 100 ألف':'Over 100K',
 'أكبر 10 منشآت استهلاكًا للديزل':'Top 10 diesel-consuming facilities','اضغط لفتح بطاقة المنشأة':'click to open the facility card',
 'منشآت معتمدة في كشوفات وزارة الصناعة ولا يوجد لها عقد مسجّل مع شركة البريقة: فرص تعاقد مباشرة، مرتّبة حسب حجم احتياجها الشهري.':'Facilities approved in the Ministry of Industry sheets with no contract registered with Brega: direct contracting opportunities, ranked by monthly need.',
 'منشآت بلا عقد':'Facilities without a contract','من {0} منشأة في الكشوفات':'of {0} facilities in the sheets','ديزل غير متعاقد عليه':'Uncontracted diesel','نسبتها من إجمالي الديزل':'Share of total diesel','من الاحتياج المعتمد':'of the approved need','غاز غير متعاقد عليه':'Uncontracted gas',
 'الديزل غير المتعاقد عليه حسب المنطقة':'Uncontracted diesel by region','حسب نوع النشاط':'By activity','قائمة الفرص':'Opportunity list','تصدير القائمة':'Export list','المنشأة':'Facility','النشاط':'Activity','صاحب الترخيص / المفوض':'Licensee / representative',
 'ديزل لتر/شهر':'Diesel L/month','غاز طن':'Gas (tons)','عرض كل الفرص ({0})':'Show all opportunities ({0})','لا توجد فرص':'No opportunities','كل المنشآت ضمن التصفية مرتبطة بعقود.':'All facilities in the filter have contracts.',
 'لا توجد طلبات زبائن بعد':'No customer requests yet','سجّل الطلبات والشكاوى من بند «خدمة الزبائن» وستظهر تحليلاتها هنا.':'Record requests and complaints in Customer service and their analysis will appear here.','فتح خدمة الزبائن':'Open customer service',
 'إجمالي الطلبات':'Total requests','{0} مفتوحة':'{0} open','متأخرة عن موعدها':'Overdue','طلبات مفتوحة تجاوزت موعد الإنجاز':'Open requests past their due date','متوسط زمن المعالجة':'Average handling time','يومًا للطلبات المغلقة':'days for closed requests',
 'الإنجاز في الموعد':'Closed on time','{0} من {1} مغلقة':'{0} of {1} closed','الشكاوى':'Complaints','حالة الطلبات':'Request status','اضغط لفتح القائمة':'click to open the list','الطلبات الواردة والمغلقة شهريًا':'Requests received and closed per month','واردة':'Received','مغلقة':'Closed',
 'حسب نوع الطلب':'By request type','حسب قناة الورود':'By channel','حسب الأولوية':'By priority','متوسط أيام المعالجة حسب النوع':'Average handling days by type','الطلبات المفتوحة حسب الجهة المسؤولة':'Open requests by responsible unit','أكثر الزبائن تواصلًا':'Most active customers',
 'اختر ما تريد تحليله':'Choose what to analyse','البيانات':'Data','التجميع حسب':'Group by','المقياس':'Measure','تصدير النتيجة':'Export result','الجدول':'Table','{0} مجموعة':'{0} groups','عدد السجلات':'Records','النسبة':'Share','الإجمالي':'Total',
 'عقود البريقة':'Brega contracts','كشوفات الاحتياجات':'Needs sheets','طلبات الزبائن':'Customer requests','الحالة':'Status','الإدارة المختصة':'Department','الموقع':'Location','الشركة المتعاقدة':'Contracting company','المسؤول':'Officer','العملة':'Currency','سنة التوقيع':'Signing year','شهر التوقيع':'Signing month','تنبيه الانتهاء':'Expiry alert','لا يوجد':'None',
 'مجموع القيمة':'Total value','متوسط القيمة':'Average value','متوسط المدة (شهر)':'Average term (months)','عدد التمديدات':'Extensions','القسم في الكشف':'Sheet section','الارتباط بعقد':'Contract link','مرتبطة بعقد':'With contract','بلا عقد':'No contract',
 'ديزل إجمالي (لتر/شهر)':'Total diesel (L/month)','غاز (طن)':'Gas (tons)','نوع الطلب':'Request type','قناة الورود':'Channel','الأولوية':'Priority','الجهة المسؤولة':'Responsible unit','الزبون':'Customer','شهر الورود':'Month received','الالتزام بالموعد':'Timeliness','متأخر':'Overdue','ضمن الموعد':'On time','عدد الطلبات':'Requests','متوسط أيام المعالجة':'Average handling days',
 'جديد':'New','قيد المعالجة':'In progress','بانتظار الزبون':'Waiting for customer','مغلق':'Closed','عاجلة':'Urgent','مهمة':'High','عادية':'Normal',
 'استفسار':'Inquiry','طلب تزويد بالوقود':'Fuel supply request','طلب تعاقد جديد':'New contract request','طلب تجديد أو تمديد عقد':'Contract renewal / extension','شكوى':'Complaint','تأخر في التوريد':'Delivery delay','ملاحظة على الجودة أو الكمية':'Quality or quantity issue','مطالبة مالية أو فواتير':'Billing / financial claim','أخرى':'Other',
 'هاتف':'Phone','زيارة للمقر':'Office visit','بريد إلكتروني':'Email','رسالة رسمية':'Official letter','واتساب':'WhatsApp','شركة':'Company','مصنع':'Factory','جهة عامة':'Public body','فرد':'Individual',
 'تسجيل طلبات الزبائن واستفساراتهم وشكاواهم، وإسنادها للجهة المسؤولة، ومتابعة حالتها حتى الإغلاق.':'Record customer requests, inquiries and complaints, assign them to the responsible unit, and track them until closed.',
 'طلب / شكوى جديدة':'New request / complaint','زبون جديد':'New customer','تصدير Excel':'Export Excel','بند خدمة الزبائن يحتاج تفعيلًا في Firebase.':'Customer service needs to be enabled in Firebase.',
 'قاعدة البيانات لا تسمح بعد بحفظ الطلبات. على مدير المنظومة فتح Firebase ← Firestore ← Rules واستبدال القواعد بمحتوى الملف':'The database does not allow saving requests yet. The administrator should open Firebase → Firestore → Rules and replace the rules with the updated file','المحدَّث (يضيف':'(it adds','إلى قائمة المجموعات) ثم الضغط على Publish.':'to the collection list) then press Publish.',
 'طلبات مفتوحة':'Open requests','{0} جديدة لم تُباشَر':'{0} new, not started','تجاوزت موعد الإنجاز':'Past due date','عاجلة مفتوحة':'Open urgent','أولوية قصوى':'Top priority','أُغلقت هذا الشهر':'Closed this month','من {0} مغلقة إجمالًا':'of {0} closed in total','يومًا':'days',
 'الطلبات والشكاوى ({0})':'Requests & complaints ({0})','الزبائن':'Customers','بحث باسم الزبون أو المنطقة أو الهاتف…':'Search by customer, region or phone…','كل الزبائن':'All customers','لهم عقود مع البريقة':'With Brega contracts','في الكشوفات بلا عقد':'In sheets without contract','لهم طلبات مفتوحة':'With open requests','مسجّلون يدويًا':'Added manually',
 'الكل':'All','المفتوحة':'Open','المتأخرة':'Overdue','بحث برقم الطلب أو الزبون أو الموضوع أو رقم العقد…':'Search by request no., customer, subject or contract no.…','كل الأولويات':'All priorities','كل الجهات المسؤولة':'All responsible units',
 '{0} طلب':'{0} requests','الرقم':'No.','التاريخ':'Date','النوع':'Type','الموضوع':'Subject','موعد الإنجاز':'Due date','العمر':'Age','{0} يوم':'{0} days','لا نتائج':'No results','غيّر التصفية أو البحث.':'Change the filter or search.','لا توجد طلبات بعد':'No requests yet','اضغط «طلب / شكوى جديدة» لتسجيل أول طلب.':'Press "New request / complaint" to record the first one.',
 '{0} زبون':'{0} customers','جهة الاتصال':'Contact','الهاتف':'Phone','في الكشوفات':'In sheets','الطلبات':'Requests','مفتوحة':'Open','مسجّل':'Registered','عرض الكل ({0})':'Show all ({0})',
 'تحديث الحالة':'Update status','ما الذي تم؟ (يُحفظ في سجل المتابعة، وعند الإغلاق يُعتبر الحل)':'What was done? (saved in the follow-up log; when closing it is the resolution)','حفظ التحديث':'Save update','إعادة فتح الطلب':'Reopen request','بيانات الطلب':'Request details','تاريخ الورود':'Date received','عمر الطلب':'Request age','العقد المرتبط':'Linked contract','رقم العقد':'Contract no.','التفاصيل':'Details',
 'الحل / نتيجة المعالجة':'Resolution','تاريخ الإغلاق':'Closed on','سجل المتابعة':'Follow-up log','لا توجد تحديثات بعد.':'No updates yet.','تسجيل الطلب':'Request recorded','تغيير الحالة من نموذج التعديل':'Status changed from the edit form',
 'تسجيل طلب / شكوى':'New request / complaint','تعديل الطلب {0}':'Edit request {0}','اسم الزبون (شركة / مصنع / جهة)':'Customer name (company / factory / body)','اسم المتصل / جهة الاتصال':'Caller / contact','رقم العقد (إن وجد)':'Contract no. (if any)','الطلب':'Request','المعالجة':'Handling',
 'يُقترح تلقائيًا حسب الأولوية: عاجلة يومان، مهمة 5 أيام، عادية 10 أيام':'Suggested from priority: urgent 2 days, high 5 days, normal 10 days','اسم الزبون والتاريخ والنوع والموضوع مطلوبة.':'Customer, date, type and subject are required.','اكتب الحل أو نتيجة المعالجة قبل الإغلاق.':'Write the resolution before closing.',
 'تم حفظ التعديل':'Changes saved','تم تسجيل الطلب رقم {0}':'Request {0} recorded','تم تسجيل الطلب رقم {0}/{1}':'Request {0}/{1} recorded','تم إغلاق الطلب':'Request closed','تم حفظ التحديث':'Update saved','تم حفظ بيانات الزبون':'Customer saved',
 'تعديل البيانات':'Edit details','إضافة بيانات اتصال':'Add contact details','طلب / شكوى لهذا الزبون':'Request / complaint for this customer','بيانات الاتصال':'Contact details','البريد الإلكتروني':'Email','العنوان / المنطقة':'Address / region','ملاحظات':'Notes','العقود مع البريقة':'Contracts with Brega','ينتهي {0}':'Ends {0}',
 'الطلبات والشكاوى':'Requests & complaints','لا توجد طلبات مسجّلة لهذا الزبون.':'No requests recorded for this customer.','في كشوفات وزارة الصناعة':'In the Ministry of Industry sheets','{0} منشأة في الكشوفات':'{0} facilities in the sheets','{0} لتر':'{0} L',
 'تسجيل زبون':'New customer','تعديل بيانات الزبون':'Edit customer','بيانات الزبون':'Customer details','اسم الزبون':'Customer name','الصفة':'Kind','جهة الاتصال / المفوض':'Contact / representative','اسم الزبون مطلوب.':'Customer name is required.','غير محدد':'Unspecified'});
 I18N.rule(/^ر(\d) (\d{4})$/,m=>'Q'+m[1]+' '+m[2]);I18N.rule(/^الربع (\d) من (\d{4})$/,m=>'Q'+m[1]+' '+m[2]);
 I18N.rule(/^(\d+) (طلب)$/,m=>m[1]+' requests');I18N.rule(/^(\d+) (زبون)$/,m=>m[1]+' customers');}
