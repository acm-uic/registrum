import React, { useState } from 'react'

import { Button, Modal, Form } from 'react-bootstrap'

const SignIn = () => {
    const [show, toggleShow] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <>
            <Button variant="primary" onClick={() => toggleShow(!show)}>
                Log In
            </Button>

            <Modal show={show} onHide={() => toggleShow(!show)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sign In</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setEmail(e.target.value)
                                }}
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setPassword(e.target.value)
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={(e: React.ChangeEvent<HTMLInputElement>) => {
                            e.preventDefault()
                        }}
                    >
                        Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SignIn
