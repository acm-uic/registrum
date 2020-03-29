import React, { FC } from 'react'
import { Button, Form } from 'react-bootstrap'

const Account: FC = () => {
    return(
        <div>
            <h4>Account Information</h4>
            <br/><br/>

            <h5>Update Password</h5>

            <Form>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Re-type Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" />
                </Form.Group>

                <Button variant="primary" type="submit">Submit</Button>
            </Form>

            <br/><br/>

            <h5>Update Name</h5>

            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Account Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" />
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
            </Form>

        </div>
    )
}

export default Account
