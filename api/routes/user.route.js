import express from "express"
import { deleteUser, getUsers, signOut, updateUser, userCon } from "../controllers/user.controller.js"
import verifyToken, { adminVerify } from "../utils/verifyUser.js"

const router = express.Router()


router.get("/test", userCon)
router.put("/update/:id", verifyToken, updateUser)
router.delete("/delete/:id",verifyToken,deleteUser)
router.post("/sign-out",signOut)
router.get("/get-users",verifyToken,adminVerify,getUsers)

export default router