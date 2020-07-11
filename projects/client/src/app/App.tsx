import * as React from 'react'
import { hot } from 'react-hot-loader'
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

const App = () => {
    const { user, courses } = useSelector(state => state.auth)
    const dispatch = useDispatch()

    React.useEffect(() => {
        dispatch(updateUser())

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
                    <Route path="/settings">{user ? <Settings user={user} /> : <></>}</Route>
                    <Route path="/signin" component={SignInForm} />
                    <Route path="/signup" component={SignUpForm} />
                    <Route path="/" exact>
                        {user ? <Courses courses={courses} /> : <Welcome />}
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default App
