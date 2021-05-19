const { Router } = require('express');
const passwordRouter = Router();
const { authorize } = require('../user/controllers');
const { handleValidate } = require('../helpers/validate');
const {
  createPassword: rulesCreatePassword,
  passwordId,
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
  handleValidate(passwordId, 'params'),
  deletePassword,
);
module.exports = passwordRouter;

passwordRouter.patch(
  '/:passwordId',
  authorize,
  handleValidate(passwordId, 'params'),
  handleValidate(changePasswordRules, changePassword),
);
