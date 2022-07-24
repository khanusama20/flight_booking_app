const JWT = require('jsonwebtoken');
const {
  sendResponse,
} = require('../utilities/utils');

async function decodeJWTTokenMiddleware(req, res, next) {
  console.log('Init Middleware - Decode JWT Token');

  const token = req.headers.authorization;
  if (!token) {
    console.log('No token provided');
    sendResponse(
      req,
      res,
      400,
      25,
      null,
      'No token provided',
    );
    return;
  }

  const tokenParts = token.split(' ');
  if (tokenParts.length > 2) {
    sendResponse(
      req,
      res,
      400,
      25,
      null,
      'Token is invalid',
    );
    return;
  }

  if (tokenParts[0] !== 'Bearer') {
    sendResponse(
      req,
      res,
      400,
      25,
      null,
      'Token is invalid',
    );
    return;
  }

  try {
    const decoded = await JWT.verify(tokenParts[1], process.env.PRIVATE_KEY);
    console.log('Token decoded successfully');
    req.AUTH_USER_DATA = decoded;
    next();
  } catch (error) {
    console.error(error);
    sendResponse(
      req,
      res,
      401,
      25,
      null,
      'Failed to authenticate expired token',
    );
  }
}

module.exports = {
  decodeJWTTokenMiddleware,
};
