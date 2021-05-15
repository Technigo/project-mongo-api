/* eslint-disable linebreak-style */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';

import netflixData from './data/netflix-titles.json';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const NetflixData = mongoose.model('NetflixData', {
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await NetflixData.deleteMany();
    await netflixData.forEach((item) => {
      const newNetflixData = new NetflixData(item);
      newNetflixData.save();
    });
  }
  seedDatabase();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// First page that shows all the endpoints
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
});

// Function for different queries
// Global scope to be used in all, movies and tvshows routes
const queries = (title, genre, releaseYear, country) => {
  const query = {};
  if (title) {
    query.title = title;
  }
  if (genre) {
    query.listed_in = genre;
  }
  if (releaseYear) {
    query.release_year = releaseYear;
  }
  if (country) {
    query.country = country;
  }
  return query;
};

// Function to sort on newest and oldest movies
// Global scope to be used in all, movies and tvshows routes
const sortOnYear = (sort) => {
  if (sort === 'newest') { 
    return { release_year: -1 } 
  } else if (sort === 'oldest') { 
    return { release_year: 1 }
  }
};

// Function for pages, skipping 20 per page
// Global scope to be used in all, movies and tvshows routes
const pageResults = (page) => {
  return ((page - 1) * 20)
};

// Route for all titles
app.get('/all', async (req, res) => {
  const { title, genre, releaseYear, country, page, sort } = req.query;
  const titleRegex = new RegExp(title, 'i');
  const genreRegex = new RegExp(genre, 'i');
  const countryRegex = new RegExp(country, 'i');

  // Find results on all titles
  // Search by queries, sort on releaseYear and limit to 20 per page.
  const data = await NetflixData.find(queries(titleRegex, genreRegex, releaseYear, countryRegex))
    .sort(sortOnYear(sort))
    .limit(20)
    .skip(pageResults(page))

  try {
    return data.length > 0 
      ? res.json(data) 
      : res.json({ result: "Nothing found on that query, try again!" });
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong!', details: error })
  }
});

// Route for movies
app.get('/movies', async (req, res) => {
  const { title, genre, releaseYear, country, page, sort } = req.query;
  const titleRegex = new RegExp(title, 'i');
  const genreRegex = new RegExp(genre, 'i');
  const countryRegex = new RegExp(country, 'i');

  // Find results on all movies
  // Search by queries, sort on releaseYear and limit to 20 per page.
  const movies = await NetflixData.find({ type: 'Movie' })
    .find(queries(titleRegex, genreRegex, releaseYear, countryRegex))
    .sort(sortOnYear(sort))
    .limit(20)
    .skip(pageResults(page))

  try {
    return movies.length > 0 
      ? res.json(movies) 
      : res.json({ result: "Nothing found on that query, try again!" });
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong!', details: error })
  }
});

// Route for TV shows
app.get('/tvshows', async (req, res) => {
  const { title, genre, releaseYear, country, page, sort } = req.query;
  const titleRegex = new RegExp(title, 'i');
  const genreRegex = new RegExp(genre, 'i');
  const countryRegex = new RegExp(country, 'i');

  // Find results on all tvshows
  // Search by queries, sort on releaseYear and limit to 20 per page.
  const tvshows = await NetflixData.find({ type: 'TV Show' })
    .find(queries(titleRegex, genreRegex, releaseYear, countryRegex))
    .sort(sortOnYear(sort))
    .limit(20)
    .skip(pageResults(page))

  try {
    return tvshows.length > 0 
      ? res.json(tvshows) 
      : res.json({ result: "Nothing found on that query, try again!" });
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong!', details: error });
  }
});

// Route for id
app.get('/all/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const singleMovie = await NetflixData.findById({ _id: id });
    res.json(singleMovie)
  } catch (error) {
    res.status(404).json({ error: 'Could not find a title with that id.', details: error })
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
});
