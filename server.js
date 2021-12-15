import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import musicData from './data/top-music.json';
import listEndpoints from 'express-list-endpoints';

// set up mongoose and connect to the database
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on.
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// specify a model
const Single = mongoose.model('Single', {
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
  popularity: Number
});

// using environment variable in seedData when seting up the database (only do once)
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Single.deleteMany({});

    musicData.forEach((singleData) => {
      const newSingle = new Single(singleData);
      newSingle.save();
    });
  };
  seedDatabase();
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world');
});

// get the endpoints
app.get('endpoints', (req, res) => {
  res.send(listEndpoints(app));
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
