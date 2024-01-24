import express from "express"
import { updateUser, userCon } from "../controllers/user.controller.js"
import verifyToken from "../utils/verifyUser.js"

const router = express.Router()


router.get("/test", userCon)
router.put("/update/:id", verifyToken, updateUser)

export default router