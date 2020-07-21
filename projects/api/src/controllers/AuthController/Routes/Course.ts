import Axios, { AxiosInstance } from 'axios'
import { Handler, Request, Response } from 'express'
import { AuthControllerOptions } from '..'
import User, { UserObject } from '../../../models/User'

export type CourseRoutesOptions = AuthControllerOptions

export class CourseRoutes {
    private notifyURL: string
    private bannerURL: string
    private bannerClient: AxiosInstance

    constructor(options: CourseRoutesOptions) {
        this.notifyURL = options.notifyUrl
        this.bannerURL = options.bannerUrl

        // * Axios Client for making request to banner
        this.bannerClient = Axios.create({
            baseURL: this.bannerURL,
            withCredentials: true
        })
    }

    static GET: Handler[] = [
        async (req: Request, res: Response): Promise<void> => {
            // * Get the user from request
            const { _id } = req.user as UserObject
            const user = await User.findOne({ _id })

            // * Return the array of course CRNs
            res.status(200).send(user.subscriptions)
        }
    ]

    POST: Handler[] = [
        async (req: Request, res: Response): Promise<void> => {
            const { _id } = req.user as UserObject

            try {
                // * Obtain the crn from the request body
                const crn = req.body as string

                // * Add the crn to the user
                await User.updateOne({ _id }, { $addToSet: { subscriptions: crn } })

                // * Waiting for Banner Client to be completely implemented
                await this.bannerClient.post('/hook/addHook', {
                    url: `${this.notifyURL}/notify/${_id}/${crn}`,
                    crn
                })

                // * Let them know that it was successful
                res.status(200).end()
            } catch (er) {
                res.status(500).end(er.message)
            }
        }
    ]
    DELETE: Handler[] = [
        async (req: Request, res: Response): Promise<void> => {
            const { _id } = req.user as UserObject

            try {
                // * Obtain the crn from the request body
                const crn = req.body as string

                // * Add the crn to the user
                await User.updateOne({ _id }, { $pull: { subscriptions: crn } })

                // * Waiting for Banner Client to be completely implemented
                await this.bannerClient.post('/hook/delete', {
                    url: `${this.notifyURL}/notify/${_id}/${crn}`,
                    crn
                })

                // * Let them know that it was successful
                res.status(200).end()
            } catch (er) {
                res.status(500).end(er.message)
            }
        }
    ]
}
