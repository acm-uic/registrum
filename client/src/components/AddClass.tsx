import React, { useState, useEffect } from 'react'

import { Button, Modal, Form, ListGroup } from 'react-bootstrap'
import axios, { AxiosResponse } from 'axios'

import { useDispatch, useStore } from 'react-redux'
import { Class } from '../models/interfaces/Class'

import { updateUser } from '../models/redux/actions/auth'
import Select from 'react-select'

import ClassListing from './ClassListing'
interface Term {
    _id: string
    code: number
    description: string
}
interface Subject {
    _id: string
    code: string
    description: string
}

const AddClass = () => {
    // * Get user from state
    const store = useStore()
    const { Auth } = store.getState()
    const { user } = Auth

    // * Dispatch hook
    const dispatch = useDispatch()

    // * Modal state
    const [show, toggleShow] = useState(false)

    // * Current Term
    const [currentTerm, setCurrentTerm] = useState<Term | null>(null)
    // * Current Subject
    const [currentSubject, setCurrentSubject] = useState<Subject | null>(null)

    // * Current Class
    const [currentClass, setCurrentClass] = useState<string | null>(null)

    // * Term list
    const [terms, setTerms] = useState<Term[]>([])

    // * Subject list for given term
    const [subjects, setSubjects] = useState<Subject[]>([])

    // * Classes for given subject
    const [classes, setClasses] = useState<string[]>([])

    // * Class listings for given class and course number
    const [classListing, setClassListing] = useState<Class[]>([])

    // * Initial load that sets terms array
    useEffect(() => {
        if (terms.length === 0) {
            // * Fetch subjects from API
            axios.get('/api/classes/terms').then((res: AxiosResponse) => {
                // * Destructure response from API
                const { data: terms } = res

                // * Set terms
                setTerms(terms)
                setClassListing([])
            })
        }
    }, [subjects])

    // * useEffect every time term changes, fetch subjects
    useEffect(() => {
        if (currentTerm !== null) {
            // * Fetch Subject list for term
            axios.get(`/api/classes/subjects`).then((res: AxiosResponse) => {
                // * Destructure response from API
                const { data: subjects } = res

                // * Set Subjects
                setSubjects(subjects)

                // * Reset Current Subject & Current Class
                setCurrentSubject(null)
                setCurrentClass(null)
                setClassListing([])
            })
        }
    }, [currentTerm])

    // * useEffect every time subject changes, fetch classes
    useEffect(() => {
        if (currentSubject != null) {
            // * Fetch class list for subject
            axios
                .get(`/api/classes/list/${currentTerm.code}/${currentSubject.code}`)
                .then((res: AxiosResponse) => {
                    // * Destructure response from API
                    const { data: classes } = res
                    // * Set Classes
                    setClasses(classes)

                    // * Reset Class & listings
                    setCurrentClass(null)
                    setClassListing([])
                })
        }
    }, [currentSubject])

    useEffect(() => {
        if (currentSubject !== null && currentClass !== null) {
            // * Fetch class listings for subject and course
            axios
                .get(
                    `/api/classes/listing/${currentTerm.code}/${currentSubject.code}/${currentClass}`
                )
                .then((res: AxiosResponse) => {
                    // * Destructure response from API
                    const { data: listing } = res

                    // * Set Classes
                    setClassListing(listing.reverse())
                })
        }
    }, [currentClass])

    // * Track class handler (subscribes to class)
    const subscribeToClass = async (crn: string) => {
        // * Subscribe to class
        await axios.post('/api/banner/subscribe', {
            crn
        })

        // * Reset Selections
        setCurrentTerm(null)
        setCurrentSubject(null)
        setCurrentClass(null)
        setClassListing([])

        // * Close Modal
        toggleShow(false)

        // * update user
        dispatch(updateUser())
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
                                <Select
                                    onChange={option =>
                                        setCurrentTerm(
                                            // eslint-disable-next-line
                                            // @ts-ignore
                                            option.value
                                        )
                                    }
                                    options={terms.map((term: Term) => {
                                        return {
                                            value: term,
                                            label: `${term.code}- ${term.description}`
                                        }
                                    })}
                                ></Select>
                            )}
                        </Form.Group>

                        {/* // * Select Subject */}
                        {currentTerm !== null && (
                            <Form.Group>
                                <Form.Label>Select Course Subject</Form.Label>
                                {/* // * Render Drop down when term list fetched */}
                                {subjects.length > 0 && (
                                    <Select
                                        onChange={option =>
                                            setCurrentSubject(
                                                // eslint-disable-next-line
                                                // @ts-ignore
                                                option.value
                                            )
                                        }
                                        options={subjects.map((subject: Subject) => {
                                            return {
                                                value: subject,
                                                label: `(${subject.code}) ${subject.description}`
                                            }
                                        })}
                                    ></Select>
                                )}
                            </Form.Group>
                        )}

                        {/* //* Select Class */}
                        {currentSubject != null && (
                            <Form.Group>
                                <Form.Label>Select Course Number</Form.Label>
                                {/* // * Render Drop down when term list fetched */}
                                {classes.length > 0 && (
                                    <Select
                                        onChange={option =>
                                            setCurrentClass(
                                                // eslint-disable-next-line
                                                // @ts-ignore
                                                option.value
                                            )
                                        }
                                        options={classes.map((cls: string) => {
                                            return {
                                                value: cls,
                                                label: `${currentSubject.code} - ${cls}`
                                            }
                                        })}
                                    ></Select>
                                )}
                            </Form.Group>
                        )}

                        {/* //* Class Listing Group */}
                        {classListing.length > 0 && (
                            <div className="classListView">
                                <ListGroup>
                                    {classListing
                                        .filter(cls => {
                                            return !user.subscriptions.includes(
                                                cls.courseReferenceNumber
                                            )
                                        })
                                        .map((listing: Class, index) => (
                                            <ClassListing
                                                key={index}
                                                listing={listing}
                                                onTrack={subscribeToClass}
                                            />
                                        ))}
                                </ListGroup>
                            </div>
                        )}
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AddClass
