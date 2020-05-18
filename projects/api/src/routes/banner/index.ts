import { Router, Request, Response } from 'express'
import { isAuthenticated } from '../auth/passport'
import User, { UserObject } from '../models/User'
import { notifyUser } from '../../util/notifier'
import { BannerClient } from '../../util/banner'
// * All routes under /classes/*
const router: Router = Router()

const API_HOST = process.env.API_HOST || 'http://localhost:4000'
const API_BASE_PATH = process.env.API_BASE_PATH
const notifyUrl = `${API_HOST}${API_BASE_PATH}/banner`

// * | >>>>> Bharat's API ()
router.post('/subscribe', isAuthenticated, async (req: Request, res: Response) => {
    // * Grab user id from session
    const _id = (req.user as UserObject)._id

    // * Grab CRN from params
    const { crn } = req.body

    if (crn) {
        // * Add subscription to class model (addToSet ensures unique CRN's, no duplicates)
        await User.updateOne({ _id }, { $addToSet: { subscriptions: crn } })
        console.log('SUBSCRIBING WITH ' + `${notifyUrl}/notify/${_id}/${crn}`)
        // * Subscribe via Banner API
        try {
            // * Waiting for Banner Client to be completely implemented
            await BannerClient.post('/hook', {
                url: `${notifyUrl}/notify/${_id}/${crn}`,
                crn
            })
        } catch (err) {
            // ! DO NOTHING Since banner routes aren't implemented yet
            console.log(err.message)
            res.status(500).send(err.message)
            return
        }
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

        // * Subscribe via Banner API
        try {
            console.log('UNSUBSCRIBING WITH ' + `${notifyUrl}/notify/${_id}/${crn}`)
            // ! Waiting for Banner Client to be completely implemented
            await BannerClient.post('/deletehook', {
                url: `${notifyUrl}/notify/${_id}/${crn}`,
                crn
            })
        } catch (err) {
            // * DO NOTHING Since banner routes aren't implemented yet
            res.status(500).send('Error trying to unsubscribe to class')
            return
        }
        // TODO: Subscribe to CRN with banner API
        res.status(200).send('Unsubscription Successful')
    } else {
        res.status(400).send('No Class CRN provided')
    }
})

router.get('/tracking', isAuthenticated, async (req: Request, res: Response) => {
    // * Grab user id from session
    const _id = (req.user as UserObject)._id

    // * Grab updated user
    const user: UserObject = await User.findOne({ _id })
    // * Serialize CRNs
    const crns: string[] = user.subscriptions

    // * Grab class JSONs from banner API
    const { data: classes } = await BannerClient.post('/course', {
        courseReferenceNumbers: crns
    })
    // * Send class JSONs
    res.send(classes)
})

router.post('/notify/:id/:crn', async (req: Request, res: Response) => {
    // * Grab needed params off of request
    const { id: _id } = req.params
    const classJSON = req.body

    try {
        // * Resolve updated user
        const user = await User.findOne({ _id })

        console.log(user.email)
        // * Send user notification
        await notifyUser(user, classJSON)

        // * Notification successful
        res.status(200).send('NOTIFICATION SUCCESSFUL')
    } catch (err) {
        // ! Error notifying user
        res.status(400).send(err.message)
    }
})

export default router
