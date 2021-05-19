const mongoose = require('mongoose');
const { Schema } = mongoose;

const passwordSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
});

const PasswordModule = mongoose.model('Password', passwordSchema);

module.exports = PasswordModule;
