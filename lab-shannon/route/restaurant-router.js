'use strict';

const {Router} = require(`express`);
const jsonParser = require(`body-parser`).json();

const Restaurant = require(`../model/restaurant`);
const httpErrors = require(`http-errors`);
const logger = require(`../lib/logger`);

const restaurantRouter = module.exports = new Router();

restaurantRouter.post('/api/restaurants', jsonParser, (request, response, next) => {
  console.log(request.body);
  if(!request.body.name || !request.body.cuisine || !request.body.city){
    return next(httpErrors(400), `Sending a 400 error due to missing information on POST body`);
  }

  return new Restaurant(request.body).save()
    .then(restaurant => response.json(restaurant))
    .catch(next);
});
