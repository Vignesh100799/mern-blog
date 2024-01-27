import Comment from "../model/comment.model.js"
import User from "../model/user.model.js"
import { customError } from "../utils/customError.js";


export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body
        if (userId !== req.user.id) {
            return next(
                customError(403, 'You are not allowed to create this comment')
            );
        }

        const newComment = new Comment({
            content,
            postId,
            userId
        })

        await newComment.save()
        res.status(200).json(newComment)
    } catch (error) {
        next(error)
    }
}

export const getComments = async (req, res, next) => {

    try {
        const comment = await Comment.find({ postId: req.params.postId }).sort({
            createdAt: -1
        })
       

        res.status(200).json(comment)

    } catch (error) {
        next(error)
    }
}