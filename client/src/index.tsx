import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { App } from './App'
import 'react-app-polyfill/ie11'
import 'bootstrap/dist/css/bootstrap.css'
import { register } from './serviceWorker'

// ! Configure Redux Store
import { store } from './models/redux/store'

// * Import styles
import './styles/index.scss'

// * Attempt to fetch current user, and set user

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

register()
