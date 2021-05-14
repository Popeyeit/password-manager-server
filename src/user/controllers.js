const userModel = require('./models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    });

    const token = await jwt.sign(
      {
        uid: user._id,
      },
      process.env.JWT_SECRET,
    );
    await userModel.updateUserToken(user._id, token);

    res.status(201).json({
      token,
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
