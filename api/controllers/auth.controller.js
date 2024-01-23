import bycrpt from "bcryptjs"
import User from "../model/user.model.js"


export const authCon = async (req, res) => {
    try {
        const { username, email, password, confirmpassword } = req.body
        const hashPassword = bycrpt.hashSync(password, 10)
        
        const newUser = new User({
            username,
            email,
            password: hashPassword,
        })
        
        await newUser.save()

        res.status(200).json({message : "User registered succesfully"})
    } catch (error) {
        console.log(error)
        res.status(404).json({message : "User not registered"})
    }
}