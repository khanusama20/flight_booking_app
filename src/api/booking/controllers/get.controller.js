const FlightSchema = require('../../../models/flight.model');
const BookingSchema = require('../model/booking.model');

const {
  pullAvailableSeats,
  pullAvailableFlights,
} = require('../queries/pullAvailableFlights');

const {
  sendResponse,
} = require('../../../utilities/utils');

const {
  INFO,
  ERROR,
  WARNING,
  SUCCESS,
} = require('../../../constants/messageType');

async function checkAvailability(req, res) {
  try {
    const {
      origin,
      destination,
      dateOfJourney,
    } = req.query;

    const departureDate = new Date(dateOfJourney).setHours(0, 0, 0, 0);

    const result = await pullAvailableSeats(origin, destination, departureDate);
    console.log('Available Seats in flight ', result);

    if (result.length === 0) {
      // 64 not found
      sendResponse(req, res, 200, 64, null, 'Booking Full', INFO);
      return;
    }

    const availableFlightsResult = await pullAvailableFlights(req.query);
    if (availableFlightsResult.length === 0) {
      sendResponse(req, res, 200, 64, null, 'Booking Full', INFO);
      return;
    }

    availableFlightsResult[0].flights = availableFlightsResult[0].flights.map((item) => {
      item.departure_date = dateOfJourney;
      return item;
    });

    const {
      capacity,
    } = availableFlightsResult[0]._id;

    availableFlightsResult[0]._id.available_seats = capacity - result[0].totalReserved;
    sendResponse(req, res, 200, -1, availableFlightsResult, 'Booking Available', SUCCESS);
  } catch (error) {
    console.log(error.message);
    sendResponse(req, res, 200, 16, null, 'Internal Server Error', ERROR);
  }
}

module.exports = {
  checkAvailability,
};
