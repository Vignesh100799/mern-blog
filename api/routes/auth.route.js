import express from "express"
import { joiValidation } from "../middleware/joivalidation.js"
import { signUpValidation } from "../validation/auth.validationSchema.js"
import { signUp } from "../controllers/auth.controller.js"

const router = express.Router()


router.post("/sign-up",joiValidation(signUpValidation),signUp)

export default router