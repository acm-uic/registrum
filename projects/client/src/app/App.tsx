import * as React from 'react'
import { hot } from 'react-hot-loader'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Welcome from '../views/Welcome'
import SignInForm from '../views/SignInForm'
import SignUpForm from '../views/SignUpForm'
import Settings from '../views/Settings'
import Courses from '../views/Courses'
import NavBar from '../components/NavBar'
import IUser from '../interfaces/IUser'
import courses from '../helpers/FakeCourseData.json'
const demoUser: IUser = {
    email: 'bm@a.com',
    firstName: 'b',
    lastName: 'b',
    gravatarId: 'asdasd',
    password: 'asdasd',
    id: 3
}

function App() {
    const [user, setUser] = React.useState<IUser | undefined>(undefined)
    const logout = () => setUser(undefined)

    return (
        <div className="App">
            <Router>
                <NavBar user={user} />
                <Switch>
                    <Route path="/settings" exact>
                        {user ?
                            <Settings user={user} />
                            : <></>}
                    </Route>
                    <Route path="/" exact>
                        <Courses onAddCourse={console.log} courses={courses}/>
                    </Route>
                    {/* <Route path="/" exact component={Welcome} /> */}
                    <Route path="/signin" exact component={SignInForm} />
                    <Route path="/signup" exact component={SignUpForm} />
                    <Route>
                        <Redirect to="/" />
                    </Route>
                </Switch>
            </Router>
        </div>
    )
}

export default hot(module)(App)
