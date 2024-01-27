import express from 'express';
import verifyToken, { adminVerify } from '../utils/verifyUser.js';
import { createComment, deleteComment, editCommand, getComment, getComments, likeCommand } from '../controllers/comment.controller.js';


const router = express.Router()


router.post("/create", verifyToken, createComment)
router.get("/getComment/:postId", getComments)
router.put("/likeCommand/:commentId", verifyToken, likeCommand)
router.put("/editComment/:commentId", verifyToken, editCommand)
router.delete("/deleteComment/:commentId",verifyToken,deleteComment)
router.get("/getComment",verifyToken,adminVerify,getComment)
export default router
    