import express from "express"
import auth from "./auth"
import classes from "./classes"

const router = express.Router()

router.use("/auth", auth)
router.use("/classes", classes)

export default router
