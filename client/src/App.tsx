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

import React, { FC, useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch } from 'react-redux'
import Home from './pages/Home'
import SplashPage from './pages/SplashPage'
import Classes from './pages/Classes'
import Account from './pages/Account'
import NavBar from './components/NavBar'

import { useSelector } from './models/store'
import { updateUser } from './models/store/auth/thunk'

export const App: FC = () => {
    // * Grab current user
    const auth = useSelector(state => state.auth)
    const { user } = auth
    const dispatch = useDispatch()

    useEffect(() => {
        // * Update user on app load / auth state change
        dispatch(updateUser())
    }, [auth])

    return (
        <>
            <ToastContainer
                position="bottom-left"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                draggable
                pauseOnHover
            />
            <Router>
                <NavBar />
                {user !== null ? (
                    <>
                        <Route exact path="/classes" component={Classes} />
                        <Route exact path="/account" component={Account} />
                        <Route exact path="/" component={Home} />{' '}
                    </>
                ) : (
                    <SplashPage />
                )}
            </Router>
        </>
    )
}
