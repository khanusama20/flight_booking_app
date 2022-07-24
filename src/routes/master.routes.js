const express = require('express');

const masterRoute = express.Router();
const authRoute = express.Router();

const FlightBookingRouteMaster = require('../api/booking/index.routes');
const UserRouteMaster = require('../api/user/index.routes');

const [secureRouteSet, AuthLessRouteSet] = FlightBookingRouteMaster;
masterRoute.use('/flight', secureRouteSet);
authRoute.use('/flight', AuthLessRouteSet);
authRoute.use('/user', UserRouteMaster);

module.exports = [
  masterRoute,
  authRoute,
];
