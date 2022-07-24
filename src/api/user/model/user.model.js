const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const User = Schema({
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
    default: null,
  },
  password: {
    type: String,
    default: null,
  },
});

module.exports = model('user', User);
