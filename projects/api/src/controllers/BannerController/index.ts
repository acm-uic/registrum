import { Controller } from 'registrum-common/dist/classes/Controller'
import { isAuthenticated } from '../../util/passport'
import { TermRoutes, SubjectRoutes } from './Routes'

export class BannerController extends Controller {
    constructor(path: string) {
        super(path)
        this.#initializeRoutes()
    }

    #initializeRoutes = (): void => {
        // * Routes for the newest terms
        this.router.get('/term', isAuthenticated, TermRoutes.ALL)
        this.router.get('/term/:id', isAuthenticated, TermRoutes.SPECIFIC)

        // * Route for the subjects
        this.router.get('/subject', isAuthenticated, SubjectRoutes.ALL)
        this.router.get('/subject/:id', isAuthenticated, SubjectRoutes.SPECIFIC)

        // * Routes for the courses
        // this.router.get('/courses/:crn', isAuthenticated, null)
        // this.router.get('/courses/:term/:subject', isAuthenticated, null)
        // this.router.get('/courses/:term/:subject/:num', isAuthenticated, null)
    }
}
