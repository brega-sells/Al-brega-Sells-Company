"""Adds the analytics (تحليل البيانات) and customer-service (خدمة الزبائن) modules to index.html files.
Usage: python3 apply.py FILE [FILE...]  (idempotent guard: refuses if already applied)"""
import sys,os
here=os.path.dirname(os.path.abspath(__file__))
JS=open(os.path.join(here,'analytics-cs.js'),encoding='utf-8').read()
CSS=open(os.path.join(here,'analytics-cs.css'),encoding='utf-8').read()
ICONS=(" chart:'<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M4 20h16\"/><rect x=\"5\" y=\"11\" width=\"3\" height=\"6\" rx=\".5\"/><rect x=\"10.5\" y=\"6\" width=\"3\" height=\"11\" rx=\".5\"/><rect x=\"16\" y=\"9\" width=\"3\" height=\"8\" rx=\".5\"/></svg>',\n"
       " support:'<svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\"><path d=\"M4 13v-1a8 8 0 0 1 16 0v1\"/><rect x=\"3\" y=\"13\" width=\"4\" height=\"6\" rx=\"1.5\"/><rect x=\"17\" y=\"13\" width=\"4\" height=\"6\" rx=\"1.5\"/><path d=\"M19 19c0 1.5-2 2.5-5 2.5\"/></svg>',\n")
COMMON=[
 (".muted{color:var(--muted)}",".muted{color:var(--muted)}\n"+CSS.rstrip('\n')),
 ("\n contract:'<svg","\n"+ICONS+" contract:'<svg"),
 ("const COLS=['contracts','needs','batches','extensions','letters','companies'];","const COLS=['contracts','needs','batches','extensions','letters','companies','tickets'];"),
 ("letters:[],companies:[],","letters:[],companies:[],tickets:[],"),
 (" {id:'dash',label:'لوحة المؤشرات',icon:'dash',group:'عام'},"," {id:'dash',label:'لوحة المؤشرات',icon:'dash',group:'عام'},\n {id:'ana',label:'تحليل البيانات',icon:'chart',group:'عام'},\n {id:'cs',label:'خدمة الزبائن',icon:'support',group:'عام',count:()=>S.tickets.filter(t=>t.status!=='مغلق').length||''},"),
 ("org:viewOrg,settings:viewSettings}","org:viewOrg,ana:viewAna,cs:viewCs,settings:viewSettings}"),
 ("/* ============ Extensions & letters ============ */",JS.rstrip('\n')+"\n\n/* ============ Extensions & letters ============ */"),
 ("/^(c-q|n-q|d-q|gq)$/","/^(c-q|n-q|d-q|gq|tk-q|cu-q)$/"),
 ("if(keep&&S.view==='contracts')","if(keep&&S.view==='cs'){recompute();renderTk();renderCu()}else if(keep&&S.view==='contracts')"),
]
FIREBASE=[
 ("if(err.code==='permission-denied'){setConn('لا تملك صلاحية قراءة البيانات')}",
  "if(err.code==='permission-denied'){(window.__denied||(window.__denied={}))[col]=1;if(col==='tickets'){CACHE[col]=CACHE[col]||new Map();emit(col)}else setConn('لا تملك صلاحية قراءة البيانات')}"),
 ("if(col==='config')return 'الإعدادات';","if(col==='config')return 'الإعدادات';if(col==='tickets')return (d.no||'')+' — '+(d.customer||'')+' ('+(d.status||'')+')';"),
 ("config:'إعدادات',roles:'مستخدم'","config:'إعدادات',roles:'مستخدم',tickets:'طلب زبون',companies:'زبون'"),
]
for f in sys.argv[1:]:
    s=open(f,encoding='utf-8').read()
    assert 'function viewAna(' not in s, f+': already applied'
    reps=COMMON+(FIREBASE if 'firebase-app-compat' in s else [])
    for a,b in reps:
        n=s.count(a); assert n==1,(f,a[:60],n)
        s=s.replace(a,b)
    open(f,'w',encoding='utf-8').write(s); print('patched',f)
