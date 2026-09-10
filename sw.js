// Service Worker para GitHub Pages
const CACHE_NAME = 'supervisao-v2'; // ⬆️ versão incrementada: força atualização do cache (preview/edição do documento)
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
  self.skipWaiting(); // ativa o novo SW sem esperar todas as abas fecharem
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Remove caches antigos (ex: supervisao-v1) para não continuar servindo arquivos desatualizados
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(name) { return name !== CACHE_NAME; })
          .map(function(name) { return caches.delete(name); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request);
      });
    })
  );
});
