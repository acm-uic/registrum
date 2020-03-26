import React, { FC } from 'react'
import { useSelector } from 'react-redux'

import AddClass from '../components/AddClass'
import { User } from '../models/interfaces/User'
import ClassView from '../components/ClassView'

import { Container, Row, Col } from 'react-bootstrap'

const Classes: FC = () => {
    const user: User | null = useSelector((state: any) => state.Auth.user)

    return (
        <div>
            <AddClass />

            <Container fluid>
                <Row>
                    <Col>
                        {user !== null &&
                            user.classes.map(cls => <ClassView key={cls._id} cls={cls} />)}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Classes
