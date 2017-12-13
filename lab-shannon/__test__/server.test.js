'use strict';

process.env.PORT = 3000;
process.env.MONGODB_URI = `mongodb://localhost/db`;

const faker = require(`faker`);
const superagent = require(`superagent`);
const server = require(`../lib/server`);

const apiURL = `http://localhost:${process.env.PORT}/api/sweets`;

let cuisines = [`indian`, `italian`, `american`, `bangladeshi`, `french`, `thai`, `vietnamese`];
let cities = [`Seattle`, `Bellevue`, `Redmond`, `Issaquah`, `Sammamish`, `Edmonds`, `Shoreline`];

createFakeRestaurant = () => {
  return new Restaurant ({
    name: faker.word(2);
    cuisine: cuisines[faker.random.number(6)];
    city: cities[faker.random.number(6)];
  }).save();
}

describe(`/api/restaurants`, () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Restaurant.remove({}));

  describe(`POST request`, () => {
    let fakeRestaurant = {
      name: 'Bukhara',
      cuisine: 'indian',
      city: 'Issaquah'
    };
    test(`POST request should respond with a 200 status if there were no errors`, () => {
      return superagent.post(apiURL)
      .send(fakeRestaurant)
      .then(response => {
        expect(response.status).toEqual(200);
      })
    });
  });
})
