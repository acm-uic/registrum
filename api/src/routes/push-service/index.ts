import { Router, Request, Response } from 'express'
import { isAuthenticated } from '../auth/passport'
import SubscriptionsModel, { SubscriptionsObject } from '../models/SubscriptionsModel'
import User, { UserObject } from '../models/User'
import { BannerClient } from '../../util/banner'
import webpush from "web-push"
// * All routes under /classes/*
const router = Router()


//! FIXME: removed isAuthenticated --> add it back
router.post('/save-client-subscriptions', async (req: Request, res: Response) => {
    // * Grab user id from session
    //const _id = (req.user as UserObject)._id

    // * Grab user subscription object from post request
    const { subscription } = req.body

    console.log("subscription object: " + subscription);

    try {

        //* make an object instance using model
        // todo: make a new mongoDB model for saving subscription objects
        let subscriptionInstance = new SubscriptionsModel( subscription );

        //* save object to mongoDB
        subscriptionInstance.save();

    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
        return
    }

    res.status(200).send('Client Subscription Successful')
  
})

router.post('/send-notifications', async (req: Request, res: Response) => {
    // * Grab user id from session
    //const _id = (req.user as UserObject)._id

    try {

            //! FIXME: use env variables here
            webpush.setGCMAPIKey('565395438650');
            webpush.setVapidDetails(
                'mailto:jigar@novusclub.org',
                "BK_0D9VS_RrjJh3BRbdBifq6Ump45KpzfwWxk6P6sVOSTcrc89TzWlgtM1f7R7hOiKQsOxZHlGNGRiex02n9-9g",
                "xRRruVND4fgEeBQoa3mld2ulOwXZxLtWAlaUyPuycpg"
            );

            // * grab pushSubscription objects from database & send them to client --> check console
            //* hard code it for right now

            // This is the same output of calling JSON.stringify on a PushSubscription
            const pushSubscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/cW3C-Kqe3f0:APA91bF3r_TfdjoYcvD5rP1cF14PY2gmAcI2FkHUNSWrWoYjSrB6z6wbFysM_TDiJaiz8VuvAdY3lLSSFnTy-7hpbxU_D6lsM2o4mIQZXOLlNUEs22QHuLp-rNRIhh3XZHQDsgll2F6Q","expirationTime":null,"keys":{"p256dh":"BGVpcLVBFJCfHuYEJjNbEdzzCvG2rYdUsqYDGbC227yT4EIn0Vuf-gqSpgyae7moAL2Mi0a8sSNSkmiImb17tOA","auth":"qdK4hzw7rGjPYj3BSfO_WQ"}}


            

            webpush.sendNotification(pushSubscription, 'Payload Text');

    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message)
        return
    }

    res.status(200).send('Sending notifications successful')
  
})


export default router
