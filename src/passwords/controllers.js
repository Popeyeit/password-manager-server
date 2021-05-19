const PasswordModule = require('./models');

exports.createPassword = async (req, res, next) => {
  try {
    const { user } = req;
    const { body } = req;
    const { _id: id } = user;
    const { name, password, login } = body;

    const result = await PasswordModule.create({
      name,
      password,
      login,
      owner: id,
    });

    res.status(201).send({
      name: result.name,
      password: result.password,
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
    const response = result.map(passwordItem => ({
      name: passwordItem.name,
      password: passwordItem.password,
      login: passwordItem.login,
      id: passwordItem._id,
    }));

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
    const updatedResult = await PasswordModule.findOneAndUpdate(
      { _id: passwordId },
      { ...body },
      { new: true },
    );
    res.status(200).json(updatedResult);
  } catch (error) {
    next(error);
  }
};
