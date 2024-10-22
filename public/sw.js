/// <reference lib="webworker" />

async function cacheFirstWithRefresh(/** @type {Request} */ request) {
    const fetchResponsePromise = fetch(request).then(async networkResponse => {
        if (networkResponse.ok) {
            const cache = await caches.open('Cluecards');
            cache.put(request, networkResponse.clone());
        } else if (networkResponse.status === 404 && request.url.includes('/assets/')) {
            // Assume that the resource we're looking for was an old version of a dynamic asset, and remove it from the cache
            const cache = await caches.open('Cluecards');
            cache.delete(request);
        }
        return networkResponse;
    });

    return (await caches.match(request)) || (await fetchResponsePromise);
}

self.addEventListener('fetch', (/** @type {FetchEvent} */ event) => {
    event.respondWith(cacheFirstWithRefresh(event.request));
});
