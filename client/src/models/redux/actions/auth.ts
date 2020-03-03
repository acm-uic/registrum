import { Action } from './action'
import { Class } from '../../interfaces/Class'
export const setClasses = (classes: Class[] | null): Action => ({
    type: 'SET_CLASSES',
    payload: classes
})
