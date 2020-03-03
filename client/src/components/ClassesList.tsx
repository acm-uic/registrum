import React, { FC, useState, useEffect } from 'react'

import { Class } from 'models/interfaces/Class'
import { useSelector } from 'react-redux'

const ClassesList: FC = () => {
    const classList = useSelector(state => state)

    return <>{JSON.stringify(classList)}</>
}

export default ClassesList
