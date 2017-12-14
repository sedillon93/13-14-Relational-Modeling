'use strict';

const {Router} = require(`express`);
const jsonParser = require(`body-parser`).json();

const Restaurant = require(`../model/restaurant`);
const httpErrors = require(`http-errors`);
const logger = require(`../lib/logger`);

const restaurantRouter = module.exports = new Router();

restaurantRouter.post('/api/restaurants', jsonParser, (request, response, next) => {
  if(!request.body.name || !request.body.cuisine || !request.body.city){
    return next(httpErrors(400), `Sending a 400 error due to missing information on POST body`);
  }

  return new Restaurant(request.body).save()
    .then(restaurant => response.json(restaurant))
    .catch(next);
});

restaurantRouter.get(`/api/restaurants/:id`, (request, response, next) => {
  return Restaurant.findById(request.params.id)
    .then(restaurant => {
      if(!restaurant){
        throw httpErrors(404, `Sending a 404 because no restaurant was found with that id`);
      }
      return response.json(restaurant);
    })
    .catch(next);
});
