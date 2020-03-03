import express, { Router, Request, Response } from 'express'
import User, { IUser } from '../models/User'
import Classes from '../models/Class'
import passport from 'passport'
import { isAuthenticated } from '../auth/passport'
import { v4 as uuidv4 } from 'uuid'

// * All routes under /classes/*
const router = express.Router()
router.get('/userlist', isAuthenticated, async (req: Request, res: Response) => {
    if (req.user) {
        const user = req.user as IUser
        res.status(200).send(user.classes)
    } else {
        res.status(401).send({ error: 'Not Authenticated' })
    }
})

//* POST request params --> email and classes
router.post('/add', isAuthenticated, async (req: Request, res: Response) => {
    // * get user's email before making post request
    const { subject, number } = req.body
    const id = uuidv4()

    const user = req.user as IUser
    try {
        console.log(user)
        await User.updateOne({ _id: user._id }, { $push: { classes: { subject, number, id } } })
        res.status(200).send('OK')
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Error Updating User')
    }
})

//* POST request params --> email and class
router.post('/remove', isAuthenticated, async (req: Request, res: Response) => {
    //TODO: Write route that removes class from users list of watched classes
    //TODO: add user authintication

    try {
        const { _id } = req.body
        const user = req.user as IUser
        await User.updateOne(
            {
                _id: user._id
            },
            {
                $pull: { classes: { _id } }
            }
        )
    } catch (err) {
        res.status(400).send('Error')
    }
    res.status(200).send('OK')
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
module.exports = router
