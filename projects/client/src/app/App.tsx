import * as React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Welcome from '../views/Welcome'
import SignInForm from '../views/SignInForm'
import SignUpForm from '../views/SignUpForm'
import Settings from '../views/Settings'
import Courses from '../views/Courses'
import NavBar from '../components/NavBar'
import { useSelector, useDispatch } from '../redux/store'
import { updateUser, getUserCourses } from '../redux/auth/thunk'
import { getTerms, getSubjects } from '../redux/banner/thunk'

const App = (): JSX.Element => {
    const { user, courses } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    React.useEffect(() => {
        // * Verify user credentials (session cookie)
        dispatch(updateUser())

        // * Once logged in, get updated banner info and user's courses
        if (user) {
            dispatch(getTerms())
            dispatch(getSubjects())
            dispatch(getUserCourses())
        }
    }, [user])

    return (
        <div className="App">
            <Router>
                <NavBar user={user} />
                <Switch>
                    {user && <Route path="/settings"><Settings user={user} /></Route>}
                    {!user && <Route path="/signin" component={SignInForm} />}
                    {!user && <Route path="/signup" component={SignUpForm} />}
                    <Route path="/" exact>
                        {user ? <Courses courses={courses} /> : <Welcome />}
                    </Route>
                    <Route>
                        {/* If user is logged in then redirect to dashboard */}
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default App
