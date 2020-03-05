import React from 'react'
import { useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'

import { User } from '@interfaces/User'
import SignIn from '@components/SignIn'
import SignUp from '@components/SignUp'
import UICLogo from '@assets/UICLogo.png'
import { signIn, signOut } from '@utils/functions/authentication'

const NavBar = () => {
    const user: User | null = useSelector((state: any) => state.Auth.user)

    return (
        <Navbar expand="lg" className="align-middle">
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
                        </Nav.Link>
                    )}
                </Nav>

                <Nav>
                    {user == null ? (
                        <>
                            <SignUp />
                            <SignIn />
                        </>
                    ) : (
                        <NavDropdown title={user.firstname} id="basic-nav-dropdown" alignRight>
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
