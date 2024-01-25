import Post from "../model/post.model.js"
import { customError } from "../utils/customError.js";

const createPost = async (req, res, next) => {

    try {
        if (!req.body.title || !req.body.content) {
            return next(customError(400, 'Please provide all required fields'));
        }

        const slug = req.body.title
            .split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')

        const newPost = new Post({
            ...req.body,
            slug,
            userId: req.user.id
        })

        await newPost.save()

        res.status(200).json(newPost)
    } catch (error) {
        next(error)
    }
}

export const getBlogs = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = req.query.order === 'asc' ? 1 : -1
        const posts = await Post.find({
            ...(req.query.userId) && { userId: req.query.userId },
            ...(req.query.category) && { category: req.query.category },
            ...(req.query.slug) && { slug: req.query.slug },
            ...(req.query.postId) && { _id: req.query.postId },
            ...(req.query.searchTerm) && {
                $or: [
                    {
                        title: { $regex: req.query.searchTerm, $options: 'i' },
                        content: { $regex: req.query.searchTerm, $options: 'i' }
                    }
                ]
            }
        })
            .sort({ updatedAt: sortDirection })
            .skip(startIndex)
            .limit(limit)

        const totalBlogs = await Post.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )
        const lastMonthBlogs = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo }
        })

        res.status(200).json({
            posts,
            totalBlogs,
            lastMonthBlogs
        })

    } catch (error) {
        next(error)
    }
}
export default createPost