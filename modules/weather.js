'use strict';

const axios = require('axios');

async function requestWeather(req) {
  const { lat, lon } = req.query;
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5`;
  try {
    const response = await axios.get(url);
    const forecastResults = response.data.data.map(value => new Forecast(value));
    return Promise.resolve(forecastResults);
  } catch (error) {
    error.customMessage = 'Call the devs';
  }
}

class Forecast {

  constructor(value) {
    this.datetime = value.datetime;
    this.description = value.weather.description;
  }
}

module.exports = requestWeather;
