import { Class } from './Class'

export interface User {
    firstname: string | null
    lastname: string | null
    classes: Class[]
}
