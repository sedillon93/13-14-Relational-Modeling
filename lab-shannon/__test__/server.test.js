'use strict';

process.env.PORT = 3000;
process.env.MONGODB_URI = `mongodb://localhost/db`;

const faker = require(`faker`);
const superagent = require(`superagent`);
const server = require(`../lib/server`);
const Restaurant = require(`../model/restaurant`);

const apiURL = `http://localhost:${process.env.PORT}/api/restaurants`;

let cuisines = [`indian`, `italian`, `american`, `bangladeshi`, `french`, `thai`, `vietnamese`];
let cities = [`Seattle`, `Bellevue`, `Redmond`, `Issaquah`, `Sammamish`, `Edmonds`, `Shoreline`];

let createFakeRestaurant = () => {
  return new Restaurant ({
    name: faker.lorem.word(2),
    cuisine: cuisines[faker.random.number(6)],
    city: cities[faker.random.number(6)],
    rating: faker.random.number(5),
  }).save();
};

describe(`/api/restaurants`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Restaurant.remove({}));

  describe(`POST request`, () => {
    test(`POST request should respond with a 200 status if there were no errors`, () => {
      return superagent.post(apiURL)
        .send({name: 'Bukhara', cuisine: 'indian', city: 'Issaquah', rating: 5})
        .then(response => {
          // console.log(response, `is the 200 POST request`);
          // console.log(response.status, `is the status`);
          expect(response.status).toEqual(200);
        })
        .catch(`Oh noes! There was a problem with your POST request`);
    });
    test(`POST request should respond with a 400 status if the body was missing information`, () => {
      return superagent.post(apiURL)
        .send({name: `Don't Eat Here`, cuisine: `italian`})
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
    test(`POST should respond with a 409 status if a duplicate restaurant name is used`, () => {
      let mockRestaurant;
      return createFakeRestaurant()
        .then(restaurant => {
          mockRestaurant = restaurant;
          return superagent.post(apiURL)
            .send({name: mockRestaurant.name, cuisine: mockRestaurant.cuisine, city: mockRestaurant.city, rating: mockRestaurant.rating});
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });
  });

  describe(`GET request`, () => {
    test(`GET should respond with a 200 status if there were no errors`, () => {
      let testRestaurant = null;

      return createFakeRestaurant()
        .then(restaurant => {
          testRestaurant = restaurant;
          return superagent.get(`${apiURL}/${restaurant._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
        })
        .catch(`Oh noes, there was a problem with your GET request.`);
    });
    test(`GET should respond with a 404 status if the id provided doesn't match anything`, () => {
      return superagent.get(`${apiURL}/theBadPlace`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe(`DELETE request`, () => {
    test(`DELETE should respond with a 204 status if there were no errors`, () => {
      return createFakeRestaurant()
        .then(restaurant => {
          return superagent.delete(`${apiURL}/${restaurant.id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        })
        .catch(`Oh noes, there was a problem with your DELETE request.`);
    });
    test(`DELETE should respond with a 404 status if no restaurant was found with the id provided`, () => {
      return superagent.delete(`${apiURL}/notReal`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe(`PUT request`, () => {
    test(`PUT should respond with 200 status if there were no errors`, () => {
      let restaurantToUpdate = null;

      return createFakeRestaurant()
        .then(restaurant => {
          restaurantToUpdate = restaurant;
          return superagent.put(`${apiURL}/${restaurant._id}`)
            .send({cuisine: 'italian'});
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.cuisine).toEqual(`italian`);
        })
        .catch(`Oh noes, there was a problem with your PUT request.`);
    });
    test(`PUT should respond with a 404 status if no restaurant is found with the id provided`, () => {
      return createFakeRestaurant()
        .then(() => {
          return superagent.put(`${apiURL}/notAnID`)
            .send({name: 'That Italian place'});
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
    test(`PUT should respond with a 400 status if there is no request body sent`, () => {
      let restaurantToUpdate = null;

      return createFakeRestaurant()
        .then(restaurant => {
          restaurantToUpdate = restaurant;
          return superagent.put(`${apiURL}/${restaurant._id}`)
            .send({});
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
    test(`PUT should respond with a 409 if a duplicate restaurant name is used`, () => {
      let mockRestaurant1;
      let mockRestaurant2;
      return createFakeRestaurant()
        .then(restaurant => {
          mockRestaurant1 = restaurant;
        })
      return createFakeRestaurant()
        .then(restaurant => {
          mockRestaurant2 = restaurant;
          return superagent.put(`${apiURL}/${restaurant._id}`)
            .send({name: mockRestaurant1.name})
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });
  });
});
