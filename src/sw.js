const version = "v3.0.3";

self.addEventListener("install", (event) => {
	event.waitUntil(
		caches
			.open(version)
			.then((cache) =>
				cache.addAll([
					"keyframes.css",
					"index.ts",
					"card.jpg",
					"96.png",
					"192.png",
					"512.png",
					"logo.svg",
					"mask.svg",
					"/",
					"/:lang",
				])
			)
	);
});

self.addEventListener("fetch", function (event) {
	event.respondWith(cacheOrNetwork(event.request));
	event.waitUntil(updateCache(event.request));
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
		.then((cache) =>
			cache
				.match(request)
				.then((matching) => matching || Promise.reject(request))
		);
}

function updateCache(request) {
	return caches
		.open(version)
		.then((cache) =>
			fetch(request).then((response) =>
				cache.put(request, response.clone()).then(() => response)
			)
		);
}
