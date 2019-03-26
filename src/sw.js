const version = "v1";

self.addEventListener("install", event => {
	event.waitUntil(
		caches
			.open(version)
			.then(cache =>
				cache.addAll([
					"keyframes.css",
					"index.ts",
					"card.jpg",
					"96.png",
					"192.png",
					"512.png",
					"logo.svg",
					"/",
					"/:lang"
				])
			)
	);
});

self.addEventListener("fetch", function(event) {
	event.respondWith(cacheOrNetwork(event.request));
});

function fromNetwork(request) {
	return fetch(request);
}

function cacheOrNetwork(request) {
	return fromCache(request).catch(() => fromNetwork(request));
}

function fromCache(request) {
	return caches
		.open(version)
		.then(cache =>
			cache.match(request).then(matching => matching || Promise.reject(request))
		);
}
