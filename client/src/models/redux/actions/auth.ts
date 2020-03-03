import { Action } from './action'
import { Class } from '../../interfaces/Class'
export const setClasses = (classes: Class[]): Action => ({
    type: 'SET_CLASSES',
    payload: classes
})
