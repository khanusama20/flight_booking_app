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

module.exports = {
  sendResponse,
  randomId,
};
