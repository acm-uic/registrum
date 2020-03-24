import React from 'react'
import { shallow } from 'enzyme'
import NavBar from '../components/NavBar'
import { Provider } from 'react-redux'
import { store } from '../models/redux/store'
it('renders', () => {
    const renderedComponent = shallow(
        <Provider store={store}>
            <NavBar />
        </Provider>
    ).dive()
    console.log(renderedComponent.debug())

    expect(renderedComponent.contains('Classes')).toBeTruthy()
})
