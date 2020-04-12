import React, { useState, useEffect } from 'react'

import { Button, Modal, Form, Dropdown } from 'react-bootstrap'
import axios, { AxiosResponse } from 'axios'

import { useDispatch } from 'react-redux'
import { Class } from '../models/interfaces/Class'

import { updateUser } from '../models/redux/actions/auth'

const AddClass = () => {
    // * Dispatch hook
    const dispatch = useDispatch()

    // * Modal state
    const [show, toggleShow] = useState(false)

    // * Current Term
    const [currentTerm, setCurrentTerm] = useState('')
    // * Current Subject
    const [currentSubject, setCurrentSubject] = useState('')
    // * Current Class
    const [currentClass, setCurrentClass] = useState<Class | null>(null)

    // * Term list
    const [terms, setTerms] = useState([])

    // * Subject list for given term
    const [subjects, setSubjects] = useState([])

    // * Classes for given subject
    const [classes, setClasses] = useState<Class[]>([])

    // * Initial load that sets terms array
    useEffect(() => {
        if (terms.length === 0) {
            // * Fetch subjects from API
            axios.get('/api/classes/terms').then((res: AxiosResponse) => {
                // * Destructure response from API
                const { data: terms } = res

                // * Set terms
                setTerms(terms)
            })
        }
    }, [subjects])

    // * useEffect every time term changes, fetch subjects
    useEffect(() => {
        if (currentTerm.length !== 0) {
            // * Fetch Subject list for term
            axios.get(`/api/classes/subjects/${currentTerm}`).then((res: AxiosResponse) => {
                // * Destructure response from API
                const { data: subjects } = res

                // * Set Subjects
                setSubjects(subjects)

                // * Reset Current Subject & Current Class
                setCurrentSubject('')
                setCurrentClass(null)
            })
        }
    }, [currentTerm])

    // * useEffect every time subject changes, fetch classes
    useEffect(() => {
        if (currentSubject.length > 0) {
            // * Fetch class list for subject
            axios.get(`/api/classes/list/${currentSubject}`).then((res: AxiosResponse) => {
                // * Destructure response from API
                const { data: classes } = res

                // * Set Classes
                setClasses(classes)

                // * Reset Class
                setCurrentClass(null)
            })
        }
    }, [currentSubject])

    // * Track class handler (subscribes to class)
    const subscribeToClass = async () => {
        if (currentClass) {
            // * Subscribe to class
            await axios.post('/api/banner/subscribe', {
                crn: currentClass.crn
            })

            // * Reset Selections
            setCurrentTerm('')
            setCurrentSubject('')
            setCurrentClass(null)

            // * Close Modal
            toggleShow(false)

            // * update user
            dispatch(updateUser())
        }
    }
    return (
        // * Terms > Subjects > Classes
        <>
            {/* For toggling the modal */}
            <Button
                variant="outline-primary"
                disabled={show}
                onClick={() => toggleShow(!show)}
                size="lg"
                block
            >
                Add Class
            </Button>

            <Modal show={show} onHide={() => toggleShow(!show)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Class</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        {/* // * Select Term */}
                        <Form.Group>
                            <Form.Label>Select Semester Term</Form.Label>
                            {/* // * Render Drop down when term list fetched */}
                            {terms.length > 0 && (
                                <Dropdown
                                    onSelect={(eventKey: string) => {
                                        setCurrentTerm(terms[parseInt(eventKey)])
                                    }}
                                >
                                    <Dropdown.Toggle id="term-dropdown" title="term-dropdown">
                                        {currentTerm.length > 0 ? currentTerm : 'Select Term'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {terms.map((term: string, index: number) => (
                                            <Dropdown.Item key={index} eventKey={index.toString()}>
                                                {term}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            )}
                        </Form.Group>

                        {/* // * Select Subject */}
                        {currentTerm.length > 0 && (
                            <Form.Group>
                                <Form.Label>Select Course Subject</Form.Label>
                                {/* // * Render Drop down when term list fetched */}
                                {subjects.length > 0 && (
                                    <Dropdown
                                        onSelect={(eventKey: string) => {
                                            setCurrentSubject(subjects[parseInt(eventKey)])
                                        }}
                                    >
                                        <Dropdown.Toggle id="term-dropdown" title="term-dropdown">
                                            {currentSubject.length > 0
                                                ? currentSubject
                                                : 'Select Subject'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {subjects.map((subject: string, index: number) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    eventKey={index.toString()}
                                                >
                                                    {subject}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </Form.Group>
                        )}

                        {/* //* Select Class */}
                        {currentSubject.length > 0 && (
                            <Form.Group>
                                <Form.Label>Select Course Number</Form.Label>
                                {/* // * Render Drop down when term list fetched */}
                                {classes.length > 0 && (
                                    <Dropdown
                                        onSelect={(eventKey: string) => {
                                            setCurrentClass(classes[parseInt(eventKey)])
                                        }}
                                    >
                                        <Dropdown.Toggle id="term-dropdown" title="term-dropdown">
                                            {currentClass !== null
                                                ? currentClass.number
                                                : 'Select Class'}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {classes.map((cls: Class, index: number) => (
                                                <Dropdown.Item
                                                    key={index}
                                                    eventKey={index.toString()}
                                                >
                                                    {cls.number}
                                                </Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                )}
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        disabled={currentClass == null}
                        onClick={subscribeToClass}
                        variant="primary"
                    >
                        Track
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AddClass
