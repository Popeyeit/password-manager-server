const express = require('express');
const userRouter = express.Router();
const { handleValidate } = require('../helpers/validate');

const {
  registerUser,
  checkUniqueEmail,
  loginUser,
  currentUser,
  logoutUser,
  authorize,
  verifyEmail,
  recoverPassword,
  verifyPassword,
} = require('./controllers');

const {
  registerSchema,
  loginSchema,
  recoverPasswordSchema,
} = require('./schemes');

userRouter.post(
  '/register',
  handleValidate(registerSchema),
  checkUniqueEmail,
  registerUser,
);

userRouter.post('/login', handleValidate(loginSchema), loginUser);
userRouter.post('/logout', authorize, logoutUser);
userRouter.get('/currentUser', authorize, currentUser);
userRouter.get('/verify/:verificationToken', verifyEmail);
userRouter.post(
  '/recover/password',
  handleValidate(recoverPasswordSchema),
  recoverPassword,
);
userRouter.get('/recover/password/:verificationId', verifyPassword);
module.exports = userRouter;
