import React, { FC } from 'react'
import { Card, Container } from 'react-bootstrap'
import { Status } from '../models/interfaces/Status'
import AddClass from './AddClass'

interface StatusPanelProps {
    statuses: Status[];
}
export const StatusPanel: FC<StatusPanelProps> = ({ statuses }) => {
  let openCount = 0
  statuses.forEach(status => {
    if (status.status == 'Open') openCount++
  })

  return (
    <Container className="statuses">
      <Card>
        <Card.Body>
          <Card.Title>
            You are currently tracking 
            {' '}
            {statuses.length}
            {' '}
            {statuses.length === 1 ? 'class' : 'classes'}
            !
          </Card.Title>
        </Card.Body>
      </Card>
      <hr />
      <Card>
        <Card.Body>
          <Card.Title>
            There 
            {' '}
            {openCount === 1 ? 'is' : 'are'} 
            {' '}
            {openCount}
            {' '}
            {openCount === 1 ? 'class' : 'classes'}
            {' '}
            open!
          </Card.Title>
        </Card.Body>
      </Card>
      <hr />
      <AddClass />
    </Container>
  )
}

export default StatusPanel
