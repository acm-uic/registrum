import React, { useState } from 'react'

import { Button, Modal, Form } from 'react-bootstrap'

import { signIn } from '../utils/functions/authentication'
import * as serviceWorker from '../serviceWorker'

const SignIn = () => {
    const [show, toggleShow] = useState(false)
    const [validated, setValidated] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const doSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setValidated(true)

        // * Verify that the email matches according to W3C standard
        if (!/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
            return
        }

        // * Verify the the password is adhering to out standard
        // * Length is atleast than 8
        // * Has one lower case and upper case English letter
        // * Has one digit and one special character
        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password)) {
            return
        }

        setValidated(false)
        toggleShow(false)
        setEmail('')
        setPassword('')

        // todo: make a subscription object using service worker here and send it w/ login route


        await serviceWorker.registerWithLogin();

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
                    <Form validated={validated}>
                        <Form.Group controlId="validationEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                placeholder="Enter email"
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setEmail(e.target.value)
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid email
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                We&apos;ll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="validationPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setPassword(e.target.value)
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Your password must be atleast 8 characters long and have a digit, a
                                special character, and an uppercase and lowercase English letter
                            </Form.Control.Feedback>
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
