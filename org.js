/* Organizational structure, department records, organization KPI board.
   Classic script: shares the global scope with the other app files; load order is set in index.html. */
"use strict";
/* ============ Organizational structure ============ */
/* المصدر: ملف «الإدارة العامة للمبيعات والشؤون التجارية» (هيكل معتمد بانتظار اعتماد مجلس الإدارة).
   كل عنصر: [المعرّف، معرّف الجهة الأعلى، المسمى، علامات]
   العلامات: v = شاغرة · u = تحتاج تدقيق (الاسم أو الرقم غير واضح في الصورة الممسوحة).
   أسماء المسؤولين وأرقامهم الوظيفية ليست في الكود (المستودع عام): تُقرأ بعد الدخول من config/orgPeople
   ويستوردها مدير النظام من الإعدادات. راجع orgpeople.js.
   الصلاحيات تُضاف لاحقًا في ORG_PERMS بمفتاح معرّف الجهة، ولم تُحدَّد بعد. */
const ORG_ROWS=[
 ['board',null,'عضو مجلس الإدارة للتزويد والمبيعات والطاقات المتجددة'],
 ['gm','board','الإدارة العامة للمبيعات والشؤون التجارية'],
 // تتبع المدير العام مباشرة
 ['gm-rep','gm','قسم المتابعة والتقارير - العامة للمبيعات'],
 ['gm-rep-f','gm-rep','وحدة المتابعة العامة للمبيعات','u'],
 ['gm-rep-r','gm-rep','وحدة التقارير - العامة للمبيعات'],
 ['gm-rep-a','gm-rep','وحدة تحليل البيانات والكميات'],
 ['gm-fo','gm','مكتب متابعة المبيعات'],
 ['gm-fo-tr','gm-fo','مشرف متابعة المبيعات طرابلس'],
 ['gm-fo-ms','gm-fo','مشرف متابعة المبيعات مصراتة'],
 ['gm-fo-zw','gm-fo','مشرف متابعة المبيعات الزاوية'],
 ['gm-fo-sb','gm-fo','مشرف متابعة المبيعات سبها'],
 ['gm-fo-bn','gm-fo','مشرف متابعة المبيعات بنغازي'],
 ['gm-fo-tb','gm-fo','مشرف متابعة المبيعات طبرق'],
 ['gm-fo-br','gm-fo','مشرف متابعة المبيعات البريقة والسرير'],
 ['gm-fo-is','gm-fo','وحدة نظم المعلومات والبيانات التجارية'],
 // إدارة الشؤون التجارية والتحصيلات
 ['ca','gm','إدارة الشؤون التجارية والتحصيلات'],
 ['ca-acc','ca','منسق حسابات الزبائن م'],
 ['ca-acc-big','ca-acc','قسم كبار المستهلكين م'],
 ['ca-acc-debt','ca-acc','قسم متابعة الديون م'],
 ['ca-acc-ctr','ca-acc','قسم العقود التجارية م'],
 ['ca-acc-mkt','ca-acc','قسم التسويق م'],
 ['ca-cr','ca','منسق الائتمان والتحصيلات م'],
 ['ca-cr-cr','ca-cr','قسم الائتمان م'],
 ['ca-cr-col','ca-cr','قسم التحصيلات م'],
 // إدارة المبيعات غ.ج
 ['w','gm','إدارة المبيعات غ.ج'],
 ['w-svc','w','قسم خدمات المحطات والزبائن غ.ج'],
 ['w-fol','w','قسم المتابعة غ.ج'],
 ['w-dat','w','قسم البيانات والتقارير غ.ج'],
 ['w-dat-d','w-dat','مشرف وحدة البيانات غ.ج'],
 ['w-dat-r','w-dat','مشرف وحدة التقارير غ.ج'],
 ['w-st','w','منسق المحطات غ.ج'],
 ['w-st-tr','w-st','قسم مبيعات طرابلس'],
 ['w-st-tr-s','w-st-tr','وحدة مبيعات المحطات طرابلس'],
 ['w-st-tr-o','w-st-tr','وحدة طلبات محطات طرابلس'],
 ['w-st-tr-f','w-st-tr','وحدة متابعة محطات طرابلس','u'],
 ['w-st-ev','w-st','قسم تقييم وقبول المحطات غ.ج'],
 ['w-st-ev-u','w-st-ev','وحدة تقييم المحطات غ.ج'],
 ['w-st-jb','w-st','مكتب محطات الجبل الغربي'],
 ['w-st-jb-i','w-st-jb','وحدة التفتيش الجبل الغربي'],
 ['w-st-jb-s','w-st-jb','وحدة مبيعات الجبل الغربي'],
 ['w-st-jb-p','w-st-jb','وحدة متابعة نقاط الجبل الغربي'],
 ['w-dc','w','منسق مبيعات شركات التوزيع غ.ج','u'],
 ['w-dc-po','w-dc','قسم متابعة وإدارة أوامر الشراء غ.ج','u'],
 ['w-dc-qt','w-dc','قسم حساب الكميات والمطابقة مع الشركات غ.ج','u'],
 ['w-av','w','منسق مبيعات الطيران والسفن غ.ج','u'],
 ['w-av-jf','w-av','قسم مبيعات وقود الطيران غ.ج','u'],
 ['w-av-jf-1','w-av-jf','وحدة مبيعات طيران معيتيقة، زوارة'],
 ['w-av-jf-2','w-av-jf','وحدة مبيعات طيران طرابلس، الزنتان، غدامس'],
 ['w-av-mr','w-av','قسم المبيعات ووقود السفن غ.ج'],
 ['w-av-mr-1','w-av-mr','وحدة مبيعات السفن طرابلس'],
 ['w-pc','w','منسق مبيعات القطاع العام والمستهلكين غ.ج','u'],
 ['w-pc-con','w-pc','قسم مبيعات المستهلكين غ.ج','u'],
 ['w-pc-con-bk','w-pc-con','وحدة مبيعات المخابز غ.ج'],
 ['w-pc-pub','w-pc','قسم مبيعات القطاع العام غ.ج','u'],
 ['w-pc-oil','w-pc','وحدة مبيعات الزيوت والشحوم غ.ج','u'],
 ['w-pc-cash','w-pc','قسم المبيعات النقدية غ.ج'],
 ['w-ord','w','قسم الطلبات غ.ج','u'],
 ['w-ord-tr','w-ord','وحدة طلبات مستودعات طرابلس','u'],
 // إدارة المبيعات و.ش
 ['e','gm','إدارة المبيعات و.ش'],
 ['e-fol','e','قسم المتابعة و.ش'],
 ['e-dat','e','قسم البيانات والتقارير و.ش'],
 ['e-po','e','قسم متابعة وإدارة أوامر الشراء و.ش'],
 ['e-qt','e','قسم حساب الكميات والمطابقة مع الشركات و.ش','u'],
 ['e-st','e','منسق المحطات و.ش'],
 ['e-st-ev','e-st','قسم تقييم وقبول المحطات و.ش'],
 ['e-st-ev-u','e-st-ev','وحدة تقييم المحطات و.ش','u'],
 ['e-st-bn','e-st','قسم مبيعات بنغازي'],
 ['e-st-bn-s','e-st-bn','وحدة مبيعات المحطات بنغازي'],
 ['e-st-bn-o','e-st-bn','وحدة الطلبات بنغازي'],
 ['e-st-bn-p','e-st-bn','وحدة القطاع العام والمستهلكين بنغازي'],
 ['e-st-bn-g','e-st-bn','وحدة موزعي الغاز بنغازي'],
 ['e-st-dr','e-st','مكتب محطات درنه'],
 ['e-st-dr-i','e-st-dr','وحدة التفتيش درنه'],
 ['e-st-dr-s','e-st-dr','وحدة مبيعات درنه','u'],
 ['e-st-dr-p','e-st-dr','وحدة متابعة نقاط درنه'],
 ['e-st-bd','e-st','مكتب محطات البيضاء','v'],
 ['e-st-bd-i','e-st-bd','وحدة التفتيش البيضاء','v'],
 ['e-st-bd-s','e-st-bd','وحدة مبيعات البيضاء','v'],
 ['e-st-bd-p','e-st-bd','وحدة متابعة نقاط البيضاء','v'],
 ['e-st-aj','e-st','مكتب محطات اجدابيا'],
 ['e-st-aj-i','e-st-aj','وحدة التفتيش اجدابيا','v'],
 ['e-st-aj-s','e-st-aj','وحدة مبيعات اجدابيا'],
 ['e-st-aj-p','e-st-aj','وحدة متابعة نقاط اجدابيا','v'],
 ['e-st-mj','e-st','مكتب محطات المرج'],
 ['e-st-mj-i','e-st-mj','وحدة التفتيش المرج'],
 ['e-st-mj-s','e-st-mj','وحدة مبيعات المرج'],
 ['e-st-mj-p','e-st-mj','وحدة متابعة نقاط المرج'],
 ['e-st-sj','e-st','مكتب محطات سرت الجفرة'],
 ['e-st-sj-i','e-st-sj','وحدة التفتيش سرت الجفرة'],
 ['e-st-sj-s','e-st-sj','وحدة مبيعات سرت الجفرة','u'],
 ['e-st-sj-p','e-st-sj','وحدة متابعة نقاط سرت الجفرة','u'],
 ['e-av','e','منسق مبيعات الطيران والسفن و.ش','u'],
 ['e-av-jf','e-av','قسم مبيعات وقود الطيران و.ش'],
 ['e-av-mr','e-av','قسم مبيعات وقود السفن و.ش'],
 ['e-dc','e','منسق مبيعات شركات التوزيع و.ش'],
 ['e-pc','e','منسق مبيعات القطاع العام والمستهلكين و.ش'],
 ['e-pc-pub','e-pc','قسم مبيعات القطاع العام و.ش'],
 ['e-pc-con','e-pc','قسم مبيعات المستهلكين و.ش','v'],
 ['e-pc-oil','e-pc','وحدة مبيعات الزيوت والشحوم و.ش'],
 ['e-ord','e','قسم الطلبات و.ش'],
 ['e-ord-x','e-ord','وحدة الطلبات المنفذ و.ش','u']];
const ORG_TYPES=[
 {k:'board',re:/^عضو مجلس/,l:'مجلس الإدارة',p:'p-fl'},
 {k:'gm',re:/^الإدارة العامة/,l:'إدارة عامة',p:'p-fl'},
 {k:'dept',re:/^إدارة/,l:'إدارة',p:'p-info'},
 {k:'coord',re:/^منسق/,l:'منسق',p:'p-ok'},
 {k:'office',re:/^مكتب/,l:'مكتب',p:'p-warn'},
 {k:'section',re:/^قسم/,l:'قسم',p:'p-neutral'},
 {k:'super',re:/^مشرف/,l:'مشرف',p:'p-neutral'},
 {k:'unit',re:/^وحدة/,l:'وحدة',p:'p-neutral'}];
const ORG=ORG_ROWS.map(([id,parent,title,fl=''])=>({id,parent,title,head:'',empNo:'',type:(ORG_TYPES.find(t=>t.re.test(title))||ORG_TYPES[7]).k,vacant:fl.includes('v'),uncertain:fl.includes('u')}));
const ORG_BY=new Map(ORG.map(o=>[o.id,o]));
/* شاغل الوظيفة كما ورد في بطاقة الوصف الوظيفي، بمفتاح معرّف الجهة: يُملأ من config/orgPeople بعد الدخول */
const ORG_HOLDER={};
const orgKids=id=>ORG.filter(o=>o.parent===id);
/* صلاحيات كل جهة: { [معرّف الجهة]: [...] } — تُملأ عند وصول بيانات الصلاحيات */
const ORG_PERMS={};
/* صفة المسؤول عند ورودها في كتاب التكليف */
const ORG_ROLE={'gm':'مكلف بمهام مدير عام المبيعات والشؤون التجارية'};
/* مهام كل جهة: صفحات المنظومة التي تتولاها، بمفتاح معرّف الجهة */
const ORG_TASKS={'gm-rep':['contracts','ext','needs','batches','dir']};
/* اختصاصات الإدارات كما وردت في قرار مجلس الإدارة رقم (160) لسنة 2026م (إحالة مكتب شؤون مجلس الإدارة رقم 265) */
const ORG_DECREE={no:'160',year:'2026',date:'2026-08-03',eff:'2026-08-01',ref:'265',title:'بشأن استحداث الإدارة العامة للمبيعات والشؤون التجارية',
 arts:[['المادة (1)','يُستحدث بموجب هذا القرار إنشاء إدارة عامة جديدة تسمى الإدارة العامة للمبيعات والشؤون التجارية.'],
  ['المادة (2)','يتكون الهيكل التنظيمي للإدارة الجديدة من: إدارة المبيعات غ.ج، وإدارة المبيعات و.ش، وإدارة الشؤون التجارية والتحصيلات.'],
  ['المادة (3)','تتولى الإدارة العامة للمبيعات والشؤون التجارية المستحدثة القيام بالمهام والاختصاصات المبيّنة لها ولإداراتها.'],
  ['المادة (4)','يُنقل العاملون بإدارتي المبيعات غ.ج و و.ش والعاملون بإدارة الشؤون التجارية والتحصيلات بالإدارة العامة للشؤون التجارية السابقة إلى الإدارة العامة للمبيعات والشؤون التجارية وفقًا لهذا القرار.'],
  ['المادة (5)','تتولى الإدارة العامة للموارد البشرية اتخاذ الإجراءات اللازمة لوضع هذا القرار موضع التنفيذ.'],
  ['المادة (6)','يُعمل بهذا القرار اعتبارًا من 2026/08/01 وعلى الإدارات ذات العلاقة تنفيذه.']]};
const ORG_SALES_DUTIES=[
 ['التخطيط','تنفيذ سياسات وخطط البيع المعتمدة بالشركة.'],
 ['الزبائن','استلام ودراسة طلبات الزبائن ومحطات الوقود والجهات العامة والخاصة، واستكمال إجراءات البيع وفقًا للنظم المعمول بها.'],
 ['التوزيع والإمداد','متابعة انسياب توزيع المحروقات والغاز والمنتجات النفطية إلى شركات التوزيع ومحطات الوقود بالمناطق الخاضعة لإشرافها، بالتنسيق مع إدارات المناطق.'],
 ['المالية والتحصيل','متابعة أرصدة الزبائن والمبيعات الآجلة بالتنسيق مع إدارة الشؤون التجارية والتحصيلات.'],
 ['البيانات','حصر وتوثيق بيانات الزبائن ومحطات الوقود العاملة وتحديثها بصفة دورية.'],
 ['التخطيط','رصد احتياجات المناطق والزبائن وكبار المستهلكين من المنتجات النفطية، واقتراح البرامج التنفيذية.'],
 ['الشكاوى','معالجة شكاوى الزبائن والمشاكل التشغيلية في نطاقها، ورفع ما يتجاوز صلاحياتها إلى الإدارة العامة.'],
 ['التقارير','إعداد تقارير المبيعات الشهرية والدورية عن نشاط الإدارة ورفعها إلى الإدارة العامة للمبيعات والشؤون التجارية.'],
 ['مهام أخرى','أية مهام أخرى تكلف بها من الإدارة العامة في نطاق اختصاصها.']];
const ORG_DUTIES={
 gm:{lead:'تتولى الإدارة العامة للمبيعات والشؤون التجارية الإشراف العام على نشاط المبيعات والشؤون التجارية على مستوى الشركة، وتختص بما يلي:',items:[
  ['السياسات','رسم السياسات العامة للمبيعات وتسويق المنتجات النفطية والغاز والزيوت، والإشراف على تنفيذها بعد اعتمادها من مجلس الإدارة.'],
  ['الإشراف','الإشراف الفني والإداري على الإدارات والمكاتب التابعة لها، وتنسيق العمل فيما بينها، وتوزيع الاختصاصات بما يضمن تسيير العمل بمرافقها بصورة منتظمة.'],
  ['التخطيط','إعداد الخطط والبرامج التقديرية لاحتياجات المناطق من المحروقات والمنتجات النفطية بالتنسيق مع الإدارات المختصة، ومتابعة تنفيذها.'],
  ['التوزيع والإمداد','متابعة انتظام عمليات التوزيع والإمداد لكافة الزبائن، ومعالجة الاختناقات والصعوبات التي تعترض سير العمل.'],
  ['العقود','اعتماد ومتابعة العقود والاتفاقيات التجارية المبرمة مع الزبائن والموزعين والجهات العامة، بالتنسيق مع الإدارات ذات العلاقة.'],
  ['المالية والتحصيل','متابعة الموقف المالي للمبيعات الآجلة والمديونيات والتحصيلات، واتخاذ الإجراءات اللازمة بشأنها بالتنسيق مع الإدارة العامة للشؤون المالية.'],
  ['التطوير والرقمنة','اقتراح تطوير منظومات العمل وإجراءات البيع والتوزيع، والعمل على رقمنة العمليات التجارية.'],
  ['التقارير','إعداد التقارير الدورية والسنوية عن نشاط المبيعات والشؤون التجارية ورفعها إلى مجلس الإدارة.']]},
 w:{lead:'مهام إدارة المبيعات غ.ج، وتتولى القيام بما يلي:',items:ORG_SALES_DUTIES},
 e:{lead:'مهام إدارة المبيعات و.ش، وتتولى القيام بما يلي:',items:ORG_SALES_DUTIES},
 ca:{lead:'إدارة الشؤون التجارية والتحصيلات، وتختص بالآتي:',items:[
  ['العقود','متابعة العقود والاتفاقيات التجارية المبرمة مع الزبائن والموزعين، والتحقق من الالتزام ببنودها ومدد سريانها، والتنبيه إلى مواعيد تجديدها.'],
  ['الضمانات','متابعة الضمانات المصرفية وخطابات الاعتماد المقدمة من الزبائن، والتحقق من صلاحيتها وكفايتها بالتنسيق مع الإدارة العامة للشؤون المالية.'],
  ['المالية والتحصيل','حصر ومتابعة المديونيات والمبيعات الآجلة على مستوى إدارتي المبيعات، وإعداد كشوفات دورية بالمواقف والتحصيلات.'],
  ['المالية والتحصيل','التنسيق مع الإدارة العامة للشؤون المالية بشأن التسويات المالية والمطابقات الدورية لأرصدة الزبائن.'],
  ['المالية والتحصيل','اقتراح الإجراءات اللازمة حيال الزبائن المتأخرين عن السداد، وإعداد المذكرات اللازمة بشأنها.'],
  ['التقارير','إعداد تقرير دوري شامل عن الموقف التجاري والتحصيلات ورفعه إلى مدير عام الإدارة.']]}};
const ORG_DUTY_ORDER=['gm','w','e','ca'];
function viewOrgDuties(el){
  const sel=ORG_DUTIES[S.ui.od]?S.ui.od:'',q=norm(S.ui.odq2||''),D0=ORG_DECREE;
  const ids=sel?[sel]:ORG_DUTY_ORDER,tot=ORG_DUTY_ORDER.reduce((n,id)=>n+ORG_DUTIES[id].items.length,0);
  let hits=0;
  const secs=ids.map(id=>{const o=ORG_BY.get(id),d=ORG_DUTIES[id],t=ORG_TYPES.find(x=>x.k===o.type)||{};
    const items=d.items.map((x,i)=>({tag:x[0],txt:x[1],n:i+1})).filter(x=>!q||norm(x.tag+' '+x.txt).includes(q));hits+=items.length;if(q&&!items.length)return '';
    const tags=uniq(d.items.map(x=>x[0]));
    return `<section class="od-sec t-${o.type}" id="od-${id}">
     <header class="od-h"><div class="od-hm"><span class="od-type">${esc(t.l||'')}</span><h3>${esc(o.title)}</h3>
      <p>${o.vacant?'شاغرة':`<b>${esc(o.head)}</b>${ORG_ROLE[id]?` · ${esc(ORG_ROLE[id])}`:''}`}</p></div>
      <div class="od-stats"><span><b class="num">${d.items.length}</b>مهام</span><span><b class="num">${orgAll(id).length}</b>جهة تابعة</span><span><b class="num">${tags.length}</b>مجال عمل</span><span class="go" data-od-dash="${id}" role="button" tabindex="0" data-tip="${esc('فتح سجل الإدارة')}"><b class="num">${(S.records||[]).filter(x=>x.unit===id).length}</b>سجل</span></div>
      <div class="od-acts"><button class="btn sm" data-od-dash="${id}">لوحة المؤشرات</button><button class="btn sm ghost" data-org-focus="${id}">عرض في المخطط</button></div></header>
     <p class="od-lead">${esc(d.lead)}</p>
     <ol class="od-list">${items.map(x=>`<li><span class="od-n num">${x.n}</span><div><span class="od-tag">${esc(x.tag)}</span><p>${esc(x.txt)}</p></div></li>`).join('')}</ol>
    </section>`}).join('');
  const other=orgKids('gm').filter(o=>!ORG_DUTIES[o.id]);
  el.innerHTML=`<div class="od-decree">
    <div class="od-seal">${I.org||''}</div>
    <div class="od-dm"><span class="od-eyebrow">قرار مجلس الإدارة</span><h3>القرار رقم (${D0.no}) لسنة ${D0.year}م</h3><p>${esc(D0.title)}</p>
     <div class="od-meta"><span>تاريخ القرار <b class="num">${fd(D0.date)}</b></span><span>نافذ اعتبارًا من <b class="num">${fd(D0.eff)}</b></span><span>إحالة مكتب شؤون مجلس الإدارة رقم <b class="num">${D0.ref}</b></span></div></div>
    <div class="od-big"><b class="num">${tot}</b><span>مهمة واختصاصًا</span><small>لـ ${ORG_DUTY_ORDER.length} جهات</small></div>
   </div>
   <details class="od-arts"><summary>مواد القرار <small>${D0.arts.length} مواد</small></summary><ol>${D0.arts.map(a=>`<li><b>${esc(a[0])}</b><span>${esc(a[1])}</span></li>`).join('')}</ol></details>
   <div class="od-bar"><div class="ocd-scopes" style="margin:0"><button data-od="" aria-pressed="${!sel}">كل الجهات</button>${ORG_DUTY_ORDER.map(id=>`<button data-od="${id}" aria-pressed="${sel===id}">${esc(ORG_BY.get(id).title)} <span class="num">${ORG_DUTIES[id].items.length}</span></button>`).join('')}</div>
    <div class="grow od-search">${I.search}<input type="search" id="od-q" value="${esc(S.ui.odq2||'')}" placeholder="بحث في المهام والاختصاصات…" aria-label="بحث في المهام"></div></div>
   ${q?`<div class="count-line">${hits} نتيجة</div>`:''}
   ${secs||`<div class="empty"><b>لا نتائج</b>جرّب كلمة أخرى.</div>`}
   ${!sel&&!q&&other.length?`<section class="od-note"><h4>جهات تابعة للإدارة العامة لم يحدد القرار اختصاصاتها</h4><ul>${other.map(o=>{const tk=(ORG_TASKS[o.id]||[]).map(v=>VIEWS.find(x=>x.id===v)).filter(Boolean);return `<li><b>${esc(o.title)}</b> <span class="muted">${o.vacant?'شاغرة':esc(o.head)}</span>${tk.length?`<span class="od-tk">مهامها في المنظومة: ${tk.map(v=>`<button type="button" data-org-go="${v.id}">${esc(v.label)}</button>`).join('')}</span>`:''}</li>`}).join('')}</ul></section>`:''}`;
  const qi=el.querySelector('#od-q');qi.addEventListener('input',debounce(()=>{S.ui.odq2=qi.value;const p=qi.selectionStart;viewOrgDuties(el);const n=el.querySelector('#od-q');n.focus();try{n.setSelectionRange(p,p)}catch(e){}},200));
}
/* تصدير الهيكل التنظيمي والمهام والاختصاصات بصيغة PDF (عبر طباعة المتصفح: حفظ كـ PDF) */
function orgPdfHtml(){
  const en=!!(window.I18N&&I18N.lang==='en'),T=s=>en?I18N.t(s):s,D0=ORG_DECREE,logo=(document.querySelector('.side img, header img, .lg-card img')||{}).src||'';
  const typeL=o=>T((ORG_TYPES.find(x=>x.k===o.type)||{}).l||'');
  const h=s=>esc(s);
  const head=o=>o.vacant?`<i class="vac">${T('شاغرة')}</i>`:h(o.head)+(ORG_ROLE[o.id]?`<br><small>${h(T(ORG_ROLE[o.id]))}</small>`:'');
  const tree=(id,d)=>orgKids(id).map(o=>`<tr><td class="lv${Math.min(d,4)}"><span class="dot t-${o.type}"></span>${h(o.title)}</td><td>${typeL(o)}</td><td>${head(o)}</td><td class="n">${h(o.empNo||'—')}</td><td class="n">${orgAll(o.id).length||'—'}</td></tr>`+tree(o.id,d+1)).join('');
  const units=[ORG_BY.get('gm'),...orgAll('gm')],vac=units.filter(o=>o.vacant).length;
  const duties=ORG_DUTY_ORDER.map(id=>{const o=ORG_BY.get(id),d=ORG_DUTIES[id];return `<section class="du t-${o.type}"><h3><span class="dot t-${o.type}"></span>${h(o.title)} <small>${typeL(o)} · ${o.vacant?T('شاغرة'):h(o.head)}${ORG_ROLE[id]?' · '+h(T(ORG_ROLE[id])):''}</small></h3><p class="lead">${h(T(d.lead))}</p>
   <ol>${d.items.map(x=>`<li><b>${h(T(x[0]))}</b><span>${h(T(x[1]))}</span></li>`).join('')}</ol></section>`}).join('');
  const other=orgKids('gm').filter(o=>!ORG_DUTIES[o.id]);
  return `<!doctype html><html lang="${en?'en':'ar'}" dir="${en?'ltr':'rtl'}"><head><meta charset="utf-8"><title>${h(T('الهيكل التنظيمي والمهام والاختصاصات'))} — ${fd(TODAY_ISO)}</title>
<style>
@page{size:A4;margin:14mm 12mm 16mm}
*{box-sizing:border-box}body{font-family:Arial,Arimo,"Noto Sans Arabic",Tahoma,sans-serif;font-weight:700;color:#0e2240;margin:0;font-size:11.5px;line-height:1.7;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.cover{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;min-height:250mm;border:1px solid #d8e0eb;border-radius:12px;padding:30px;background:linear-gradient(180deg,#f6f8fc,#fff);break-after:page}
.cover img{width:120px;height:auto;margin-bottom:18px}.cover .eyebrow{color:#0063ad;font-size:13px;letter-spacing:.02em}.cover h1{font-size:26px;margin:6px 0 2px;color:#0b3168;line-height:1.4}.cover h2{font-size:16px;margin:0 0 16px;color:#55677f;font-weight:700}
.cover .box{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;width:100%;max-width:520px;margin:12px 0 20px}.cover .box div{border:1px solid #d8e0eb;border-radius:10px;padding:10px;background:#fff}.cover .box b{display:block;font-size:24px;color:#0063ad}.cover .box span{font-size:11px;color:#55677f}
.cover .dec{border-top:1px dashed #d8e0eb;padding-top:14px;color:#55677f;font-size:12px;max-width:560px}.cover .dec b{color:#0e2240}
.cover .ft{margin-top:auto;color:#93aac6;font-size:10.5px}
h2.sec{font-size:17px;color:#0b3168;margin:0 0 4px;padding-bottom:6px;border-bottom:3px solid #0063ad;display:flex;align-items:baseline;gap:10px}h2.sec small{color:#55677f;font-size:11px;font-weight:700}
p.sub{margin:4px 0 12px;color:#55677f}
table{width:100%;border-collapse:collapse;font-size:11px}th{background:#0b3168;color:#fff;padding:7px 8px;text-align:start;font-size:11px}td{padding:6px 8px;border-bottom:1px solid #e7ecf4;vertical-align:top}tr{break-inside:avoid}tbody tr:nth-child(even) td{background:#f6f8fc}
td.n{font-variant-numeric:tabular-nums;white-space:nowrap}td small{color:#55677f;font-size:10px}i.vac{color:#a86a0c;font-style:normal}
.lv1{padding-inline-start:8px}.lv2{padding-inline-start:30px}.lv3{padding-inline-start:52px}.lv4{padding-inline-start:74px}
.dot{display:inline-block;width:9px;height:9px;border-radius:3px;margin-inline-end:6px;vertical-align:middle;background:#667585}
.t-gm .dot,.dot.t-gm{background:#0b3168}.dot.t-dept{background:#0063ad}.dot.t-coord{background:#1d7a4c}.dot.t-office{background:#a86a0c}.dot.t-section{background:#3a55c4}
.legend{display:flex;flex-wrap:wrap;gap:6px 16px;margin:8px 0 0;font-size:10.5px;color:#55677f}
.arts{margin:0 0 14px;padding:0;list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:8px}.arts li{border:1px solid #d8e0eb;border-radius:8px;padding:8px 10px;font-size:10.5px;break-inside:avoid}.arts b{display:block;color:#0063ad;margin-bottom:2px}
.du{break-inside:avoid-page;margin:14px 0 0;border:1px solid #d8e0eb;border-radius:10px;overflow:hidden}
.du h3{margin:0;padding:9px 12px;background:#f3f5f9;font-size:14px;color:#0b3168;border-bottom:1px solid #d8e0eb}.du h3 small{font-weight:700;color:#55677f;font-size:10.5px;margin-inline-start:6px}
.du .lead{margin:0;padding:8px 12px 0;color:#55677f;font-size:11px}
.du ol{margin:0;padding:8px 12px 10px;list-style:none;counter-reset:d}.du li{display:grid;grid-template-columns:22px 110px 1fr;gap:8px;padding:5px 0;border-top:1px dashed #e7ecf4;counter-increment:d;break-inside:avoid}.du li:first-child{border-top:0}
.du li::before{content:counter(d);width:20px;height:20px;border-radius:6px;background:#e1edf9;color:#0063ad;display:grid;place-items:center;font-size:10.5px}.du li b{color:#55677f;font-size:10.5px}
.note{margin-top:14px;border:1px dashed #d8e0eb;border-radius:10px;padding:10px 12px;font-size:11px;color:#55677f}.note b{color:#0e2240}
.pg{break-before:page}
</style></head><body>
<section class="cover">${logo?`<img src="${logo}" alt="">`:''}
 <div class="eyebrow">${h(T('شركة البريقة لتسويق النفط'))}</div>
 <h1>${h(T('الإدارة العامة للمبيعات والشؤون التجارية'))}</h1>
 <h2>${h(T('الهيكل التنظيمي والمهام والاختصاصات'))}</h2>
 <div class="box"><div><b>${units.length}</b><span>${h(T('جهة في الهيكل'))}</span></div><div><b>${orgKids('gm').length}</b><span>${h(T('جهات رئيسية'))}</span></div><div><b>${ORG_DUTY_ORDER.reduce((n,id)=>n+ORG_DUTIES[id].items.length,0)}</b><span>${h(T('مهمة واختصاصًا'))}</span></div></div>
 <div class="dec">${h(T('المرجع'))}: <b>${h(T(`قرار مجلس الإدارة رقم (${D0.no}) لسنة ${D0.year}م`))}</b> — ${h(T(D0.title))}<br>${h(T('تاريخ القرار'))} <b>${fd(D0.date)}</b> · ${h(T('نافذ اعتبارًا من'))} <b>${fd(D0.eff)}</b> · ${h(T('إحالة مكتب شؤون مجلس الإدارة رقم'))} <b>${D0.ref}</b></div>
 <div class="ft">${h(T('صادر من منظومة الإدارة العامة للمبيعات والشؤون التجارية'))} · ${fd(TODAY_ISO)}</div>
</section>
<h2 class="sec">${h(T('الهيكل التنظيمي'))} <small>${units.length} ${h(T('جهة'))} · ${vac} ${h(T('شاغرة'))}</small></h2>
<p class="sub">${h(T('الإدارة العامة للمبيعات والشؤون التجارية وإداراتها وأقسامها ووحداتها، كما وردت في الهيكل المعتمد.'))}</p>
<table><thead><tr><th>${h(T('الجهة'))}</th><th>${h(T('النوع'))}</th><th>${h(T('المسؤول'))}</th><th>${h(T('الرقم الوظيفي'))}</th><th>${h(T('جهات تابعة'))}</th></tr></thead><tbody>
${(()=>{const b=ORG_BY.get('board');return `<tr><td><span class="dot t-gm"></span>${h(b.title)}</td><td>${typeL(b)}</td><td>${head(b)}</td><td class="n">${h(b.empNo||'—')}</td><td class="n">${orgAll(b.id).length}</td></tr>`})()}${tree('board',1)}</tbody></table>
<div class="legend">${ORG_TYPES.filter(x=>x.k!=='board'&&x.k!=='super').map(x=>`<span><span class="dot t-${x.k}"></span>${h(T(x.l))}</span>`).join('')}<span><i class="vac">${h(T('شاغرة'))}</i> = ${h(T('منصب شاغر'))}</span></div>
<h2 class="sec pg">${h(T('المهام والاختصاصات'))} <small>${h(T(`قرار مجلس الإدارة رقم (${D0.no}) لسنة ${D0.year}م`))}</small></h2>
<p class="sub">${h(T('مواد القرار'))}</p>
<ol class="arts">${D0.arts.map(a=>`<li><b>${h(T(a[0]))}</b>${h(T(a[1]))}</li>`).join('')}</ol>
${duties}
${other.length?`<div class="note"><b>${h(T('جهات تابعة للإدارة العامة لم يحدد القرار اختصاصاتها'))}:</b> ${other.map(o=>h(o.title)+' ('+(o.vacant?T('شاغرة'):h(o.head))+')').join(' · ')}</div>`:''}
</body></html>`}
function orgPdf(){const w=window.open('','_blank');if(!w){toast(window.I18N?I18N.t('اسمح بفتح النوافذ المنبثقة لتصدير PDF'):'اسمح بفتح النوافذ المنبثقة لتصدير PDF');return}
  w.document.open();w.document.write(orgPdfHtml());w.document.close();
  const run=()=>{try{w.focus();w.print()}catch(e){}};if(w.document.readyState==='complete')setTimeout(run,300);else w.addEventListener('load',()=>setTimeout(run,300));
  toast(window.I18N?I18N.t('اختر «حفظ كـ PDF» في نافذة الطباعة'):'اختر «حفظ كـ PDF» في نافذة الطباعة')}
/* ============ سجلات الإدارات: إضافة وحذف وإرفاق وتصدير، كلٌّ في نطاق مهامه ============ */
const REC_TYPES=['مراسلة','تقرير','عقد / اتفاقية','كشف','محضر','مذكرة','ضمان مصرفي','أخرى'];
const REC_ST=['جارٍ','منجز','مؤجل'];const REC_STC={'جارٍ':'p-info','منجز':'p-ok','مؤجل':'p-warn'};
const REC_UNITS=['gm','w','e','ca','gm-rep','gm-fo'];
let REC_UNIT=null;
async function recMyUnit(){if(REC_UNIT!=null)return REC_UNIT;const me=window.__me&&window.__me();if(!me||!window.__fs){REC_UNIT='';return ''}
  if(typeof M!=='undefined'&&M.unit!==undefined&&M.loaded){REC_UNIT=M.unit||'';return REC_UNIT}
  try{const r=await window.__fs().collection('roles').doc(me.email).get();REC_UNIT=(r.exists&&r.data().unit)||''}catch(e){REC_UNIT=''}return REC_UNIT}
function recCan(unit){const me=window.__me&&window.__me();if(!me)return S.canWrite;if(me.role==='admin')return true;if(!S.canWrite||me.role==='viewer')return false;const u=REC_UNIT||'';return u===unit||u==='gm'}
function recDuties(unit){const d=ORG_DUTIES[unit];if(d)return d.items.map((x,i)=>({n:i+1,l:x[0]+' — '+x[1].slice(0,70)+(x[1].length>70?'…':''),full:x[1],tag:x[0]}));
  const tk=(ORG_TASKS[unit]||[]).map(v=>VIEWS.find(x=>x.id===v)).filter(Boolean);return tk.map((v,i)=>({n:i+1,l:v.label,full:v.label,tag:v.label}))}
function recUI(){return S.ui.rc||(S.ui.rc={q:'',duty:'',st:'',type:''})}
function recRows(unit){const u=recUI(),q=norm(u.q);let r=(S.records||[]).filter(x=>x.unit===unit);
  if(u.duty)r=r.filter(x=>String(x.duty||'')===u.duty);if(u.st)r=r.filter(x=>x.status===u.st);if(u.type)r=r.filter(x=>x.type===u.type);
  if(q)r=r.filter(x=>norm([x.title,x.ref,x.notes,x.type,(x.attachments||[]).map(a=>a.name).join(' ')].join(' ')).includes(q));
  return r.sort((a,b)=>(b.date||'').localeCompare(a.date||'')||(b.createdAt||'').localeCompare(a.createdAt||''))}
function recDutyLabel(unit,n){const d=recDuties(unit).find(x=>String(x.n)===String(n));return d?d.tag:''}
function recPanel(unit){const o=ORG_BY.get(unit);if(!o)return '';const all=(S.records||[]).filter(x=>x.unit===unit),u=recUI(),duties=recDuties(unit),can=recCan(unit);
  const open=all.filter(x=>x.status!=='منجز').length,files=all.reduce((n,x)=>n+(x.attachments||[]).length,0);
  return `<section class="panel ocd-wide rec" id="rec-panel" data-unit="${unit}"><div class="rec-head"><div><h3 class="section-title">سجل الإدارة <small>إضافة وحذف وإرفاق وتصدير، كلٌّ في نطاق مهامه</small></h3>
    <div class="rec-stats"><span><b class="num">${all.length}</b> سجل</span><span><b class="num">${open}</b> جارٍ</span><span><b class="num">${files}</b> مرفق</span>${can?'':'<span class="pill p-neutral">اطلاع فقط</span>'}</div></div>
   <div class="toolbar">${can?`<button class="btn primary sm" data-act="rec-new" data-unit="${unit}">${I.plus}إضافة سجل</button>`:''}<button class="btn sm" data-act="rec-export" data-unit="${unit}">${I.down}تصدير Excel</button><button class="btn sm" data-act="rec-pdf" data-unit="${unit}">${I.down}تصدير PDF</button></div></div>
   <div class="toolbar rec-filters"><div class="grow">${I.search}<input type="search" id="rc-q" value="${esc(u.q)}" placeholder="بحث في السجلات والمرفقات…"></div>
    <select id="rc-duty"><option value="">كل المهام</option>${duties.map(d=>`<option value="${d.n}" ${u.duty===String(d.n)?'selected':''}>${d.n}. ${esc(d.tag)}</option>`).join('')}</select>
    <select id="rc-type"><option value="">كل الأنواع</option>${REC_TYPES.map(t=>`<option ${u.type===t?'selected':''}>${t}</option>`).join('')}</select>
    <select id="rc-st"><option value="">كل الحالات</option>${REC_ST.map(t=>`<option ${u.st===t?'selected':''}>${t}</option>`).join('')}</select></div>
   <div id="rec-table"></div></section>`}
function renderRecTable(unit){const el=document.getElementById('rec-table');if(!el)return;const r=recRows(unit),can=recCan(unit),duties=recDuties(unit);
  const att=l=>window.ATT&&ATT.view?ATT.view(l,{compact:1}):l.map(a=>`<span class="tag">${esc(a.name)}</span>`).join(' ');
  el.innerHTML=r.length?`<div class="count-line">${r.length} سجل</div><div class="tablewrap rec-tw"><table><thead><tr><th class="nosort">التاريخ</th><th class="nosort">الموضوع</th><th class="nosort">المهمة</th><th class="nosort">النوع</th><th class="nosort">الإشارة</th><th class="nosort">المرفقات</th><th class="nosort">الحالة</th><th class="nosort">بواسطة</th>${can?'<th class="nosort"></th>':''}</tr></thead><tbody>
   ${r.map(x=>{const d=duties.find(y=>String(y.n)===String(x.duty));return `<tr data-rec="${x.id}"><td class="n">${fd(x.date)}</td><td class="t-strong wrap">${esc(x.title||'—')}${x.notes?`<small class="muted" style="display:block;font-weight:400">${esc(x.notes.slice(0,90))}${x.notes.length>90?'…':''}</small>`:''}</td><td>${d?`<span class="tag link" data-tip="${esc(d.full)}">${d.n}. ${esc(d.tag)}</span>`:'<span class="muted">—</span>'}</td><td>${esc(x.type||'—')}</td><td class="n">${esc(x.ref||'—')}</td><td class="rec-att">${(x.attachments||[]).length?att(x.attachments):'<span class="muted">—</span>'}</td><td><span class="pill ${REC_STC[x.status]||'p-neutral'}">${esc(x.status||'جارٍ')}</span>${x.hold?`<span class="pill p-crit" data-tip="${esc('حجز قانوني: '+(x.hold.reason||''))}" style="margin-inline-start:4px">🔒</span>`:''}${(x.history||[]).length?`<button type="button" class="btn sm ghost" data-rec-hist="${x.id}" title="تاريخ التعديلات" style="margin-inline-start:4px;padding:2px 6px">${(x.history||[]).length}✎</button>`:''}</td><td><small>${esc(x.by||'')}</small></td>${can?`<td class="rec-acts"><button class="btn sm ghost" data-act="rec-edit" data-id="${x.id}" data-unit="${unit}">تعديل</button><button class="btn sm ghost danger" data-act="rec-del" data-id="${x.id}" data-unit="${unit}">حذف</button></td>`:''}</tr>`}).join('')}</tbody></table></div>`
   :`<div class="empty"><b>${(S.records||[]).some(x=>x.unit===unit)?'لا توجد سجلات مطابقة':'لا توجد سجلات بعد'}</b>${can?'اضغط «إضافة سجل» لتسجيل مراسلة أو تقرير أو مرفق ضمن مهام هذه الإدارة.':'سيظهر هنا ما تسجله الإدارة ضمن مهامها.'}</div>`}
function recBind(unit){const p=document.getElementById('rec-panel');if(!p)return;recMyUnit().then(()=>{renderRecTable(unit);const h=p.querySelector('[data-act="rec-new"]');if(!h&&recCan(unit)){const tb=p.querySelector('.rec-head .toolbar');tb.insertAdjacentHTML('afterbegin',`<button class="btn primary sm" data-act="rec-new" data-unit="${unit}">${I.plus}إضافة سجل</button>`);const ro=p.querySelector('.rec-stats .pill');if(ro)ro.remove()}});
  const u=recUI();const q=p.querySelector('#rc-q');q.addEventListener('input',debounce(()=>{u.q=q.value;renderRecTable(unit)},150));
  ['duty','type','st'].forEach(k=>p.querySelector('#rc-'+k).addEventListener('change',e=>{u[k]=e.target.value;renderRecTable(unit)}))}
function recForm(unit,rec){const isNew=!rec;const o=ORG_BY.get(unit);rec=rec||{date:TODAY_ISO,status:'جارٍ',type:'مراسلة',duty:recUI().duty||''};const duties=recDuties(unit);
  const attField=window.ATT&&ATT.formField?ATT.formField('dlg',rec.attachments||[],{name:rec.title||o.title,scope:{k:'units',u:[unit,'gm','board']}}):`<div class="field full"><label>المرفقات</label><span class="hint">ميزة إرفاق الملفات والمسح الضوئي قيد التفعيل؛ أعد تحميل الصفحة لاحقًا.</span></div>`;
  modal(isNew?'إضافة سجل — '+o.title:'تعديل السجل',`<fieldset><legend>السجل</legend>
    <div class="field full"><label for="r-duty">المهمة / الاختصاص<span class="req">*</span></label><select id="r-duty"><option value="">— اختر المهمة التي يندرج تحتها السجل —</option>${duties.map(d=>`<option value="${d.n}" ${String(rec.duty)===String(d.n)?'selected':''}>${d.n}. ${esc(d.l)}</option>`).join('')}${duties.length?'':'<option value="0">عام</option>'}</select></div>
    ${F('r-title','الموضوع',rec.title,{req:1,full:1})}${F('r-type','النوع',rec.type,{type:'select',options:uniq([...REC_TYPES,rec.type])})}${F('r-date','التاريخ',rec.date,{type:'date',req:1})}
    ${F('r-ref','رقم الإشارة / المرجع',rec.ref)}${F('r-st','الحالة',rec.status,{type:'select',options:REC_ST})}${F('r-notes','ملاحظات',rec.notes,{type:'textarea',full:1})}</fieldset>
   <fieldset><legend>المرفقات</legend>${attField}${!isNew&&(window.__me&&window.__me()||{}).role==='admin'?`<div class="field full gv-hold"><label><input type="checkbox" id="r-hold" ${rec.hold?'checked':''}> حجز قانوني: يمنع حذف السجل حتى يرفع مدير النظام الحجز</label><input id="r-hold-reason" placeholder="سبب الحجز (قضية، تدقيق، مراجعة…)" value="${esc(rec.hold&&rec.hold.reason||'')}" maxlength="200" style="margin-top:6px"></div>`:''}</fieldset>`,
  `<button type="submit" class="btn primary" data-act="rec-save" data-id="${rec.id||''}" data-unit="${unit}">حفظ</button><button type="button" class="btn" data-act="close-dlg">إلغاء</button>${!isNew?`<button type="button" class="btn danger" data-act="del" data-col="records" data-id="${rec.id}" style="margin-inline-start:auto">حذف</button>`:''}<span id="f-err" style="color:var(--crit);font-size:12.5px;margin-inline-start:8px"></span>`)}
async function recSave(unit,id){const old=id?(S.records||[]).find(x=>x.id===id):null;
  const o={unit,duty:val('r-duty'),title:val('r-title'),type:val('r-type'),date:val('r-date'),ref:val('r-ref'),status:val('r-st')||'جارٍ',notes:val('r-notes')};
  if(!o.title||!o.date||o.duty===''){document.getElementById('f-err').textContent='المهمة والموضوع والتاريخ مطلوبة.';return}
  o.attachments=window.ATT&&ATT.val?await ATT.val('dlg','f-err'):(old&&old.attachments)||[];
  const me=window.__me&&window.__me();if(old){o.by=old.by||'';o.createdBy=old.createdBy||'';const hEl=document.getElementById('r-hold');if(hEl){if(hEl.checked)o.hold=old.hold||{by:(me&&me.email)||'',at:new Date().toISOString(),reason:(val('r-hold-reason')||'').slice(0,200)};else if(old.hold)o.holdReleased={by:(me&&me.email)||'',at:new Date().toISOString()}}else if(old.hold)o.hold=old.hold;o.history=recHistory(old,o,me)}else{o.by=(me&&(me.name||me.email))||await csMe();o.createdBy=(me&&me.email)||''}
  await write('records',id||uid('r'),o,!id);dlg.close();toast(old?'تم حفظ التعديل':'تم إضافة السجل')}
const REC_HK=['title','type','date','ref','status','notes','duty'];
function recHistory(old,o,me){const ch=REC_HK.filter(k=>String(old[k]||'')!==String(o[k]||'')).map(k=>({k,from:String(old[k]||'').slice(0,120),to:String(o[k]||'').slice(0,120)}));const na=(o.attachments||[]).length,oa=(old.attachments||[]).length;if(na!==oa)ch.push({k:'attachments',from:String(oa),to:String(na)});if(!!o.hold!==!!old.hold)ch.push({k:'hold',from:old.hold?'1':'',to:o.hold?'1':''});const h=(old.history||[]).slice(-99);if(ch.length)h.push({ts:new Date().toISOString(),by:(me&&me.email)||'',name:(me&&me.name)||'',changes:ch});return h}
function recExportRows(unit){return recRows(unit).map((x,i)=>({'م':i+1,'التاريخ':x.date||'','الموضوع':x.title||'','المهمة':x.duty?x.duty+'. '+recDutyLabel(unit,x.duty):'','النوع':x.type||'','رقم الإشارة':x.ref||'','الحالة':x.status||'','المرفقات':(x.attachments||[]).map(a=>a.name).join('، '),'ملاحظات':x.notes||'','بواسطة':x.by||'','آخر تحديث':x.updatedAt?x.updatedAt.slice(0,10):''}))}
function recExport(unit){const o=ORG_BY.get(unit);saveXlsx([['سجل الإدارة',recExportRows(unit)]],'سجل-'+o.title.replace(/[\/\\:*?"<>|]/g,' ')+'-'+TODAY_ISO+'.xlsx')}
function recPdf(unit){const o=ORG_BY.get(unit),en=!!(window.I18N&&I18N.lang==='en'),T=s=>en?I18N.t(s):s,rows=recExportRows(unit),keys=rows.length?Object.keys(rows[0]).filter(k=>k!=='ملاحظات'):[];
  const w=window.open('','_blank');if(!w){toast(T('اسمح بفتح النوافذ المنبثقة لتصدير PDF'));return}
  w.document.open();w.document.write(`<!doctype html><html lang="${en?'en':'ar'}" dir="${en?'ltr':'rtl'}"><head><meta charset="utf-8"><title>${esc(T('سجل الإدارة'))} — ${esc(o.title)}</title><style>@page{size:A4 landscape;margin:12mm}body{font-family:Arial,Arimo,"Noto Sans Arabic",Tahoma,sans-serif;font-weight:700;color:#0e2240;font-size:11px;margin:0}h1{font-size:18px;margin:0 0 2px}p{margin:0 0 12px;color:#55677f}table{width:100%;border-collapse:collapse}th{background:#0b3168;color:#fff;padding:6px 8px;text-align:start}td{padding:5px 8px;border-bottom:1px solid #e7ecf4;vertical-align:top}tr{break-inside:avoid}tbody tr:nth-child(even) td{background:#f6f8fc}.ft{margin-top:10px;color:#93aac6;font-size:10px}</style></head><body>
   <h1>${esc(T('سجل الإدارة'))}: ${esc(o.title)}</h1><p>${o.vacant?T('شاغرة'):esc(o.head)} · ${rows.length} ${esc(T('سجل'))} · ${fd(TODAY_ISO)}</p>
   ${rows.length?`<table><thead><tr>${keys.map(k=>`<th>${esc(T(k))}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${keys.map(k=>`<td>${esc(String(r[k]))}</td>`).join('')}</tr>`).join('')}</tbody></table>`:`<p>${esc(T('لا توجد سجلات بعد'))}</p>`}
   <div class="ft">${esc(T('صادر من منظومة الإدارة العامة للمبيعات والشؤون التجارية'))}</div></body></html>`);w.document.close();
  const run=()=>{try{w.focus();w.print()}catch(e){}};setTimeout(run,400)}
document.addEventListener('click',async e=>{const a=e.target.closest('[data-act^="rec-"]');if(!a)return;const act=a.dataset.act,unit=a.dataset.unit,id=a.dataset.id;
  if(act==='rec-new'){if(!recCan(unit)){toast('لا تملك صلاحية الإضافة في هذه الإدارة');return}if(dlg.open)dlg.close();recForm(unit,null);return}
  if(act==='rec-edit'){e.stopPropagation();const r=(S.records||[]).find(x=>x.id===id);if(r)recForm(unit,r);return}
  if(act==='rec-save'){e.preventDefault();a.disabled=true;try{await recSave(unit,id||null)}catch(err){document.getElementById('f-err').textContent=writeErr(err)}finally{a.disabled=false}return}
  if(act==='rec-del'){e.stopPropagation();if(!a.classList.contains('armed')){a.classList.add('armed');a.textContent='تأكيد الحذف';setTimeout(()=>{a.classList.remove('armed');a.textContent='حذف'},4000);return}
    try{await S.db.collection('records').doc(id).delete();toast('تم حذف السجل')}catch(err){toast(writeErr(err))}return}
  if(act==='rec-export'){recExport(unit);return}
  if(act==='rec-pdf'){recPdf(unit);return}},true);
function orgDutiesPanel(id){const d=ORG_DUTIES[id];if(!d)return '';
  return `<section class="panel ocd-wide"><h3 class="section-title">المهام والاختصاصات <small>قرار مجلس الإدارة رقم (${ORG_DECREE.no}) لسنة ${ORG_DECREE.year}م</small></h3>
   <ol class="od-list od-compact">${d.items.map((x,i)=>`<li><span class="od-n num">${i+1}</span><div><span class="od-tag">${esc(x[0])}</span><p>${esc(x[1])}</p></div></li>`).join('')}</ol>
   <button class="btn sm" data-od-open="${id}" style="margin-top:10px">عرض كل الاختصاصات</button></section>`}
document.addEventListener('click',e=>{if(!e.target.closest('#o-tree'))return;
  const b=e.target.closest('[data-od]');if(b){S.ui.od=b.dataset.od;S.ui.odq2='';renderOrg();return}
  const d=e.target.closest('[data-od-dash]');if(d){S.ui.of=d.dataset.odDash;S.ui.om='dash';document.querySelectorAll('[data-om]').forEach(x=>x.setAttribute('aria-selected',x.dataset.om==='dash'));renderOrg();return}
  const o=e.target.closest('[data-od-open]');if(o){e.stopPropagation();S.ui.od=o.dataset.odOpen;S.ui.om='duties';S.ui.odq2='';document.querySelectorAll('[data-om]').forEach(x=>x.setAttribute('aria-selected',x.dataset.om==='duties'));renderOrg();document.getElementById('o-tree').scrollIntoView({block:'start',behavior:'smooth'})}},true);
function orgPath(id){const p=[];let o=ORG_BY.get(id);while(o){p.unshift(o);o=ORG_BY.get(o.parent)}return p}
function orgDesc(id){return orgKids(id).reduce((n,k)=>n+1+orgDesc(k.id),0)}
function viewOrg(){
  const cnt=k=>ORG.filter(o=>o.type===k).length,mode=S.ui.om||'chart';
  const kp=(l,v,c='')=>`<div class="kpi ${c}" style="cursor:default"><span class="l">${l}</span><span class="v">${v}</span></div>`;
  return `<div class="page-head"><div><h2>الهيكل التنظيمي</h2><p>الإدارة العامة للمبيعات والشؤون التجارية وإداراتها وأقسامها ووحداتها، كما وردت في الهيكل المعتمد. اضغط على أي جهة لعرض ما يتبعها.</p></div>
  <div class="toolbar"><div class="seg" role="tablist"><button data-om="chart" aria-selected="${mode==='chart'}">مخطط</button><button data-om="list" aria-selected="${mode==='list'}">قائمة</button><button data-om="dash" aria-selected="${mode==='dash'}">لوحة المؤشرات</button><button data-om="duties" aria-selected="${mode==='duties'}">المهام والاختصاصات</button></div><button class="btn" data-act="org-print">طباعة</button><button class="btn" data-act="export-org">${I.down}تصدير Excel</button><button class="btn" data-act="export-org-pdf">${I.down}تصدير PDF</button></div></div>
  <div class="kpis org-kpis">${kp('الإدارات',cnt('dept'))}${kp('المنسقون',cnt('coord'))}${kp('الأقسام',cnt('section'))}${kp('المكاتب',cnt('office'))}${kp('الوحدات والمشرفون',cnt('unit')+cnt('super'))}${kp('شواغر',ORG.filter(o=>o.vacant).length,'warn')}</div>
  <div class="toolbar"><div class="grow">${I.search}<input type="search" id="o-q" value="${esc(S.ui.oq||'')}" placeholder="بحث بالمسمى أو اسم المسؤول أو الرقم الوظيفي…"></div>
  <select id="o-f"><option value="">الهيكل الكامل</option>${ORG.filter(o=>orgKids(o.id).length&&o.id!=='board').map(o=>`<option value="${o.id}" ${S.ui.of===o.id?'selected':''}>${'— '.repeat(Math.max(0,orgPath(o.id).length-2))}${esc(o.title)}</option>`).join('')}</select></div>
  <div id="o-tree" class="panel org"></div>
  <div class="oc-legend">${ORG_TYPES.filter(t=>t.k!=='board'&&t.k!=='super').map(t=>`<span><i class="oc-dot t-${t.k}"></i>${t.l}</span>`).join('')}<span><i class="oc-dot vac"></i>شاغرة</span><span><span class="tag dup">تدقيق</span> الاسم أو الرقم غير واضح في النسخة الممسوحة</span></div>`;
}
/* بطاقة جهة في المخطط */
function ocCard(o,cls=''){
  const t=ORG_TYPES.find(x=>x.k===o.type),n=orgKids(o.id).length,perms=ORG_PERMS[o.id],tasks=(ORG_TASKS[o.id]||[]).map(v=>VIEWS.find(x=>x.id===v)).filter(Boolean);
  return `<div class="oc-card t-${o.type}${o.vacant?' vac':''}${n?' has':''} ${cls}" ${n?`data-org-focus="${o.id}" role="button" tabindex="0"`:''} title="${esc(o.title)}">
   <span class="oc-type">${t.l}</span><b class="oc-title">${esc(o.title)}</b>
   ${o.vacant?'<span class="oc-name oc-vac">شاغرة</span>':`<span class="oc-name">${esc(o.head)}</span>${ORG_ROLE[o.id]?`<span class="oc-role">${esc(ORG_ROLE[o.id])}</span>`:''}${o.empNo?`<span class="oc-no num">${esc(o.empNo)}</span>`:''}`}
   ${tasks.length?`<span class="oc-tasks"><span class="oc-tasks-h">المهام</span>${tasks.map(v=>`<button type="button" data-org-go="${v.id}">${I[v.icon]}${esc(v.label)}</button>`).join('')}</span>`:''}
   ${ORG_DUTIES[o.id]?`<button type="button" class="oc-duty" data-od-open="${o.id}">${ORG_DUTIES[o.id].items.length} مهام واختصاصات</button>`:''}
   ${o.uncertain||n||perms&&perms.length?`<span class="oc-foot">${o.uncertain?'<span class="tag dup">تدقيق</span>':''}${perms&&perms.length?`<span class="tag">${perms.length} صلاحية</span>`:''}${n?`<span class="oc-more">${orgDesc(o.id)} جهة تابعة ‹</span>`:''}</span>`:''}</div>`;
}
/* المستوى الأخير يُعرض عموديًا تحت الجهة الأم كما في الهيكل الورقي */
function ocStack(o){const k=orgKids(o.id);return k.length?`<div class="oc-stack">${k.map(c=>ocCard(c,'sm')).join('')}</div>`:''}
function ocBranch(o,rows){const k=orgKids(o.id);
  if(!rows||!k.length)return `<li>${ocCard(o)}${ocStack(o)}</li>`;
  return `<li>${ocCard(o)}<ul>${k.map(c=>ocBranch(c,rows-1)).join('')}</ul></li>`}
function renderOrgChart(el){
  const f=ORG_BY.get(S.ui.of)||ORG_BY.get('board'),path=orgPath(f.id),rows=f.id==='board'?2:1,k=orgKids(f.id);
  el.innerHTML=`<nav class="oc-crumbs">${path.map((p,i)=>i<path.length-1?`<button data-org-focus="${p.id==='board'?'':p.id}">${esc(p.id==='board'?'الهيكل الكامل':p.title)}</button><span>‹</span>`:`<b>${esc(p.id==='board'?'الهيكل الكامل':p.title)}</b>`).join('')}</nav>
  <div class="oc-scroll"><ul class="oc"><li>${ocCard(f,'root')}${k.length?`<ul>${k.map(c=>ocBranch(c,rows-1)).join('')}</ul>`:''}</li></ul></div>`;
  const sc=el.querySelector('.oc-scroll');sc.scrollLeft=(sc.scrollWidth-sc.clientWidth)/2*(getComputedStyle(sc).direction==='rtl'?-1:1);
}
function orgNode(o,hit){
  const kids=orgKids(o.id).filter(k=>hit.has(k.id));
  return `<div class="ol-row">${ocCard(o,'line')}${kids.length?`<div class="ol-kids">${kids.map(k=>orgNode(k,hit)).join('')}</div>`:''}</div>`;
}
function renderOrg(){
  const el=document.getElementById('o-tree');if(!el)return;const q=norm(S.ui.oq||''),root=q?'board':S.ui.of||'board';
  const bare=!q&&(S.ui.om==='dash'||S.ui.om==='duties');el.classList.toggle('bare',bare);el.classList.toggle('duties',!q&&S.ui.om==='duties');const ok=document.querySelector('.org-kpis');if(ok)ok.hidden=bare;if(!q&&S.ui.om==='duties'){el.classList.remove('chart');viewOrgDuties(el);return}if(!q&&S.ui.om==='dash'){el.classList.remove('chart');viewOrgDash(el);return}
  if(!q&&(S.ui.om||'chart')==='chart'){el.classList.add('chart');renderOrgChart(el);return}
  el.classList.remove('chart');const hit=new Set();
  ORG.filter(o=>!q||norm([o.title,o.head,o.empNo].join(' ')).includes(q)).forEach(o=>orgPath(o.id).forEach(p=>hit.add(p.id)));
  el.innerHTML=hit.has(root)?`${q?`<div class="count-line">${ORG.filter(o=>norm([o.title,o.head,o.empNo].join(' ')).includes(q)).length} نتيجة</div>`:''}${orgNode(ORG_BY.get(root),hit)}`:`<div class="empty"><b>لا نتائج</b>جرّب كلمة أخرى.</div>`;
}
function exportOrg(){const r=ORG.map(o=>({'المسمى':o.title,'النوع':ORG_TYPES.find(t=>t.k===o.type).l,'المسؤول':o.vacant?'شاغرة':o.head,'الرقم الوظيفي':o.empNo,'الجهة الأعلى':o.parent?ORG_BY.get(o.parent).title:'','المسار':orgPath(o.id).map(p=>p.title).join(' / '),'تدقيق':o.uncertain?'نعم':''}));const du=[];ORG_DUTY_ORDER.forEach(id=>ORG_DUTIES[id].items.forEach((x,i)=>du.push({'الجهة':ORG_BY.get(id).title,'م':i+1,'المجال':x[0],'المهمة':x[1],'المرجع':'قرار مجلس الإدارة رقم ('+ORG_DECREE.no+') لسنة '+ORG_DECREE.year})));saveXlsx([['الهيكل التنظيمي',r],['المهام والاختصاصات',du]],'الهيكل-التنظيمي-'+TODAY_ISO+'.xlsx')}
afterRender.org=()=>{renderOrg();const q=document.getElementById('o-q');q.addEventListener('input',debounce(()=>{S.ui.oq=q.value;renderOrg()},150));document.getElementById('o-f').addEventListener('change',e=>{S.ui.of=e.target.value;renderOrg()})};
/* ============ لوحة مؤشرات الهيكل التنظيمي ============ */
function orgAll(id){const out=[];const walk=p=>orgKids(p).forEach(k=>{out.push(k);walk(k.id)});walk(id);return out}
function orgDepth(id){const k=orgKids(id);return k.length?1+Math.max(...k.map(c=>orgDepth(c.id))):0}
function ocPct(a,b){return b?Math.round(a*100/b):0}
function ocBars(rows,max,opt={}){
  return `<div class="ocd-bars">${rows.map(r=>`<div class="ocd-row${r.go||r.set?' go':''}" ${r.go?`data-org-dash="${r.go}" role="button" tabindex="0"`:r.set?`data-ocd-set="${r.set}" role="button" tabindex="0"`:''}>
    <span class="ocd-lbl" title="${esc(r.full||r.l)}">${esc(r.l)}</span>
    <span class="ocd-track">${(r.parts||[{v:r.v,c:'f'}]).filter(p=>p.v).map(p=>`<span class="ocd-seg ${p.c}" style="width:${p.v*100/max}%" data-tip="${esc((r.full||r.l)+' · '+(p.t||'')+' '+p.v)}"></span>`).join('')}</span>
    <span class="ocd-val num">${r.vl??r.v}</span></div>`).join('')}</div>`;
}
function ocGauge(pct,label,sub,act){const p=Math.max(0,Math.min(100,pct)),r=52,L=Math.PI*r,met=p>=100;
  return `<div class="ocg${act?' go':''}" ${act?`data-ocd-set="${act}" role="button" tabindex="0"`:''} data-tip="${esc(label+': '+p+'% · الهدف 100%')}">
   <svg viewBox="0 0 128 74" aria-hidden="true"><path d="M12 66a52 52 0 0 1 104 0" class="ocg-track"/>${p?`<path d="M12 66a52 52 0 0 1 104 0" class="ocg-val" style="stroke-dasharray:${L*p/100} ${L}"/>`:''}</svg>
   <b class="num">${p}%</b><span class="ocg-l">${label}</span><span class="ocg-s">${sub}</span>
   <span class="pill ${met?'p-ok':'p-warn'}">${met?'✓ محقق':'! دون الهدف'} · الهدف 100%</span></div>`}
function viewOrgDash(el){
  const root=ORG_BY.get(S.ui.of)||ORG_BY.get('board'),sub=orgAll(root.id),pos=[root,...sub];
  const filled=pos.filter(o=>!o.vacant).length,vac=pos.length-filled,unc=pos.filter(o=>o.uncertain).length,permd=pos.filter(o=>(ORG_PERMS[o.id]||[]).length).length;
  const base=root.id==='board'?'gm':root.id,kids=orgKids(base),tasks=pos.reduce((n,o)=>n+(ORG_TASKS[o.id]||[]).length,0);
  const mgrs=pos.filter(o=>orgKids(o.id).length),avgSpan=mgrs.length?(mgrs.reduce((n,o)=>n+orgKids(o.id).length,0)/mgrs.length):0;
  const kp=(l,v,s='',c='',act='')=>`<div class="kpi ${c}${act?' go':''}" ${act?`data-ocd-set="${act}" role="button" tabindex="0"`:'style="cursor:default"'}><span class="l">${l}</span><span class="v">${v}</span>${s?`<span class="s">${s}</span>`:''}</div>`;
  const types=ORG_TYPES.filter(t=>t.k!=='board').map(t=>({l:t.l,v:sub.filter(o=>o.type===t.k).length,k:t.k})).filter(r=>r.v);
  const maxT=Math.max(1,...types.map(r=>r.v));
  const cmp=kids.map(k=>{const a=[k,...orgAll(k.id)],v=a.filter(o=>o.vacant).length;return {l:k.title,full:k.title,go:orgKids(k.id).length?k.id:'',v:a.length,parts:[{v:a.length-v,c:'f',t:'مشغولة'},{v,c:'v',t:'شاغرة'}],vl:a.length}}).sort((a,b)=>b.v-a.v);
  const maxC=Math.max(1,...cmp.map(r=>r.v));
  const span=mgrs.map(o=>({l:o.title,full:`${o.title} — ${o.vacant?'شاغرة':o.head}`,v:orgKids(o.id).length,go:o.id!==root.id?o.id:''})).sort((a,b)=>b.v-a.v).slice(0,8);
  const maxS=Math.max(1,...span.map(r=>r.v));
  // عدد الجهات في كل مستوى إداري
  const rd=orgPath(root.id).length,lv={};pos.forEach(o=>{const d=orgPath(o.id).length-rd+1;lv[d]=(lv[d]||0)+1});
  const lvs=Object.entries(lv).map(([d,n])=>({d:+d,n})),maxL=Math.max(1,...lvs.map(x=>x.n));
  const path=orgPath(root.id),scopes=['board',...orgKids('gm').map(o=>o.id)];
  el.innerHTML=`<div class="ocd-scopes">${scopes.map(id=>{const o=ORG_BY.get(id);return `<button data-org-dash="${id}" aria-pressed="${id===root.id}">${esc(id==='board'?'الهيكل الكامل':o.title)}</button>`}).join('')}</div>
  <div class="ocd-head"><div><div class="oc-crumbs" style="padding:0 0 4px">${path.map((p,i)=>i<path.length-1?`<button data-org-dash="${p.id}">${esc(p.id==='board'?'الهيكل الكامل':p.title)}</button><span>‹</span>`:'').join('')}</div>
   <h3>${esc(root.id==='board'?'لوحة مؤشرات الهيكل التنظيمي':'لوحة مؤشرات: '+root.title)}</h3><p>${root.vacant?'المسؤول: شاغرة':`المسؤول: <b>${esc(root.head)}</b>${ORG_ROLE[root.id]?` · ${esc(ORG_ROLE[root.id])}`:''}${root.empNo?` <span class="num">${esc(root.empNo)}</span>`:''}`}</p></div>
   ${kids.length?`<button class="btn sm" data-org-focus="${root.id==='board'?'':root.id}">عرض في المخطط</button>`:''}</div>
  <h4 class="ocd-sec">مؤشرات الأداء الرئيسية <small>مقارنة بالهدف</small></h4>
  <div class="ocd-gauges">${ocGauge(ocPct(filled,pos.length),'نسبة إشغال المناصب',`${filled} مشغولة من ${pos.length}`,'st:v')}${ocGauge(ocPct(pos.length-unc,pos.length),'دقة بيانات الهيكل',`${unc} بند بحاجة تدقيق`,'st:u')}${ocGauge(ocPct(permd,pos.length),'اكتمال الصلاحيات',permd?`${permd} جهة محددة`:'بانتظار بيانات الصلاحيات')}</div>
  <h4 class="ocd-sec">بطاقات ملخصة <small>اضغط على البطاقة لتصفية الجدول</small></h4>
  <div class="kpis ocd-kpis">${kp('الجهات التابعة',sub.length,kids.length?`${kids.length} ${root.id==='board'?'تحت الإدارة العامة':'مباشرة'}`:'','','st:')}${kp('المناصب المشغولة',filled,`${ocPct(filled,pos.length)}%`,'ok','st:f')}${kp('الشواغر',vac,`${ocPct(vac,pos.length)}%`,vac?'warn':'','st:v')}${kp('بحاجة تدقيق',unc,'أسماء أو أرقام غير واضحة',unc?'warn':'','st:u')}${kp('المستويات الإدارية',orgDepth(root.id)+1)}${kp('متوسط نطاق الإشراف',avgSpan.toFixed(1),`${mgrs.length} مسؤول له جهات تابعة`)}${kp('المهام المسندة',tasks,tasks?'صفحات في المنظومة':'')}</div>
  <div class="ocd-grid">
   ${orgDutiesPanel(root.id)}
   ${root.id!=='board'?recPanel(root.id):''}
   ${cmp.length>1?`<section class="panel ocd-wide"><h3 class="section-title">${root.id==='board'?'حجم الإدارات والجهات التابعة للإدارة العامة':'حجم الجهات التابعة مباشرة'} <small>اضغط على جهة لعرض لوحتها</small></h3>
     <div class="ocd-legend"><span><i class="f"></i>مشغولة</span><span><i class="v"></i>شاغرة</span></div>${ocBars(cmp,maxC)}</section>`:''}
   ${types.length?`<section class="panel"><h3 class="section-title">التوزيع حسب النوع <small>اضغط للتصفية</small></h3>${ocBars(types.map(t=>({...t,set:'ty:'+t.k})),maxT)}</section>`:''}
   <section class="panel"><h3 class="section-title">عدد الجهات في كل مستوى إداري</h3><div class="ocd-cols">${lvs.map(x=>`<div class="ocd-col" data-tip="${esc('المستوى '+x.d+': '+x.n+' جهة')}"><span class="num">${x.n}</span><i style="height:${Math.max(4,x.n*100/maxL)}%"></i><small>م${x.d}</small></div>`).join('')}</div></section>
   ${span.length?`<section class="panel ocd-wide"><h3 class="section-title">نطاق الإشراف <small>عدد الجهات التابعة مباشرة لكل مسؤول · اضغط لعرض لوحتها</small></h3>${ocBars(span,maxS)}</section>`:''}
   <section class="panel ocd-wide"><h3 class="section-title">جميع الجهات في النطاق</h3>
    <div class="toolbar ocd-filters"><div class="grow">${I.search}<input type="search" id="ocd-q" value="${esc(S.ui.odq||'')}" placeholder="بحث بالمسمى أو الاسم أو الرقم الوظيفي…"></div>
     <select id="ocd-t"><option value="">كل الأنواع</option>${ORG_TYPES.filter(t=>t.k!=='board').map(t=>`<option value="${t.k}" ${S.ui.odt===t.k?'selected':''}>${t.l}</option>`).join('')}</select>
     <select id="ocd-s"><option value="">كل الحالات</option><option value="f" ${S.ui.ods==='f'?'selected':''}>مشغولة</option><option value="v" ${S.ui.ods==='v'?'selected':''}>شاغرة</option><option value="u" ${S.ui.ods==='u'?'selected':''}>بحاجة تدقيق</option></select>
     <button class="btn sm ghost" data-ocd-set="clear">مسح التصفية</button></div>
    <div id="ocd-table"></div></section>
  </div>`;
  const tb=()=>renderOcdTable(pos,root);tb();
  const q=el.querySelector('#ocd-q');q.addEventListener('input',debounce(()=>{S.ui.odq=q.value;tb()},150));
  el.querySelector('#ocd-t').addEventListener('change',e=>{S.ui.odt=e.target.value;tb()});
  el.querySelector('#ocd-s').addEventListener('change',e=>{S.ui.ods=e.target.value;tb()});
  if(root.id!=='board')recBind(root.id);
}
function renderOcdTable(pos,root){const el=document.getElementById('ocd-table');if(!el)return;const q=norm(S.ui.odq||'');
  let r=pos.filter(o=>o.id!=='board');
  if(S.ui.odt)r=r.filter(o=>o.type===S.ui.odt);
  if(S.ui.ods==='f')r=r.filter(o=>!o.vacant);if(S.ui.ods==='v')r=r.filter(o=>o.vacant);if(S.ui.ods==='u')r=r.filter(o=>o.uncertain);
  if(q)r=r.filter(o=>norm([o.title,o.head,o.empNo].join(' ')).includes(q));
  el.innerHTML=`<div class="count-line">${r.length} جهة</div>${r.length?`<div class="tablewrap ocd-tw"><table><thead><tr><th class="nosort">الجهة</th><th class="nosort">النوع</th><th class="nosort">المسؤول</th><th class="nosort">الرقم الوظيفي</th><th class="nosort">تتبع</th><th class="nosort">جهات تابعة</th><th class="nosort">الحالة</th><th class="nosort">الصلاحيات</th></tr></thead><tbody>
  ${r.map(o=>{const a=orgAll(o.id).length;return `<tr ${a?`data-org-dash="${o.id}" style="cursor:pointer"`:''}><td class="t-strong">${esc(o.title)}</td><td>${ORG_TYPES.find(t=>t.k===o.type).l}</td><td>${o.vacant?'—':esc(o.head)}</td><td class="n">${esc(o.empNo||'—')}</td><td>${esc(o.parent?ORG_BY.get(o.parent).title:'—')}</td><td class="n">${a||'—'}</td><td>${o.vacant?'<span class="pill p-warn">شاغرة</span>':o.uncertain?'<span class="tag dup">تدقيق</span>':'<span class="pill p-ok">مشغولة</span>'}</td><td>${(ORG_PERMS[o.id]||[]).length?`${ORG_PERMS[o.id].length} صلاحية`:'<span class="muted">لم تُحدَّد بعد</span>'}</td></tr>`}).join('')}</tbody></table></div>`:'<div class="empty"><b>لا نتائج</b>غيّر التصفية أو البحث.</div>'}`;
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-ocd-set]');if(!b||!b.closest('#o-tree'))return;const v=b.dataset.ocdSet;
  if(v==='clear'){S.ui.odq='';S.ui.odt='';S.ui.ods=''}else{const [k,x]=v.split(':');if(k==='st'){S.ui.ods=x;S.ui.odt=''}if(k==='ty'){S.ui.odt=x;S.ui.ods=''}S.ui.odq=''}
  ['ocd-q','ocd-t','ocd-s'].forEach((id,i)=>{const f=document.getElementById(id);if(f)f.value=[S.ui.odq,S.ui.odt,S.ui.ods][i]||''});
  const root=ORG_BY.get(S.ui.of)||ORG_BY.get('board');renderOcdTable([root,...orgAll(root.id)],root);document.getElementById('ocd-table').scrollIntoView({block:'nearest',behavior:'smooth'})});
function ocTip(e){let t=document.getElementById('oc-tip');const h=e.target.closest&&e.target.closest('[data-tip]');
  if(!h){if(t)t.hidden=true;return}if(!t){t=document.createElement('div');t.id='oc-tip';t.setAttribute('role','tooltip');document.body.appendChild(t)}
  t.textContent=h.dataset.tip;t.hidden=false;const r=h.getBoundingClientRect();t.style.top=(r.top+window.scrollY-t.offsetHeight-8)+'px';t.style.left=Math.max(8,Math.min(window.innerWidth-t.offsetWidth-8,r.left+r.width/2-t.offsetWidth/2))+'px'}
document.addEventListener('mouseover',ocTip);
document.addEventListener('click',e=>{const d=e.target.closest('[data-org-dash]');if(d&&d.closest('#o-tree')){S.ui.of=d.dataset.orgDash==='board'?'':d.dataset.orgDash;const f=document.getElementById('o-f');if(f)f.value=S.ui.of;renderOrg();document.getElementById('o-tree').scrollIntoView({block:'start',behavior:'smooth'})}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.closest&&e.target.closest('[data-org-dash]'))e.target.click()});
function orgFocus(id){S.ui.of=id;S.ui.oq='';const q=document.getElementById('o-q');if(q)q.value='';const f=document.getElementById('o-f');if(f)f.value=id;S.ui.om='chart';document.querySelectorAll('[data-om]').forEach(b=>b.setAttribute('aria-selected',b.dataset.om==='chart'));renderOrg();document.getElementById('o-tree').scrollIntoView({block:'start',behavior:'smooth'})}
document.addEventListener('click',e=>{const g=e.target.closest('[data-org-go]');if(g){go(g.dataset.orgGo);return}const f=e.target.closest('[data-org-focus]');if(f&&f.closest('#o-tree')){orgFocus(f.dataset.orgFocus);return}
  const m=e.target.closest('[data-om]');if(m){S.ui.om=m.dataset.om;document.querySelectorAll('[data-om]').forEach(b=>b.setAttribute('aria-selected',b===m));renderOrg();return}
  if(e.target.closest('[data-act="org-print"]')){S.ui.om='chart';render();document.body.classList.add('print-org');window.print();document.body.classList.remove('print-org')}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'){const f=e.target.closest&&e.target.closest('[data-org-focus]');if(f&&f.closest('#o-tree'))orgFocus(f.dataset.orgFocus)}});
