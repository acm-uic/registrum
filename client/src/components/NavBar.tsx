import React, { MouseEvent } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

import { Navbar, Nav, SafeAnchorProps } from 'react-bootstrap'

import SignIn from './SignIn'
import SignUp from './SignUp'
import { signOut } from '../utils/functions/authentication'
import { useSelector } from '../models/store'

const NavBar = () => {
    const { user } = useSelector(state => state.auth)

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
                            <Nav
                                onClick={async (e: React.MouseEvent<HTMLElement>) => {
                                    e.preventDefault()
                                    await signOut()
                                }}
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                Sign Out
                            </Nav>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavBar
