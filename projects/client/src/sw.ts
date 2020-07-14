import { precacheAndRoute } from 'workbox-precaching'
import { clientsClaim, skipWaiting } from 'workbox-core'

declare const self: ServiceWorkerGlobalScope

export function initializeSW() {
    skipWaiting()
    clientsClaim()

    self.addEventListener('push', event => {
        const title = 'Get Started With Workbox'
        const options = {
            body: event.data?.text()
        }
        event.waitUntil(self.registration.showNotification(title, options))
    })

    precacheAndRoute(self.__WB_MANIFEST || [])
}

initializeSW()
