const CACHE_NAME = 'memorow-cache-v11';
const urlsToCache = [
  'memorow.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];

// Install: キャッシュ登録 + 即時更新（skipWaiting）
self.addEventListener('install', event => {
  self.skipWaiting(); // ← 旧SW待たずに即アクティブ
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate: 古いキャッシュ削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME) // 今回のCACHE以外を削除
          .map(key => caches.delete(key))
      );
    })
  );
  return self.clients.claim(); // 即座にページ制御
});

// Fetch: キャッシュ優先、なければネットワーク
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
