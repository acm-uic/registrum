import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Button, Col, ListGroupItem } from 'react-bootstrap'
import axios from 'axios'
import { toast } from 'react-toastify'
import Listing from '../models/interfaces/Listing'
import { updateUser } from '../models/store/auth/thunk'
// import { removeClass } from '../utils/functions/authentication'

interface StatusViewProps {
    status: Listing
}

const StatusView: FC<StatusViewProps> = ({ status }) => {
    const dispatch = useDispatch()
    const doRemoveClass = async () => {
        try {
            // * Delete class by CRN
            await axios.post('/api/banner/unsubscribe', { crn: status.courseReferenceNumber })

            // * update user
            dispatch(updateUser())
        } catch (err) {
            toast(err.message as string, { type: 'error' })
        }
    }

    return (
        <Col className="statusView" lg={4}>
            <ListGroupItem
                variant={status.seatsAvailable > 0 ? undefined : 'danger'}
                className="list-group-item list-group-item-action flex-column align-items-start"
            >
                <Card.Title>
                    {status.courseReferenceNumber} - {status.subject}
                    {status.courseNumber}: {status.courseTitle} (
                    {status.seatsAvailable > 0 ? 'OPEN' : 'FULL'})
                </Card.Title>

                <p className="mb-2">
                    <i>
                        {status.scheduleTypeDescription} -{' '}
                        {status.faculty.length > 0 && status.faculty[0].displayName}{' '}
                    </i>
                </p>
                <p className="mb-2">
                    {status.enrollment} / {status.maximumEnrollment} enrolled in this class
                </p>

                <hr />
                <Button block variant="outline-danger" onClick={doRemoveClass}>
                    Remove Class
                </Button>
            </ListGroupItem>
        </Col>
    )
}

export default StatusView
