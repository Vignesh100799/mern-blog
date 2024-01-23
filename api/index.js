import express from "express"
import dotenv from "dotenv"


import db from "./db/db.js"

import userRoute from "./routes/user.route.js"
import authRoute from "./routes/auth.route.js"


const app = express()
dotenv.config()
db(process.env.DB_URL)


app.use(express.json())


app.listen(6505, () => {
    console.log("server running in port 6505")
})

app.use("/api/user", userRoute)
app.use("/api/auth", authRoute)