import * as React from 'react'
import {
    Stack,
    Persona,
    Image,
    Link,
    IconButton,
    IContextualMenuProps,
    IContextualMenuItem,
    getTheme,
    mergeStyleSets
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
    const theme = getTheme();
    const classNames = mergeStyleSets({
        logo: {
            fill: theme.palette.themePrimary
        }
    })
    return (
        <nav style={{ padding: 15, marginBottom: 10, borderBottom: '1px solid' }}>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center" tokens={{childrenGap: 30}}>
                <Link href="/">
                    <Logo height={50} className={classNames.logo} />
                </Link>
                {user ? (
                    <IconButton style={{ padding: 10, height: 50 }} menuProps={menuProps}>
                        <Persona
                            hidePersonaDetails={true}
                            imageUrl={getGravatarImageUrl(user.gravatarId)}
                        />
                    </IconButton>
                ) : (
                    <></>
                )}
            </Stack>
        </nav>
    )
}

export default NavBar
