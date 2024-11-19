const Joi = require('joi');

const registerSchema = Joi.object({
  fullName: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
  gender: Joi.string().valid('male', 'female'),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};