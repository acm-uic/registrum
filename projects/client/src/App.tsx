import React from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Welcome from './components/Welcome'
import SignInForm from './components/SignInForm'
import SignUpForm from './components/SignUpForm'
import Settings from './components/Settings'
import Courses from './components/Courses'
import NavBar from './components/NavBar'
import UserContext from './UserContext'
import IUser from './interfaces/IUser'

const demoUser = null

function App() {
    const [user, setUser] = React.useState<IUser | null>(null)
    const logout = () => setUser(null)

    return (
        <UserContext.Provider value={{ user, logout }}>
            <div className="App">
                <Router>
                    <UserContext.Consumer>
                        {({ user }) =>
                            user ? (
                                <>
                                    <NavBar user={user} />
                                    <Switch>
                                        <Route path="/settings">
                                            <Settings user={user} />
                                        </Route>
                                        <Route path="/" exact>
                                            <Courses />
                                        </Route>
                                        <Route>
                                            <Redirect to="/" />
                                        </Route>
                                    </Switch>
                                </>
                            ) : (
                                <>
                                    <NavBar />
                                    <Switch>
                                        <Route path="/" exact component={Welcome} />
                                        <Route>
                                            <Redirect to="/" />
                                        </Route>
                                    </Switch>
                                </>
                            )
                        }
                    </UserContext.Consumer>
                </Router>
            </div>
        </UserContext.Provider>
    )
}

export default App
