import React from 'react'
import { shallow } from 'enzyme'
import { Header } from '../components/Header'

it('renders', () => {
    const result = shallow(<Header />).contains('Registrum')

    expect(result).toBeTruthy()
})
