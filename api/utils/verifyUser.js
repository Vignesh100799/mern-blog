import jwt from "jsonwebtoken";
import { customError } from "./customError.js";

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token

    if (!token) {
        next(customError(401, "Unauthorized"))
    }
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if (err) {
            return next(customError(401, 'Unauthorized'))
        }
        req.user = user
        next()
    })
}
export const adminVerify = (req, res, next) => {

    const {isAdmin}  = req.user
    if (!isAdmin) {
        next(customError(401, "You are not allowed to post"))
    }
    next()

}
export default verifyToken