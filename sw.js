const version = "0.6.18";
const cacheName = 'regis-'+version;
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
		debugger;
      return cache.addAll([
		'/',
        '/index.html',
        '/styles/styles.css',
		'/js/main.js',
        '/js/offline.js',
        '/js/underscore.min.js',
        '/js/jquery-3.2.0.min.js',
		'/assets/icons/icon-72x72.png',
		'/assets/icons/icon-96x96.png',
		'/assets/icons/icon-128x128.png',
		'/assets/icons/icon-144x144.png',
		'/assets/icons/icon-152x152.png',
		'/assets/icons/icon-192x192.png',
		'/assets/icons/icon-384x384.png',
		'/assets/icons/icon-512x512.png'
      ])
          .then(() => self.skipWaiting()).catch(function(err) {
 console.log(err);
});
    }).catch(function(err) {
 console.log(err);
})
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open('mysite-dynamic').then(function(cache) {
      return cache.match(event.request).then(function(response) {
        var fetchPromise = fetch(event.request).then(function(networkResponse) {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        })
        return response || fetchPromise;
      })
    })
  );
});