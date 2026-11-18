// Il gioco si carica sempre dalla rete (così gli aggiornamenti arrivano subito);
// la copia salvata serve solo se non c'è connessione.
const CACHE = 'kitty-bros-app-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // solo la pagina del gioco, il manifest e le icone: la musica non viene salvata
  const mine = url.origin === self.location.origin && (req.mode === 'navigate' || /\.(webmanifest|png)$/.test(url.pathname));
  if (!mine) return;
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req))
  );
});
