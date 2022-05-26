'use strict';

const axios = require('axios');
let cache = require('./cache');

async function requestMovies(req) {
  const search = req.query.search.split(',')[0];
  const key = 'movie-' + search;

  if (cache[key] && (Date.now() - cache[key].timestamp < 43200)) {
    console.log('Cache hit');
    return cache[key];
  } else {
    console.log('Cache miss');
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${search}`;
    try {
      const response = await axios.get(url);
      const movieResults = response.data.results.map(value => new Movie(value));

      cache[key] = req.query;
      cache[key].timestamp = Date.now();
      cache[key].data = movieResults;

      return Promise.resolve(movieResults);
    } catch (error) {
      error.customMessage = 'Call the devs';
    }
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

module.exports = requestMovies;
