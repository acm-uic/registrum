import * as React from 'react'
import { Text, Stack, FontWeights, PrimaryButton, TextField } from '@fluentui/react'
import { Link } from 'react-router-dom'
import { useDispatch } from '../redux/store'
import { signUpUser } from '../redux/auth/thunk'

const boldStyle = {
    root: { fontWeight: FontWeights.semibold }
}

export const SignUpForm = (): JSX.Element => {
    const [firstname, setFirstname] = React.useState('')
    const [lastname, setLastname] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const dispatch = useDispatch()

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()

        dispatch(
            signUpUser({ firstname, lastname, email, password, emailNotificationsEnabled: true })
        )
    }

    return (
        <Stack
            horizontalAlign="center"
            verticalAlign="center"
            verticalFill
            tokens={{ childrenGap: 15 }}
        >
            <Text variant="xxLarge" styles={boldStyle}>
                Sign Up
            </Text>
            <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: '90%', maxWidth: 300 } }}>
                <TextField
                    name="firstname"
                    label="First Name"
                    type="text"
                    value={firstname}
                    onChange={(_, val) => {
                        setFirstname(val || '')
                    }}
                />
                <TextField
                    name="lastname"
                    label="Last Name"
                    type="text"
                    value={lastname}
                    onChange={(_, val) => {
                        setLastname(val || '')
                    }}
                />
                <TextField
                    name="email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(_, val) => {
                        setEmail(val || '')
                    }}
                />
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(_, val) => {
                        setPassword(val || '')
                    }}
                />
                <TextField name="confirm-password" label="Confirm Password" type="password" />
                <PrimaryButton type="submit" onClick={handleSubmit}>
                    Sign Up
                </PrimaryButton>
                <Text>
                    Already have an account?{' '}
                    <Link to="/signin" style={{ textDecoration: 'none' }}>
                        Sign in.
                    </Link>
                </Text>
            </Stack>
        </Stack>
    )
}

export default SignUpForm
