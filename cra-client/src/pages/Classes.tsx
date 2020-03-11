import React, { FC } from 'react'
import { useSelector } from 'react-redux'

import AddClass from '../components/AddClass'
import { User } from '../models/interfaces/User'

const Classes: FC = () => {
    const user: User | null = useSelector((state: any) => state.Auth.user)

    return (
        <div>
            <AddClass />

            {user !== null && JSON.stringify(user.classes)}
        </div>
    )
}

export default Classes
