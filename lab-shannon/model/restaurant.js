'use strict';

const mongoose = require(`mongoose`);
const Cuisine = require(`./cuisine`);
const httpErrors = require(`http-errors`);
const logger = require(`../lib/logger-middleware`);

const restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  cuisine: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'cuisine',
  },
  city: {
    type: String,
    required: true,
    unique: false,
  },
  rating: {
    type: Number,
    required: true,
    unique: false,
  },
});

//------------------------------------------------------------------------------------
restaurantSchema.pre('save', function(done){
  return Cuisine.findById(this.cuisine)
    .then(cuisineFound => {
      if(!cuisineFound){
        throw httpErrors(404, `The cuisine provided does not exist; cannot complete POST request for new restaurant`);
      }

      cuisineFound.restaurants.push(this._id);
      return cuisineFound.save();
    })
    .then(() => done())
    .catch(error => logger.log(`info`, error));
});

restaurantSchema.post('remove', (document, done) => {
  return Cuisine.findById(document.cuisine)
    .then(cuisineFound => {
      if(!cuisineFound){
        throw httpErrors(404, `The  cuisine provided does not exist; cannot complete DELETE request for the restaurant`);
      }

      cuisineFound.restaurants = cuisineFound.restaurants.filter(restaurant => {
        return restaurant._id.toString() !== document._id.toString();
      });

      return cuisineFound.save();
    })
    .then(() => done())
    .catch(done);
});

//------------------------------------------------------------------------------------
module.exports = mongoose.model(`restaurant`, restaurantSchema);
