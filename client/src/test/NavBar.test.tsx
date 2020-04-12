import React from 'react'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { store } from '../models/redux/store'
import NavBar from '../components/NavBar'

it('Renders NavBar Correctly', () => {
    render(
        <Provider store={store}>
            <Router>
                <NavBar />
            </Router>
        </Provider>
    )

    // * Test for Links in App
    expect(screen.findByText('Registrum')).toBeDefined()
    expect(screen.findByText('Login')).toBeDefined()
    expect(screen.findByText('Register')).toBeDefined()
})
