import Joi from 'joi'

const registerUserSchema = Joi.object({
  first_name: Joi.string().min(3).max(30).required(),
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})

export const loginUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().min(3).max.optional(),
  password: Joi.string().min(6).required()
})

export const userValidation = (data) => {
  return registerUserSchema.validate(data, { abortEarly: false })
}

export const userValidationPartial = (data) => {
  return registerUserSchema.optional().validate(data, { abortEarly: false })
}
