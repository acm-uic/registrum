import { Router, Request, Response } from 'express'
import { isAuthenticated } from '../auth/passport'
import User, { UserObject } from '../models/User'

// * All routes under /classes/*
const router = Router()

router.post('/subscribe', isAuthenticated, async (req: Request, res: Response) => {
    // * Grab user id from session
    const _id = (req.user as UserObject)._id

    // * Grab CRN from params
    const { crn } = req.body

    if (crn) {
        console.log(_id)
        // * Add subscription to class model (addToSet ensures unique CRNS, no duplicates)
        await User.updateOne({ _id }, { $addToSet: { subscriptions: crn } })

        // TODO: Subscribe to CRN with banner API
        res.status(200).send('Subscription Successful')
    } else {
        res.status(400).send('No Class CRN provided')
    }
})

router.post('/unsubscribe', isAuthenticated, async (req: Request, res: Response) => {
    // * Grab user id from session
    const _id = (req.user as UserObject)._id

    // * Grab CRN from params
    const { crn } = req.body

    if (crn) {
        // * Remove Subscription from class model
        await User.updateOne({ _id }, { $pull: { subscriptions: crn } })

        // TODO: Subscribe to CRN with banner API
        res.status(200).send('Unsubscription Successful')
    } else {
        res.status(400).send('No Class CRN provided')
    }
})

router.get('/statuses', isAuthenticated, async (req: Request, res: Response) => {
    // * Grab user id from session
    const _id = (req.user as UserObject)._id

    // * Grab updated user
    const user: UserObject = await User.findOne({ _id })
    // * Serialize CRNs
    const crns: string[] = user.subscriptions

    // TODO: Get Class Data from Bharats data using list of CRNs
    // * For now just map serialized CRNs to status array
    res.send(
        crns.map(crn => ({
            status: 'Not Open',
            crn
        }))
    )
})

export default router
