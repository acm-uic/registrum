import React from 'react'
import { useSelector } from 'react-redux'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'

import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'

import { User } from '@interfaces/User'
import SignIn from '@components/SignIn'
import UICLogo from '@assets/UICLogo.png'

const NavBar = () => {
    const firstname = useSelector((state: User) => state.firstname)

    return (
        <Navbar bg="dark" expand="lg" className="align-middle">
            <Navbar.Brand href="/">
                <img alt="UIC Logo" src={UICLogo} width={30} className="d-inline-block align-top" />{' '}
                <b className="text-white">Registrum</b>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    {firstname != null && <Nav.Link href="/classes">Classes</Nav.Link>}
                </Nav>

                <Nav>
                    {firstname == null ? (
                        <>
                            <SignIn />
                        </>
                    ) : (
                        <NavDropdown title={'Arshad' /*Name */} id="basic-nav-dropdown" alignRight>
                            <NavDropdown.Item href="/account">
                                <FontAwesomeIcon icon={faUser} />
                                {'  '}Account
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item>
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
