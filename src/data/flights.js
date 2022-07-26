const flights = [
  {
    airline: 'aircraft',
    duration: 3000,
    plane: 'ATR725',
    total_fare: 3000,
    booking_hold_fare: 300,
    minimum_booking_hours: 3000,
    flight_type: 'domestic',
    currency: 'INR',
    running_days: 5,
    flights: [
      {
        origin: 'Mumbai',
        origin_code: 'BOM',
        destination: 'Delhi',
        destination_code: 'DEL',
        departure: '05:00',
        arrival: '06:55',
      },
      {
        origin: 'Mumbai',
        origin_code: 'BOM',
        destination: 'Delhi',
        destination_code: 'DEL',
        departure: '07:00',
        arrival: '08:55',
      },
      {
        origin: 'Delhi',
        origin_code: 'DEL',
        destination: 'Mumbai',
        destination_code: 'BOM',
        departure: '08:55',
        arrival: '10:50',
      },
      {
        origin: 'Delhi',
        origin_code: 'DEL',
        destination: 'Mumbai',
        destination_code: 'BOM',
        departure: '10:55',
        arrival: '12:50',
      },
    ],
  },
];

module.exports = flights;
