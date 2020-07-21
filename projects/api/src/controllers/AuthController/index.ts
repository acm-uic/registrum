import { UserObject } from '../../models/User'
import { Controller } from 'registrum-common/dist/classes/Controller'
import { isAuthenticated } from '../../util/passport'
import { AuthRoutes, UserRoutes, DeviceRoutes, CourseRoutes } from './Routes'

export type AuthControllerOptions = {
    notifyUrl: string
    bannerUrl: string
}

export class AuthController extends Controller {
    private notifyURL: string
    private bannerURL: string
    private courseRoutes: CourseRoutes

    constructor(path: string, config: AuthControllerOptions) {
        super(path)

        this.notifyURL = config.notifyUrl
        this.bannerURL = config.bannerUrl

        this.courseRoutes = new CourseRoutes(config)

        this.#initializeRoutes()
    }

    #initializeRoutes = (): void => {
        // * Login and Logout Routes
        this.router.post('/', AuthRoutes.LOGIN)
        this.router.delete('/', AuthRoutes.LOGOUT)

        // * All routes under /auth/user
        this.router.get('/user', isAuthenticated, UserRoutes.GET)
        this.router.post('/user', UserRoutes.POST)
        this.router.put('/user', isAuthenticated, UserRoutes.PUT)
        this.router.delete('/user', isAuthenticated, UserRoutes.DELETE)

        // * All routes under /auth/course
        this.router.get('/course', isAuthenticated, CourseRoutes.GET)
        this.router.post('/course', isAuthenticated, this.courseRoutes.POST)
        this.router.delete('/course', isAuthenticated, this.courseRoutes.DELETE)

        // * All routes under /auth/device
        this.router.get('/device', isAuthenticated, DeviceRoutes.GET)
        this.router.post('/device', isAuthenticated, DeviceRoutes.POST)
        this.router.delete('/device', isAuthenticated, DeviceRoutes.DELETE)
    }

    // * Remove the password field from object
    static prepareClientObject = (user: UserObject): UserObject => {
        delete user['password']
        return user
    }

    // * Stores the regex expressions for validation
    static ValidationExpressions = {
        // ? Verifies that the name don't have outlandish characters
        name: RegExp(/[a-zA-Z]+[a-zA-Z-\s]+[a-zA-Z]*$/),
        // ? Verifies that the email matches according to W3C standard
        email: RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/),
        // ? Verifies that length is at least 8
        // ? Verifies that one lower case and upper case English letter are included
        // ? Verifies that one digit and one special character are included
        password: RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    }
}
