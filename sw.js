var CACHE_SITE = 'smd-pwa-site-v.1.1.1.1';
var urlsToCache = [
'/stationMD/index.html',
'/stationMD/offline.html',
'/stationMD/sample-pwa-shortcut-1.html',
'/stationMD/sample-pwa-shortcut-2.html',
'/stationMD/css/pwa.css',
'/stationMD/js/controller.js',
'/stationMD/manifest.json',
'/stationMD/img/favicon/logo.svg',
'/stationMD/img/favicon/favicon.ico',
'/stationMD/img/pwa/pwa.svg',
'/stationMD/img/pwa/512.png',
'/stationMD/img/pwa/maskable_icon.png',
'/stationMD/img/pwa/desc-1.png',
'/stationMD/img/pwa/desc-2.png',
'/stationMD/img/pwa/desc-3.png'
];
self.addEventListener('install', function(event) {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_SITE)
        .then(function(cache) {
            return cache.addAll(urlsToCache, {cache: 'reload'});
        })
        );
});
self.addEventListener('activate', event => {
    var cacheKeeplist = [CACHE_SITE];
    self.clients.claim();
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (cacheKeeplist.indexOf(key) === -1) {
                    console.log('SW: Updated.');
                    return caches.delete(key);
                }
            }));
        })

        );
});
self.addEventListener("fetch", (event) => {
    if ((event.request.method != 'POST')) { 
        event.respondWith(
            (async () => {
                try {
                    const networkResponse = await fetch(event.request);
                    return networkResponse;
                } catch (error) {
                    const cacheResponse = await caches.match(event.request);
                    if (cacheResponse) {
                        return cacheResponse;
                    }
                    const fallbackResponse = await caches.match('/stationMD/offline.html');
                    if (fallbackResponse) {
                        return fallbackResponse;
                    }
                }
            })()
            );
    }
});