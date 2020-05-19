// ? This file configures the redux store within an application
import { createStore, applyMiddleware, combineReducers, Action } from 'redux'
import thunk, { ThunkAction } from 'redux-thunk' // * Middleware used for asynchronous events that affect state
import {
    useSelector as useReduxSelector,
    TypedUseSelectorHook,
    useDispatch as useReduxDispatch
} from 'react-redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import { AuthReducer } from '@redux/auth/reducer'
import { BannerReducer } from '@redux/banner/reducer'

// * Bind reducers into single object
const reducers = combineReducers({
    // ! Add more reducers in this object
    auth: AuthReducer,
    banner: BannerReducer
})

// * Configure store
export const store = createStore(
    reducers,
    {},
    // * Only use redux-devtool on development builds
    process.env.NODE_ENV === 'development'
        ? composeWithDevTools(applyMiddleware(thunk))
        : applyMiddleware(thunk)
)

// * Typed useSelector hook to access (read) strongly typed state
export const useSelector: TypedUseSelectorHook<ReturnType<typeof reducers>> = useReduxSelector

// * Thunk Action type that matches out reducers (less bloated code)
export type AppThunk = ThunkAction<void, ReturnType<typeof reducers>, unknown, Action<string>>

export const useDispatch = () => useReduxDispatch()
