importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// Hỗ trợ hiển thị System Push Notification khi chạy ngầm / khóa màn hình
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon, data } = event.data;
    self.registration.showNotification(title, {
      body: body,
      icon: icon || '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      vibrate: [200, 100, 200, 100, 200],
      data: data,
      tag: 'lovespace_notification',
      renotify: true,
    });
  }
});
