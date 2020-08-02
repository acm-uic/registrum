import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './app/App'
import { store } from './redux/store'
import './index.css'
import './appVersion'
import { encode } from './helpers/functions'

const root = document.createElement('div')
root.id = 'root'
document.body.appendChild(root)

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        document.getElementById('root')
    )
}

render()

if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('./app/App', render)
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/service-worker.js')
        .then(async registration => {
            await registration.update()
            console.log('SW registered: ', registration)

            if (!process.env.WEBPUSHPUBLIC) {
                return
            }

            registration.pushManager
                .subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: encode(process.env.WEBPUSHPUBLIC)
                })
                .then(scr => {
                    console.info('Subscribed to push notification: ', scr)
                })
                .catch(err => {
                    console.error('Failed to subscribe the user: ', err)
                })
        })
        .catch(registrationError => {
            console.log('SW registration failed: ', registrationError)
        })
}
