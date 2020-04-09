import { app } from './app'

app.listen(app.get('port'),
    () => console.log(`🚀 Banner service running on port ${app.get('port')}. 🤘`))
