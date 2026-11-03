for(const f of process.argv.slice(2)){console.log('== '+f);const o=JSON.parse(require('fs').readFileSync(f,'utf8'));let last=0;
for(const h of o.hits){if(h.x!==last||h.n){console.log(h.where,'x='+h.x,'n='+h.n,h.tags.join(','));last=h.x}}
console.log('total checks',o.hits.length,'popups',JSON.stringify(o.popups));console.log('errors',o.errors.filter(e=>!/404/.test(e)))}
