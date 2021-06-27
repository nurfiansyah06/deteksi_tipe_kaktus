// simple pwa config

var cacheVersion = new Date().getTime();
var staticCacheName = "flask-pwa-v" + cacheVersion
const CACHE_NAME = 'static-cache';

const FILES_TO_CACHE = [
  '/static/offline.html',
];

var filesToCache = [
    '/',
    '/offline',
    '/static/pwa/images/favicon.ico',
    '/static/pwa/images/icons/icon-72x72.png',
    '/static/pwa/images/icons/icon-96x96.png',
    '/static/pwa/images/icons/icon-128x128.png',
    '/static/pwa/images/icons/icon-144x144.png',
    '/static/pwa/images/icons/icon-152x152.png',
    '/static/pwa/images/icons/icon-192x192.png',
    '/static/pwa/images/icons/icon-384x384.png',
    '/static/pwa/images/icons/icon-512x512.png',
    '/static/pwa/images/apple-icon-180x180.png',
];

// Cache on install
self.addEventListener('install', (evt) => {
    console.log('[ServiceWorker] Install');
    evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
    );
  
    self.skipWaiting();
  });

// Clear cache on activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => (cacheName.startsWith("flask-pwa-")))
          .filter(cacheName => (cacheName !== staticCacheName))
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// Serve from cache, and return offline page if client is offline 
this.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' || (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request.url).catch(error => {
        return caches.match('/offline');
      })
    );
  } else{
    event.respondWith(caches.match(event.request)
        .then(function (response) {
        return response || fetch(event.request);
      })
    );
  }
});

