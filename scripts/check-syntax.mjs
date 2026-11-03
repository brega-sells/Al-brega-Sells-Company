// Parses every first-party script (and the inline scripts of index.html) so a typo never reaches GitHub Pages.
// Usage: node scripts/check-syntax.mjs   → exits 1 and names the file on the first syntax error.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = fs.readdirSync(root).filter(f => f.endsWith('.js') && !['firebase.js', 'extras-cloud.js'].includes(f));
let bad = 0;
const check = (name, src) => { try { new Function(src); console.log('ok   ', name); } catch (e) { bad++; console.log('ERROR', name, '→', e.message); } };
for (const f of files) check(f, fs.readFileSync(path.join(root, f), 'utf8'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let i = 0; for (const m of html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g)) { i++; if (/application\/json/.test(m[1])) { try { JSON.parse(m[2]); console.log('ok   ', `index.html json #${i}`); } catch (e) { bad++; console.log('ERROR', `index.html json #${i}`, '→', e.message); } } else check(`index.html inline #${i}`, m[2]); }
for (const m of html.matchAll(/<script[^>]*\bsrc="([^"]+)"/g)) { if (!/^https?:/.test(m[1]) && !fs.existsSync(path.join(root, m[1]))) { bad++; console.log('ERROR missing script', m[1]); } }
const rules = fs.readFileSync(path.join(root, 'firestore.rules'), 'utf8');
if (!/rules_version = '2'/.test(rules)) { bad++; console.log('ERROR firestore.rules missing rules_version'); }
console.log(bad ? `${bad} problem(s)` : 'all scripts parse'); process.exit(bad ? 1 : 0);
