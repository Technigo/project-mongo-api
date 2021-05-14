/* eslint-disable linebreak-style */
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import movieData from './data/netflix-titles.json'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Movie = mongoose.model('Movie', {
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
    await Movie.deleteMany();
    await movieData.forEach((item) => {
      const newMovie = new Movie(item);
      newMovie.save();
    });
  }
  seedDatabase();
}

//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
});

// Function to sort on newest and oldest movies
// Global scope to be used in all, movies and tvshows routes
const sorting = (sort) => {
  if (sort === 'newest') { 
    return { release_year: -1 } 
  } else if (sort === 'oldest') { 
    return { release_year: 1 }
  }
}

// Function for pages, skipping 20 per page
// Global scope to be used in all, movies and tvshows routes
const pageResults = (page) => {
  return ((page - 1) * 20)
}

// Route for all titles
app.get('/all', async (req, res) => {
  const { title, genre, releaseYear, country, page, sort } = req.query;
  const titleRegex = new RegExp(title, 'i');
  const genreRegex = new RegExp(genre, 'i');
  const countryRegex = new RegExp(country, 'i');

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
  }

  // Find results on title, genre, releaseyear, country. Sort on year, page function and limit to 20 results
  const data = await Movie.find(queries(titleRegex, genreRegex, releaseYear, countryRegex))
    .sort(sorting(sort))
    .limit(20)
    .skip(pageResults(page))

  try {
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong and we could not find what you were looking for!', details: error })
  }
});

// Route for movies
app.get('/movies', async (req, res) => {
  const { sort, page } = req.query;

  try {
    const movies = await Movie.find({ type: 'Movie' })
      .sort(sorting(sort))
      .limit(20)
      .skip(pageResults(page))
    res.json(movies);
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong!', details: error })
  }
});

// Route for TV shows
app.get('/tvshows', async (req, res) => {
  const { sort, page } = req.query;

  try {
    const tvshows = await Movie.find({ type: 'TV Show' })
      .sort(sorting(sort))
      .limit(20)
      .skip(pageResults(page))
    res.json(tvshows);
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong!', details: error })
  }
});

// Route for id
app.get('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const singleMovie = await Movie.findById({ id });
  if (singleMovie) {
    res.json(singleMovie)
  } else {
    res.status(404).json({ error: 'Could not find a title with that id.' })
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
});
