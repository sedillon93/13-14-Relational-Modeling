'use strict';

const faker = require(`faker`);
const Restaurant = require(`../../model/restaurant`);
const restaurantMock = module.exports = {};

restaurantMock.create = () => {
  return new Restaurant({
    name: faker.lorem.words(3),
    cuisine: faker.company.companyName,
    city: faker.address.city,
    rating: faker.random.number(5),
  }).save();
};

restaurantMock.createMany = (howMany) => {
  return Promise.all(new Array(howMany).fill(0)
    .map(() => restaurantMock.create()));
};

restaurantMock.remove = () => Restaurant.remove({});
