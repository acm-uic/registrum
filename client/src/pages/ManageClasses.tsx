import React, { FC } from 'react'

import ClassesList from '@components/ClassesList'
import AddClassForm from '@components/AddClassForm'

const ManageClases: FC = () => {
    return (
        <>
            <ClassesList />
            <AddClassForm />
        </>
    )
}

export default ManageClases
