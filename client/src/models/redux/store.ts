/*
 * File: /src/models/configure.ts
 * File Created: Thursday, 12th December 2019 1:03:18 am
 * Author: Alex Chomiak
 *
 * Last Modified: Monday, 23rd December 2019 10:40:11 am
 * Modified By: Alex Chomiak
 *
 * Author Github: https://github.com/alexchomiak
 */
// ? This file configures the redux store within an application
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
// * Redux-Thunk middleware, used for asynchronous events that effect state (api calls)
import { composeWithDevTools } from 'redux-devtools-extension';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { Auth } from './reducers/auth';
import { Reducer } from './reducers/reducer';

// * Bind reducers into single object
const reducers = combineReducers<Reducer<any>>({
    // ! Add more reducers in this object
    Auth
});

const persistOptions = {
    key: 'root',
    storage
};

// * Declare state interface (This gets the compiler to shutup when referencing any objects)
export type State = {} & { [prop: string]: any };

// * Configure store
export const store = createStore(
    persistReducer(persistOptions, reducers),
    {},
    composeWithDevTools(applyMiddleware(thunk))
);
export const persistor = persistStore(store);
console.log('Configured Store', store.getState());
