const express = require('express');

const userAuthRoute = express.Router();

const PostController = require('./controllers/post.controller');

const controller = {
  ...PostController,
};

userAuthRoute.post('/sign-up', controller.userSignUp);
userAuthRoute.post('/login', controller.login);

module.exports = userAuthRoute;
