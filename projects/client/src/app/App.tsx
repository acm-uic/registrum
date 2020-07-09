import * as React from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Welcome from '../views/Welcome'
import SignInForm from '../views/SignInForm'
import SignUpForm from '../views/SignUpForm'
import Settings from '../views/Settings'
import Courses from '../views/Courses'
import NavBar from '../components/NavBar'

import { useSelector } from '../redux/store'

const App = () => {
    const { user } = useSelector(state => state.auth)
    const { courses } = useSelector(state => state.banner)

    return (
        <div className="App">
            <Router>
                <NavBar user={user} />
                <Switch>
                    <Route path="/settings">{user ? <Settings user={user} /> : <></>}</Route>
                    <Route path="/signin" component={SignInForm} />
                    <Route path="/signup" component={SignUpForm} />
                    <Route path="/" exact>
                        {user ? (
                            <Courses onAddCourse={console.log} courses={courses} />
                        ) : (
                            <Welcome />
                        )}
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default hot(module)(App)
