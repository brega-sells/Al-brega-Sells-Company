import json
src=open('/home/claude/system/index.html',encoding='utf-8').read()
def rep(a,b):
    global src
    assert src.count(a)==1,(src.count(a),a[:80]); src=src.replace(a,b)
rep('<meta name="claude:viewport-fit-sides" content="cover">\n','')
rep('<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>\n','')
rep('display=swap">','display=swap" media="print" onload="this.media=\'all\'">')
rep('*{box-sizing:border-box}','*{box-sizing:border-box}\nbody{margin:0}img{max-width:100%}[hidden]{display:none!important}a.btn{text-decoration:none;color:inherit}')
rep("const buf=await f.arrayBuffer();const wb=XLSX.read(buf,{type:'array',cellDates:true});","const wb=await readWorkbook(f);")
rep("const toRows=n=>XLSX.utils.sheet_to_json(wb.Sheets[n],{defval:''});","const toRows=n=>wb.rows(n);")
rep("catch(err){res.innerHTML='<div class=\"banner\">تعذّرت قراءة الملف. تأكد أنه ملف Excel صالح.</div>'}","catch(err){res.innerHTML='<div class=\"banner\">'+esc(err.message||'تعذّرت قراءة الملف. تأكد أنه ملف Excel صالح.')+'</div>'}")
seed=open('/home/claude/server-pkg/seed/initial-data.json',encoding='utf-8').read()
rep('  loadArticles();\n','')
seed=json.dumps(json.loads(seed),ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
arts=json.dumps(json.load(open('/home/claude/system/articles.json',encoding='utf-8')),ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
rep('<script>\n"use strict";\n/* ============ Icons',
    '<script type="application/json" id="seed-data">'+seed+'</script>\n<script type="application/json" id="articles-data">'+arts+'</script>\n<script>\n'+open('build/local.js',encoding='utf-8').read()+'\n</script>\n<script>\n"use strict";\n/* ============ Icons')
src=src.rstrip()+'\n<script>\n'+open('build/extras.js',encoding='utf-8').read()+'\n</script>\n'
src='<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n</head>\n<body>\n'+src+'</body>\n</html>\n'
open('/home/claude/standalone/منظومة-العقود-والاحتياجات.html','w',encoding='utf-8').write(src)
print(len(src))
