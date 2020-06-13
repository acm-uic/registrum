import * as React from 'react'
import { Text, Stack, FontWeights, PrimaryButton, TextField } from '@fluentui/react'
import UserContext from '../UserContext'

const boldStyle = {
    root: { fontWeight: FontWeights.semibold }
}

export const SignInForm: React.FunctionComponent = () => {
    const [email, setEmail] = React.useState<string>('')
    const [password, setPassword] = React.useState<string>('')

    const onClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {}

    return (
        <Stack horizontalAlign="center" verticalAlign="center" verticalFill tokens={{childrenGap: 15}}>
            <Text variant="xxLarge" styles={boldStyle}>
                Sign In
            </Text>
            <Stack tokens={{childrenGap: 10}}>
                <TextField
                    name="email"
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(
                        _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                        newValue?: string
                    ) => {
                        setEmail(newValue || '')
                    }}
                />
                <TextField
                    name="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(
                        _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
                        newValue?: string
                    ) => {
                        setPassword(newValue || '')
                    }}
                />
                <PrimaryButton type="submit" onClick={onClickHandler}>
                    Sign In
                </PrimaryButton>
            </Stack>
        </Stack>
    )
}

export default SignInForm
