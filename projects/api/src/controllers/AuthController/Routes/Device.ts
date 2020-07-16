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
            throw new Error('Not Implemented')
        }
    ]
    static DELETE: Handler[] = [
        async (req: Request, res: Response): Promise<void> => {
            const { _id } = req.user as UserObject
            const deviceEndpoints = JSON.parse(req.body.subscription) as SubscriptionsObject

            const updatedUser = await User.updateOne(
                { _id },
                { $pull: { subscriptionObjects: deviceEndpoints } }
            )

            throw new Error('Not Implemented')
        }
    ]
}
