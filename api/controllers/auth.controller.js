import bcryptjs from "bcryptjs"
import User from "../model/user.model.js"
import { customError } from "../utils/customError.js"


export const signUp = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const hashPassword = bcryptjs.hashSync(password, 10);
      const findEmail = await User.findOne({ email });
  
      if (findEmail) {
        return next(customError(400, "Email already Registered"));
      }
      const findUser = await User.findOne({ username });
      if (findUser) {
        return next(customError(400, "please enter another username"));
      }
  
      const newUser = new User({
        username,
        email,
        password: hashPassword,
      });
  
      await newUser.save();
  
      res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      next(error);
    }
  };