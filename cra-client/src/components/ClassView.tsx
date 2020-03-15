import React, { FC } from 'react'
import { Class } from '../models/interfaces/Class'

import { Card } from 'react-bootstrap'

interface ClassViewProps {
    cls: Class
}

const ClassView: FC<ClassViewProps> = ({ cls }) => {
    return (
        <>
            <Card bg="info" key={cls.subject + cls.number} text="dark" style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title>{cls.subject + ' ' + cls.number}</Card.Title>
                    <Card.Text>Status on this class</Card.Text>
                </Card.Body>
            </Card>
        </>
    )
}

export default ClassView
