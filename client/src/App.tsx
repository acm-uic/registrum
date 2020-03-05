/*
 * File: /src/App.tsx
 * File Created: Wednesday, 11th December 2019 11:29:00 pm
 * Author: Alex Chomiak
 *
 * Last Modified: Sunday, 5th January 2020 4:29:11 pm
 * Modified By: Alex Chomiak
 *
 * Author Github: https://github.com/alexchomiak
 */

import React, { FC } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import Home from '@pages/Home'
import Classes from '@pages/Classes'
import Account from '@pages/Account'

import NavBar from '@components/NavBar'

export const App: FC = () => {
    return (
        <>
            <Router>
                <NavBar />
                <Route exact path="/classes" component={Classes} />
                <Route exact path="/account" component={Account} />
                <Route exact path="/" component={Home} />
            </Router>
        </>
    )
}
