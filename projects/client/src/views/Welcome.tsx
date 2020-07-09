import * as React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Text, Link, Stack, FontWeights, PrimaryButton, DefaultButton } from '@fluentui/react'

const boldStyle = {
    root: { fontWeight: FontWeights.semibold }
}

export const HomePage: React.FunctionComponent = () => {
    return (
        <Stack horizontalAlign="center" verticalAlign="center" verticalFill tokens={{childrenGap: 15}}>
            <Text variant="xxLarge" styles={boldStyle}>
                Welcome to Registrum
            </Text>
            <Text variant="large">
                To continue, sign in. If you're a new user, register an account.
            </Text>
            <Stack horizontal tokens={{childrenGap: 15}}>
                <RouterLink to="/signin" component={PrimaryButton}>
                    Sign In
                </RouterLink>
                <RouterLink to="/signup" component={DefaultButton}>
                    Sign Up
                </RouterLink>
            </Stack>
            <Text variant="large" styles={boldStyle}>
                <Link href="https://github.com/acm-uic/registrum">GitHub</Link>
            </Text>
        </Stack>
    )
}

export default HomePage
