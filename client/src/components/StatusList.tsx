import React, { FC } from 'react'
import StatusView from './StatusView'
import { Status } from '../models/interfaces/Status'
import { Container, Row, Col } from 'react-bootstrap'

interface StatusListProps {
    statuses: Status[]
}

const StatusList: FC<StatusListProps> = ({ statuses }) => {
    return (
        <Container fluid>
            <Row>
                <Col>
                    {statuses.map((status, index) => (
                        <StatusView key={index} status={status} />
                    ))}
                </Col>
            </Row>
        </Container>
    )
}

export default StatusList
