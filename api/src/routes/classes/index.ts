import express, { Router, Request, Response } from 'express'
import User, { IUser } from '../models/User'
import Classes from '../models/Class'
import passport from 'passport'

// * All routes under /classes/*
const router = express.Router()

router.get('/userlist', passport.authenticate('local'), async (req: Request, res: Response) => {
    if (req.user) {
        const user = req.user as IUser
        res.status(200).send(user.classes)
    } else {
        res.status(401).send({ error: 'Not Authenticated' })
    }
})

//* POST request params --> email and classes
router.post('/add', passport.authenticate('local'), async (req: Request, res: Response) => {
    // * get user's email before making post request
    const { subject, number } = req.body

    res.status(200).send('Testing add functionality')
})

//* POST request params --> email and class
router.post('/remove', async (req: Request, res: Response) => {
    //TODO: Write route that removes class from users list of watched classes
    //TODO: add user authintication

    res.status(200).send('TODO')
})

router.get('/subjects', async (req: Request, res: Response) => {
    // TODO: Write route that grabs class subjects list from Banner DB and returns them
    // * FOR NOW, return seeded list
    res.send(['CS', 'BIO'])
})

//* example get request --> http://localhost:8080/classes/list/CS
router.get('/list/:subjectCodeName', async (req: Request, res: Response) => {
    // TODO: Write route that grabs class list for provided subject from Banner DB and returns them
})
module.exports = router
