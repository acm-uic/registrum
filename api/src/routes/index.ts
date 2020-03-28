import express from 'express'
import auth from './auth'
import classes from './classes'
import banner from './banner'

const router = express.Router()

router.use('/auth', auth)
router.use('/classes', classes)
router.use('/banner', banner)
export default router
