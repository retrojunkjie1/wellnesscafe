/*
  Basic service worker for offline caching.
  This file is served from the app root as /service-worker.js.
  It provides a simple cache-first strategy for navigation requests and static assets.
*/

const CACHE_NAME = 'wellnesscafe-cache-v1';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', (event)=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache)=>cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event)=>{
  event.waitUntil(
    caches.keys().then((keys)=>{
      return Promise.all(
        keys.map((key)=>{
          if(key !== CACHE_NAME){return caches.delete(key);}return undefined;
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event)=>{
  const {request} = event;
  if(request.method !== 'GET'){return;}

  // For navigation requests, use Network falling back to Cache
  if(request.mode === 'navigate'){
    event.respondWith(
      fetch(request).catch(()=>{
        return caches.match('/index.html');
      })
    );
    return;
  }

  // For other GET requests, try cache first, then network and cache it
  event.respondWith(
    caches.match(request).then((cached)=>{
      if(cached){return cached;}
      return fetch(request).then((response)=>{
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache)=>{cache.put(request, cloned);});
        return response;
      }).catch(()=>cached);
    })
  );
});
