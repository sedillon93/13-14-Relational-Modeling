'use strict';

const mongoose = require(`mongoose`);

const cuisineSchema = mongoose.Schema({
  cuisineType: {
    type: String,
    required: true,
    unique: true,
  },
  restaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'restaurant'
  }],
}{
  usePushEach: true,
});

module.exports = mongoose.model('cuisine', cuisineSchema);
