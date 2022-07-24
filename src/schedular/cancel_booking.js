const BookingSchema = require('../api/booking/model/booking.model');

function autoCancelBooking() {
  try {
    const currentDate = Date.now();
    
    let aggregationCallback = (error, result) => {
      if (error) {
        console.error('Exception', error);
        return;
      }

      BookingSchema.updateMany({
        $or: result[0].data
      }, {
        $set: {
          booking_status: "cancelled"
        }
      }, {
        new: true,
        lean: true,
        projection: 'booking_status _id flight_detail'
      }).exec((error, updatedResult) => {
        if (error) {
          console.error('Error occured while cancelling booking', error);
          return;
        }
        console.log(updatedResult);
      })
    }

    BookingSchema.aggregate([{
      $match: {
        booking_status: 'hold',
      },
    }, {
      $addFields: {
        new_date: {
          $add: ['$booking_date', (60000 * 20)],
        }
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
            _id: "$_id"
          }
        }
      }
    }]).exec(aggregationCallback);
  } catch (error) {
    console.error('Exception', error);
  }
}

module.exports = {
  autoCancelBooking,
};
