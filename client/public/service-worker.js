//TODO: add active, install, and push eventListeners

// * event handler for push notifications
// TODO: this should only execute if user is logged in & tracking a class
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