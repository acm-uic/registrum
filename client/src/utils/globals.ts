import { initializeSW } from '../serviceWorker'

// * Global variables files! Accessible from any file using:
// ?                       import {var} from '@utils/globals'

export const GLOBAL_VARIABLE = 'Hello World!'

export default GLOBAL_VARIABLE

export const getSubscriptionObject = async () => {
    //* navigator --> the core of service workers
    if ('serviceWorker' in navigator) {
        try {
            // * Getting the registeration object
            const registration = await navigator.serviceWorker.ready

            initializeSW(registration)

            // * using the registeration object --> to get the subscription object
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
