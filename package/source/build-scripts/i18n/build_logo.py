"""Replace the embedded logo (sidebar, login card, favicon) with package/source/logo-brega.png / favicon-brega.png."""
import sys, re, base64, os
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
path = sys.argv[1]
s = open(path, encoding='utf-8').read()
logo = 'data:image/png;base64,' + base64.b64encode(open(os.path.join(root, 'logo-brega.png'), 'rb').read()).decode()
fav = 'data:image/png;base64,' + base64.b64encode(open(os.path.join(root, 'favicon-brega.png'), 'rb').read()).decode()
s, n1 = re.subn(r'<link rel="icon" type="image/png" href="data:image/[^"]+">', '<link rel="icon" type="image/png" href="' + fav + '">', s, count=1)
s, n2 = re.subn(r'(<div class="brand-mark" aria-hidden="true"><img src=")data:image/[^"]+(")', lambda m: m.group(1) + logo + m.group(2), s)
assert n1 == 1 and n2 == 2, (n1, n2)
css = '.brand-mark{border-radius:50%!important;background:#fff;padding:0!important;overflow:hidden}.lg-card .brand-mark,.lg-brand .brand-mark{width:130px!important;height:130px!important}\n'
if '.brand-mark{border-radius:50%' not in s:
    s = s.replace('</style>', css + '</style>', 1)
open(path, 'w', encoding='utf-8').write(s)
print('logo ok')
