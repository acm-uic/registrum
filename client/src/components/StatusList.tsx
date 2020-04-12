import React, { FC } from 'react'
import { Container, Row } from 'react-bootstrap'
import StatusView from './StatusView'
import { Status } from '../models/interfaces/Status'

interface StatusListProps {
    statuses: Status[];
}

const StatusList: FC<StatusListProps> = ({ statuses }) => (
    <Container fluid>
        <Row>
            {statuses.map((status, index) => (
                <StatusView key={index} status={status} />
            ))}
        </Row>
    </Container>
)

export default StatusList
