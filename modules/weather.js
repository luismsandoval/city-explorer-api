'use strict';

const axios = require('axios');
let cache = require('./cache');

async function requestWeather(req) {
  const { lon, lat } = req.query;
  const key = 'weather-' + lat + lon;

  if (cache[key] && (Date.now() - cache[key].timestamp < 43200)) {
    console.log('Cache hit');
    return cache[key];
  } else {
    console.log('Cache miss');
    const url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5`;
    try {
      const response = await axios.get(url);
      const forecastResults = response.data.data.map(value => new Forecast(value));

      cache[key] = req.query;
      cache[key].timestamp = Date.now();
      cache[key].data = forecastResults;

      return Promise.resolve(forecastResults);
    } catch (error) {
      error.customMessage = 'Call the devs';
    }
  }
}

class Forecast {

  constructor(value) {
    this.datetime = value.datetime;
    this.description = value.weather.description;
  }
}

module.exports = requestWeather;
