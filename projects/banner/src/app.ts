import { Controller } from 'registrum-common/dist/classes/Controller'
import { ExpressApp, AppConfig } from 'registrum-common/dist/classes/ExpressApp'

export class App extends ExpressApp {
    constructor(controllers: Controller[], config: AppConfig) {
        super(controllers, config)
    }
}
