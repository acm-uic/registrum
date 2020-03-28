import React, { FC } from 'react'
import { updateUser } from '../models/redux/actions/auth'
import { useDispatch } from 'react-redux'
import { Card } from 'react-bootstrap'
import { Status } from '../models/interfaces/Status'
import axios from 'axios'
import { toast } from 'react-toastify'
// import { removeClass } from '../utils/functions/authentication'

interface StatusViewProps {
    status: Status
}

const StatusView: FC<StatusViewProps> = ({ status }) => {
    const dispatch = useDispatch()
    const doRemoveClass = async () => {
        try {
            await axios.post('/api/banner/unsubscribe', { crn: status.crn })

            // * update user
            dispatch(updateUser())
        } catch (err) {
            toast(err.message as String, { type: 'error' })
        }
    }

    return (
        <>
            <Card bg="info" text="dark" style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>
                        {status.crn} - {status.status}
                    </Card.Title>
                    <Card.Link onClick={doRemoveClass}>Remove Class</Card.Link>
                </Card.Body>
            </Card>
        </>
    )
}

export default StatusView
