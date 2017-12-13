'use strict';

const logger = require(`./logger`);

module.exports = (request, response, next) => {
  logger.log(`info`, `Processing a ${request.method} request to the url ${request.url}`);
  
  return next();
}
