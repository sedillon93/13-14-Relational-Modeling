'use strict';

const faker = require(`faker`);
const Cuisine = require(`../../model/cuisine`);

const cuisineMock = module.exports = {};

cuisineMock.create = () => {
  return new Cuisine({
    cuisineType: faker.lorem.words(1),
    mostUsedSpices: faker.lorem.words(8).split(' '),
  }).save();
};

cuisineMock.createMany = (howMany) => {
  return Promise.all(new Array(howMany).fill(0)
    .map(() => cuisineMock.create()));
};

cuisineMock.remove = () => Cuisine.remove({});
