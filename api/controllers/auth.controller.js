import bcryptjs from "bcryptjs"
import User from "../model/user.model.js"
import { customError } from "../utils/customError.js"
import jwt from "jsonwebtoken";
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

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const validUser = await User.findOne({ email })

    if (!validUser) {
      return next(customError(400, "User not found"))
    }
    if (email !== validUser.email) {
      return next(customError(400, "User or password is incorrect"))
    }
    const validatePassword = bcryptjs.compareSync(password, validUser.password)
    if (!validatePassword) {
      return next(customError(400, "User or password is incorrect"))
    }

    const token = jwt.sign({
      id: validUser._id
    }, process.env.JWT_KEY)

    const { password: pass, ...rest } = validUser._doc
    res.status(200).cookie('access_token', token, {
      httpOnly: true
    }).json({ message: "SignIn Success", ...rest });
    

  } catch (error) {
    next(error)
  }
}