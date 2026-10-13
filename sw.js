const CACHE_NAME = 'ucwo-cte1-v4';

// Only pre-cache the essential UI shell immediately
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

const PDF_ASSETS = [
  './pdfs/program-of-activities.pdf',
  './pdfs/opening-worship.pdf',
  './pdfs/morning-devotion.pdf',
  './pdfs/closing-worship-evaluation.pdf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Cache UI instantly
      await cache.addAll(CORE_ASSETS);
      
      // 2. Fetch and cache PDFs sequentially (one by one) to avoid choking phone RAM
      for (const pdf of PDF_ASSETS) {
        try {
          const res = await fetch(pdf);
          if (res.ok) await cache.put(pdf, res);
        } catch (err) {
          console.warn('Deferred cache for:', pdf);
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((networkRes) => {
        // Cache dynamic requests (e.g. PDFs accessed directly)
        if (networkRes.ok && event.request.method === 'GET') {
          const clone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkRes;
      });
    })
  );
});