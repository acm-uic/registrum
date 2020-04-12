import { Router, Request, Response } from 'express'
import { isAuthenticated } from '../auth/passport'
import User, { UserObject } from '../models/User'
import { notifyUser } from '../../util/notifier'
import { BannerClient } from '../../util/banner'
// * All routes under /classes/*
const router = Router()

// * | >>>>> Bharat's API ()
router.post(
  '/subscribe',
  isAuthenticated,
  async (req: Request, res: Response) => {
    // * Grab user id from session
    const _id = (req.user as UserObject)._id

    // * Grab CRN from params
    const { crn } = req.body

    if (crn) {
      // * Add subscription to class model (addToSet ensures unique CRN's, no duplicates)
      await User.updateOne({ _id }, { $addToSet: { subscriptions: crn } })

      // * Subscribe via Banner API
      try {
        // * Waiting for Banner Client to be completely implemented
        await BannerClient.post('/subscribe', {
          hook: `/notify/${_id}/${crn}`,
        })
      } catch (err) {
        // ! DO NOTHING Since banner routes aren't implemented yet
        // res.status(500).send('Error trying to subscribe to class')
      }
      res.status(200).send('Subscription Successful')
    } else {
      res.status(400).send('No Class CRN provided')
    }
  }
)

router.post(
  '/unsubscribe',
  isAuthenticated,
  async (req: Request, res: Response) => {
    // * Grab user id from session
    const _id = (req.user as UserObject)._id

    // * Grab CRN from params
    const { crn } = req.body

    if (crn) {
      // * Remove Subscription from class model
      await User.updateOne({ _id }, { $pull: { subscriptions: crn } })

      // * Subscribe via Banner API
      try {
        // ! Waiting for Banner Client to be completely implemented
        await BannerClient.post('/unsubscribe', {
          hook: `/notify/${_id}/${crn}`,
        })
      } catch (err) {
        // * DO NOTHING Since banner routes aren't implemented yet
        // res.status(500).send('Error trying to subscribe to class')
      }
      // TODO: Subscribe to CRN with banner API
      res.status(200).send('Unsubscription Successful')
    } else {
      res.status(400).send('No Class CRN provided')
    }
  }
)

router.get(
  '/statuses',
  isAuthenticated,
  async (req: Request, res: Response) => {
    // * Grab user id from session
    const _id = (req.user as UserObject)._id

    // * Grab updated user
    const user: UserObject = await User.findOne({ _id })
    // * Serialize CRNs
    const crns: string[] = user.subscriptions

    // TODO: Get Class Data from Bharats data using list of CRNs
    // * For now just map serialized CRNs to status array
    res.send(
      crns.map((crn) => ({
        status: 'Not Open',
        crn,
      }))
    )
  }
)

router.post('/notify/:id/:crn', async (req: Request, res: Response) => {
  // * Grab needed params off of request
  const { id: _id } = req.params
  const { classJSON } = req.body

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
