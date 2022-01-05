import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

import netflixData from './data/netflix-titles.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/movies';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Movie = mongoose.model('Movie', {
  show_id: Number,
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
  type: String,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Movie.deleteMany({});

    netflixData.forEach(item => {
      const newMovie = new Movie(item);
      newMovie.save();
    });
  };

  seedDatabase();
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

// Get all the movies
//Query param to get movie by title: /movies?title=enter the title
//Query param to get movie by director: /movies?director=enter the director
//Query param to get movie by country: /movies?country=enter the country
app.get('/movies', async (req, res) => {
  const { title, director, country } = req.query;

  try {
    const allMovies = await Movie.find({
      title: new RegExp(title, 'i'),
      director: new RegExp(director, 'i'),
      country: new RegExp(country, 'i'),
    });
    res.json(allMovies);
  } catch (error) {
    res.status(400).json({
      error: `Can't find what you're looking for..`,
    });
  }
});

app.get('/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const movieById = await Movie.findOne({ show_id: id });
    res.json(movieById);
  } catch (error) {
    res.status(400).json('No movie with that ID was found..');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
