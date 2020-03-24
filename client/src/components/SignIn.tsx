import React, { useState } from 'react'

import { Button, Modal, Form } from 'react-bootstrap'

import { signIn } from '../utils/functions/authentication'

const SignIn = () => {
    const [show, toggleShow] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const doSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        toggleShow(false)
        setEmail('')
        setPassword('')

        await signIn(email, password)
    }

    return (
        <>
            {/* For toggling the modal */}
            <span onClick={() => toggleShow(!show)}>Login</span>

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
                    <Button variant="primary" onClick={doSignIn}>
                        Login
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SignIn
