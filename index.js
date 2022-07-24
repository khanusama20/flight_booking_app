const http = require('http');
require('dotenv').config();
const app = require('./src/app');

const httpServer = http.createServer(app);

httpServer.listen(process.env.PORT, process.env.HOST, () => {
  console.log('Server started successfully');
  console.log(`Server listening at port http://${process.env.HOST}:${process.env.PORT}/`);
});