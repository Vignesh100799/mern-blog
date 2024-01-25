import express from "express"
import verifyToken, { adminVerify } from "../utils/verifyUser.js"
import createPost, { getBlogs } from "../controllers/post.controller.js"

const router = express.Router()

router.post("/create-blog",verifyToken,adminVerify,createPost)
router.get("/get-blog",getBlogs)

export default router