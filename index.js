const http = require('http');
const { fork } = require('child_process');
require('dotenv').config();
const app = require('./src/app');

const worker_process = fork("cron-jobs.js");    
worker_process.on('close', function (code) {  
  console.log('child process exited with code ', code);  
});  

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, process.env.HOST, () => {
  console.log('Server started successfully');
  console.log(`Server listening at port http://${process.env.HOST}:${PORT}/`);
});
