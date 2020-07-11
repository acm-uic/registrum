import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './app/App'
import { store } from './redux/store'
import './index.css'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

serviceWorker.register()
