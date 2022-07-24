let CronJob = require('cron').CronJob;
require('dotenv').config();
const DBConnection = require('./src/config/dbConnection');
const {
  autoCancelBooking
} = require('./src/schedular/schedular.index');

DBConnection();

console.log('Before job instantiation');

let job = new CronJob('00 */1 * * * *', function() {
  console.log('You will see this message every second');
  autoCancelBooking();
}, null, true, 'Asia/Kolkata');

job.start();
