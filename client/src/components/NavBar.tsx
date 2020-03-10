import React from 'react'
import { useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUser, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

import { Navbar, NavDropdown, Nav } from 'react-bootstrap'

import { User } from '@interfaces/User'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'
import UICLogo from '../assets/UICLogo.png'
import { signOut } from '@utils/functions/authentication'

const NavBar = () => {
    const user: User | null = useSelector((state: any) => state.Auth.user)

    return (
        <Navbar expand="md" className="align-middle">
            <Navbar.Brand as={Link} to="/">
                <img alt="UIC Logo" src={UICLogo} width={30} className="d-inline-block align-top" />{' '}
                <b>Registrum</b>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {user != null && (
                        <Nav.Link as={Link} to="/classes">
                            Classes
                            {JSON.stringify(user.classes)}
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
                    <Nav.Link as={Link} to="/classes">
                        About Us
                    </Nav.Link>
                    <Nav.Link as={Link} to="/classes">
                        Contact
                    </Nav.Link>
                    {user != null && (
                        <NavDropdown
                            title={
                                <>
                                    <FontAwesomeIcon icon={faUserCircle} />
                                    {'  '}
                                    {user.firstname}
                                </>
                            }
                            id="basic-nav-dropdown"
                            alignRight
                        >
                            <NavDropdown.Item as={Link} to="/account">
                                <FontAwesomeIcon icon={faUser} />
                                {'  '}Account
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                onClick={async (e: any) => {
                                    e.preventDefault()
                                    await signOut()
                                }}
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} />
                                {'  '}Sign Out
                            </NavDropdown.Item>
                        </NavDropdown>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default NavBar
