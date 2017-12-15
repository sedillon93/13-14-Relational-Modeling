'use strict';

const mongoose = require(`mongoose`);

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

module.exports = mongoose.model(`restaurant`, restaurantSchema);
