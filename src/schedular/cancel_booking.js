const BookingSchema = require('../api/booking/model/booking.model');

function autoCancelBooking() {
  try {
    const currentDate = Date.now();

    const aggregationCallback = (error, result) => {
      if (error) {
        console.error('Exception', error);
        return;
      }

      if (result.length === 0) {
        console.log('Not found hold booking');
        return;
      }

      BookingSchema.updateMany({
        $or: result[0].data,
      }, {
        $set: {
          booking_status: 'cancelled',
        },
      }, {
        new: true,
        lean: true,
        projection: 'booking_status _id flight_detail',
      }).exec((updateError, updatedResult) => {
        if (updateError) {
          console.error('Error occured while cancelling booking', updateError);
          return;
        }
        console.log(updatedResult);
      });
    };

    BookingSchema.aggregate([{
      $match: {
        booking_status: 'hold',
      },
    }, {
      $addFields: {
        new_date: {
          $add: ['$booking_date', (60000 * 60) * 24],
        },
      },
    }, {
      $match: {
        new_date: {
          $gte: currentDate,
        },
      },
    }, {
      $group: {
        _id: null,
        data: {
          $push: {
            _id: '$_id',
          },
        },
      },
    }]).exec(aggregationCallback);
  } catch (error) {
    console.error('Exception', error);
  }
}

module.exports = {
  autoCancelBooking,
};
