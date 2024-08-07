const CACHE_NAME = 'balance-reloaded-cache-v1';
const urlsToCache = [
    '/',
    'index.html',
    'styles.css',
    'app.js',
    'img/logo.png',
    'data/users.json',
    'data/quotes.json'
];

// Installation des Service Workers und Hinzufügen von Dateien zum Cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache wird geöffnet');
                return cache.addAll(urlsToCache);
            })
    );
});

// Abrufen von Anfragen
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache-Hit, Antwort von Cache
                if (response) {
                    return response;
                }
                // Kein Cache-Hit, Anfrage vom Netzwerk
                return fetch(event.request);
            })
    );
});

// Aktivierung des Service Workers und Entfernen alter Caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
