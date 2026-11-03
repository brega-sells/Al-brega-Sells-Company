/* Boot: runs first. Frame-busting, Firebase project config, and the non-blocking web-font swap.
   Kept out of index.html so the Content-Security-Policy can forbid inline scripts. */
if(window.top!==window.self){try{window.top.location=window.self.location}catch(e){document.documentElement.hidden=true}}
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyDHMuE7o8V88tYgtCYZ4dn0RrugUoSWpXY",
  authDomain: "brega-sales.firebaseapp.com",
  projectId: "brega-sales",
  storageBucket: "brega-sales.firebasestorage.app",
  messagingSenderId: "303198855626",
  appId: "1:303198855626:web:d7940867de95c0bea56f33"
};
(function(){const l=document.querySelector('link[data-async-css]');if(!l)return;const on=()=>{l.media='all'};if(l.sheet)on();else l.addEventListener('load',on)})();
