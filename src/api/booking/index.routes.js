const express = require('express');

const bookingRoute = express.Router();

const PostController = require('./controller/post.controller');
const GetController = require('./controller/get.controller');

const controller = {
  ...PostController,
  ...GetController
};

bookingRoute.post('/reserve-seat', controller.reserveSeat);
bookingRoute.get('/check-availability', controller.checkAvailability);

module.exports = bookingRoute;
