import express from "express"
import { joiValidation } from "../middleware/joivalidation.js"
import { signUpValidation } from "../validation/auth.validationSchema.js"
import { authCon } from "../controllers/auth.controller.js"

const router = express.Router()


router.post("/sign-up",joiValidation(signUpValidation),authCon)

export default router