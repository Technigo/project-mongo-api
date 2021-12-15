import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
import topMusicData from './data/top-music.json';

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/marpet-project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const Track = mongoose.model('Track', {
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

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Track.deleteMany({});

    topMusicData.forEach((item) => {
      const newTrack = new Track(item);
      newTrack.save();
    });
  };

  seedDatabase();
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Our own middleware that checks if the database is connected before going forward to our endpoints
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: 'Service unavailable' });
  }
});

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello musiclover');
});

// get all the songs. A simple solution.
app.get('/songs', async (req, res) => {
  let songs = await Track.find(req.query);

  // filtering songs on bpm. the bpm will be greater that the value we type in.
  if (req.query.bpm) {
    const songsByBPM = await Track.find().gt('bpm', req.query.bpm);
    songs = songsByBPM;
  }

  res.json(songs);
});

// get one song based on id
app.get('/songs/:id', async (req, res) => {
  try {
    const songById = await Track.findById(req.params.id);
    if (songById) {
      res.json(songById);
    } else {
      res.status(404).json({ error: 'Sorry, the song is not found' });
    }
  } catch (err) {
    res.status(400).json({ error: 'The id is invalid' });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
