import React from 'react'
import NavBar from '../components/NavBar'
import { Provider } from 'react-redux'
import { store } from '../models/redux/store'
import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
it('Renders NavBar Correctly', () => {
    render(
        <Provider store={store}>
            <Router>
                <NavBar />
            </Router>
        </Provider>
    )

    // * Test for Links in App
    expect(screen.getByText('Registrum')).toBeDefined()
    expect(screen.getByText('About Us')).toBeDefined()
    expect(screen.getByText('Contact')).toBeDefined()
    expect(screen.getByText('Login')).toBeDefined()
    expect(screen.getByText('Register')).toBeDefined()
})
