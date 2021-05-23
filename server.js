import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import netflixData from './data/netflix-titles.json';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const ReleaseYear = mongoose.model('ReleaseYear', {
  release_year: Number,
});

const Movie = mongoose.model('Movie', {
  title: String,
  director: String,
  release_year: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReleaseYear',
  },
});

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Movie.deleteMany();
    await ReleaseYear.deleteMany();

    await netflixData.forEach((item) => {
      const newYear = new ReleaseYear(item);
      newYear.save();
      const newMovie = new Movie({ ...item, release_year: newYear });
      newMovie.save();
    });
  };

  seedDB();
}

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/movies', async (req, res) => {
  const movies = await Movie.find().populate('release_year');
  res.json(movies);
});

app.get('/movies/:id', async (req, res) => {
  const movies = await await Movie.findById(req.params.id);
  if (movies) {
    res.json(movies);
  } else {
    res.status(404).json({ error: 'Movie Not Found' });
  }
});

app.get('/years', async (req, res) => {
  const years = await ReleaseYear.find();
  res.json(years);
});

app.get('/:title', (req, res) => {
  try {
    Movie.findOne({ title: req.params.title }).then((movie) => {
      if (movie) {
        res.json(movie);
      } else {
        res.status(404).json({ error: 'Not Found' });
      }
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid user ID' });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
