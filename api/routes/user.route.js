import express from "express"
import { userCon } from "../controllers/user.controller.js"

const router = express.Router()


router.get("/test", userCon)

export default router