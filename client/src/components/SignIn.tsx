import React, { FC, useState } from 'react'

import { Paper, makeStyles, createStyles, Typography, FormGroup } from '@material-ui/core'
import { Button, TextField } from '@material-ui/core'
import { store } from '../models/redux/store'
import { setClasses } from '../models/redux/actions/auth'
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

const SignIn: FC = () => {
    const classes = useStyles()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        await axios.post(
            '/api/auth/login',
            {
                email,
                password
            },
            { withCredentials: true }
        )

        try {
            // * Check if we can retrieve classes
            const classes = (await axios.get('/api/classes/userlist')) as Class[]
            store.dispatch(setClasses(classes))
        } catch (err) {
            // * Otherwise set classes to null
            store.dispatch(setClasses(null))
        }
    }

    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
    }

    return (
        <>
            <Paper className={classes.paper}>
                <Typography variant="h4" className={classes.title}>
                    Sign In
                </Typography>

                <FormGroup>
                    <TextField
                        className={classes.input}
                        label="Email Address"
                        aria-describedby="Email Address"
                        helperText="We will never share your emails with external parties."
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEmail(e)}
                    />
                    <TextField
                        className={classes.input}
                        label="Password"
                        type="password"
                        aria-describedby="Password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handlePassword(e)}
                    />
                    <Button onClick={handleLogin}> Sign In</Button>
                </FormGroup>
            </Paper>
        </>
    )
}

export default SignIn
