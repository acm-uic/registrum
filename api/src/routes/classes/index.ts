import express, { Router, Request, Response } from 'express'
import User, { UserObject } from '../models/User'
import { isAuthenticated } from '../auth/passport'
import { v4 as uuidv4 } from 'uuid'

// * All routes under /classes/*
const router = express.Router()
router.get('/userlist', isAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as UserObject
    res.status(200).send(user.classes)
})

//* POST request params --> email and classes
router.post('/add', isAuthenticated, async (req: Request, res: Response) => {
    // * get user's email before making post request

    const { subject, number } = req.body

    // POST data check
    if (typeof subject == 'undefined') {
        res.status(500).send('Missing course subject')
        return
    } else if (typeof number == 'undefined') {
        res.status(500).send('Missing course number')
        return
    }

    const user = req.user as UserObject
    // await User.updateOne({ _id: user._id }, { $push: { classes: { subject, number, id } } })
    // res.status(200).send('OK')

    const response = await User.findOneAndUpdate(
        { _id: user._id },
        { $push: { classes: { subject, number } } },
        { rawResult: true, new: true }
    )

    if (response.ok === 1) res.status(200).send(response.value.classes)
    else res.status(500).send('Error')
})

//* POST request params --> email and class
router.post('/remove', isAuthenticated, async (req: Request, res: Response) => {
    const { _id } = req.body
    const user = req.user as UserObject

    const response = await User.findByIdAndUpdate(
        { _id: user._id },
        { $pull: { classes: { _id } } },
        { rawResult: true, new: true }
    )

    if (response.ok === 1) res.status(200).send(response.value.classes)
    else res.status(500).send('Error')
})

// router.get('/subjects', async (req: Request, res: Response) => {
//     // TODO: Write route that grabs class subjects list from Banner DB and returns them
//     // * FOR NOW, return seeded list
//     res.send(['CS', 'BIO'])
// })

// //* example get request --> http://localhost:8080/classes/list/CS
// router.get('/list/:subjectCodeName', async (req: Request, res: Response) => {
//     // TODO: Write route that grabs class list for provided subject from Banner DB and returns them
// })
export default router
