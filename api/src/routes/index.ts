import express from 'express'
import auth from './auth'
import classes from './classes'
import banner from './banner'
import pushService from "./push-service"

const router = express.Router()

router.use('/auth', auth)
router.use('/classes', classes)
router.use('/banner', banner)
router.use('/push-service', pushService)
export default router
