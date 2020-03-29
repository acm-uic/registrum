import React, { FC, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { changePasswordAPI, updateUsernameAPI } from '../utils/functions/authentication'

const Account: FC = () => {

    //* Using hooks to keep track of state
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');

    const [fName, setFName] = useState('')
    const [lName, setLName] = useState('')

    //* event handler to update password that will be trigger when user clicks submit
    const updatePassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        setPassword('')
        setRetypePassword('')

        // * [[Check regex for password]]
        // * Verify the the password is adhering to out standard
        // * Length is at least than 8
        // * Has one lower case and upper case English letter
        // * Has one digit and one special character
        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password)) {
            return
        }        

        //* check if both passwords are the same
        if( password != retypePassword ){
            alert("The two password fields don't match");
            return
        }

        //* make api call to update the password
        await changePasswordAPI(password);
    }

    //* event handler to update password that will be trigger when user clicks submit
    const updateAccountInfo = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        setFName('')
        setLName('')
        
        //* Check regex for username
        const nameRegex = /[a-zA-Z]+[a-zA-Z0-9\s]+[a-zA-Z]/
        if (!nameRegex.test(fName) || !nameRegex.test(lName)) {
            return
        }

        await updateUsernameAPI(fName, lName);
    }
    

    return(
        <div>
            <h4>Account Information</h4>
            <br/><br/>

            <h5>Update Password</h5>

            <Form>
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