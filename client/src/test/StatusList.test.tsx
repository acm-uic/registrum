import React from 'react'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { store } from '../models/redux/store'
import StatusList from '../components/StatusList'
import { Class } from '../models/interfaces/Class'
it('Renders StatusList Correctly', () => {
    const statuses: Class[] = [
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
        expect(screen.findByText(status.courseReferenceNumber as string)).toBeDefined()
        expect(screen.findByText('FULL')).toBeDefined()
    })
})
