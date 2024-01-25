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

export default createPost