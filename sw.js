const CACHE_NAME = "rg-dashboard-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Les données de supervision doivent toujours être fraîches : jamais de cache.
  if (url.hostname.endsWith("workers.dev") || url.pathname.includes("/api/")) {
    return;
  }

  // Réseau d'abord pour le shell de l'app : une mise à jour du site doit être
  // visible dès la prochaine ouverture, sans dépendre d'un changement de nom
  // de cache. Le cache ne sert que de secours hors-ligne.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
