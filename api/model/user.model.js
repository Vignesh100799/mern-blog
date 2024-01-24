import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }, password: {
        type: String,
        required: true,
        unique: true
    },
    profilePicture:{
        type :String,
        default : "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpre-inscription.supmti.ac.ma%2Flogin%2F%3Fa%3Duser-profile-icon-in-flat-member-avatar-vector-illustration-gg-orNKK8sY&psig=AOvVaw0vXcvhJ7zstNmgVeR7oks7&ust=1706161889851000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCKjXwMeq9YMDFQAAAAAdAAAAABAI"
    }
}, { timestamps: true })
const User = mongoose.model("User", userSchema)
export default User

