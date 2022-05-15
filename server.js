'use strict';

// this library lets us access our .env file
require('dotenv').config();

// express is a server library
const express = require('express');

// initalizes the express library
const app = express();

// library that determines who is allowed to speak to our server
const cors = require('cors');
const { type } = require('express/lib/response');


// this settting says that everyone is allowed to speak to our server
app.use(cors());

// we are getting the port variable from the .env file.
const PORT = process.env.PORT;

// this is a route. if you turn the server on and go to http://localhost:3001/ (or whatever port you specified in your .env), you will see 'hello from the home route'
app.get('/', (request, response) => {
  response.send('hello from the home route');
});

app.get('/weather', (req, res) => {
  const type = req.query.type;
  console.log('type of list requested: ', type);
  const forecastResults = new Forecast(type);
  console.log('forecast result: ', forecastResults)
  res.send(forecastResults);
  console.log(Forecast.arr);
});

class Forecast {
  static weather = require('./data/weather.json');

  constructor (type) {
  this.items = Forecast.weather.find(value => value.city_name === type);
  this.arr = this.items.data.map(value => ({
    description: `Low of ${value.low_temp}, high of ${value.max_temp} with ${value.weather.description}`,
    date: `${value.datetime}`
  }));
  };

}

// this turns the server on to the port that you specifed in your .env file
app.listen(PORT, () => console.log(`listening on ${PORT}`));
