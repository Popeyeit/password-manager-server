const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  token: {
    type: String,
    required: false,
    default: null,
  },
  verificationToken: {
    type: String,
    required: false,
  },
  newPassword: { type: String, required: false, min: 6 },
  verificationPassword: {
    type: String,
    required: false,
  },
});

const getUserByEmail = async function (email) {
  const res = await this.findOne({
    email,
  });

  return res;
};
const updateUserToken = async function (id, newToken) {
  return await this.findByIdAndUpdate(id, {
    token: newToken,
  });
};

userSchema.statics.getUserByEmail = getUserByEmail;
userSchema.statics.updateUserToken = updateUserToken;

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
