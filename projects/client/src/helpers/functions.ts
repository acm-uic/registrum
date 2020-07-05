import { initializeSW } from '../serviceWorker'

export const getSubscriptionObject = async () => {
    //* navigator --> the core of service workers
    if ('serviceWorker' in navigator) {
        try {
            // * Getting the registration object
            const registration = await navigator.serviceWorker.ready

            initializeSW(registration)

            // * using the registration object --> to get the subscription object
            const subscription = await registration.pushManager.getSubscription()

            // * Return subscription if not null
            return subscription !== null ? JSON.stringify(subscription) : null
        } catch (err) {
            console.error(err)
            return null
        }
    } else {
        return null
    }
}
