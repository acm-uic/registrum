import errorHandler from 'errorhandler'

import app from './app'

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler())

/**
 * Start Express server.
 */

const server = app.listen(app.get('port'), () => {
  console.log(`App running on port ${app.get('port')}`)
  console.log('  Press CTRL-C to stop\n')
})

export default server
