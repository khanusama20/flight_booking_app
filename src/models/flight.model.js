const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const Flight = Schema({
  airline: { type: String, default: null },
  duration: { type: Number, default: null },
  capacity: { type: Number, default: 180 },
  plane: { type: String, default: null },
  total_fare: { type: Number, default: null },
  booking_hold_fare: { type: Number, default: null },
  minimum_booking_hours: { type: Number, default: null },
  flight_type: { type: String, default: null },
  currency: { type: String, default: null },
  running_days: { type: Number, default: null },
  flights: {
    type: Array,
    default: [],
  },
});

module.exports = model('flight', Flight);
