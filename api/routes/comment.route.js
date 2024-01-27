import express from 'express';
import verifyToken from '../utils/verifyUser.js';
import { createComment, getComments, likeCommand } from '../controllers/comment.controller.js';


const router = express.Router()


router.post("/create",verifyToken,createComment)
router.get("/getComment/:postId",getComments)
router.put("/likeCommand/:commentId",verifyToken,likeCommand)
export default router
