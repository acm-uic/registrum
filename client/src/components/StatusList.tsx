import React, { FC } from 'react'
import StatusView from './StatusView'
import { Status } from '../models/interfaces/Status'
import { Container, Row } from 'react-bootstrap'

interface StatusListProps {
    statuses: Status[]
}

const StatusList: FC<StatusListProps> = ({ statuses }) => {
    return (
        <Container fluid>
            <Row>
                {statuses.map((status, index) => (
                    <StatusView key={index} status={status} />
                ))}
            </Row>
        </Container>
    )
}

export default StatusList
