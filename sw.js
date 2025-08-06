const CACHE_NAME = 'sheet-music-reader-v2';

// On install, we don't pre-cache anything; we let the fetch handler do it dynamically.
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting()); // Activate worker immediately
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          // Remove caches that are not the current one
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
  return self.clients.claim(); // Take control of all open pages
});

self.addEventListener('fetch', (event) => {
  // We only cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Use a "cache, falling back to network" strategy
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        // Return response from cache if found
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // If the request is successful, cache it.
          if (networkResponse && networkResponse.status === 200) {
            // We must clone the response as it's a one-time use stream
            const responseToCache = networkResponse.clone();
            cache.put(event.request, responseToCache);
          }
          return networkResponse;
        });

        // Return the cached response if it exists, otherwise wait for the network response.
        return response || fetchPromise;
      });
    })
  );
});