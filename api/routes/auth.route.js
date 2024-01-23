import express from "express"
import { joiValidation } from "../middleware/joivalidation.js"
import { signInValidation, signUpValidation } from "../validation/auth.validationSchema.js"
import { signIn, signUp } from "../controllers/auth.controller.js"

const router = express.Router()


router.post("/sign-up",joiValidation(signUpValidation),signUp)
router.post ("/sign-in",joiValidation(signInValidation),signIn)
export default router