'use strict';

require(`./lib/set-up`);

const faker = require(`faker`);
const superagent = require(`superagent`);
const server = require(`../lib/server`);

const restaurantMock = require(`./lib/restaurant-mock`);
const cuisineMock = require(`./lib/cuisine-mock`);

const apiURL = `http://localhost:${process.env.PORT}/api/restaurants`;

describe(`/api/restaurants`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => restaurantMock.remove({}));

  describe(`POST request`, () => {
    test(`POST request should respond with a 200 status if there were no errors`, () => {
      let tempMockCuisine;

      return cuisineMock.create()
        .then(cuisine => {
          tempMockCuisine = cuisine;
          return superagent.post(apiURL)
            .send({name: 'Bukhara', cuisine: tempMockCuisine._id, city: 'Issaquah', rating: 5})
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body.city).toEqual('Issaquah');
              expect(response.body.name).toEqual('Bukhara');
              expect(response.body.rating).toEqual(5);
              expect(response.body.cuisine).toEqual(tempMockCuisine._id.toString());
            })
            .catch(`Oh noes! There was a problem with your POST request`);
        });
    });
    test(`POST request should respond with a 400 status if the body was missing information`, () => {
      return superagent.post(apiURL)
        .send({name: `Don't Eat Here`, cuisine: `italian`})
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
    test(`POST should respond with a 404 request if the cuisine id is invalid`, () => {
      return superagent.post(apiURL)
        .send({
          name: faker.lorem.words(2),
          cuisine: 398,
          city: faker.address.city(),
          rating: faker.random.number(5),
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
    test(`POST should respond with a 409 status if a duplicate restaurant name is used`, () => {
      let tempMock;

      return restaurantMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.post(`${apiURL}`)
            .send({name: tempMock.restaurant.name, cuisine: tempMock.cuisine._id, city: 'Redmond', rating: 3})
            .then(Promise.reject)
            .catch(response => {
              expect(response.status).toEqual(409);
            });
        });
    });
  });

  describe(`GET request`, () => {
    test(`GET should respond with a 200 status if there were no errors`, () => {
      let tempMock;

      return restaurantMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.get(`${apiURL}/${tempMock.restaurant._id}`);
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
      return restaurantMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/${mock.restaurant.id}`);
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
    test.only(`PUT should respond with 200 status if there were no errors`, () => {
      let tempMock;

      return restaurantMock.create()
        .then(mock => {
          tempMock = mock;
          return superagent.put(`${apiURL}/${tempMock.restaurant._id}`)
            .send({city: 'Issaquah'});
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(JSON.stringify(response.body.cuisine)).toEqual(JSON.stringify(tempMock.cuisine._id));
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
            .send({name: mockRestaurant1.name});
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });
  });
});
