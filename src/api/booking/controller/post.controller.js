// const FlightSchema = require('../../../models/flight.model');
const BookingSchema = require('../model/booking.model');
const {
  sendResponse,
  randomId,
} = require('../../../utilities/utils');
const {
  INFO,
  ERROR,
  WARNING,
  SUCCESS,
} = require('../../../constants/messageType');

async function reserveSeat(req, res) {
  try {
    console.log('Request body before insert ', JSON.stringify(req.body));
    const data = {
      bookingId: randomId(),
      place_of_origin: req.body.place_of_origin,
      booking_status: req.body.status,
      journey_date: new Date(req.body.date_of_journey).setHours(0,0,0,0),
      flight_detail: {
        ...req.body.flight_detail,
        departureDate: new Date(req.body.flight_detail.departureDate).valueOf(),
        arrivalDate: new Date(req.body.flight_detail.arrivalDate).valueOf(),
      },
    };

    console.log('Data modification before insert ', JSON.stringify(data));
    const booking_result = await new BookingSchema(data).save();
    // const booking_result = 'yes';
    if (booking_result) {
      sendResponse(
        req,
        res,
        200,
        -1,
        booking_result,
        'Congratulations! Your booking is confirmed successfully',
        SUCCESS,
      );
    } else {
      sendResponse(
        req,
        res,
        200,
        10,
        null,
        'Sorry! Your booking is failed',
        ERROR,
      );
    }
  } catch (error) {
    console.log(error.message);
    sendResponse(
      req,
      res,
      500,
      16,
      null,
      'Internal Server Error',
      ERROR,
    );
  }
}

module.exports = {
  reserveSeat,
};
