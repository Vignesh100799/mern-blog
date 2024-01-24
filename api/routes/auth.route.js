import express from "express"
import { joiValidation } from "../middleware/joivalidation.js"
import { signInValidation, signUpValidation } from "../validation/auth.validationSchema.js"
import { gooleLogin, signIn, signUp } from "../controllers/auth.controller.js"

const router = express.Router()


router.post("/sign-up",joiValidation(signUpValidation),signUp)
router.post ("/sign-in",joiValidation(signInValidation),signIn)
router.post("/google",gooleLogin)

export default router