import React from 'react'
import { IUser } from './interfaces/IUser'

export interface IUserContext {
    user: IUser | null
    logout: () => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const UserContext = React.createContext<IUserContext>({ user: null, logout: () => {} })

export default UserContext
