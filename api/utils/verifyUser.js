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
export default verifyToken