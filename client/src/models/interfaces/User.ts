import { Class } from './Class';

export interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    classes: Class[];
    emailNotificationsEnabled: boolean;
}
