import React from 'react'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { store } from '../models/redux/store'
import StatusView from '../components/StatusView'

it('Renders StatusView Correctly', () => {
    const status = {
        courseReferenceNumber: '12347',
        _id: '12345',
        id: 12345,
        subject: 'Subject',
        subjectDescription: 'Subject Description',
        campusDescription: 'Campus Description',
        scheduleTypeDescription: 'scheduleTypeSubscription',
        creditHours: '3',
        seatsAvailable: 0,
        enrollment: 50,
        maximumEnrollment: 50,
        faculty: [],
        term: 'term',
        courseTitle: 'Fun Class',
        courseNumber: '12345'
    }
    render(
        <Provider store={store}>
            <Router>
                <StatusView key={1} status={status} />
            </Router>
        </Provider>
    )

    // * Test for Links in App
    expect(screen.findByText(status.courseReferenceNumber)).toBeDefined()
    expect(screen.findByText('FULL')).toBeDefined()
})
