import React from 'react'
import { shallow } from 'enzyme'
import NavBar from '../components/NavBar'

it('renders', () => {
    const result = shallow(<NavBar />).contains('Registrum')

    expect(result).toBeTruthy()
})
