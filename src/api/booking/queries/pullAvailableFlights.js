const FlightSchema = require('../../../models/flight.model');
const BookingSchema = require('../model/booking.model');

async function pullAvailableSeats(origin, destination, departureDate) {
  try {
    const result = await BookingSchema
      .aggregate([
        {
          $match: {
            $and: [
              { journey_date: departureDate },
              {
                'flight_detail.origin_code': origin,
                'flight_detail.destination_code': destination,
              },
            ],
          },
        },
        {
          $group: {
            _id: null,
            totalReserved: {
              $sum: '$reserve_seats',
            },
          },
        },
      ]);

    return result;
  } catch (exception) {
    throw exception;
  }
}
async function pullAvailableFlights(obj) {
  try {
    const {
      origin,
      destination,
    } = obj;

    const queryResult = await FlightSchema
      .aggregate([
        {
          $match: {
            flights: {
              $elemMatch: {
                origin_code: origin,
                destination_code: destination,
              },
            },
          },
        },
        {
          $unwind: '$flights',
        },
        {
          $match: {
            $and: [{
              'flights.origin_code': origin,
            },
            {
              'flights.destination_code': destination,
            },
            ],
          },
        },
        {
          $group: {
            _id: {
              airline: '$airline',
              duration: '$duration',
              plane: '$plane',
              total_fare: '$total_fare',
              booking_hold_fare: '$booking_hold_fare',
              minimum_booking_hours: '$minimum_booking_hours',
              flight_type: '$flight_type',
              currency: '$currency',
              running_days: '$running_days',
              capacity: '$capacity',
              frequency: '$frequency',
            },
            flights: {
              $push: '$flights',
            },
          },
        },
      ]);

    return queryResult ?? [];
  } catch (exception) {
    throw exception;
  }
}

module.exports = {
  pullAvailableSeats,
  pullAvailableFlights,
};
