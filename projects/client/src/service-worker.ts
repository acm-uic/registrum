import { registerRoute } from 'workbox-routing';
import { precacheAndRoute } from 'workbox-precaching';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope;

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
  ({ url }) =>
    url.origin === 'https://static2.sharepointonline.com' ||
    (url.origin === 'https://spoprod-a.akamaihd.net' && url.pathname.startsWith('files/fabric/assets')),
  new CacheFirst({
    cacheName: 'fluent-ui-fonts',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 Year
        maxEntries: 30
      })
    ]
  })
);

// Cache images with a cache-first strategy for 30 days.
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
      })
    ]
  })
);

// Cache scripts and css files with stale-while-revalidate strategy.
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
);

self.addEventListener('push', async (event: PushEvent) => {
  // * Ask for permission
  if (Notification.permission === 'default') {
    await Notification.requestPermission();
  }

  // * Permission granted -> Subscribe
  if (Notification.permission === 'granted') {
    console.log('Permissions for Notification granted');

    const message = event.data?.text();

    // * Setup the title and options
    const title = 'Registrum: Class Status';
    const options = {
      body: message
    };

    // * Show the notification
    event.waitUntil(self.registration.showNotification(title, options));
  } else {
    // ! Permissions for Notification not granted
    return;
  }
});

precacheAndRoute(self.__WB_MANIFEST || []);
