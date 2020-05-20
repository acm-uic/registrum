import { Response, Router } from 'express'

export abstract class Controller {
    public router: Router
    public path: string
    constructor(path: string) {
        this.router = Router()
        this.path = path
    }
    public static jsonResponse(response: Response, code: number, message: string) {
        return response.status(code).json({ message })
    }

    public ok<T>(res: Response, dto?: T) {
        if (!!dto) {
            res.type('application/json')
            return res.status(200).json(dto)
        } else {
            return res.sendStatus(200)
        }
    }
    public created(response: Response) {
        response.sendStatus(201)
    }

    public accepted(response: Response) {
        response.sendStatus(202)
    }

    public clientError(response: Response, message?: string) {
        Controller.jsonResponse(response, 400, message ? message : 'Unauthorized')
    }

    public unauthorized(response: Response, message?: string) {
        Controller.jsonResponse(response, 401, message ? message : 'Unauthorized')
    }

    public paymentRequired(response: Response, message?: string) {
        Controller.jsonResponse(response, 402, message ? message : 'Payment required')
    }

    public forbidden(response: Response, message?: string) {
        Controller.jsonResponse(response, 403, message ? message : 'Forbidden')
    }

    public notFound(response: Response, message?: string) {
        Controller.jsonResponse(response, 404, message ? message : 'Not found')
    }

    public conflict(response: Response, message?: string) {
        Controller.jsonResponse(response, 409, message ? message : 'Conflict')
    }

    public tooMany(response: Response, message?: string) {
        Controller.jsonResponse(response, 429, message ? message : 'Too many requests')
    }

    public notImplemented(response: Response, message?: string) {
        Controller.jsonResponse(response, 501, message ? message : 'Not Implemented')
    }

    public fail(response: Response, error: Error | string) {
        console.log(error)
        return response.status(500).json({
            message: error.toString()
        })
    }
}
