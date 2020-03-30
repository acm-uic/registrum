import React, { FC, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axios from 'axios'

import { useDispatch } from 'react-redux'
import { updateUser } from '../models/redux/actions/auth'

const Account: FC = () => {
    const dispatch = useDispatch()
    //* Using hooks to keep track of state
    const [currentPassword, setCurrentPassword] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');

    const [fName, setFName] = useState('')
    const [lName, setLName] = useState('')

    //* event handler to update password that will be trigger when user clicks submit
    const update = async () => {
        // * Create updates object
        let updates = {}
        if(password.length > 0) {
            //* check if both passwords are the same
            if( password != retypePassword ){
                toast("The two password fields don't match", { type: 'error' })
                return;
            }

            // * [[Check regex for password]]
            // * Verify the the password is adhering to out standard
            // * Length is at least than 8
            // * Has one lower case and upper case English letter
            // * Has one digit and one special character
            if (!(new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,'i')).test(password)) {
                toast("Password requirements not met: 8 characters, 1 uppercase & lowercase, 1 digit & 1 special character", { type: 'error' })
                return;
            }    
            
            // * Set updates object
            updates.password = password
        }

        // * Check if first name field set
        if(fName.length > 0) {
            updates.firstname = fName
        }

        // * Check if last name field set
        if(lName.length > 0) {
            updates.lastname = lName
        }
      

        //* make api call to update the password
        try {
            // * making api call to update password
            const response = await axios.post('/api/auth/update', {
               ...updates,
               userPassword: currentPassword
            })
            
            // * notifying user for success or failure
            if( response.status == 200 ){
                toast("Account updated successfully", { type: 'success' })
                dispatch(updateUser())
            }
            else{
                toast("Error updating password", { type: 'error' })
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

    

    return(
        <div>
            <h4>Account Information</h4>
            <br/><br/>

            <h5>Update Password</h5>

            <Form>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Current Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" value={currentPassword} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { setCurrentPassword(e.target.value)} } />
                </Form.Group>

                <hr/>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" value={password} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value)} } />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Re-type New Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" value={retypePassword} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { setRetypePassword(e.target.value)} } />
                </Form.Group>

                 <Form.Group controlId="formBasicEmail">
                    <Form.Label>First Name (optional) </Form.Label>
                    <Form.Control type="text" placeholder="Enter First Name" value={fName} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { setFName(e.target.value)} } />
                </Form.Group>


                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Last Name (optional) </Form.Label>
                    <Form.Control type="text" placeholder="Enter Last Name" value={lName} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { setLName(e.target.value)} } />
                </Form.Group>

                <Button variant="primary" onClick={update} >Submit</Button>
            </Form>

            <br/><br/>

        
         
        </div>
    )
}

export default Account