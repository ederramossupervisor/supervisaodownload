// Service Worker para GitHub Pages
const CACHE_NAME = 'supervisao-v1';
const urlsToCache = [
  '/supervisaodownload/',
  '/supervisaodownload/index.html',
  '/supervisaodownload/css/style.css',
  '/supervisaodownload/js/config.js',
  '/supervisaodownload/js/documents.js', 
  '/supervisaodownload/js/api.js',
  '/supervisaodownload/js/app.js',
  '/supervisaodownload/manifest.json'
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
