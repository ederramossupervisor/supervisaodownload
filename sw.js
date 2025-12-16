// Service Worker para GitHub Pages
const CACHE_NAME = 'supervisao-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './js/config.js',
  './js/api.js',
  './js/documents.js',
  './js/app.js',
  './manifest.json',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
