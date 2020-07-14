import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './app/App'
import { store } from './redux/store'
import './index.css'
import './appVersion'

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

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
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('SW registered: ', registration);
            registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: APPLICATION_SERVER_KEY });
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
