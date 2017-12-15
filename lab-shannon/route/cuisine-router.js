'use strict'

const {Router} = require(`express`);
const jsonParser = require(`body-parser`);
const mongoose = require(`mongoose`);
const httpErrors = require(`http-errors`);
const Cuisine = require(`../model/cuisine`);

const cuisineRouter = module.exports = new Router();

cuisineRouter.post(`/api/cuisines`, jsonParser, (request, response, next) => {
  if(!request.body.cuisineType){
    return next(httpErrors(400), 'Cuisine type is required to make a POST request');
  }

  return new Cuisine(request.body).save()
    .then(cuisine => response.json(cuisine))
    .catch(next);
});

cuisineRouter.put(`/api/cuisines/:id`, jsonParser, (request, response, next) => {
  let options = {runValidators: true, new: true};

  return Cuisine.findByIdAndUpdate(request.params.id, request.body, options)
    .then(cuisine => {
      if(!cuisine){
        throw httpErrors(404, `No cuisine found with that id; cannot complete PUT request`);
      }

      return response.json(cuisine);
    })
    .catch(next);
});

cuisineRouter.get(`/api/cuisines/:id`, (request, response, next) => {
  return Cuisine.findById(request.params.id)
    .then(cuisine => {
      if(!cuisine){
        throw httpErrors(404, `No cuisine found with that id; cannot complete GET request`);
      }

      return response.json(cuisine);
    })
    .catch(next);
});

cuisineRouter.delete(`/api/cuisines/:id`, (request, response, next) => {
  return Cuisinse.findByIdAndRemove(request.params.id)
    .then(cuisine => {
      if(!cuisine){
        throw httpErrors(400, `No cuisine found with that id; cannot complete DELETE request`);
      }

      return response.sendStatus(204);
    })
    .catch(next);
});
