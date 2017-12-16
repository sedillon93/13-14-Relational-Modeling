'use strict';

const faker = require(`faker`);
const Restaurant = require(`../../model/restaurant`);
const cuisineMock = require(`./cuisine-mock`);

const restaurantMock = module.exports = {};

restaurantMock.create = () => {
  let mock = {};  //this is NOT the mock Restaurant; this is a general mock which will hold a restaurant with a reference to a specific cuisine which is also stored on the mock. So the mock is here in order to have a relationship between the restaurant and a cuisine.

  return cuisineMock.create()
    .then(cuisine => {
      mock.cuisine = cuisine;

      return new Restaurant({
        name: faker.lorem.words(3),
        cuisine: mock.cuisine._id,
        city: faker.address.city(),
        rating: faker.random.number(5),
      }).save();
    })
    .then(restaurant => {
      mock.restaurant = restaurant;
      return mock;
    });
};

restaurantMock.createMany = (howMany) => {
  let mock = {};

  return cuisineMock.create()
    .then(cuisine => {
      mock.cuisine = cuisine;
      return Promise.all(new Array(howMany)
        .fill(0)
        .map(() => {
          return new Restaurant({
            name: faker.lorem.words(3),
            cuisine: mock.cuisine._id,
            city: faker.address.city(),
            rating: faker.random.number(5),
          }).save();
        }));
    })
    .then(restaurants => {
      mock.restaurants = restaurants;
      return mock;
    });
};

restaurantMock.remove = () => Promise.all([
  Restaurant.remove({}),
  cuisineMock.remove({}),
]);
