import React from 'react'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { store } from '../models/redux/store'
import StatusView from '../components/StatusView'

it('Renders StatusView Correctly', () => {
  const status = { crn: '12345', status: 'Not Open' }
  render(
    <Provider store={store}>
      <Router>
        <StatusView key={1} status={status} />
      </Router>
    </Provider>,
  )

  // * Test for Links in App
  expect(screen.findByText(status.crn)).toBeDefined()
  expect(screen.findByText(status.status)).toBeDefined()
})
