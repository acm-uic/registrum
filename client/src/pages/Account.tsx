import React, { FC, useState } from 'react'
import {
  Button, Form, Card, Container,
} from 'react-bootstrap'
import { toast } from 'react-toastify'
import axios from 'axios'

import { useDispatch, useStore } from 'react-redux'
import { updateUser } from '../models/redux/actions/auth'
import {User} from '../models/interfaces/User'
interface UserUpdate {
    // * Update Interface
    firstname?: string;
    lastname?: string;
    password?: string;
    emailNotificationsEnabled?: boolean;
}

const Account: FC = () => {
  // * Grab needed state
  const store = useStore()
  const {Auth} = store.getState()
  const user = Auth.user as User
  console.log(user)

  // * Grab dispatcher for redux
  const dispatch = useDispatch()

  //* Using hooks to keep track of state
  const [currentPassword, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [retypePassword, setRetypePassword] = useState('')

  const [fName, setFName] = useState('')
  const [lName, setLName] = useState('')
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(user.emailNotificationsEnabled)

  //* event handler to update password that will be trigger when user clicks submit
  const update = async () => {
    // * Create updates object
    const updates: UserUpdate = {}

    if (password.length > 0) {
      //* check if both passwords are the same
      if (password != retypePassword) {
        toast('The two password fields don\'t match', { type: 'error' })
        return
      }

      // * [[Check regex for password]]
      // * Verify the the password is adhering to out standard
      // * Length is at least than 8
      // * Has one lower case and upper case English letter
      // * Has one digit and one special character
      if (
        !new RegExp(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          'i',
        ).test(password)
      ) {
        toast(
          'Password requirements not met: 8 characters, 1 uppercase & lowercase, ' +
          '1 digit & 1 special character',
          { type: 'error' },
        )
        return
      }

      // * Set updates object
      updates.password = password
    }

    // * Check if first name field set
    if (fName.length > 0) {
      updates.firstname = fName
    }

    // * Check if last name field set
    if (lName.length > 0) {
      updates.lastname = lName
    }

    // * Notification options
    if(emailNotificationsEnabled != user.emailNotificationsEnabled) {
      updates.emailNotificationsEnabled = emailNotificationsEnabled
    }

    //* make api call to update the password
    try {
      // * making api call to update password
      const response = await axios.post('/api/auth/update', {
        ...updates,
        userPassword: currentPassword,
      })

      // * notifying user for success or failure
      if (response.status == 200) {
        toast('Account updated successfully', { type: 'success' })
        dispatch(updateUser())
      } else {
        toast('Error updating password', { type: 'error' })
      }
    } catch (error) {
      // * Display error message from server
      toast(error.response.data, { type: 'error' })
    }

    setPassword('')
    setRetypePassword('')
    setCurrentPassword('')
    setFName('')
    setLName('')
  }

  return (
    <Container style={{ marginTop: '1rem' }}>
      <Card>
        <Card.Header>
          <h4>Account Information</h4>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Group controlId="formBasicPassword">
              <Card.Title>
                Please enter your current password to make any changes...
              </Card.Title>
              <Form.Control
                type="password"
                placeholder="Enter Password"
                value={currentPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setCurrentPassword(e.target.value)
                }}
              />
            </Form.Group>

            <hr />

            <Form.Group controlId="formBasicPassword">
              <Card.Title>Change your password</Card.Title>
              <Form.Control
                disabled={currentPassword.length == 0}
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setPassword(e.target.value)
                }}
              />
            </Form.Group>
            {password.length > 0 && (
            <Form.Group>
              <Form.Label>Re-type New Password</Form.Label>
              <Form.Control
                disabled={currentPassword.length == 0}
                type="password"
                placeholder="Confirm new password"
                value={retypePassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setRetypePassword(e.target.value)
                }}
              />
            </Form.Group>
            )}

            <Form.Group controlId="formBasicEmail">
              <Card.Title>Change your first name</Card.Title>
              <Form.Control
                disabled={currentPassword.length == 0}
                type="text"
                placeholder="Enter new first name"
                value={fName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setFName(e.target.value)
                }}
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Card.Title>Change your last name</Card.Title>
              <Form.Control
                disabled={currentPassword.length == 0}
                type="text"
                placeholder="Enter new last name"
                value={lName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setLName(e.target.value)
                }}
              />
            </Form.Group>

            <Form.Group controlId="formNotifications">
              <Card.Title>Notification Options</Card.Title>

              <Form.Check type="checkbox" checked={emailNotificationsEnabled} onChange={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)} label="Email Notifications Enabled" />

            </Form.Group>


            <Button
              block
              variant="primary"
              onClick={update}
              disabled={
                                !(
                                  (password.length > 0 && retypePassword.length > 0)
                                    || fName.length > 0
                                    || lName.length > 0
                                    || user.emailNotificationsEnabled != emailNotificationsEnabled
                                )
                            }
            >
              Submit Changes
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Account
