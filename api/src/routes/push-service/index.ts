import { Router, Request, Response } from 'express'
import { isAuthenticated } from '../auth/passport'
import User, { UserObject } from '../models/User'
import { BannerClient } from '../../util/banner'
import webpush from 'web-push'
// * All routes under /classes/*
const router = Router()

// * this is subscribing for push notifications and not specific classes
//* this route is triggered when a user logs in to save subscription obj to the database
router.post('/save-client-subscriptions', isAuthenticated, async (req: Request, res: Response) => {
    // * Grab user id from session
    const _id = (req.user as UserObject)._id

    // * Grab user subscription object from post request
    const subscriptionObject = JSON.parse(req.body.subscriptionObject)

    try {
        //* add subscription object to user's array of subscription objets
        await User.updateOne({ _id }, { $push: { subscriptionObjects: subscriptionObject } })
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
        return
    }

    res.status(200).send('Client Subscription Successful')
})

// * this is unsubscribing for push notifications and not specific classes
// * route is triggered when user logs out
router.post('/unsubscribe-client', isAuthenticated, async (req: Request, res: Response) => {
    // * Grab user id from session
    const _id = (req.user as UserObject)._id

    // * Grab user subscription object from post request
    const subscriptionObject = JSON.parse(req.body.subscriptionObject)

    console.log('subscription object in unsubscribe route: ' + subscriptionObject)

    try {
        //* add subscription object to user's array of subscription objets
        await User.updateOne({ _id }, { $pull: { subscriptionObjects: subscriptionObject } })
    } catch (err) {
        console.log(err.message)
        res.status(500).end()
        return
    }

    res.status(200).send('Client unsubscription Successful')
})

//!FIXME: dev purposes --> shouldn't be its own route
//* TODO: for dev purposes have a logged in user trigger this route and send push notifications to all their subscriptionObjects
router.post('/send-notifications', isAuthenticated, async (req: Request, res: Response) => {
    // * Grab user id from session
    const _id = (req.user as UserObject)._id

    try {
        //! FIXME: use env variables here
        webpush.setGCMAPIKey('565395438650')
        webpush.setVapidDetails(
            'mailto:jigar@novusclub.org',
            'BK_0D9VS_RrjJh3BRbdBifq6Ump45KpzfwWxk6P6sVOSTcrc89TzWlgtM1f7R7hOiKQsOxZHlGNGRiex02n9-9g',
            'xRRruVND4fgEeBQoa3mld2ulOwXZxLtWAlaUyPuycpg'
        )

        // * grab pushSubscription objects from database & send them to client --> check console

        const user = await User.findOne({ _id })

        user.subscriptionObjects.forEach(element => {
            webpush.sendNotification(element, 'CRN:' + '44033' + ' ' + 'OPEN')
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
        return
    }

    res.status(200).send('Sending notifications successful')
})

export default router
