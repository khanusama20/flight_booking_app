const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
// connection
const DBConnection = require('./config/dbConnection');
const appRouteMaster = require('./routes/master.routes');

// initialize express app
const app = express();

// connection establishement
DBConnection();

app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});

app.use(
  bodyParser.json({
    limit: '10MB',
  }),
);

app.use(
  bodyParser.urlencoded({
    limit: '50MB',
    extended: true,
  }),
);

console.log(`__dirname ${__dirname}`);
const publicDirectory = path.join(__dirname, '../public');
app.use(express.static(`${publicDirectory}`));

app.get('/', (req, res) => {
  res.send('<h1>Hello Express!</h1>');
});

const [secureRoutes, authRoutes] = appRouteMaster;
app.use('/api/secure', secureRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
