import React, { useState, useEffect } from 'react'
import { Button, Modal, Form, ListGroup } from 'react-bootstrap'
import axios from 'axios'
import Select from 'react-select'

import Listing from '../models/interfaces/Listing'
import { useSelector, useDispatch } from '@redux/.'
import { updateUser } from '@redux/auth/thunk'
import { getCourses, getListings } from '@redux/banner/thunk'
import ClassListing from './ClassListing'
import Term from '@interfaces/Term'
import Subject from '@interfaces/Subject'
import Course from '@interfaces/Course'

const AddClass = () => {
    // * Dispatch hook
    const dispatch = useDispatch()

    // * Get user from state
    const { user } = useSelector(state => state.auth)
    const { terms, subjects, courses, listings } = useSelector(state => state.banner)

    // * Modal state
    const [show, toggleShow] = useState(false)

    const [term, setTerm] = useState<number>()
    const [subject, setSubject] = useState<string>()
    const [course, setCourse] = useState<number>()

    // * useEffect every time subject changes, fetch classes
    useEffect(() => {
        if (term && subject) {
            // * Fetch course list
            dispatch(getCourses({ term, subject }))
        }
    }, [term, subject])

    useEffect(() => {
        if (term && subject && course) {
            // * Fetch course listings
            dispatch(getListings({ term, subject, course }))
        }
    }, [term, subject, course])

    // * Track class handler (subscribes to class)
    const subscribeToClass = async (crn: string) => {
        // * Subscribe to class
        await axios.post('/api/banner/subscribe', {
            crn
        })

        // * Reset Selections
        setCourse(undefined)

        // * Update User
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
                                    onChange={option => {
                                        setTerm(
                                            // eslint-disable-next-line
                                            // @ts-ignore
                                            option.value
                                        )

                                        setSubject(undefined)
                                        setCourse(undefined)
                                    }}
                                    options={terms.map((t: Term) => {
                                        return {
                                            value: t.code,
                                            label: `${t.code}- ${t.description}`
                                        }
                                    })}
                                ></Select>
                            )}
                        </Form.Group>

                        {/* // * Select Subject */}
                        {term && (
                            <Form.Group>
                                <Form.Label>Select Course Subject</Form.Label>
                                {/* // * Render Drop down when term list fetched */}
                                {subjects.length > 0 && (
                                    <Select
                                        onChange={option => {
                                            setSubject(
                                                // eslint-disable-next-line
                                                // @ts-ignore
                                                option.value
                                            )
                                            setCourse(undefined)
                                        }}
                                        options={subjects.map((s: Subject) => {
                                            return {
                                                value: s.code,
                                                label: `(${s.code}) ${s.description}`
                                            }
                                        })}
                                    ></Select>
                                )}
                            </Form.Group>
                        )}

                        {/* //* Select Class */}
                        {subject && (
                            <Form.Group>
                                <Form.Label>Select Course Number</Form.Label>
                                {/* // * Render Drop down when term list fetched */}
                                {courses.filter(c => c.subject === subject && c.term === term)
                                    .length > 0 && (
                                    <Select
                                        onChange={option =>
                                            setCourse(
                                                // eslint-disable-next-line
                                                // @ts-ignore
                                                option.value
                                            )
                                        }
                                        options={courses
                                            .filter(c => c.subject === subject && c.term === term)
                                            .map((cls: Course) => {
                                                return {
                                                    value: cls.number,
                                                    label: `${cls.subject} - ${cls.number}`
                                                }
                                            })}
                                    ></Select>
                                )}
                            </Form.Group>
                        )}

                        {/* //* Class Listing Group */}
                        {listings.filter(
                            l =>
                                l.subject === subject &&
                                l.term === term?.toString() &&
                                l.courseNumber === course?.toString()
                        ).length > 0 && (
                            <div className="classListView">
                                <ListGroup>
                                    {listings
                                        .filter(l => {
                                            !user?.subscriptions?.includes(
                                                l.courseReferenceNumber
                                            ) &&
                                                l.subject === subject &&
                                                l.term === term?.toString() &&
                                                l.courseNumber === course?.toString()
                                        })
                                        .map((l: Listing, index) => (
                                            <ClassListing
                                                key={index}
                                                listing={l}
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
