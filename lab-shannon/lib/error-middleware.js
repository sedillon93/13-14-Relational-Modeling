'use strict';

const logger = require(`./logger`);

module.exports = (error, request, response, next) => {
  logger.log(`info`, `Handling an error`);

  //------------ HTTP errors ---------------
  if(error.status){
    return response.sendStatus(error.status);
  }

  //------------ Mongo errors --------------

  let error_message = error.message.toLowerCase();

  if(error_message.includes(`validation failed`)){
    return response.sendStatus(400);
  }
  if(error_message.includes(`duplicate key`)){
    return response.sendStatus(409);
  }
  if(error_message.includes(`objectid failed`)){
    return response.sendStatus(404);
  }
  if(error_message.includes(`unauthorized`)){
    return response.sendStatus(401);
  }

  return response.sendStatus(500);
}
