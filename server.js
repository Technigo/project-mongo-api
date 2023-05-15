import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import musicData from './data/top-music.json';
import listEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';

dotenv.config();

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || `mongodb://127.0.0.1/musicDB`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

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
  danceability: Number
});
// populate database with music data
if (process.env.RESET_DB) {
  console.log('Resetting database!');
  const seedDB = async () => {
    await Song.deleteMany();

    musicData.forEach((songData) => {
      const song = new Song(songData);
      console.log(song);
      song.save();
    });
  };
  seedDB();
}
// Check that the database is running
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: 'Service unavailable' });
  }
});

// Root endpoint (with list of endpoints)
app.get('/', (req, res) => {
  res.json(listEndpoints(app));
});

// Endpoint to get all songs
app.get('/songs', async (req, res) => {
  // can only await something in an async
  try {
    const songs = await Song.find();
    res.status(200).json({
      success: true,
      body: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      body: {
        message: error
      }
    });
  }
});

// Endpoint to get a specific song
app.get('/songs/:id', (req, res) => {
  const { id } = req.params;
  const singletrack = musicData.find((track) => {
    return track.id === Number(id);
  });
  if (singletrack) {
    res.status(200).json({
      success: true,
      message: 'OK',
      body: {
        track: singletrack
      }
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'Track not found',
      body: {}
    });
  }
});

//songs by bpm
app.get('/songs/bpm/:bpm', async (req, res) => {
  const { bpm } = req.params;
  const songs = await Song.find({ bpm: bpm });
  if (songs.length > 0) {
    res.json(songs);
  } else {
    res.status(404).json({ error: 'BPM not found' });
  }
});

// endpoint to get songs by genre
app.get('/genres/:genre', async (req, res) => {
  const { genre } = req.params;
  const songs = await Song.find({ genre: genre });
  if (songs.length > 0) {
    res.json(songs);
  } else {
    res.status(404).json({ error: 'Genre not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
