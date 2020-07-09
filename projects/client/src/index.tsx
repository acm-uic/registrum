import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from './app/store'
import { configureFakeAPI } from './helpers/FakeAPI'
import './index.css'

if (process.env.NODE_ENV === 'development') configureFakeAPI()

const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

const render = () => {
    const App = require('./app/App').default

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
