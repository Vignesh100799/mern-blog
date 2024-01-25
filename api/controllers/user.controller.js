import bcryptjs from 'bcryptjs'
import { customError } from '../utils/customError.js'
import User from '../model/user.model.js'


export const userCon = async (req, res) => {
    try {
        res.send({ message: "Route checking" })
    } catch (error) {
        console.log(error)
    }
}

export const updateUser = async (req, res, next) => {
    const userID = req.params.id
    if (req.user.id !== userID) {
        return next(customError(404, "You are not allowed to update this user"))
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(
                errorHandler(400, 'Username must be between 7 and 20 characters')
            );
        }
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
        return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-z0-9]+$/)) {
        return next(
            errorHandler(400, 'Username can only contain lowercase letters and numbers')
        );
    }

    if (req.body.username.includes(' ')) {
        return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    try {
        const updateUser = await User.findByIdAndUpdate(userID, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
            }
        },
            { new: true }
        )

        const { password, ...rest } = updateUser._doc

        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }

}
export const deleteUser = async (req, res, next) => {
    try {
        const userID = req.params.id
        if (req.user.id !== userID) {
            return next(errorHandler(400, "You are not allowed to delete this user"))
        }
        await User.findByIdAndDelete(userID)

        res.status(200).json({ message: "User deleted Successfully" })
    } catch (error) {
        next(error)
    }
}
export const signOut = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json({ message: "user signout successfully" })
    } catch (error) {
        next(error)
    }
}