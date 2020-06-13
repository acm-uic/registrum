import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { configureFakeAPI } from './helpers/FakeAPI'
import './index.css'

if (process.env.NODE_ENV === 'development') configureFakeAPI()

ReactDOM.render(
        <App />,
    document.getElementById('root')
)
