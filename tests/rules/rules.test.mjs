import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import fs from 'fs';
const env=await initializeTestEnvironment({projectId:'demo-brega',firestore:{rules:fs.readFileSync(new URL('../../firestore.rules',import.meta.url),'utf8'),host:'127.0.0.1',port:8085}});
const roles={'admin@b.ly':{role:'admin'},'gm@b.ly':{role:'editor',unit:'gm'},'w@b.ly':{role:'editor',unit:'w'},'e@b.ly':{role:'editor',unit:'e'},'wv@b.ly':{role:'viewer',unit:'w'},'board@b.ly':{role:'viewer',unit:'board'},'nounit@b.ly':{role:'editor'}};
await env.withSecurityRulesDisabled(async c=>{const db=c.firestore();for(const[k,v]of Object.entries(roles))await db.doc('roles/'+k).set(v);
 const base={title:'x',status:'new',progress:0,log:[{a:1}],createdBy:'gm@b.ly',fromUnit:'gm',toUnit:'w'};
 await db.doc('assignments/A1').set(base);await db.doc('assignments/A2').set({...base,toUnit:'e'});await db.doc('assignments/A3').set({...base,fromUnit:'w',toUnit:'w',createdBy:'w@b.ly'});
 await db.doc('config/main').set({t1:90});await db.doc('duties/w').set({items:[]});});
const as=e=>env.authenticatedContext(e.replace(/[^a-z]/g,''),{email:e}).firestore();
let pass=0,fail=0;const T=async(name,p,ok)=>{try{await (ok?assertSucceeds(p):assertFails(p));pass++}catch(e){fail++;console.log('FAIL',name,e.message)}};
const nw=(o)=>Object.assign({title:'t',status:'new',progress:0,log:[{a:1}]},o);
const W=as('w@b.ly'),E=as('e@b.ly'),G=as('gm@b.ly'),A=as('admin@b.ly'),WV=as('wv@b.ly'),B=as('board@b.ly'),N=as('nounit@b.ly');
// reads
await T('w reads A1 (to w)',W.doc('assignments/A1').get(),1);
await T('w cannot read A2',W.doc('assignments/A2').get(),0);
await T('e reads A2',E.doc('assignments/A2').get(),1);
await T('gm reads A2',G.doc('assignments/A2').get(),1);
await T('board reads A2',B.doc('assignments/A2').get(),1);
await T('nounit cannot read',N.doc('assignments/A1').get(),0);
await T('w query toUnit==w',W.collection('assignments').where('toUnit','==','w').get(),1);
await T('w query all denied',W.collection('assignments').get(),0);
await T('gm query all',G.collection('assignments').get(),1);
await T('viewer w reads A1',WV.doc('assignments/A1').get(),1);
// create
await T('w create internal',W.collection('assignments').add(nw({fromUnit:'w',toUnit:'w',createdBy:'w@b.ly'})),1);
await T('w create to e denied',W.collection('assignments').add(nw({fromUnit:'w',toUnit:'e',createdBy:'w@b.ly'})),0);
await T('w spoof fromUnit gm denied',W.collection('assignments').add(nw({fromUnit:'gm',toUnit:'w',createdBy:'w@b.ly'})),0);
await T('w spoof createdBy denied',W.collection('assignments').add(nw({fromUnit:'w',toUnit:'w',createdBy:'gm@b.ly'})),0);
await T('gm create to e',G.collection('assignments').add(nw({fromUnit:'gm',toUnit:'e',createdBy:'gm@b.ly'})),1);
await T('create as done denied',G.collection('assignments').add(nw({fromUnit:'gm',toUnit:'e',createdBy:'gm@b.ly',status:'done'})),0);
await T('viewer create denied',WV.collection('assignments').add(nw({fromUnit:'w',toUnit:'w',createdBy:'wv@b.ly'})),0);
await T('admin create',A.collection('assignments').add(nw({fromUnit:'gm',toUnit:'ca',createdBy:'admin@b.ly'})),1);
// doer updates
await T('w start A1',W.doc('assignments/A1').update({status:'progress',progress:20,log:[{a:1},{a:2}],updatedAt:'x'}),1);
await T('w self-approve denied',W.doc('assignments/A1').update({status:'done',progress:100,log:[{a:1},{a:2},{a:3}],updatedAt:'x'}),0);
await T('w change title denied',W.doc('assignments/A1').update({title:'hack',log:[{a:1},{a:2},{a:3}]}),0);
await T('w rewrite log denied',W.doc('assignments/A1').update({status:'review',log:[{a:9}],updatedAt:'x'}),0);
await T('w submit A1',W.doc('assignments/A1').update({status:'review',progress:100,log:[{a:1},{a:2},{a:3}],updatedAt:'x'}),1);
await T('viewer update denied',WV.doc('assignments/A1').update({status:'progress',log:[{a:1},{a:2},{a:3},{a:4}]}),0);
await T('e update A1 denied',E.doc('assignments/A1').update({status:'progress',log:[{a:1},{a:2},{a:3},{a:4}]}),0);
// issuer
await T('gm approve A1',G.doc('assignments/A1').update({status:'done',doneAt:'x',log:[{a:1},{a:2},{a:3},{a:4}]}),1);
await T('gm move toUnit denied',G.doc('assignments/A2').update({toUnit:'w',log:[{a:1},{a:2}]}),0);
await T('w issuer edits A3',W.doc('assignments/A3').update({title:'y',log:[{a:1},{a:2}]}),1);
// delete
await T('w delete gm-created A2 denied',W.doc('assignments/A2').delete(),0);
await T('gm delete own new A2',G.doc('assignments/A2').delete(),1);
await T('gm delete done A1 denied',G.doc('assignments/A1').delete(),0);
await T('admin delete A1',A.doc('assignments/A1').delete(),1);
// duties & config
await T('editor reads duties',W.doc('duties/w').get(),1);
await T('editor writes duties denied',G.doc('duties/w').set({items:[]}),0);
await T('admin writes duties',A.doc('duties/w').set({items:[]}),1);
await T('editor writes config/main denied',W.doc('config/main').set({t1:1}),0);
await T('editor writes config/notices ok',W.doc('config/notices').set({data:{}}),1);
await T('admin writes config/meetings',A.doc('config/meetings').set({whatsapp:{}}),1);
await T('editor reads config',W.doc('config/main').get(),1);
await T('editor writes contracts ok',W.doc('contracts/c1').set({no:'1'}),1);
await T('viewer writes contracts denied',WV.doc('contracts/c1').set({no:'1'}),0);
console.log(`PASS ${pass} FAIL ${fail}`);await env.cleanup();process.exit(fail?1:0);
