import express from "express"
import { deleteUser, signOut, updateUser, userCon } from "../controllers/user.controller.js"
import verifyToken from "../utils/verifyUser.js"

const router = express.Router()


router.get("/test", userCon)
router.put("/update/:id", verifyToken, updateUser)
router.delete("/delete/:id",verifyToken,deleteUser)
router.post("/sign-out",signOut)

export default router