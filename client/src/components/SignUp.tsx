import React, { useState } from 'react'

import { Button, Modal, Form } from 'react-bootstrap'

import { signUp } from '@utils/functions/authentication'

interface ModalButton {
    variant:
        | 'primary'
        | 'secondary'
        | 'success'
        | 'danger'
        | 'warning'
        | 'info'
        | 'dark'
        | 'light'
        | 'link'
        | 'outline-primary'
        | 'outline-secondary'
        | 'outline-success'
        | 'outline-danger'
        | 'outline-warning'
        | 'outline-info'
        | 'outline-dark'
        | 'outline-light'
    size: 'sm' | 'lg'
}

const SignUp = ({ size, variant }: ModalButton) => {
    const [show, toggleShow] = useState(false)

    const [fName, setFName] = useState('')
    const [lName, setLName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <>
            <span onClick={() => toggleShow(!show)}>Register</span>

            <Modal show={show} onHide={() => toggleShow(!show)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                placeholder="Jon"
                                value={fName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setFName(e.target.value)
                                }}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                placeholder="Doe"
                                value={lName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setLName(e.target.value)
                                }}
                            />
                        </Form.Group>

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
                        onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault()

                            toggleShow(false)
                            setFName('')
                            setLName('')
                            setEmail('')
                            setPassword('')

                            await signUp(fName, lName, email, password)
                        }}
                    >
                        Sign Up
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SignUp
