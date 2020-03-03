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
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk' // * Redux-Thunk middleware, used for asynchronous events that effect state (api calls)
import { Reducer } from './reducers/reducer'
import { Auth } from './reducers/auth'
// * Bind reducers into single object
const reducers = combineReducers<Reducer<any>>({
    // ! Add more reducers in this object
    Auth
})

// * Declare state interface (This gets the compiler to shutup when referencing any objects)
export type State = {} & { [prop: string]: any }

// * Configure store
export const store = createStore(reducers, {}, applyMiddleware(thunk))
console.log('Configured Store', store.getState())
