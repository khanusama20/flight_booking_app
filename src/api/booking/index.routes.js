const express = require('express');

const bookingRoute = express.Router();
const openRoute = express.Router();

const PostController = require('./controllers/post.controller');
const GetController = require('./controllers/get.controller');

const controller = {
  ...PostController,
  ...GetController,
};

bookingRoute.post('/reserve-seat', controller.reserveSeat);
openRoute.get('/check-availability', controller.checkAvailability);

module.exports = [
  bookingRoute,
  openRoute,
];
