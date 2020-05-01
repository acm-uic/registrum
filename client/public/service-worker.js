// * event handler for push notifications
// * this needs to be here to listen for push event from server since it needs to be vanilla javascript
self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    const serverMessage = event.data.text();
  
    // * this is used to customize the push notification
    const title = 'Class Status';
    const options = {
      body: serverMessage,
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
});