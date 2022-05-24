'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const requestMovies = require('./modules/movies.js');
const requestWeather = require('./modules/weather.js');
const error = require('./modules/error');

app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => {
  response.send('hello from the home route');
});

const getMovies = (req, res) => requestMovies(req).then(value => res.status(200).send(value));
const getWeather = (req, res) => requestWeather(req).then(value => res.status(200).send(value));


app.get('/movie', getMovies);
app.get('/weather', getWeather);

app.use('*', error);

app.listen(PORT, () => console.log(`listening on ${PORT}`));
