const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const UserSchema = require('../model/user.model');
const {
  sendResponse,
} = require('../../../utilities/utils');

async function userSignUp(req, res) {
  try {
    // Date of birth formate validation: only valid formats are allowed
    // MMDDYYYY, YYYYMMDD

    let userAge;
    if (req.body.birth_date) {
      userAge = moment(
        req.body.birth_date.split('/').join(''),
        'MMDDYYYY',
      ).fromNow();

      if (userAge === 'Invalid date') {
        sendResponse(
          req,
          res,
          406,
          9,
          null,
          'Invalid date, MMDDYYYY format is requires',
        );
        return;
      }
      const found = userAge.match(/^[0-9]+/); // 26 years ago = ['26', 'years', 'ago']
      userAge = found ? parseInt(found[0], 10) : null;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    req.body.birth_date = new Date(req.body.birth_date).setHours(0, 0, 0, 0);

    const signup = new UserSchema({
      ...req.body,
      ...{
        password: hash,
        salt,
        age: userAge,
      },
    });

    const result = await signup.save();
    if (!result) {
      sendResponse(req, res, 200, 49, null, 'Sign up failed');
      return;
    }
    const userDetails = result.toObject();

    delete userDetails.password;
    delete userDetails.salt;

    sendResponse(req, res, 200, -1, userDetails, 'Successfully created');
  } catch (error) {
    console.error(error);
    sendResponse(req, res, 500, 16, null, 'Internal Server Error');
  }
}

module.exports = {
  userSignUp,
};
