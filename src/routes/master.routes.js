const express = require('express');

const masterRoute = express.Router();
const authRoute = express.Router();

const FlightBookingRouteMaster = require('../api/booking/index.routes');
const UserRouteMaster = require('../api/user/index.routes');

masterRoute.use('/flight', FlightBookingRouteMaster);
authRoute.use('/user', UserRouteMaster);

module.exports = [
  masterRoute,
  authRoute,
];
