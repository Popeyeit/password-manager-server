const PasswordModule = require('./models');
const CryptoJS = require('crypto-js');

exports.createPassword = async (req, res, next) => {
  try {
    const { user } = req;
    const { body } = req;
    const { _id: id } = user;
    const { name, password, login } = body;

    const ciphertext = CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_CRYPTO,
    ).toString();

    const result = await PasswordModule.create({
      name,
      password: ciphertext,
      login,
      owner: id,
    });

    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_CRYPTO);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

    res.status(201).send({
      name: result.name,
      password: originalPassword,
      login: result.login,
      id: result._id,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPasswords = async (req, res, next) => {
  try {
    const { user } = req;
    const { _id: id } = user;

    const result = await PasswordModule.find({ owner: id });
    const response = result.map(passwordItem => {
      const bytes = CryptoJS.AES.decrypt(
        passwordItem.password,
        process.env.SECRET_CRYPTO,
      );
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);

      return {
        name: passwordItem.name,
        password: originalPassword,
        login: passwordItem.login,
        id: passwordItem._id,
      };
    });

    res.status(200).json(response);
  } catch (error) {}
};

exports.deletePassword = async (req, res, next) => {
  try {
    const { passwordId } = req.params;

    const result = await PasswordModule.findByIdAndDelete({
      _id: passwordId,
    });

    res.status(200).send({ id: result._id });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { body } = req;
    const { passwordId } = req.params;

    const ciphertext = CryptoJS.AES.encrypt(
      body.password,
      process.env.SECRET_CRYPTO,
    ).toString();

    const updatedResult = await PasswordModule.findOneAndUpdate(
      { _id: passwordId },
      { name: body.name, login: body.login, password: ciphertext },
      { new: true },
    );
    res.status(200).json({
      name: updatedResult.name,
      password: body.password,
      login: updatedResult.login,
      id: updatedResult._id,
    });
  } catch (error) {
    next(error);
  }
};
