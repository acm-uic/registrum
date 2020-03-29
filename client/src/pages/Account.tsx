import React, { FC, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { changePasswordAPI, updateUsernameAPI } from '../utils/functions/authentication'

const Account: FC = () => {

    //* Using hooks to keep track of state
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');
    const [username, setUsername] = useState('');

    //* event handler to update password that will be trigger when user clicks submit
    const updatePassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        setPassword('')
        setRetypePassword('')

        //! TODO: Check regex for password

        //* check if both passwords are the same
        if( password != retypePassword ){
            alert("The two password fields don't match");
            return;
        }


        //* make api call to update the password
        await changePasswordAPI(password);
    }

    //* event handler to update password that will be trigger when user clicks submit
    const updateUsername = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        setUsername('')

        //! TODO: Check regex for username
        if(username.length == 0){
            alert("Username field is empty")
        }

        await updateUsernameAPI(username);
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

            <h5>Update Name</h5>

            <Form>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Account Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter Name" value={username} onChange={ (e: React.ChangeEvent<HTMLInputElement>) => { setUsername(e.target.value)} } />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={updateUsername} >Submit</Button>
            </Form>

         
        </div>
    )
}

export default Account