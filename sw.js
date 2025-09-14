const CACHE_NAME = "rehmat-masjid-v1.0.3";

const urlsToCache = [
    "/",
    "/index.html",
    "/4-mah-sathi.html",
    "/assets/css/style.css",
    "/assets/js/main.js",
    "/assets/js/4-mah-sathi.js",
    "/assets/js/data.js",
    "/assets/media/favicon-og.ico"
];

// External URLs to try-catch individually
const externalUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
    "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all([
                cache.addAll(urlsToCache),
                ...externalUrls.map((url) =>
                    fetch(url).then((response) => {
                        if (!response.ok) {
                            throw new Error(`Request failed for ${url}`);
                        }
                        return cache.put(url, response);
                    }).catch((err) => {
                        console.warn(`⚠️ Failed to cache ${url}:`, err);
                    })
                )
            ]);
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
