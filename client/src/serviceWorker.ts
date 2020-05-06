declare let self: ServiceWorkerGlobalScope

// * Checks if client is on localhost
const isLocalhost = Boolean(
    self.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        self.location.hostname === '[::1]' ||
        // 127.0.0.0/8 are considered localhost for IPv4.
        self.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

// * Converting public key
function toByteArray(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

    const rawData = self.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}
const publicKey = toByteArray(
    'BK_0D9VS_RrjJh3BRbdBifq6Ump45KpzfwWxk6P6sVOSTcrc89TzWlgtM1f7R7hOiKQsOxZHlGNGRiex02n9-9g'
)

// * Finish SW Setup (Subscribe to Notifications)
export const initializeSW = (registration: ServiceWorkerRegistration) => {
    // * Ask for permission
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(() => {
            // * Permission has been set
        })
    }

    // * Permission granted -> Subscribe
    if (Notification.permission === 'granted') {
        console.log('Permission Granted')

        registration.pushManager
            .subscribe({
                userVisibleOnly: true,
                applicationServerKey: publicKey
            })
            .then(function (subscription) {
                console.log('User is subscribed.')
                console.log('initial subscription: ' + subscription)
            })
            .catch(function (err) {
                console.log('Failed to subscribe the user: ', err)
            })
    }
}

export function register() {
    if ('serviceWorker' in navigator && (process.env.NODE_ENV === 'production' || isLocalhost)) {
        console.log(
            'serviceWorker' in navigator && (process.env.NODE_ENV === 'production' || isLocalhost)
        )

        const swUrl = `./serviceWorker.js`

        if ('Notification' in self)
            navigator.serviceWorker
                .register(swUrl)
                .then(() => {
                    // * Successfully registered Service Worker
                })
                .catch(error => {
                    console.error('Error during service worker registration:', error)
                })
    } else {
        console.error('Service Worker not supported')
    }
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then(registration => {
                registration.unregister()
            })
            .catch(error => {
                console.error(error.message)
            })
    }
}

self.addEventListener('push', event => {
    const message = event.data?.text()

    // * Setup the title and options
    const title = 'Registrum: Class Status'
    const options = {
        body: message
    }

    // * Show the notification
    event.waitUntil(self.registration.showNotification(title, options))
})
