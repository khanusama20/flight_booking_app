const mongoose = require('mongoose');
const { compare } = require('bcrypt');

const { Schema, model } = mongoose;

const User = new Schema({
  first_name: {
    type: String,
    trim: true,
    required: true,
  },
  last_namme: {
    type: String,
    trim: true,
    required: true,
  },
  mobile_no: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  gender: {
    type: String,
    enum: [
      'Male', 'Female', 'Others',
    ],
  },
  birth_date: {
    type: Number,
    required: true,
  },
  age: {
    type: Number,
    default: null,
  },
  salt: {
    type: String,
  },
  password: {
    type: String,
  },
});

User.methods.isValidPassword = async function (password) {
  return await compare(password, this.password);
};

module.exports = model('user', User);
