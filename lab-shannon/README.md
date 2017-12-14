## Purpose
The purpose of this program is to provide a RESTful API which utilizes MongoDB, Express, and Mongoose to execute CRUD operations on a collection of restaurant documents.

## How to use
* First install the dependencies by running 'npm install'.
* Run the command 'npm run dbon' to connect to the database and establish a connection.
* IN A DIFFERENT TAB of the terminal install jest for testing by running "npm i -s jest". You will then be able to use the command 'npm test' to execute all tests in the test files.
* Each restaurant document requires four properties: A name, cuisine, city, and rating.

## Request Endpoints
POST: Post requests are handled by the route '/api/restaurants'. A successful post request will return a 200 status. If part of the required content is missing (name, cuisine, or city) a 400 status will be returned.
PUT: Put requests are handled by the route '/api/restaurants/:id'.
GET: Get requests are handled by the route '/api/restaurants/:id'.
DELETE: Delete requests are handled by the route '/api/restaurants/:id'.

## Technologies
* ES6
* node
* winston
* eslint
* faker
* dotenv
* mongoose
* mongodb
* express
* jest
* superagent
* body-parser
* http-error
* Middleware files for handling & logging errors (errorMiddleware.js & loggerMiddleware.js, respectively)

## License
MIT

## Credits
* Vinicio Vladimir Sanchez Trejo & the Code Fellows curriculum provided the base .eslintrc, .eslintignore, .gitignore, index.js, log.json, and server.js files upon which the command functions were built.
* My fellow 401JS classmates, the TAs, and Vinicio for help problem solving and debugging.
