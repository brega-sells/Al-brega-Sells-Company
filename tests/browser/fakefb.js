/* Fake firebase-compat for browser tests. Data comes from window.__FAKE = {user:{email,displayName,emailVerified}, data:{col:{id:doc}}} */
(function(){
const F=window.__FAKE||{user:null,data:{}};
const DB={};for(const c in F.data){DB[c]=new Map(Object.entries(F.data[c]));}
const LIS=[];const log=[];window.__FBLOG=log;
function clone(x){return x==null?x:JSON.parse(JSON.stringify(x))}
function col(c){if(!DB[c])DB[c]=new Map();return DB[c]}
function emitAll(c){LIS.filter(l=>l.col===c).forEach(l=>{try{l.fire()}catch(e){console.error(e)}})}
function docSnap(c,id){const d=col(c).get(id);return {id,exists:!!d,data:()=>clone(d),metadata:{hasPendingWrites:false,fromCache:false},ref:docRef(c,id)}}
function match(d,f,op,v){const x=d?d[f]:undefined;if(op==='==')return x===v;if(op==='!=')return x!==v;if(op==='array-contains')return Array.isArray(x)&&x.includes(v);if(op==='in')return v.includes(x);if(op==='>=')return x>=v;if(op==='<=')return x<=v;if(op==='>')return x>v;if(op==='<')return x<v;return true}
function query(c,filters,order,lim){
  let rows=[...col(c).entries()].filter(([id,d])=>filters.every(([f,op,v])=>match(d,f,op,v)));
  if(order){const [f,dir]=order;rows.sort((a,b)=>{const x=a[1][f],y=b[1][f];return (x>y?1:x<y?-1:0)*(dir==='desc'?-1:1)})}
  if(lim)rows=rows.slice(0,lim);
  const docs=rows.map(([id])=>docSnap(c,id));
  return {docs,size:docs.length,empty:!docs.length,forEach:f=>docs.forEach(f),docChanges:()=>docs.map(doc=>({type:'added',doc,oldIndex:-1,newIndex:0})),metadata:{hasPendingWrites:false,fromCache:false}}
}
function docRef(c,id){return {id,path:c+'/'+id,
  get:async()=>docSnap(c,id),
  set:async(d,o)=>{log.push(['set',c,id,clone(d)]);if(o&&o.merge){col(c).set(id,Object.assign({},col(c).get(id)||{},clone(d)))}else col(c).set(id,clone(d));emitAll(c)},
  update:async d=>{log.push(['update',c,id,clone(d)]);if(!col(c).has(id))throw Object.assign(new Error('not-found'),{code:'not-found'});col(c).set(id,Object.assign({},col(c).get(id),clone(d)));emitAll(c)},
  delete:async()=>{log.push(['delete',c,id]);col(c).delete(id);emitAll(c)},
  onSnapshot:(cb,err)=>{const l={col:c,fire:()=>cb(docSnap(c,id))};LIS.push(l);setTimeout(l.fire,0);return()=>{const i=LIS.indexOf(l);if(i>=0)LIS.splice(i,1)}},
  collection:sub=>colRef(c+'/'+id+'/'+sub)}}
function colRef(c,filters=[],order=null,lim=0){return {path:c,
  doc:id=>docRef(c,id||('auto'+Math.random().toString(36).slice(2,10))),
  add:async d=>{const id='auto'+Math.random().toString(36).slice(2,10);await docRef(c,id).set(d);return docRef(c,id)},
  where:(f,op,v)=>colRef(c,filters.concat([[f,op,v]]),order,lim),
  orderBy:(f,dir)=>colRef(c,filters,[f,dir||'asc'],lim),
  limit:n=>colRef(c,filters,order,n),
  get:async()=>query(c,filters,order,lim),
  onSnapshot:(cb,err)=>{const l={col:c,fire:()=>cb(query(c,filters,order,lim))};LIS.push(l);setTimeout(l.fire,0);return()=>{const i=LIS.indexOf(l);if(i>=0)LIS.splice(i,1)}}}}
const FS={collection:colRef,doc:p=>{const [c,id]=p.split('/');return docRef(c,id)},enablePersistence:async()=>{},
  batch:()=>{const ops=[];return {set:(r,d)=>ops.push(()=>r.set(d)),update:(r,d)=>ops.push(()=>r.update(d)),delete:r=>ops.push(()=>r.delete()),commit:async()=>{for(const o of ops)await o()}}}};
let authCbs=[];let USER=F.user?Object.assign({emailVerified:true,sendEmailVerification:async()=>{log.push(['verify'])},reload:async()=>{},updateProfile:async()=>{},getIdToken:async()=>'tok',reauthenticateWithCredential:async()=>{log.push(['reauth'])},reauthenticateWithPopup:async p=>{log.push(['reauth-popup',p&&p.providerId])},metadata:{lastSignInTime:new Date().toISOString()}},F.user):null;
const AUTH={get currentUser(){return USER},onAuthStateChanged:cb=>{authCbs.push(cb);setTimeout(()=>cb(USER),0);return()=>{}},
  signOut:async()=>{USER=null;log.push(['signOut']);try{sessionStorage.setItem('fake_signout','1')}catch(e){}authCbs.forEach(cb=>cb(null))},
  signInWithEmailAndPassword:async(e,p)=>{log.push(['signIn',e]);return {user:USER}},
  createUserWithEmailAndPassword:async(e,p)=>{log.push(['register',e]);return {user:USER}},
  sendPasswordResetEmail:async e=>{log.push(['reset',e])},
  signInWithPopup:async p=>{log.push(['popup',p&&p.providerId]);try{sessionStorage.setItem('fake_popup',p&&p.providerId)}catch(e){}if(USER){USER.emailVerified=true;USER.providerData=[{providerId:'google.com'}]}return {user:USER}},
  signInWithRedirect:async p=>{log.push(['redirect',p&&p.providerId])}};
window.firebase={initializeApp:()=>({}),auth:()=>AUTH,firestore:Object.assign(()=>FS,{FieldValue:{serverTimestamp:()=>new Date().toISOString(),arrayUnion:(...a)=>a,delete:()=>null}})};
window.firebase.auth.EmailAuthProvider={credential:(e,p)=>({e,p})};
window.firebase.auth.GoogleAuthProvider=function(){this.providerId='google.com';this.setCustomParameters=()=>this};
window.__FAKEDB=DB;
})();
