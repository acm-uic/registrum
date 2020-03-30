import React, { FC, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import axios from 'axios'

const Account: FC = () => {

    //* Using hooks to keep track of state
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');

    const [fName, setFName] = useState('')
    const [lName, setLName] = useState('')

    //* event handler to update password that will be trigger when user clicks submit
    const updatePassword = async () => {
        // e.preventDefault()
        setPassword('')
        setRetypePassword('')
        setOldPassword('')

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

        //* make api call to update the password
        try {
            // * making api call to update password
            const response = await axios.post('/api/auth/update', {
                firstname: "Alex",
                userPassword: oldPassword, 
                password
            })
            
            // * notifying user for success or failure
            if( response.status == 200 ){
                toast("Password updated successfully", { type: 'success' })
            }
            else{
                toast("Error updating password", { type: 'error' })
            }
    
        } catch (error) {
            // * Display error message from server
            toast(error.response.data, { type: 'error' })
        }
        
    }

    //* event handler to update password that will be trigger when user clicks submit
    const updateAccountInfo = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        setFName('')
        setLName('')
        
        //* Check regex for username
        const nameRegex = /[a-zA-Z]+[a-zA-Z0-9\s]+[a-zA-Z]/
        if (!nameRegex.test(fName) || !nameRegex.test(lName)) {
            toast("Firstname and/or Lastname not valid", { type: 'error' })
            return
        }

        try {
  
            // * making api call to update username
            const response = await axios.post('api/auth/updateAccountInfo', {
                fName: fName,
                lName: lName
            })
    
            // * notifying user for success or failure
            if( response.status == 200 ){
                toast("Username updated successfully", { type: 'success' })
            }
            else{
                toast("Error updating username", { type: 'error' })
            }
    
        } catch (error) {
            console.log(error);
        }

    }
    

    return(
        <div>
            <h4>Account Information</h4>
            <br/><br/>

            <h5>Update Password</h5>

            <Form>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Old Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" value={oldPassword} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { setOldPassword(e.target.value)} } />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" value={password} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { setPassword(e.target.value)} } />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Re-type Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter Password" value={retypePassword} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { setRetypePassword(e.target.value)} } />
                </Form.Group>

                <Button variant="primary" type="submit" onClick={updatePassword} >Submit</Button>
            </Form>

            <br/><br/>

            <h5>Update Account Info</h5>

            <Form>

                <Form.Group controlId="formBasicEmail">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter First Name" value={fName} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { setFName(e.target.value)} } />
                </Form.Group>


                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Last Name" value={lName} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { setLName(e.target.value)} } />
                </Form.Group>
                
                <Button variant="primary" type="submit" onClick={updateAccountInfo} >Submit</Button>
            </Form>

         
        </div>
    )
}

export default Account