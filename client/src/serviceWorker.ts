const applicationServerPublicKey =
    'BK_0D9VS_RrjJh3BRbdBifq6Ump45KpzfwWxk6P6sVOSTcrc89TzWlgtM1f7R7hOiKQsOxZHlGNGRiex02n9-9g'

// * this will ask the user for permission using a browser pop up
async function askUserPermission() {
    console.log('in askUserPermission')
    return await Notification.requestPermission()
}

// * converting public key
function urlB64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

function subscribeUserWithLogin(swRegistration: ServiceWorkerRegistration) {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey)
    swRegistration.pushManager
        .subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey
        })
        .then(function (subscription) {
            console.log('User is subscribed.')
            console.log('initial subscription: ' + subscription)
        })
        .catch(function (err) {
            console.log('Failed to subscribe the user: ', err)
        })
}

function initialize(swRegistration: ServiceWorkerRegistration) {
    // Set the initial subscription value
    swRegistration.pushManager.getSubscription().then(function (subscription) {
        const isSubscribed = !(subscription === null)

        if (isSubscribed) {
            console.log('User IS subscribed.')
        } else {
            console.log('User is NOT subscribed. ')

            // * ask for permission since user is not subscribed
            askUserPermission().then(consent => {
                // * check if user allows or blocks push notifications

                if (consent !== 'granted') {
                    //* user denied permission
                    //TODO: unsubscribe user on the server --> delete them from the database
                } else {
                    //* user approved permission
                    subscribeUserWithLogin(swRegistration)
                }
            })
        }
    })
}

const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.0/8 are considered localhost for IPv4.
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
)

type Config = {
    onSuccess?: (registration: ServiceWorkerRegistration) => void
    onUpdate?: (registration: ServiceWorkerRegistration) => void
}

function finishRegistration(swUrl: string) {
    console.log('in finishRegistration')

    navigator.serviceWorker
        .register(swUrl)
        .then(registration => {
            console.log('Service Worker is registered during login', registration)
            initialize(registration)
        })
        .catch(error => {
            console.error('Error during service worker registration with login:', error)
        })
}

export function registerWithLogin() {
    if ('serviceWorker' in navigator && (process.env.NODE_ENV === 'production' || isLocalhost)) {
        console.log(
            'serviceWorker' in navigator && (process.env.NODE_ENV === 'production' || isLocalhost)
        )

        const swUrl = `./serviceWorker.js`

        if (isLocalhost) {
            finishRegistration(swUrl)
        } else {
            // Is not localhost. Just register service worker
            finishRegistration(swUrl)
        }
    } else {
        console.log('statement not true')
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
