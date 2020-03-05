import React, { useState } from 'react'

import { Button, Modal, Form } from 'react-bootstrap'

import { signIn } from '@utils/functions/authentication'

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

const SignIn = ({ size, variant }: ModalButton) => {
    const [show, toggleShow] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <>
            <Button variant={variant} size={size} onClick={() => toggleShow(!show)}>
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
                        onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault()

                            toggleShow(false)
                            setEmail('')
                            setPassword('')

                            await signIn(email, password)
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
