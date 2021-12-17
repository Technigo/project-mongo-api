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

// Use middleware readyState for errorhandling if database isn't in a good state
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({
      response: 'Service unavailable',
      success: false
    });
  }
});

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
  res.send(
    'This is the home of "not-that-great-but still-called-top-Music" by Ida. Please see documentation 👉'
  );
});

// get the endpoints
app.get('endpoints', (req, res) => {
  res.send(listEndpoints(app));
});

// getting all singles and added query params
app.get('/singles', async (req, res) => {
  let singles = await Single.find(req.query);

  // this let you find several with the value grather than...
  if (req.query.danceability) {
    const singlesByDanceability = await Single.find().gt(
      'danceability',
      req.query.danceability
    );
    singles = singlesByDanceability;
  }

  if (req.query.popularity) {
    const singlesByPopularity = await Single.find().gt(
      'popularity',
      req.query.popularity
    );
    singles = singlesByPopularity;
  }

  res.status(200).json({
    response: singles,
    success: true
  });
});

// get data by artist, using RegExp the Mongoose-way
app.get('/singles/artist/:artist', async (req, res) => {
  const { artist } = req.params;
  try {
    const singleByArtist = await Single.find({
      artistName: { $regex: '\\b' + artist + '\\b', $options: 'i' }
    });
    if (singleByArtist) {
      res.status(200).json({
        response: singleByArtist,
        success: true
      });
    } else {
      res.status(404).json({
        response: 'Incorrect Artist',
        sucess: false
      });
    }
  } catch (err) {
    res.status(400).json({
      response: 'Invalid Artist',
      sucess: false
    });
  }
});

// Get data by id, with Mongoose we cant use findById instead of find
app.get('/singles/id/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const singleById = await Single.findById(id);
    if (singleById) {
      res.status(200).json({
        response: singleById,
        success: true
      });
    } else {
      res.status(404).json({
        response: 'Incorrect ID',
        sucess: false
      });
    }
  } catch (err) {
    res.status(400).json({
      response: 'Invalid id',
      sucess: false
    });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
