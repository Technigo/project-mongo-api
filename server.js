import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json';
import topMusicData from './data/top-music.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/music-hedvig';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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

// This resets the database.
// Deletes the things in the database
// and just plants the data i wrote in it.
// RESET_DB run dev is the command in the terminal.
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

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: 'Service unavilable' });
  }
});

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello ✨ 🥑 🌲');
});

// get all the tracks
// also you can use different queries here
// also sort by dancebility (you get the results greater the number you have putted in)
app.get('/tracks', async (req, res) => {
  // res.json(topMusicData); - this uses the json file.

  // find gets all the items, we can use it as a filter.
  // It is asyncronous function.
  // you can filter on what do you want with this
  // function. You can also have multipple things to filter on.

  let tracks = await Track.find(req.query);

  if (req.query.danceability) {
    const tracksByDanceability = await Track.find().gt(
      'danceability',
      req.query.danceability
    );
    tracks = tracksByDanceability;
  }

  res.json(tracks);
});

// get one track based on id
app.get('/tracks/id/:id', async (req, res) => {
  try {
    const trackById = await Track.findById(req.params.id);
    if (trackById) {
      res.json(trackById);
    } else {
      res.status(404).json({ error: 'track not found' });
    }
  } catch (err) {
    res.status(400).json({ error: 'invalid format of the id!' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
