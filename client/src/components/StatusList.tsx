import React, { FC } from 'react'
import { Container, Row } from 'react-bootstrap'
import StatusView from './StatusView'
import { Class } from '../models/interfaces/Class'

interface StatusListProps {
    statuses: Class[]
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
