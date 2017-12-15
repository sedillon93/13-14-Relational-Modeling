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
          console.log(response);
          expect(response.status).toEqual(200);
          expect(response.body.cuisineType).toEqual('Bangladeshi');
          expect(response.body.mostUsedSpices).toEqual(['turmeric', 'cumin', 'chilis', 'cinnamon']);
        })
        .catch(error => console.log(error));
    });
  });
});
