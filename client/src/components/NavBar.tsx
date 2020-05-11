import React from 'react'
import { useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

import { Navbar, Nav } from 'react-bootstrap'

import { User } from '../models/interfaces/User'
import SignIn from './SignIn'
import SignUp from './SignUp'
import { signOut } from '../utils/functions/authentication'

const NavBar = () => {
    const user: User | null = useSelector((state: any) => state.Auth.user)

    return (
        <Navbar expand="md" bg="light" className="align-middle">
            <Navbar.Brand as={Link} to="/">
                <img src="/images/icon-72x72.png" height={30} /> <b>Registrum</b>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {user != null && (
                        <Nav.Link as={Link} to="/classes">
                            Classes
                        </Nav.Link>
                    )}
                </Nav>

                <Nav>
                    {user == null && (
                        <>
                            <Nav.Link>
                                <SignIn />
                            </Nav.Link>
                            <Nav.Link>
                                <SignUp />
                            </Nav.Link>
                        </>
                    )}

                    {user != null && (
                        <>
                            <Nav.Link as={Link} to="/account">
                                <FontAwesomeIcon icon={faUser} />
                                {'  '}
                                {user.firstname}
                            </Nav.Link>
                            <Nav.Link
                                onClick={async (e: any) => {
                                    e.preventDefault()
                                    await signOut()
                                }}
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                Sign Out
                            </Nav.Link>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavBar
