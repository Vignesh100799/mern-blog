import mongoose from "mongoose"


 const db = async (url) => {
    try {
        const connect = await mongoose.connect(url)
        console.log("MongoDB connected Successfully")
    } catch (error) {
        console.log(error)
    }
}
export default db