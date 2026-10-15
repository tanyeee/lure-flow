// ルアーアクション・シミュレータ Service Worker
const VERSION = "v20261015-0358";
const CACHE = "flume-" + VERSION;
const CORE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {}));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("message", e => { if (e.data === "SKIP_WAITING") self.skipWaiting(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(res => {
      if (res && (res.ok || res.type === "opaque")) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
