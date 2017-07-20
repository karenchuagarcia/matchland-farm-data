var version = '20170720';
var cacheName = 'matchland-farm-odc-' + version;
var filesToCache = [
  'dataset.'+version+'.js',

  'index.htm',
  'manifest.js',
  'service-worker.js',

  'asset/bootstrap.min.css',
  'asset/bootstrap.min.css.map',
  'asset/jquery.dataTables.min.css',
  'asset/jquery-1.12.4.min.js',
  'asset/dataTables.bootstrap.min.js',
  'asset/jquery.dataTables.min.js',

  'icon/favicon.png',
  'icon/icon-57x57.jpg',
  'icon/icon-72x72.jpg',
  'icon/icon-114x114.jpg',
  'icon/icon-144x144.jpg',

  'images/sort_both.png',
  'images/sort_asc.png',
  'images/sort_desc.png'
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
