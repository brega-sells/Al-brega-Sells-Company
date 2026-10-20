import re
src=open('/home/claude/system/index.html',encoding='utf-8').read()
def rep(a,b,cnt=1):
    global src
    assert src.count(a)==cnt,(src.count(a),a[:90]); src=src.replace(a,b)
rep('<meta name="claude:viewport-fit-sides" content="cover">\n','')
rep('<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>\n','')
rep('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Readex+Pro:wght@500;600;700&display=swap">',
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Readex+Pro:wght@500;600;700&display=swap" media="print" onload="this.media=\'all\'">')
# base reset + login + user chip css
rep('*{box-sizing:border-box}','''*{box-sizing:border-box}
body{margin:0}img{max-width:100%}[hidden]{display:none!important}a.btn{text-decoration:none;color:inherit}
#login{position:fixed;inset:0;z-index:100;background:var(--side);display:grid;place-items:center;padding:16px}
.lg-card{width:min(400px,100%);background:var(--surface);border-radius:14px;padding:26px 24px;display:flex;flex-direction:column;gap:14px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
.lg-brand{display:flex;gap:12px;align-items:center;margin-bottom:6px}.lg-brand h1{font-family:var(--f-display);font-size:17px;margin:0}.lg-brand small{color:var(--muted);font-size:12px}
.lg-brand{flex-direction:column;text-align:center;gap:8px}.lg-brand .brand-mark{width:150px;height:110px;padding:6px}.lg-brand h1{font-size:19px}
.lg-card input{height:40px;border:1px solid var(--line);background:var(--surface);border-radius:8px;padding-inline:10px}
.lg-msg{color:var(--crit);font-size:13px;min-height:1em}.lg-foot{margin:0;color:var(--muted);font-size:12px;text-align:center}
.who{display:flex;align-items:center;gap:8px;font-size:12.5px;border-inline-start:1px solid var(--line);padding-inline-start:10px}
.who-name{font-weight:600}.who-role{color:var(--muted)}
@media (max-width:900px){.who-name,.who-role{display:none}}''')
rep("const buf=await f.arrayBuffer();const wb=XLSX.read(buf,{type:'array',cellDates:true});","const wb=await readWorkbook(f);")
rep("const toRows=n=>XLSX.utils.sheet_to_json(wb.Sheets[n],{defval:''});","const toRows=n=>wb.rows(n);")
rep('<script>\n"use strict";\n/* ============ Icons','<script>\n'+open('build/adapter.js',encoding='utf-8').read()+'\n</script>\n<script>\n"use strict";\n/* ============ Icons')
src=src.rstrip()
assert src.endswith('</script>')
src+='\n<script>\n'+open('build/extras.js',encoding='utf-8').read()+'\n</script>\n'
# titles in settings referencing Claude: none. Wrap document.
src='<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n</head>\n<body>\n'+src+'</body>\n</html>\n'
assert 'claude' not in re.sub(r'window\.claude|claude\.use|S\.db|window\.__','',src).lower().replace('claude.use',''), [m.start() for m in re.finditer('claude',src.lower())][:5]
open('static/index.html','w',encoding='utf-8').write(src)
print('ok',len(src))
