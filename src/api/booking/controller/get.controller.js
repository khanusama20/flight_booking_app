const FlightSchema = require('../../../models/flight.model');
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

async function checkAvailability(req, res) {
  try {
    const {
      origin,
      destination,
      dateOfJourney
    } = req.query;

    const departureDate = new Date(dateOfJourney).setHours(0, 0, 0, 0);

    let result = await BookingSchema
      .aggregate([
        {
          $match: {
            $and: [
              { journey_date: departureDate },
              {
                "flight_detail.origin_code": origin,
                "flight_detail.destination_code": destination
              }
            ]
          },
        },
        {
          $group: {
            _id: null,
            totalReserved: {
              $sum: "$reserve_seats"
            }
          }
        }
      ]);

    console.log(result)
    if (result.length === 0) {
      // 64 not found
      sendResponse(
        req,
        res,
        200,
        64,
        null,
        "Booking Full",
        INFO,
      );
      return;
    }

    let availableFlightsResult = await FlightSchema
      .aggregate([
        {
          $match: {
            flights: {
              $elemMatch: {
                origin_code: "BOM",
                destination_code: "DEL"
              }
        
            }
          }
        },
        {
          $unwind: "$flights"
        },
        {
          $match: {
            $and: [{
                "flights.origin_code": "BOM"
              },
              {
                "flights.destination_code": "DEL"
              }
            ]
          }
        },
        {
          $group: {
            _id: {
              "airline": "$airline",
              "duration": "$duration",
              "plane": "$plane",
              "total_fare": "$total_fare",
              "booking_hold_fare": "$booking_hold_fare",
              "minimum_booking_hours": "$minimum_booking_hours",
              "flight_type": "$flight_type",
              "currency": "$currency",
              "running_days": "$running_days",
              "capacity": "$capacity"
            },
            flights: {
              $push: "$flights"
            }
          }
        }
      ]);

    if (availableFlightsResult.length === 0) {
      sendResponse(
        req,
        res,
        200,
        64,
        null,
        "Booking Full",
        INFO,
      );
      return;
    }

    availableFlightsResult[0].flights = availableFlightsResult[0].flights.map(item => {
      item.departure_date = dateOfJourney
      return item;
    });

    const {
      capacity
    } =  availableFlightsResult[0]._id;

    availableFlightsResult[0]._id.available_seats = capacity - result[0].totalReserved;
    sendResponse(
      req,
      res,
      200,
      -1,
      availableFlightsResult,
      "Booking Availabel",
      SUCCESS,
    );
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
  checkAvailability
};
