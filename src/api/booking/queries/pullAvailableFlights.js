const FlightSchema = require('../../../models/flight.model');
const BookingSchema = require('../model/booking.model');

async function pullAvailableSeats(origin, destination, departureDate) {
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
            { booking_status: 'confirmed' },
            { booking_status: 'hold' },
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
}
async function pullAvailableFlights(obj) {
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

  return queryResult;
}

module.exports = {
  pullAvailableSeats,
  pullAvailableFlights,
};
