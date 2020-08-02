import * as React from 'react'
import {
    Stack,
    Persona,
    IconButton,
    IContextualMenuProps,
    IContextualMenuItem,
    getTheme,
    Link,
    mergeStyleSets
} from '@fluentui/react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import Logo from '../logo.svg'
import { getGravatarImageUrl } from '../helpers/Gravatar'
import { IUser } from '../interfaces/IUser'
import { useDispatch } from '../redux/store'
import { signOutUser } from '../redux/auth/thunk'

interface INavBarProps {
    user?: IUser
}

export const NavBar = withRouter((props: INavBarProps & RouteComponentProps) => {
    const { user, history } = props

    const dispatch = useDispatch()

    const onLinkClick = (event: React.MouseEvent<any> | React.KeyboardEvent<any>, url: string) => {
        event.preventDefault()
        history.push(url)
    }

    const menuItems: IContextualMenuItem[] = [
        {
            key: 'settings',
            text: 'Settings',
            iconProps: { iconName: 'Settings' },
            onClick: e => e && onLinkClick(e, '/settings')
        },
        {
            key: 'signOut',
            text: 'Sign Out',
            iconProps: { iconName: 'SignOut' },
            onClick: () => {
                dispatch(signOutUser())
            }
        }
    ]

    const menuProps: IContextualMenuProps = {
        shouldFocusOnMount: true,
        items: menuItems
    }
    const theme = getTheme()
    const classNames = mergeStyleSets({
        logo: {
            fill: theme.palette.themePrimary
        }
    })

    return (
        <nav style={{ padding: 15, marginBottom: 10, borderBottom: '1px solid' }}>
            <Stack
                horizontal
                horizontalAlign="space-between"
                verticalAlign="center"
                tokens={{ childrenGap: 30 }}
            >
                <Link onClick={e => onLinkClick(e, '/')}>
                    <Logo height={50} className={classNames.logo} />
                </Link>
                {user && (
                    <IconButton style={{ padding: 10, height: 50 }} menuProps={menuProps}>
                        <Persona
                            hidePersonaDetails={true}
                            imageUrl={getGravatarImageUrl(user.gravatarId)}
                        />
                    </IconButton>
                )}
            </Stack>
        </nav>
    )
})

export default NavBar
