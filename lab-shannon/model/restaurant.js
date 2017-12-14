'use strict';

const mongoose = require(`mongoose`);

const restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  cuisine: {
    type: String,
    required: true,
    unique: false,
  },
  city: {
    type: String,
    required: true,
    unique: false,
  },
});

module.exports = mongoose.model(`restaurant`, restaurantSchema);
