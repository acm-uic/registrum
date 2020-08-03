export interface IUser {
  _id: number;
  email: string;
  gravatarId: string;
  firstName: string;
  lastName: string;
  subscription: string[];
  emailNotificationsEnabled: boolean;
}

export default IUser;
