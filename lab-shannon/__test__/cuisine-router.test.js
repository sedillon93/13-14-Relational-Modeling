'use strict';

require(`./lib/set-up`);

const superagent = require(`superagent`);
const server = require(`../lib/server`);
const cuisineMock = require(`./lib/cuisine-mock`);

const apiURL = `http://localhost:${process.env.PORT}/api/cuisines`;

describe(`/api/cuisines`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(cuisineMock.remove);

  describe(`POST requests`, () => {
    test(`POST request should respond with a 200 status and a cuisine if there are no errors`, () => {
      return superagent.post(apiURL)
        .send({
          cuisineType: 'Bangladeshi',
          mostUsedSpices: ['turmeric', 'cumin', 'chilis', 'cinnamon'],
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.cuisineType).toEqual('Bangladeshi');
          expect(response.body.mostUsedSpices).toEqual(['turmeric', 'cumin', 'chilis', 'cinnamon']);
        })
        .catch(error => console.log(error));
    });
    test(`POST request should respond with a 400 status if there is a bad request`, () => {
      return superagent.post(apiURL)
        .send({
          mostUsedSpices: ['Cilantro', 'Garlic'],
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });
    test(`POST request shouold respond with a 409 status if there is a duplicate unique key(cuisineType)`, () => {
      return cuisineMock.create()
        .then(cuisine => {
          return superagent.post(apiURL)
            .send({
              cuisineType: cuisine.cuisineType,
              mostUsedSpices: cuisine.mostUsedSpices
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });
  });

  // describe(`GET requests`, () => {
  //   test(`GET request should respond with a 200 status and cuisine if there are no errors`, () => {
  //     let mockCuisine;
  //
  //     return superagent.post(apiURL)
  //         .send()
  //   });
  // });
});
