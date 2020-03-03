/*
 * File: /src/index.tsx
 * File Created: Wednesday, 11th December 2019 11:26:29 pm
 * Author: Alex Chomiak
 *
 * Last Modified: Thursday, 12th December 2019 8:30:37 pm
 * Modified By: Alex Chomiak
 *
 * Author Github: https://github.com/alexchomiak
 */

import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './App'
import { Provider } from 'react-redux'

// ! Configure Redux Store
import { store } from './models/redux/store'

// * Import styles
import './styles/index.scss'

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
