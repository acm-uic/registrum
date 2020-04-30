// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA

// NOTE: have to hard code this one since env variable is running into ton of random issues. It only a public key so we should be fine
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

function finishRegisteration(swUrl: string) {
    console.log('in finishRegisteration')

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

        const swUrl = `./service-worker.js`

        if (isLocalhost) {
            finishRegisteration(swUrl)
        } else {
            // Is not localhost. Just register service worker
            finishRegisteration(swUrl)
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
