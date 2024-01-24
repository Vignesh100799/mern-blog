import joi from "joi"

export const signUpValidation = joi.object({
    username: joi.string().min(3).max(15).required().messages({
        "string.min": "Username must have {#limit} letters",
        "string.max": "Username must between {#limit} letters",
        "string.required": "Username Name is Required"
    }),
    email: joi.string().email().required().messages({
        "string.email": "Invalid Email address",
        "string.required": "Email cannot be empty"
    }),
    password: joi.string().min(8).max(15).required().messages({
        "string.min": "password must have {#limit} letters",
        "string.max": "password must between {#limit} letters",
        "string.required": "password Name is Required"
    }),
    confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
        "any.only": "Password doesn't match"
    }),
})

export const signInValidation = joi.object({
    email: joi.string().email().required().messages({
        "string.email": "Invalid Email address",
        "string.required": "Email cannot be empty"
    }),
    password: joi.string().min(8).max(15).required().messages({
        "string.min": "password must have {#limit} letters",
        "string.max": "password must between {#limit} letters",
        "string.required": "password Name is Required"
    }),
})

export const updateValidation = joi.object({
    username: joi.string().min(3).max(15).required().messages({
        "string.min": "Username must have {#limit} letters",
        "string.max": "Username must between {#limit} letters",
        "string.required": "Username Name is Required"
    }),
    email: joi.string().email().required().messages({
        "string.email": "Invalid Email address",
        "string.required": "Email cannot be empty"
    }),
    password: joi.string().min(8).max(15).required().messages({
        "string.min": "password must have {#limit} letters",
        "string.max": "password must between {#limit} letters",
        "string.required": "password Name is Required"
    }),
})