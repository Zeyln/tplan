const CACHE = "train-v4.8";

self.addEventListener("install", event => {
	event.waitUntil(
		caches.open(CACHE).then(cache => {
			return cache.addAll([
				"./",
				"./index.html",
				"./manifest.json"
			]);
		})
	);
});

self.addEventListener("activate", event => {
	event.waitUntil(
		caches.keys().then(keys =>
			Promise.all(
				keys.map(key => key !== CACHE && caches.delete(key))
			)
		)
	);
	self.clients.claim();
});

self.addEventListener("fetch", event => {
	event.respondWith(
		caches.match(event.request).then(cached => {
			return cached || fetch(event.request).then(res => {
				const copy = res.clone();
				caches.open(CACHE).then(cache => cache.put(event.request, copy));
				return res;
			});
		})
	);
});
self.addEventListener("message", event => {
	if (event.data && event.data.type === "SKIP_WAITING") {
		self.skipWaiting();
	}
});

