const CACHE_NAME = "rehmat-masjid-cache-v1";
const urlsToCache = [
    "index.html",
    "4-mah-sathi.html",
    "15-jamat.html",
    "assets/css/style.css",
    "assets/js/data.js",
    "assets/js/main.js",
    "assets/js/15-jamat.js",
    "assets/media/favicon-48.ico",
    "assets/media/favicon-72.ico",
    "assets/media/favicon-96.ico",
    "assets/media/favicon-144.ico",
    "assets/media/favicon-og.ico"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
