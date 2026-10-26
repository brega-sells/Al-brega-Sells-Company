"""Inject the Arabic/English switcher (i18n-engine.js + dictionaries) and the Arial-bold font into an index.html.
Usage: python3 build_i18n.py path/to/index.html   (idempotent: skips if already injected)"""
import sys, json, os, re
here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from dict1 import D
from dict2 import D2
from dict3 import D3
from dict4 import D4
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
if 'window.I18N=' in s:
    s = re.sub(r'<script id="i18n">.*?</script>\n', '', s, flags=re.S)
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old, s.count(old))
    s = s.replace(old, new)
d = {}; d.update(D); d.update(D2); d.update(D3); d.update(D4)
engine = open(os.path.join(here, 'i18n-engine.js'), encoding='utf-8').read()
rules = open(os.path.join(here, 'rules.js'), encoding='utf-8').read()
engine = engine.replace('/*__DICT__*/', 'add(' + json.dumps(d, ensure_ascii=False, separators=(',', ':')) + ');\n' + rules)
rep('<style>\n/* Layout', '<script id="i18n">\n' + engine + '</script>\n<style>\n/* Layout')
if 'family=Arimo' not in s:
    s = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com/css2\?[^"]*">',
               '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Arimo:wght@700&family=Noto+Sans+Arabic:wght@700&display=swap" media="print" onload="this.media=\'all\'">', s, count=1)
    rep('  --f-display:"Readex Pro","IBM Plex Sans Arabic",Tahoma,sans-serif;\n  --f-body:"IBM Plex Sans Arabic","Segoe UI",Tahoma,sans-serif;',
        '  --f-display:Arial,Arimo,"Noto Sans Arabic",Tahoma,sans-serif;\n  --f-body:Arial,Arimo,"Noto Sans Arabic",Tahoma,sans-serif;')
    rep('font-size:14px;line-height:1.6;direction:rtl}', 'font-size:14px;line-height:1.6;font-weight:700}\n'
        '/* Arial bold everywhere (user request) */\n*,*::before,*::after{font-weight:700!important}\n'
        '.lang-btn{all:unset;cursor:pointer;font-size:12.5px;padding:5px 10px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink);white-space:nowrap}.lang-btn:hover{border-color:var(--accent)}\n'
        '/* LTR (English) adjustments */\n'
        '[dir=ltr] .search svg{right:auto;left:12px}[dir=ltr] .search kbd{left:auto;right:10px}[dir=ltr] .toolbar .grow svg{right:auto;left:10px}\n'
        '[dir=ltr] .nav button[aria-current="true"]{box-shadow:inset 3px 0 0 #3ea0dc}\n'
        '[dir=ltr] .drawer{left:auto;right:0;padding-left:0;padding-right:env(safe-area-inset-right,0px)}\n'
        '[dir=ltr] td,[dir=ltr] dd,[dir=ltr] .drawer-head h3,[dir=ltr] .oc-name{unicode-bidi:plaintext}[dir=ltr] td,[dir=ltr] dd{text-align:left}\n'
        '[dir=ltr] td.n,[dir=ltr] .bar-row .val{text-align:right}\n'
        '[dir=ltr] .oc li:first-child::after{border-top:2px solid var(--oc-line)}[dir=ltr] .oc li:first-child::before{border-top:0}\n'
        '[dir=ltr] .oc li:last-child::before{border-top:2px solid var(--oc-line)}[dir=ltr] .oc li:last-child::after{border-top:0}\n'
        '[dir=ltr] .oc li:only-child::before,[dir=ltr] .oc li:only-child::after{border-top:0}')
open(path, 'w', encoding='utf-8').write(s)
print('ok', len(d), 'entries')
