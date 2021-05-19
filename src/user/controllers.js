const userModel = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const markup = require('./markup');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = (email, link) => {
  const res = markup(link);

  return {
    to: `${email}`,
    from: process.env.EMAIL,
    subject: 'Confirm your email',
    text: 'Confirm your email',
    html: res,
  };
};

const sendVerification = async (
  email,
  verificationToken,
  set = '/api/verify/',
) => {
  const verificationLink = `${process.env.BASE_URL}${set}${verificationToken}`;

  try {
    const res = await sgMail.send(msg(email, verificationLink));
  } catch (error) {}
};

exports.recoverPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.getUserByEmail(email);

    if (!user) {
      return res.status(404).json('User not found');
    }
    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT),
    );
    const result = await userModel.findOneAndUpdate(
      { email: email },
      { verificationPassword: uuid.v4(), newPassword: hashPassword },
      { new: true },
    );
    sendVerification(
      result.email,
      result.verificationPassword,
      '/api/recover/password/',
    );
    res.status(201).send('verify email');
  } catch (error) {
    next(error);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await userModel.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json('User not found');
    }
    await userModel.findByIdAndUpdate(user.id, {
      verificationToken: '',
    });

    res.status(200).json('you have successfully confirmed your mail');
  } catch (error) {
    next(error);
  }
};

exports.authorize = async (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization');
    const token = authorizationHeader.replace('Bearer ', '');

    let userId;

    try {
      userId = await jwt.verify(token, process.env.JWT_SECRET).uid;
    } catch (err) {
      next(err);
    }

    const user = await userModel.findById(userId);

    if (!user) {
      res.status(401).json('Not authorized');
      return;
    }

    if (token !== user.token) {
      res.status(401).json('Not authorized');
      return;
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
};

exports.checkUniqueEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const uniqueEmail = await userModel.getUserByEmail(email);
    if (uniqueEmail) {
      res.status(409).json('Email in use');
      return false;
    }
    next();
  } catch (error) {
    next(error);
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const { password, email } = req.body;

    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT),
    );

    const user = await userModel.create({
      email,
      password: hashPassword,
      verificationToken: uuid.v4(),
    });

    await sendVerification(user.email, user.verificationToken);

    res.status(201).json({
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const isUser = await userModel.getUserByEmail(email);

    const { verificationToken } = isUser;
    if (verificationToken) {
      return res.status(403).json('Your email is not verified');
    }

    if (!isUser) {
      return res.status(401).json('Email or password is wrong');
    }
    const isPasswordCorrect = await bcrypt.compare(password, isUser.password);

    if (!isPasswordCorrect) {
      return res.status(401).json('Email or password is wrong');
    }

    const token = await jwt.sign(
      {
        uid: isUser._id,
      },
      process.env.JWT_SECRET,
    );

    await userModel.updateUserToken(isUser._id, token);

    await res.status(200).json({
      email: isUser.email,
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.currentUser = async (req, res, next) => {
  try {
    const { user } = req;
    res.status(200).json({
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    const { user } = req;
    await userModel.updateUserToken(user.id, null);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.verifyPassword = async (req, res, next) => {
  try {
    const { verificationPassword } = req.params;

    const user = await userModel.findOne({ verificationPassword });

    if (!user) {
      return res.status(404).json('User not found');
    }
    await userModel.findByIdAndUpdate(user.id, {
      verificationPassword: '',
      newPassword: '',
      password: user.newPassword,
    });

    res
      .status(200)
      .json(
        markup(
          'http://localhost:3000/sign-in',
          'Перейти на сайт',
          'Вы успешно подтвердили email.',
        ),
      );
  } catch (error) {
    next(error);
  }
};
