'use strict';

const server = module.exports = {};

const mongoose = require(`mongoose`);
const logger = require(`./logger`);
const express = require(`express`);

const app = express();
let serverIsOn = false;
let httpServer = null;

mongoose.Promise = Promise;
//----------------------------------------------------------------------------------------
//           Route set-up (logger-middleware uses 'next' to kick to router file)
//----------------------------------------------------------------------------------------
app.use(require(`./logger-middleware`));

app.use(require(`../route/cuisine-router`));
app.use(require(`../route/restaurant-router`));

//----------------------------------------------------------------------------------------
//                      Error Middleware
//----------------------------------------------------------------------------------------
app.use(require(`./error-middleware`));
//----------------------------------------------------------------------------------------
server.start = () => {
  return new Promise((resolve, reject) => {
    if(serverIsOn){
      logger.log(`info`, `__SERVER_ERROR__ the server is already on`);
      return reject(new Error(`__SERVER_ERROR__ the server is already on`));
    }
    serverIsOn = true;
    httpServer = app.listen(process.env.PORT, () => {
      logger.log(`info`, `Turning the server on! Listening on port ${process.env.PORT}`);
      console.log(`Turning the server on! Listening on port ${process.env.PORT}`);
      return resolve();
    });
  })
    .then(mongoose.connect(process.env.MONGODB_URI, {useMongoClient: true}));
};

server.stop = () => {
  return new Promise((resolve, reject) => {
    if(!serverIsOn){
      logger.log(`info`, `The server is already off!`);
      return reject(new Error(`The server is already off!`));
    }
    if(!httpServer){
      logger.log(`info`, `There is no server to turn off!`);
      return reject(new Error(`There is no server to turn off!`));
    }
    httpServer.close(() => {
      serverIsOn = false;
      httpServer = null;
      logger.log(`info`, `Turning the server off now. Goodbye.`);
      return resolve();
    });
  })
    .then(() => mongoose.disconnect());
};
