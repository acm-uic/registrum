import React, { FC } from 'react'
import { useDispatch } from 'react-redux'
import { Card, Button, Col } from 'react-bootstrap'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Status } from '../models/interfaces/Status'
import { updateUser } from '../models/redux/actions/auth'
// import { removeClass } from '../utils/functions/authentication'

interface StatusViewProps {
    status: Status
}

const StatusView: FC<StatusViewProps> = ({ status }) => {
    const dispatch = useDispatch()
    const doRemoveClass = async () => {
        try {
            // * Delete class by CRN
            await axios.post('/api/banner/unsubscribe', { crn: status.crn })

            // * update user
            dispatch(updateUser())
        } catch (err) {
            toast(err.message as string, { type: 'error' })
        }
    }

    return (
        <Col className="statusView" lg={4}>
            <Card>
                <Card.Header>
                    <Card.Title>
                        {status.crn} -{status.status}
                    </Card.Title>
                </Card.Header>
                <Card.Body>More Class Information Here (TODO)</Card.Body>
                <Card.Footer>
                    <Button variant="outline-danger" onClick={doRemoveClass}>
                        Remove Class
                    </Button>
                </Card.Footer>
            </Card>
        </Col>
    )
}

export default StatusView
