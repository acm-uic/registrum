import Class from './Class'

interface User {
    _id: string
    firstname: string
    lastname: string
    email: string
    classes: Class[]
    emailNotificationsEnabled: boolean
}

export default User
