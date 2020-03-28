import React, { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import AddClass from '../components/AddClass'
import StatusList from '../components/StatusList'
import { Status } from '../models/interfaces/Status'
import axios from 'axios'

import { State } from '../models/redux/store'

const Classes: FC = () => {
    const auth = useSelector((state: State) => state.Auth)
    const { user } = auth

    const [statuses, setStatuses] = useState<Status[]>([])

    // * Refresh Class Data on Auth State Change
    useEffect(() => {
        axios.get('/api/banner/statuses').then(res => {
            // * Update statuses
            setStatuses(res.data as Status[])
        })
    }, [auth])

    return (
        <div>
            {user !== null && (
                <>
                    <AddClass />
                    <StatusList statuses={statuses} />
                </>
            )}
        </div>
    )
}

export default Classes
