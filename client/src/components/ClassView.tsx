import React, { FC } from 'react'
import { Class } from '../models/interfaces/Class'

import { Card } from 'react-bootstrap'

import { removeClass } from '../utils/functions/authentication'

interface ClassViewProps {
    cls: Class
}

const ClassView: FC<ClassViewProps> = ({ cls }) => {
    const doRemoveClass = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()

        // Call add class function
        await removeClass(cls._id)
    }

    return (
        <>
            <Card
                bg="info"
                key={cls.subject + cls.number + cls._id}
                text="dark"
                style={{ width: '18rem' }}
            >
                <Card.Body>
                    <Card.Title>{cls.subject + ' ' + cls.number}</Card.Title>
                    <Card.Text>Status on this class</Card.Text>
                    <Card.Link
                        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => doRemoveClass(e)}
                    >
                        Remove Class
                    </Card.Link>
                </Card.Body>
            </Card>
        </>
    )
}

export default ClassView
