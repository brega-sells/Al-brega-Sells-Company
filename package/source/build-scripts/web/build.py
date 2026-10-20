import json,re
src=open('/home/claude/system/index.html',encoding='utf-8').read()
def rep(a,b):
    global src
    assert src.count(a)==1,(src.count(a),a[:80]); src=src.replace(a,b)
rep('<meta name="claude:viewport-fit-sides" content="cover">\n','')
rep('<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>\n',
 '<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>\n<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js"></script>\n<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js"></script>\n<script src="firebase-config.js"></script>\n')
rep('*{box-sizing:border-box}','''*{box-sizing:border-box}
body{margin:0}img{max-width:100%}[hidden]{display:none!important}a.btn{text-decoration:none;color:inherit}
#login{position:fixed;inset:0;z-index:100;background:var(--side);display:grid;place-items:center;padding:16px;overflow:auto}
.lg-card{width:min(420px,100%);background:var(--surface);border-radius:14px;padding:26px 24px;display:flex;flex-direction:column;gap:14px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
.lg-brand{display:flex;gap:12px;align-items:center;margin-bottom:6px}.lg-brand h1{font-family:var(--f-display);font-size:17px;margin:0}.lg-brand small{color:var(--muted);font-size:12px}
.lg-brand{flex-direction:column;text-align:center;gap:8px}.lg-brand .brand-mark{width:150px;height:110px;padding:6px}.lg-brand h1{font-size:19px}
.lg-card input{height:40px;border:1px solid var(--line);background:var(--surface);border-radius:8px;padding-inline:10px}
.lg-msg{color:var(--crit);font-size:13px;min-height:1em}.lg-foot{margin:0;color:var(--muted);font-size:12px;text-align:center}.lg-foot a{color:var(--accent)}
.who{display:flex;align-items:center;gap:8px;font-size:12.5px;border-inline-start:1px solid var(--line);padding-inline-start:10px}
.who-name{font-weight:600}.who-role{color:var(--muted)}
@media (max-width:900px){.who-name,.who-role{display:none}}''')
rep("const buf=await f.arrayBuffer();const wb=XLSX.read(buf,{type:'array',cellDates:true});","const wb=await readWorkbook(f);")
rep("const toRows=n=>XLSX.utils.sheet_to_json(wb.Sheets[n],{defval:''});","const toRows=n=>wb.rows(n);")
rep("catch(err){res.innerHTML='<div class=\"banner\">تعذّرت قراءة الملف. تأكد أنه ملف Excel صالح.</div>'}","catch(err){res.innerHTML='<div class=\"banner\">'+esc(err.message||'تعذّرت قراءة الملف.')+'</div>'}")
# remove pdf upload UI (no storage)
rep("""${S.canWrite&&S.assets?`<div style="margin-top:8px"><label class="btn sm">${I.up}إرفاق PDF<input type="file" accept="application/pdf" data-act="upload-pdf" data-id="${c.id}" hidden></label></div>`:''}""","")
rep('  loadArticles();\n','')
seed=json.dumps(json.load(open('/home/claude/server-pkg/seed/initial-data.json',encoding='utf-8')),ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
arts=json.dumps(json.load(open('/home/claude/system/articles.json',encoding='utf-8')),ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
xl=open('/home/claude/standalone/build/extras.js',encoding='utf-8').read()
xl=xl[xl.index('/* ---- ZIP helpers'):xl.index('/* ---- banner + settings')]
rep('<script>\n"use strict";\n/* ============ Icons',
    '<script type="application/json" id="seed-data">'+seed+'</script>\n<script type="application/json" id="articles-data">'+arts+'</script>\n<script>\n'+open('build/firebase.js',encoding='utf-8').read()+'\n</script>\n<script>\n"use strict";\n/* ============ Icons')
src=src.rstrip()+'\n<script>\n"use strict";\n'+xl+'\n'+open('build/extras-cloud.js',encoding='utf-8').read()+'\n</script>\n'
src='<!doctype html>\n<html lang="ar" dir="rtl">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1">\n<link rel="icon" href="data:,">\n</head>\n<body>\n'+src+'</body>\n</html>\n'
open('site/index.html','w',encoding='utf-8').write(src)
open('site/firebase-config.js','w',encoding='utf-8').write('''// الصق هنا إعدادات مشروع Firebase الخاص بك (من: Project settings → Your apps → SDK setup and configuration)
// استبدل القيم بين علامات التنصيص فقط، ولا تغيّر أسماء الحقول.
window.FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000"
};
''')
open('site/firestore.rules','w',encoding='utf-8').write('''rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() { return request.auth != null && request.auth.token.email != null; }
    function rolePath() { return /databases/$(database)/documents/roles/$(request.auth.token.email); }
    function hasRole() { return signedIn() && exists(rolePath()); }
    function role() { return get(rolePath()).data.role; }
    function isAdmin() { return hasRole() && role() == 'admin'; }
    function canWrite() { return hasRole() && role() in ['admin', 'editor']; }

    match /roles/{email} {
      allow read: if signedIn() && (email == request.auth.token.email || isAdmin());
      allow write: if isAdmin();
    }
    match /log/{id} {
      allow read: if isAdmin();
      allow create: if canWrite();
    }
    match /{col}/{id} {
      allow read: if hasRole() && col in ['contracts','needs','batches','extensions','letters','companies','config'];
      allow write: if canWrite() && col in ['contracts','needs','batches','extensions','letters','companies','config'];
    }
  }
}
''')
open('site/.nojekyll','w').write('')
print(len(src))
