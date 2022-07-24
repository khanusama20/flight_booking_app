const moment = require('moment');

function sendResponse(req, res, statusCode, errCode, data, msgTxt, msgType) {
  const dataBody = {
    errCode,
    data,
    msgTxt,
    msgType,
    date: new Date(),
  };
  console.log('http response trigger successfully', JSON.stringify(dataBody));
  return res.status(statusCode).send(dataBody);
}

function randomId(howMany = 10, key = 'abcdef0123456789') {
  let salt = '';
  for (let x = 0; x < howMany; x++) {
    salt += key.charAt(Math.floor(Math.random() * key.length));
  }
  return salt;
}

function generateCalendar(from, tillDate, frequency = []) {
  const WEEK_NAME = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];

  const schedule = [];
  const fromDate = moment(from);
  const endDate = moment(tillDate);

  const totalDays = endDate.diff(fromDate, 'days');

  let incrementDate = fromDate;
  for (let i = 0; i < totalDays; i++) {
    if (incrementDate < endDate) {
      incrementDate = incrementDate + ((60000 * 60) * 24); // one day
      let date = new Date(incrementDate);

      if (frequency.includes(WEEK_NAME[date.getDay()])) {
        schedule.push({
          day: WEEK_NAME[date.getDay()],
          departureDate: `${(date.getMonth() + 1)}/${date.getDate()}/${date.getFullYear()}`
        })
      }
    }
  }
  return schedule;
}

module.exports = {
  sendResponse,
  randomId,
  generateCalendar,
};
