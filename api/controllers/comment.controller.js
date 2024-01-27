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
export const likeCommand = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if (!comment) {
            return next(customError(400, "comment not found"))
        }

        const userIndex = comment.likes.indexOf(req.user.id)

        if (userIndex === -1) {
            comment.numberOfLikes += 1
            comment.likes.push(req.user.id)
        } else {
            comment.numberOfLikes -= 1
            comment.likes.splice(userIndex, 1)
        }
        await comment.save()
        res.status(200).json(comment)
    } catch (error) {
        next(error)
    }
}

export const editCommand = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if (!comment) {
            return next(customError(404, "Comment Not found"))
        }
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(customError(403, "You are not allowed to edit this comment"))
        }

        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
            content: req.body.content
        }, {
            new: true
        })
        res.status(200).json(editedComment)
    } catch (error) {
        next(error)

    }
}
export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId)
        if (!comment) {
            return next(customError(404, "Comment not Found"))

        }
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(customError(403, "Your are not allowed to delete this comment"))
        }
        await Comment.findByIdAndDelete(req.params.commentId)

        res.status(200).json("Comment has been deleted")
    } catch (error) {
        next(error)
        console.log(error)
    }
}
export const getComment = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'desc' ? -1 : 1;

        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        ); 
        const lastMonthComments = await Comment.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });
        res.status(200).json({ comments, totalComments, lastMonthComments });
    } catch (error) {
        next(error)
    }
}