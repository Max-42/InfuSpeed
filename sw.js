const CACHE_NAME = 'infusionsrechner-v8';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

// Install & cache all files
self.addEventListener('install', event => {
  self.skipWaiting(); // Force the new Service Worker to activate immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate & clean old caches if needed
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all open pages immediately
});

// Intercept fetches – Serve from cache first, then fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      // Optionally fallback to offline.html if needed
    })
  );
});
