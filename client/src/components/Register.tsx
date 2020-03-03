import React, { FC, useState } from 'react'
import { Paper, makeStyles, createStyles, Typography, FormGroup } from '@material-ui/core'
import { Button, TextField } from '@material-ui/core'
import axios from 'axios'

const useStyles = makeStyles(({ spacing }) =>
    createStyles({
        paper: {
            padding: spacing(2),
            height: '350px'
        },
        title: {
            marginBottom: spacing(1)
        },
        input: {
            marginBottom: spacing(1)
        }
    })
)

const Register: FC = () => {
    const classes = useStyles()

    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSignUp = async () => {
        const response = await axios.post(
            '/api/auth/signup',
            {
                email,
                password,
                lastname,
                firstname
            },
            {
                withCredentials: true
            }
        )
    }

    const handleChangeFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setFirstname(e.target.value)
    }
    const handleChangeLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setLastname(e.target.value)
    }
    const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setEmail(e.target.value)
    }
    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setPassword(e.target.value)
    }

    return (
        <>
            <Paper className={classes.paper}>
                <Typography variant="h4" className={classes.title}>
                    Register
                </Typography>

                <FormGroup>
                    <TextField
                        type="text"
                        className={classes.input}
                        required
                        label="First Name"
                        aria-describedby="First Name"
                        value={firstname}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChangeFirstName(e)
                        }
                    />
                    <TextField
                        className={classes.input}
                        label="Last Name"
                        required
                        aria-describedby="Last Name"
                        value={lastname}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChangeLastName(e)
                        }
                    />
                    <TextField
                        className={classes.input}
                        label="Email Address"
                        aria-describedby="Email Address"
                        helperText="We will never share your emails with external parties."
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeEmail(e)}
                    />
                    <TextField
                        className={classes.input}
                        label="Password"
                        type="password"
                        aria-describedby="Password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChangePassword(e)
                        }
                    />

                    <Button onClick={handleSignUp}> Register</Button>
                </FormGroup>
            </Paper>
        </>
    )
}

export default Register
