const Joi = require('joi');

exports.createPassword = Joi.object({
  name: Joi.string().required().min(1).max(20),
  password: Joi.string().required().min(1),
  login: Joi.string().required().min(1).max(20),
});

exports.passwordId = Joi.object({
  passwordId: Joi.string().custom((value, helpers) => {
    const isValidObjId = ObjectId.isValid(value);
    if (!isValidObjId) {
      return helpers.error('Invalid password id. Must be object id');
    }
    return value;
  }),
  dateId: Joi.string().custom((value, helpers) => {
    const isValidObjId = ObjectId.isValid(value);
    if (!isValidObjId) {
      return helpers.error('Invalid password id. Must be object id');
    }
    return value;
  }),
});

exports.changePasswordRules = Joi.object({
  name: Joi.string().min(1).max(20),
  password: Joi.string().min(1),
  login: Joi.string().min(1).max(20),
});
