import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import topMusicData from './data/top-music.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Song = mongoose.model('Song', {
  id: Number,
  trackName: String,
  artistName: String,
  genre: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number,
});

// if (process.env.RESET_DB) {
const seedDatabase = async () => {
  await Song.deleteMany({});

  topMusicData.forEach((topMusicData) => {
    new Song(topMusicData).save();
  });
};
seedDatabase();
// }

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

app.get('/songs', (req, res) => {
  Song.find()
    .then((songs) => {
      if (songs.length > 0) {
        res.json(songs);
      } else {
        res.status(404).json({ error: 'NO songs found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Something went wrong, please try again.' });
    });
});

//get individual song

app.get('/songs/:id', (req, res) => {
  const songID = parseInt(req.params.id);
  Song.find({ id: songID })
    .then((song) => {
      if (song) {
        res.json(song);
      } else {
        res.status(404).json({ error: `Song with id ${movieID} not found.` });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Something went wrong, please try again.' });
    });
});

//get song

app.get('/songs/artist/:artist', (req, res) => {
  const artistName = req.params.artist.toLowerCase();
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
