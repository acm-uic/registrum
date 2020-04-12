import axios from 'axios';
import { Action, ThunkActionCreator } from './action';
import { User } from '../../interfaces/User';
import { State } from '../store';

export const setUser = (user: User | null): Action => ({
    payload: user,
    type: 'SET_USER'
});

export const updateUser = (): ThunkActionCreator => async (dispatch, getState) => {
    const state: State = getState();
    const { Auth } = state;

    // * Retrieve updated user object
    try {
        const response = await axios.get('/api/auth/');
        const user = response.data;

        // * Check if redux should rerender based off changes
        let shouldUpdate = false;

        // * Check if any other property changed
        Object.entries(user).map(keyValuePair => {
            // * Map over each key value pair in the object
            const [key, value] = keyValuePair;

            // * If value is not array or object
            if (!Array.isArray(value) && Object(value) !== value) {
                // * Set update to true
                if (value !== Auth.user[key]) shouldUpdate = true;
            } else if (Array.isArray(value) && value.length !== Auth.user[key].length)
                shouldUpdate = true;
        });

        if (response.status === 200 && shouldUpdate) {
            // * Set user
            dispatch(setUser(user));
        }
    } catch (err) {
        const { response } = err;
        if (response.status === 401 && Auth.user !== null) {
            dispatch(setUser(null));
        }
    }
};
