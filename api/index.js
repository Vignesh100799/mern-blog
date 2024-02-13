import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import db from "./db/db.js"
import morgan from "morgan"
import { errorHandler } from "./middleware/error.handler.js"
import userRoute from "./routes/user.route.js"
import authRoute from "./routes/auth.route.js"
import postRoute from "./routes/post.route.js"
import commnetRoute from "./routes/comment.route.js"
import path from "path"

const __dirname = path.resolve()
const app = express()
dotenv.config()
db(process.env.DB_URL)

app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser())

app.listen(6505, () => {
    console.log("server running in port 6505")
})

app.use("/api/user", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/blog", postRoute)
app.use("/api/comment", commnetRoute)
app.use(express.static(path.join(__dirname, "/client/dist")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"))
}
)

app.use(errorHandler)