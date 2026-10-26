RULES.push([/^المادة \((\d+)\) — (.+)$/,m=>'Article ('+m[1]+') — '+(tr(m[2])||m[2]).trim()]);
RULES.push([/^مرحبًا (.*)\. حسابك$/,m=>'Hello '+m[1]+'. Your account']);
RULES.push([/^(\d+) (عقد|عقدًا|عقود)$/,m=>m[1]+' contracts']);
RULES.push([/^(\d+) (منشأة|منشآت)$/,m=>m[1]+' facilities']);
RULES.push([/^م(\d+)$/,m=>'L'+m[1]]);
