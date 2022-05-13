import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

import netflixData from './data/netflix-titles.json';

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/movies-project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

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
    await Movie.deleteMany();
    netflixData.forEach((singleMovie) => {
      const newMovie = new Movie(singleMovie);
      newMovie.save();
    });
  };
  seedDatabase();
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

app.get('/titles', async (req, res) => {
  // Will show the list of movie titles
  // /titles
  const titles = await Movie.find();
  res.json(titles);
});

app.get('/country', async (req, res) => {
  // /country
  const country = await Movie.find();
  res.json(country);
});

app.get('/movies/country', async (req, res) => {
  // /movies/country?country=India
  const { country } = req.query;
  const countryMovie = await Movie.findOne({
    country: country,
  });
  res.send(countryMovie);
});

app.get('/movies/movie', async (req, res) => {
  const { title, release_year } = req.query;

  const myRegex = /.*/gm; // covers everything (global)

  if (release_year) {
    const singleMovie = await Movie.findOne({
      title: title ? title : myRegex,
      release_year: release_year,
    });
    res.send(singleMovie);
  } else {
    const singleMovie = await Movie.findOne({ title: title });
    res.send(singleMovie);
  }
});
// /movies/movie?title=Atlantics&release_year=2019
// /movies/movie?title=Atlantics
// /movies/movie?release_year=2019

app.get('/movies/movie/:title', async (req, res) => {
  // /movies/movie/Chocolate
  const singleMovie = await Movie.findOne({ title: req.params.title });
  res.send(singleMovie);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// RESET_DB=true npm run dev
