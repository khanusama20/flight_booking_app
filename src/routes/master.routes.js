const express = require('express');

const masterRoute = express.Router();

const FlightBookingRouteMaster = require('../api/booking/index.routes');

masterRoute.use('/flight', FlightBookingRouteMaster);

module.exports = masterRoute;
