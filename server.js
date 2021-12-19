import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
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

// This resets the database, deletes first the things that are in it and
// and just plants the data from the json file in it.
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

app.use(cors());
app.use(express.json());

// checks if the database is good to go. If not there is an error message.
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: 'Service unavailable' });
  }
});

// A guide for the user.
app.get('/', (req, res) => {
  res.send('Type /endpoints to se all the endpoints.');
});

// lists all the endpoints
app.get('/endpoints', (req, res) => {
  res.send(listEndpoints(app));
});

// get all the tracks, sort by queries or by danceability.
// You can use multiple filters at the same time.
app.get('/tracks', async (req, res) => {
  let tracks = await Track.find(req.query);
  if (tracks) {
    if (req.query.danceability) {
      const tracksByDanceability = await Track.find().gt(
        'danceability',
        req.query.danceability
      );
      tracks = tracksByDanceability;
    }
    res.json(tracks);
  } else {
    res.status(400).json({ error: 'Not found' });
  }
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
