const {
  pullAvailableSeats,
  pullAvailableFlights,
} = require('../queries/pullAvailableFlights');

const {
  sendResponse,
  generateCalendar,
} = require('../../../utilities/utils');

const {
  INFO,
  ERROR,
  SUCCESS,
} = require('../../../constants/messageType');

async function checkAvailability(req, res) {
  try {
    const {
      origin,
      destination,
      fromDate,
      toDate,
    } = req.query;

    const dateFrom = new Date(fromDate).setHours(0, 0, 0, 0);
    const tillDate = new Date(toDate).setHours(0, 0, 0, 0);

    if (dateFrom < Date.now()) {
      sendResponse(req, res, 406, 9, null, 'Previous date is not allowed', INFO);
      return;
    }

    if (tillDate < dateFrom) {
      sendResponse(req, res, 406, 9, null, 'Previous date is not allowed', INFO);
      return;
    }

    const result = await pullAvailableSeats(origin, destination, dateFrom);
    console.log('Available Seats in flight ', result);

    if (result.length > 0 && result[0].totalReserved === 180) {
      // 64 not found
      sendResponse(req, res, 200, 64, null, 'Booking Full', INFO);
      return;
    }

    const totalReserved = result.length === 0 ? 0 : result[0].totalReserved;

    const availableFlightsResult = await pullAvailableFlights(req.query);
    if (availableFlightsResult.length === 0) {
      sendResponse(req, res, 200, 64, null, 'Booking Full', INFO);
      return;
    }

    const {
      capacity,
    } = availableFlightsResult[0]._id;

    availableFlightsResult[0]._id.available_seats = capacity - totalReserved;
    const timeTable = generateCalendar(dateFrom, tillDate, availableFlightsResult[0]._id.frequency)
      .map((obj) => {
        let { flights } = obj;
        flights = availableFlightsResult[0].flights;
        return {
          ...obj,
          ...availableFlightsResult[0]._id,
          flights,
        };
      });

    if (timeTable.length === 0) {
      sendResponse(req, res, 200, 64, null, 'Flights not found', INFO);
      return;
    }
    sendResponse(req, res, 200, -1, timeTable, 'Booking Available', SUCCESS);
  } catch (error) {
    console.log(error.message);
    sendResponse(req, res, 200, 16, null, 'Internal Server Error', ERROR);
  }
}

module.exports = {
  checkAvailability,
};
