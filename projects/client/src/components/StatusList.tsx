import React, { FC } from 'react'
import { Container, Row } from 'react-bootstrap'
import StatusView from './StatusView'
import Listing from '../models/interfaces/Listing'

interface StatusListProps {
    statuses: Listing[]
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
