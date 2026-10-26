"""Adds «آلية مراحل إصدار إشعارات البيع» (sales-notice mechanism + notices log) under خدمة الزبائن.
Run after apply.py: python3 apply_notices.py FILE [FILE...]. Also updates analytics-cs.js so the module stays the source."""
import sys,os
here=os.path.dirname(os.path.abspath(__file__))
JS=open(os.path.join(here,'notices.js'),encoding='utf-8').read()
CSS="""
.nm-memo{display:flex;flex-direction:column;gap:10px;font-size:13px;margin:12px 0}.nm-prog{display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--muted)}
.nm-sel{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;margin-bottom:12px}.nm-sel select{height:36px;border:1px solid var(--line);background:var(--surface);border-radius:8px;padding-inline:10px;color:var(--ink);font:inherit}
.nm-head{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:6px 0 12px}.nm-head h3{margin:0;font-family:var(--f-display);font-size:17px}
.nm-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;position:relative}
.nm-step{display:flex;gap:12px;background:var(--surface);border:1px solid var(--line);border-radius:var(--r);padding:12px 14px}.nm-step.ok{border-inline-start:4px solid var(--ok)}
.nm-n{flex:none;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--neutral-soft);color:var(--muted);font-weight:700}.nm-step.ok .nm-n{background:var(--ok-soft);color:var(--ok)}
.nm-c{flex:1;min-width:0}.nm-t{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.nm-t .btn{margin-inline-start:auto}.nm-q{margin:4px 0 0;font-size:12.5px}
.nm-dl{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 16px;margin:10px 0 0}.nm-dl .full{grid-column:1/-1}.nm-dl dt{font-size:12px;color:var(--muted)}.nm-dl dd{margin:2px 0 0;font-size:13px}
.nm-txt{font-size:13px;line-height:1.7}
.nm-mx td,.nm-mx th{text-align:center}.nm-mx td:nth-child(-n+2),.nm-mx th:nth-child(-n+2){text-align:start}.nm-mx tr{cursor:pointer}.nm-mx tr.sel td{background:var(--accent-soft)}
.nm-dot{display:inline-block;width:12px;height:12px;border-radius:50%;border:2px solid var(--line)}.nm-dot.ok{background:var(--ok);border-color:var(--ok)}
.nm-mini{display:flex;gap:2px;margin-bottom:3px}.nm-mini i{width:9px;height:6px;border-radius:2px;background:var(--line)}.nm-mini i.d{background:var(--ok)}.nm-mini i.c{background:var(--info)}
.nm-track{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}.nm-track li{display:flex;gap:10px;align-items:flex-start;padding:6px 0}.nm-track li>span{flex:none;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:12px;background:var(--neutral-soft);color:var(--muted)}
.nm-track li.d>span{background:var(--ok);color:#fff}.nm-track li.c>span{background:var(--info);color:#fff}.nm-track li>div{display:flex;flex-direction:column;gap:2px;font-size:13px}.nm-track li:not(.d):not(.c) b{color:var(--muted);font-weight:500}
#view tr[data-nt]{cursor:pointer}
@media (max-width:800px){.nm-dl{grid-template-columns:minmax(0,1fr)}}"""
MOD=[
 ("""<button role="tab" data-cs-tab="cu" aria-selected="${u.tab==='cu'}">الزبائن</button></div>""",
  """<button role="tab" data-cs-tab="cu" aria-selected="${u.tab==='cu'}">الزبائن</button><button role="tab" data-cs-tab="nm" aria-selected="${u.tab==='nm'}">آلية إشعارات البيع</button><button role="tab" data-cs-tab="nt" aria-selected="${u.tab==='nt'}">إشعارات البيع (${S.notices.length})</button></div>"""),
 ("""  ${u.tab==='cu'?`<div class="toolbar" style="margin-top:12px">""","""  ${u.tab==='nm'?viewNm():u.tab==='nt'?`<div style="height:12px"></div>${viewNt()}`:u.tab==='cu'?`<div class="toolbar" style="margin-top:12px">"""),
 ("afterRender.cs=()=>{const u=csUI();\n","afterRender.cs=()=>{const u=csUI();if(u.tab==='nm'||u.tab==='nt'){nmAfter();return}\n"),
]
PAGE=[
 (".muted{color:var(--muted)}",".muted{color:var(--muted)}"+CSS),
 ("const COLS=['contracts','needs','batches','extensions','letters','companies','tickets'];","const COLS=['contracts','needs','batches','extensions','letters','companies','tickets','notices'];"),
 ("letters:[],companies:[],tickets:[],","letters:[],companies:[],tickets:[],notices:[],nm:null,"),
 ("let f2=true;db.doc('config/main')","db.doc('config/notices').onSnapshot(snap=>{S.nm=snap.exists?snap.data():{data:{}};rerender()},()=>{});\n  let f2=true;db.doc('config/main')"),
 ("/^(c-q|n-q|d-q|gq|tk-q|cu-q)$/","/^(c-q|n-q|d-q|gq|tk-q|cu-q|nt-q)$/"),
 ("if(keep&&S.view==='cs'){recompute();renderTk();renderCu()}","if(keep&&S.view==='cs'){recompute();renderTk();renderCu();renderNt()}"),
 ("/* ============ Extensions & letters ============ */",JS.rstrip('\n')+"\n\n/* ============ Extensions & letters ============ */"),
]
FB=[("if(col==='tickets'){CACHE[col]","if(col==='tickets'||col==='notices'){CACHE[col]"),
    ("tickets:'طلب زبون',","tickets:'طلب زبون',notices:'إشعار بيع',"),
    ("if(col==='tickets')return","if(col==='notices')return 'إشعار '+(d.no||'')+' — '+(d.customer||'');if(col==='tickets')return")]
def rep(s,pairs,f):
    for a,b in pairs:
        n=s.count(a);assert n==1,(f,a[:70],n);s=s.replace(a,b)
    return s
mp=os.path.join(here,'analytics-cs.js');m=open(mp,encoding='utf-8').read()
if 'viewNm()' not in m: open(mp,'w',encoding='utf-8').write(rep(m,MOD,mp))
for f in sys.argv[1:]:
    s=open(f,encoding='utf-8').read();assert 'function viewNm(' not in s,f+': already applied'
    s=rep(s,MOD+PAGE+(FB if 'firebase-app-compat' in s else []),f)
    open(f,'w',encoding='utf-8').write(s);print('patched',f)
