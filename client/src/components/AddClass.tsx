import React, { useState } from 'react'

import { Button, Modal, Form } from 'react-bootstrap'

import { addClass } from '../utils/functions/authentication'

const AddClass = () => {
    const [show, toggleShow] = useState(false)

    const [subject, setSubject] = useState('')
    const [number, setNumber] = useState('')

    const doAddClass = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        toggleShow(false)
        setSubject('')
        setNumber('')

        // Call add class function
        await addClass(subject, number)
    }

    return (
        <>
            {/* For toggling the modal */}
            <span onClick={() => toggleShow(!show)}>Add Class</span>

            <Modal show={show} onHide={() => toggleShow(!show)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Class</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Course Subject</Form.Label>
                            <Form.Control
                                placeholder="AAST"
                                value={subject}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setSubject(e.target.value)
                                }}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Course Number</Form.Label>
                            <Form.Control
                                placeholder="100"
                                value={number}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setNumber(e.target.value)
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={doAddClass}>
                        Track
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddClass
