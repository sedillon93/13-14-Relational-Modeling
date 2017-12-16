'use strict';

const {Router} = require(`express`);
const jsonParser = require(`body-parser`).json();

const Restaurant = require(`../model/restaurant`);
const httpErrors = require(`http-errors`);

const restaurantRouter = module.exports = new Router();

restaurantRouter.post('/api/restaurants', jsonParser, (request, response, next) => {
  if(!request.body.name || !request.body.city || !request.body.rating){
    return next(httpErrors(400), `Sending a 400 status due to missing information on POST body`);
  }

  return new Restaurant(request.body).save()
    .then(restaurant => response.json(restaurant))
    .catch(next);
});

restaurantRouter.get(`/api/restaurants/:id`, (request, response, next) => {
  return Restaurant.findById(request.params.id)
    .populate('cuisine')
    .then(restaurant => {
      if(!restaurant){
        throw httpErrors(404, `Sending a 404 status because no restaurant was found with that id`);
      }
      return response.json(restaurant);
    })
    .catch(next);
});

restaurantRouter.delete(`/api/restaurants/:id`, (request, response, next) => {
  return Restaurant.findByIdAndRemove(request.params.id)
    .then(restaurant => {
      if(!restaurant){
        throw httpErrors(404, `Sending a 404 status because a restaurant with that id does not exist for deletion `);
      }
      return response.sendStatus(204);
    })
    .catch(next);
});

restaurantRouter.put(`/api/restaurants/:id`, jsonParser, (request, response, next) => {
// why is this necessary? what do the options accomplish?
  let options = {runValidators: true, new: true};

  if(!request.body.name && !request.body.city && !request.body.rating){
    return  next(httpErrors(400), `Sending a 400 status because request must include a body`);
  }

  return Restaurant.findByIdAndUpdate(request.params.id, request.body, options)
    .then(restaurant => {
      if(!restaurant){
        throw httpErrors(404, `Sending a 404 status because restaurant with that id does not exist to update`);
      }
      return response.json(restaurant);
    })
    .catch(next);
});
