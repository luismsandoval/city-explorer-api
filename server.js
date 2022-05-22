'use strict';

// this library lets us access our .env file
require('dotenv').config();

// express is a server library
const express = require('express');

// initalizes the express library
const app = express();

// library that determines who is allowed to speak to our server
const cors = require('cors');
const axios = require('axios');


// this settting says that everyone is allowed to speak to our server
app.use(cors());

// we are getting the port variable from the .env file.
const PORT = process.env.PORT || 3002;

// this is a route. if you turn the server on and go to http://localhost:3001/ (or whatever port you specified in your .env), you will see 'hello from the home route'
app.get('/', (request, response) => {
  response.send('hello from the home route');
});

app.get('/weather', async (req, res) => {
  const { lat, lon } = req.query;
  console.log(req.query);
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=5`;
  const response = await axios.get(url);
  const forecastResults = response.data.data.map(value => new Forecast(value));
  res.status(200).send(forecastResults);
}
);

app.get('/movie', async (req, res) => {
  let search = req.query.search.split(',')[0];
  // console.log(search);
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${search}`;
  const response = await axios.get(url);
  const movieResults = response.data.results.map(value => new Movie(value));
  res.status(200).send(movieResults);
});

class Forecast {

  constructor(value) {
    this.datetime = value.datetime;
    this.description = value.weather.description;
  }
}

class Movie {

  constructor(value) {
    this.title = value.title;
    this.description = value.overview;
    this.average_votes = value.vote_average;
    this.total_votes = value.vote_count;
    this.image_url = 'https://image.tmdb.org/t/p/w500' + value.poster_path;
    this.popularity = value.popularity;
    this.released_on = value.release_date;
  }
}

// Error handler function
app.use((err, req, res, next) => {
  res.status(500).send(`do something devs: ${err.customMessage}`);
});
// this turns the server on to the port that you specifed in your .env file
app.listen(PORT, () => console.log(`listening on ${PORT}`));
