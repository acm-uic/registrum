import { Action } from 'redux';
import { Course } from 'registrum-common/dist/lib/Banner';
import { IUser } from '../../interfaces/IUser';

export const SET_USER = 'SET_USER';
export const UNSET_USER = 'UNSET_USER';
export const SET_COURSES = 'SET_COURSES';

export const SET_LOADING = 'SET_LOADING';
export const SET_ERROR = 'SET_ERROR';

// * Set the user
interface SetUserAction extends Action {
  type: typeof SET_USER;
  payload: IUser;
}

// * Set the user to null
interface UnsetUserAction extends Action {
  type: typeof UNSET_USER;
}

// * Set Courses
interface SetCoursesAction extends Action {
  type: typeof SET_COURSES;
  payload: Course[];
}

// * Set Loading status
interface SetLoadingAction extends Action {
  type: typeof SET_LOADING;
  payload: boolean;
}

// * Set the error message
interface SetErrorAction extends Action {
  type: typeof SET_ERROR;
  payload?: string;
}

// * Cumulative Type
export type UserActionTypes =
  | SetUserAction
  | UnsetUserAction
  | SetCoursesAction
  | SetLoadingAction
  | SetErrorAction;

// * Data needed to register a new user
export type SignUpProps = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  emailNotificationsEnabled: boolean;
};

// * Data needed to login using email / password
export type SignInProps = {
  email: string;
  password: string;
};

// * Data needed to (un)subscribe from a specific class
export type CourseSubscribeProps = {
  crn: string;
};
export type CourseUnsubscribeProps = CourseSubscribeProps;
