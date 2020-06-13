import * as React from 'react'
import {
    Stack,
    Persona,
    Image,
    Link,
    IconButton,
    IContextualMenuProps,
    IContextualMenuItem
} from '@fluentui/react'
import Logo from '../logo.svg'
import { getGravatarImageUrl } from '../helpers/Gravatar'
import { IUser } from '../interfaces/IUser'

interface INavBarProps {
    user?: IUser
}

const menuItems: IContextualMenuItem[] = [
    {
        key: 'signOut',
        text: 'Sign Out',
        onClick: () => console.log('Sign Out')
    },
    {
        key: 'settings',
        text: 'Settings',
        href: '/settings'
    }
]

export const NavBar: React.FunctionComponent<INavBarProps> = ({ user }: INavBarProps) => {
    const menuProps: IContextualMenuProps = {
        shouldFocusOnMount: true,
        items: menuItems
    }
    return (
        <nav style={{ padding: 15, marginBottom: 10, borderBottom: '1px solid' }}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center" tokens={{childrenGap: 30}}>
                <Link href="/">
                    <Logo height={50} />
                </Link>
                {user ? (
                    <IconButton style={{ padding: 15 }} menuProps={menuProps}>
                        {' '}
                        <Persona
                            hidePersonaDetails={true}
                            imageUrl={getGravatarImageUrl(user.gravatarId)}
                        />{' '}
                    </IconButton>
                ) : (
                    <></>
                )}
            </Stack>
        </nav>
    )
}

export default NavBar
