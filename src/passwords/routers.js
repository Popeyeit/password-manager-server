const { Router } = require('express');
const passwordRouter = Router();
const { authorize } = require('../user/controllers');
const { handleValidate } = require('../helpers/validate');
const {
  createPassword: rulesCreatePassword,
  passwordObjectId,
  changePasswordRules,
} = require('./schemes');
const {
  createPassword,
  getPasswords,
  deletePassword,
  changePassword,
} = require('./controllers');

passwordRouter.get('/', authorize, getPasswords);
passwordRouter.post(
  '/',
  authorize,
  handleValidate(rulesCreatePassword),
  createPassword,
);
passwordRouter.delete(
  '/:passwordId',
  authorize,
  // handleValidate(passwordObjectId, 'params'),
  deletePassword,
);
module.exports = passwordRouter;

passwordRouter.patch(
  '/:passwordId',
  authorize,
  // handleValidate(passwordObjectId, 'params'),
  handleValidate(changePasswordRules),
  changePassword,
);
