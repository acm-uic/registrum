import React, { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Container, Row, Col } from 'react-bootstrap'
import axios from 'axios'
import { Class } from '../models/interfaces/Class'

import StatusList from '../components/StatusList'
import StatusPanel from '../components/StatusPanel'

import { State } from '../models/redux/store'

const Classes: FC = () => {
    const auth = useSelector((state: State) => state.Auth)
    const { user } = auth

    const [statuses, setStatuses] = useState<Class[]>([])

    // * Refresh Class Data on Auth State Change
    useEffect(() => {
        // * Grab class data for use
        axios.get('/api/banner/tracking').then(res => {
            // * Update statuses
            setStatuses(res.data as Class[])
        })
    }, [auth.user])

    return (
        <Container className="classes" fluid style={{ marginTop: '1rem' }}>
            {user !== null && (
                <>
                    <Row className="classInformationTitle">
                        <Col>
                            <h4>Class Information</h4>
                            <hr />
                        </Col>
                    </Row>
                    <Row className="classInformation">
                        <Col lg={3}>
                            <StatusPanel statuses={statuses} />
                        </Col>
                        <Col lg={9}>
                            <StatusList statuses={statuses} />
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    )
}

export default Classes
