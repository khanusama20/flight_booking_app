const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const Booking = new Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true,
  },
  return_journey_available: {
    type: Boolean,
    default: false,
  },
  place_of_origin: {
    type: String,
    enum: [
      'Mumbai',
      'Delhi',
      'Chennai',
      'Kolkata',
    ],
    required: true,
  },
  day: {
    type: String,
    enum: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
  },
  booking_date: {
    type: Number,
    default: Date.now(),
  },
  booking_status: {
    type: String,
    enum: [
      'hold',
      'confirmed',
      'cancelled',
    ],
    required: true,
  },
  journey_date: {
    type: Number,
    require: true,
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  flight_detail: {
    origin: { type: String, default: '' },
    origin_code: { type: String, default: '' },
    destination: { type: String, default: '' },
    destination_code: { type: String, default: '' },
    departureTime: { type: String, default: null },
    arrivalTime: { type: String, default: null },
  },
  // only one seat will reserve on one booking
  reserve_seats: {
    type: Number,
    default: 1,
  },
});

Booking.index({
});

module.exports = model('booking', Booking);
