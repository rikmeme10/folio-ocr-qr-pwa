const CACHE_NAME = 'folio-ocr-qr-v3';
const CORE = ['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (/tesseract|qrcode/i.test(req.url)) {
    e.respondWith(fetch(req).then(r=>{const copy=r.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,copy)); return r;}).catch(()=>caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then(cached => cached || fetch(req).then(r=>{const copy=r.clone(); caches.open(CACHE_NAME).then(c=>c.put(req,copy)); return r;})));
});