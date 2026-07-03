/* KRAFT·Vibe manager — network-first service worker (offline fallback) */
const C='kv-v1';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(res=>{
      if(res.ok&&new URL(e.request.url).origin===location.origin){
        const cl=res.clone();caches.open(C).then(c=>c.put(e.request,cl));
      }
      return res;
    }).catch(()=>caches.match(e.request))
  );
});
