import { Course } from 'registrum-common/dist/lib/Banner';
import { IUser } from '../../interfaces/IUser';
import { SET_COURSES, SET_ERROR, SET_LOADING, SET_USER, UNSET_USER, UserActionTypes } from './types';

// * Type for the AuthState
export interface AuthState {
  user: IUser | null;
  loading: boolean;
  courses: Course[];
  error?: string;
}

// * Default values for the Auth reducer
const initialState: AuthState = {
  user: null,
  loading: false,
  courses: []
};

// * Changes state based on action type
export const AuthReducer = (state = initialState, action: UserActionTypes): AuthState => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload };
    case UNSET_USER:
      return { ...state, user: null };
    case SET_COURSES:
      return { ...state, courses: action.payload };
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
