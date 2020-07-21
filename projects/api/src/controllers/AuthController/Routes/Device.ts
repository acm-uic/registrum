import { Handler, Request, Response } from 'express'
import User, { SubscriptionsObject, UserObject } from '../../../models/User'

export class DeviceRoutes {
    static GET: Handler[] = [
        async (req: Request, res: Response): Promise<void> => {
            // * Get the user from request
            const { _id } = req.user as UserObject
            const user = await User.findOne({ _id })

            // * Return the array of devices
            res.status(200).send(user.subscriptionObjects)
        }
    ]

    static POST: Handler[] = [
        async (req: Request, res: Response): Promise<void> => {
            const { _id } = req.user as UserObject
            const deviceEndpoint = JSON.parse(req.body.subscription) as SubscriptionsObject

            try {
                await User.updateOne(
                    { _id },
                    { $addToSet: { subscriptionObjects: deviceEndpoint } }
                )

                // * Let them know that it was successful
                res.status(200).end()
            } catch (er) {
                res.status(501).end(er.message)
            }
        }
    ]

    static DELETE: Handler[] = [
        async (req: Request, res: Response): Promise<void> => {
            const { _id } = req.user as UserObject
            const deviceEndpoint = JSON.parse(req.body.subscription) as SubscriptionsObject

            try {
                await User.updateOne({ _id }, { $pull: { subscriptionObjects: deviceEndpoint } })

                // * Let them know that it was successful
                res.status(200).end()
            } catch (er) {
                res.status(501).end(er.message)
            }
        }
    ]
}
