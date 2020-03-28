import React, { useState } from 'react'

import { Button, Modal, Form } from 'react-bootstrap'

import { signUp } from '../utils/functions/authentication'

const SignUp = () => {
    const [show, toggleShow] = useState(false)
    const [validated, setValidated] = useState(false)

    const [fName, setFName] = useState('')
    const [lName, setLName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setValidated(true)

        const nameRegex = /[a-zA-Z]+[a-zA-Z0-9\s]+[a-zA-Z]/
        if (!nameRegex.test(fName) || !nameRegex.test(lName)) {
            return
        }

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
        setFName('')
        setLName('')
        setEmail('')
        setPassword('')

        await signUp(fName, lName, email, password)
    }

    return (
        <>
            <span onClick={() => toggleShow(!show)}>Register</span>

            <Modal show={show} onHide={() => toggleShow(!show)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form validated={validated}>
                        <Form.Group controlId="validationFirstName">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                placeholder="Jon"
                                value={fName}
                                type="text"
                                required
                                pattern="[a-zA-Z]+[a-zA-Z0-9\s]+[a-zA-Z]"
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (e.key === ' ') {
                                        e.preventDefault()
                                        setFName(fName + ' ')
                                    }
                                }}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    console.log(e.target.value)
                                    setFName(e.target.value)
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Your firstname must start with a alphanumeric character and should
                                not contain any special characters.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="validationLastName">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                placeholder="Doe"
                                value={lName}
                                required
                                pattern="[a-zA-Z]+[a-zA-Z0-9\s]+[a-zA-Z]"
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                    if (e.key === ' ') {
                                        e.preventDefault()
                                        setLName(lName + ' ')
                                    }
                                }}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setLName(e.target.value)
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Your lastname must start with a alphanumeric character and should
                                not contain any special characters.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="validationEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                required
                                value={email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setEmail(e.target.value)
                                }}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a valid email
                            </Form.Control.Feedback>
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="validationPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                required
                                pattern="(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}"
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

                        <Form.Group>
                            <Button variant="primary" onClick={handleClick}>
                                Sign Up
                            </Button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default SignUp
