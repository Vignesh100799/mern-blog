import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: "uncategorized"
    },
    image: {
        type: String,
        default: "https://images.squarespace-cdn.com/content/v1/5056c03584aedaeee9199a39/1512901729473-O70PDOI581WZL3DTM58B/how-blogging-works.jpg?format=1500w"

    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
},
    { timestamps: true })

    const Post =  mongoose.model("Post", postSchema)

    export default Post