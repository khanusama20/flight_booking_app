const mongoose = require('mongoose');

function peacefulShutdown(msg) {
  const promiseCallback = (resolve) => {
    mongoose.connection.close(() => {
      console.log(`Database disconnected ${msg}`);
      resolve(1);
    });
  };
  return new Promise(promiseCallback);
}

function optionalServices() {
  // mongoose.connection.on('connected', () => {});

  mongoose.connection.on('disconnected', () => {
    console.log('Database connection is lost, please verify your connection');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Connection is not established due to database error', err);
  });

  // when nodemon reboots the app, capture the SIGUSR2 signal
  process.once('SIGUSR2', async () => {
    if (await peacefulShutdown('nodemon restart') === 1) {
      process.kill(process.pid, 'SIGUSR2');
    }
  });

  // when local app terminates. This will rarely be fired
  process.on('SIGINT', async () => {
    if (await peacefulShutdown(
      `${process.env.APP_NAME.split('-').join(' ')} api termination successfully`,
    ) === 1) {
      process.exit(0);
    }
  });
}

function DBConnection() {
  const mongoOptions = {
    useNewUrlParser: true,
  };

  if (process.env.MONGO_DEV) {
    optionalServices();
    mongoose
      .connect(process.env.MONGO_DEV, mongoOptions, () => {
        console.log('MongoDB connection is established successfully');
      });
  } else {
    console.log('Please provide database URI address');
  }

  mongoose.set('debug', (process.env.MONGOOSE_DEBUG === 'Yes'));
}

module.exports = DBConnection;
