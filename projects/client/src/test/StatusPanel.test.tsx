import React from 'react'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { store } from '../models/store'
import StatusList from '../components/StatusList'

it('Renders StatusPanel Correctly', () => {
    const statuses = [
        {
            courseReferenceNumber: '12345',
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
        },
        {
            courseReferenceNumber: '12346',
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
        },
        {
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
    ]
    render(
        <Provider store={store}>
            <Router>
                <StatusList statuses={statuses} />
            </Router>
        </Provider>
    )

    statuses.forEach(status => {
        // * Test for each status in App
        expect(screen.findByText(status.courseReferenceNumber)).toBeDefined()
        expect(screen.findByText('FULL')).toBeDefined()
    })

    expect(screen.findByText('There is 1 class open!'))
    expect(screen.findByText('You are currently tracking 3 classes!'))
})
