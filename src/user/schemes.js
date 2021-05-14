const Joi = require('joi');

exports.registerSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string()
    .required()
    .min(6)
    .regex(/^(?=.*[A-Z])(?=.*[0-9])/, 'Must one Uppercase, One Number'),
});
exports.loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
