import express from "express"
import db from "./db/db.js"
import dotenv from "dotenv"
dotenv.config()
db(process.env.DB_URL)
const app = express()


app.listen(6505, () => {
    console.log("server running in port 6505")
})