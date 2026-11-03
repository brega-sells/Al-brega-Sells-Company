/* ===== سجل مهام الإدارات (Department duties book) =====
   This file holds the duties of the departments whose source documents arrived AFTER Board
   decision No. (160) of 2026 (the decision itself is already in index.html: ORG_DECREE / ORG_DUTIES).

   ── To add a department when its document arrives ──
   1. Find the unit id in ORG_ROWS (index.html), e.g. 'w-fol' for «قسم المتابعة غ.ج».
   2. Copy one block below, change `unit`, `src`, `lead`, `items` (and `subs`/`job` if any).
      Each item is [area tag, duty text, English tag, English text, flag]; flag 'u' = unclear in the scan
      (shown with an «تدقيق» badge until someone confirms it).
   3. Save, reload. The department appears everywhere: duties centre, org chart, records, assignments,
      dashboards, PDF and Excel exports.
   Admins can also add or correct a department from inside the system (مهام الإدارات ← إضافة مهام إدارة);
   those entries are stored in Firestore `duties/<unitId>` and override this file for that unit. */
"use strict";
window.DUTY_BOOK=[
 {unit:'gm-rep',
  src:{kind:'memo',title:'مذكرة داخلية: مهام قسم المتابعة والتقارير',en:'Internal memo: duties of the Follow-up & Reports Section',
       note:'مكتوبة بخط اليد ومُوقّعة من القسم',noteEn:'Handwritten and signed by the section',received:'2026-11-01'},
  lead:'يتولى قسم المتابعة والتقارير بالإدارة العامة للمبيعات والشؤون التجارية المهام الآتية:',
  leadEn:'The Follow-up & Reports Section of the General Administration for Sales & Commercial Affairs carries out the following duties:',
  items:[
   ['المتابعة','متابعة المواضيع مع الإدارات التابعة.','Follow-up','Follow up on subjects with the subordinate departments.'],
   ['توزيع المهام','متابعة توزيع المهام حسب الاختصاصات.','Task allocation','Follow up the allocation of tasks according to each unit’s competences.'],
   ['العقود','استلام العقود من إدارة العقود والتوثيق والموارد البشرية، وإحالتها للإدارات المختصة مع إبقاء نسخة للإدارة.','Contracts','Receive contracts from the Contracts & Documentation and Human Resources departments, refer them to the competent departments and keep a copy for the administration.','u'],
   ['التقارير','تجميع التقارير من الإدارات التابعة (يومية، شهرية، سنوية)، ومراجعتها وإحالتها للإدارات المختصة.','Reports','Collect the daily, monthly and annual reports of the subordinate departments, review them and refer them to the competent departments.'],
   ['الكميات','مراجعة قوائم الكميات المحالة من الصناعات.','Quantities','Review the quantity lists referred by the Ministry of Industry.','u'],
   ['توزيع المهام','توزيع المهام على الوحدات التابعة.','Task allocation','Distribute tasks to the subordinate units.']],
  /* records saved before these duties existed referred to the section's system pages (ORG_TASKS order) */
  legacy:{contracts:3,ext:1,needs:5,batches:5,dir:1},
  subs:{
   'gm-rep-a':{lead:'وحدة تحليل البيانات والكميات، وتختص بما يلي:',leadEn:'Data & Quantities Analysis Unit, responsible for:',items:[
     ['الكميات','استلام الطلبيات من الجهات للتزويد، وحساب الكمية الفعلية المستحقة.','Quantities','Receive supply orders from entities and calculate the actual quantity due.'],
     ['الكميات','تقديم أي ملاحظات وتقارير ومقترحات بشأن ضوابط الاحتساب.','Quantities','Submit notes, reports and proposals on the calculation rules.']]},
   'gm-rep-r':{lead:'وحدة التقارير، وتختص بما يلي:',leadEn:'Reports Unit, responsible for:',items:[
     ['العقود','متابعة توزيع العقود على الإدارات.','Contracts','Follow up the distribution of contracts to the departments.'],
     ['التقارير','مراجعة التقارير المقدمة من الإدارات وإحالتها.','Reports','Review the reports submitted by the departments and refer them.']]},
   'gm-rep-f':{lead:'وحدة المتابعة، وتختص بما يلي:',leadEn:'Follow-up Unit, responsible for:',items:[
     ['المتابعة','متابعة المواضيع الصادرة والواردة.','Follow-up','Follow up outgoing and incoming subjects.']]}}},

 {unit:'gm-fo',
  src:{kind:'job',title:'نموذج جمع معلومات الوظيفة: مدير مكتب متابعة المبيعات وتقييم الأداء',en:'Job information form: Manager, Sales Follow-up & Performance Evaluation Office',
       note:'إعداد مكتب متابعة مبيعات الإدارة العامة للمبيعات والشؤون التجارية والتحصيلات',noteEn:'Prepared by the Sales Follow-up Office',received:'2026-11-01'},
  purpose:[
   ['متابعة وتقييم الأداء للإدارات التابعة للإدارة العامة للمبيعات والشؤون التجارية والتحصيلات.','Monitor and evaluate the performance of the departments of the General Administration for Sales, Commercial Affairs & Collections.'],
   ['تحقيق الكفاءة والفاعلية من خلال المتابعة المستمرة لكافة أعمال وأنشطة الإدارات.','Achieve efficiency and effectiveness through continuous follow-up of all the departments’ work and activities.']],
  lead:'يلعب مكتب المتابعة وتقييم الأداء دورًا كبيرًا في الإشراف والمتابعة لكافة الأعمال والأنشطة والتقارير الصادرة من الإدارات التابعة للإدارة العامة للمبيعات والشؤون التجارية والتحصيلات، ويتولى ما يلي:',
  leadEn:'The Follow-up & Performance Evaluation Office plays a major role in supervising and following up all work, activities and reports issued by the departments of the General Administration, and is responsible for:',
  items:[
   ['التقارير','الإشراف على تجميع ومراجعة وتحليل التقارير والبيانات الواردة من الإدارات التابعة للإدارة العامة للمبيعات والشؤون التجارية والنشاط التجاري.','Reports','Supervise collecting, reviewing and analysing the reports and data received from the departments of the General Administration and its commercial activity.'],
   ['تقييم الأداء','تقييم نتائج الأداء ومؤشرات الإنجاز، ورصد الانحرافات وبيان أسبابها مع الجهات المختصة.','Performance','Evaluate performance results and achievement indicators, detect deviations and explain their causes with the competent bodies.'],
   ['التقارير','الإشراف على إعداد التقارير التحليلية والدورية والمواقف التنفيذية ورفعها إلى الإدارة العامة للمبيعات.','Reports','Supervise preparing analytical and periodic reports and execution status updates, and submit them to the General Administration for Sales.'],
   ['التكليفات','الإشراف على الموضوعات والتكليفات المحالة للمكتب، والتنسيق مع الجهات المعنية بشأن استيفاء البيانات والإجراءات المطلوبة.','Assignments','Supervise the subjects and assignments referred to the office, and coordinate with the bodies concerned to complete the required data and procedures.'],
   ['التحسين','تقديم التوصيات والمقترحات التي تسهم في تحسين الأداء ورفع كفاءة العمليات والتحصيل للجهات ذات العلاقة.','Improvement','Submit recommendations and proposals that improve performance and raise the efficiency of operations and collection.'],
   ['توزيع المهام','توزيع المهام على العاملين بالمكتب والإشراف على أدائهم، وضمان جودة وسرعة إنجاز الأعمال.','Task allocation','Distribute tasks to the office staff, supervise their performance and ensure quality and speed of delivery.'],
   ['البيانات','متابعة كافة البيانات البيعية الخاصة بالمنتجات الرئيسية في الإدارة العامة للمبيعات.','Data','Follow up all sales data of the main products in the General Administration for Sales.'],
   ['الموازنة','الإشراف على تجميع الموازنة للزبائن، والمشاركة في إعدادها مع الجهات ذات العلاقة.','Budget','Supervise compiling the customers’ budget and take part in preparing it with the bodies concerned.']],
  job:{
   title:'مدير مكتب متابعة مبيعات وتقييم الأداء للإدارة العامة للمبيعات والشؤون التجارية',titleEn:'Manager, Sales Follow-up & Performance Evaluation Office',
   grade:'B3',reportsTo:'مدير الإدارة العامة للمبيعات والشؤون التجارية',reportsToEn:'Director, General Administration for Sales & Commercial Affairs',
   location:'طرابلس / مقر الشركة',locationEn:'Tripoli / Head office',
   structure:[['قسم','المعلومات وتحليل الأداء','Section','Information & Performance Analysis'],
    ['وحدة','متابعة وتقييم الأداء طرابلس','Unit','Performance follow-up & evaluation, Tripoli'],['وحدة','متابعة وتقييم الأداء السرير','Unit','Performance follow-up & evaluation, Sarir'],
    ['وحدة','متابعة وتقييم الأداء مصراتة','Unit','Performance follow-up & evaluation, Misrata'],['وحدة','متابعة وتقييم الأداء الزاوية','Unit','Performance follow-up & evaluation, Zawiya'],
    ['وحدة','متابعة وتقييم الأداء سبها','Unit','Performance follow-up & evaluation, Sabha'],['وحدة','النظم والمعلومات','Unit','Systems & Information']],
   contacts:{internal:[['الوظائف المناظرة ذات نفس المستوى الإداري أو الفني','إتمام كافة المهام المناط بها المكتب','يومي ومستمر','Peer jobs at the same administrative or technical level','Complete all the tasks entrusted to the office','Daily, continuous']],
     external:'لا يوجد، وذلك حسب المهام المناط بها المكتب',externalEn:'None, given the office’s mandate'},
   supervises:[['رئيس قسم المعلومات وتحليل الأداء','Head, Information & Performance Analysis'],['مشرف وحدة متابعة وتقييم الأداء طرابلس','Supervisor, Tripoli performance unit'],
    ['مشرف وحدة متابعة وتقييم الأداء السرير','Supervisor, Sarir performance unit'],['مشرف وحدة متابعة وتقييم الأداء مصراتة','Supervisor, Misrata performance unit'],
    ['مشرف وحدة متابعة وتقييم الأداء الزاوية','Supervisor, Zawiya performance unit'],['مشرف وحدة متابعة وتقييم الأداء سبها','Supervisor, Sabha performance unit'],
    ['مشرف وحدة نظم المعلومات والبيانات','Supervisor, Information Systems & Data unit']],
   qualification:['ماجستير إدارة وتنظيم','Master’s degree in Management & Organisation'],experience:['5–8 سنوات في المجال المطلوب','5–8 years in the field'],
   training:[['البرامج الإحصائية','Statistical software'],['تحليل البيانات ومؤشرات الأداء','Data analysis and performance indicators'],['التخصص وحسب الاحتياج التدريبي','Specialised training as needed']],
   skills:{tech:[['إدارة الوقت','Time management'],['التفاوض','Negotiation'],['التفويض','Delegation'],['تحليل البيانات','Data analysis'],['التعامل مع مختلف الوسائل والبرامج','Using various tools and software'],['المتابعة واتخاذ القرار','Follow-up and decision making']],
     admin:[['فهم المعارف العلمية والفنية المتعلقة بإدارة الجودة','Understanding of quality-management knowledge'],['حسن إصدار القرار','Sound decision issuing'],['القدرة على اتخاذ القرار','Decision-making ability']],
     personal:[['المرونة','Flexibility'],['الدقة','Accuracy'],['الإلمام بكل جوانب الوظيفة','Command of every aspect of the job']]},
   environment:['بيئة عمل آمنة ومستقرة وواضحة (مكتب متكامل)','Safe, stable and clear work environment (fully equipped office)'],
   /* the job form and the approved org chart do not list the same follow-up units */
   mismatch:['تذكر بطاقة الوظيفة وحدات (طرابلس، السرير، مصراتة، الزاوية، سبها)، بينما يضم الهيكل المعتمد مشرفين لطرابلس ومصراتة والزاوية وسبها وبنغازي وطبرق والبريقة والسرير. يُستحسن توحيدهما.',
     'The job form lists units for Tripoli, Sarir, Misrata, Zawiya and Sabha, while the approved structure has supervisors for Tripoli, Misrata, Zawiya, Sabha, Benghazi, Tobruk and Brega & Sarir. Consider aligning them.']}}
];
