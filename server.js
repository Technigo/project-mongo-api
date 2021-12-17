import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndPoints from 'express-list-endpoints'; // for listing all routes
//import topMusicData from './data/top-music.json';

//----------------* for database connection *--------------------//
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/musicTrack';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//------------------------* Model for the database *------------------------------//
const Track = mongoose.model('Track', {
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

// -----------------* seeding data from json file to database (one time action) *---------------------//
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Track.deleteMany({});

    topMusicData.forEach((musicTrack) => {
      new Track(musicTrack).save();
    });
  };
  seedDatabase();
}
//------------------ Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:   PORT=9000 npm start ------------------//

const port = process.env.PORT || 8080;
const app = express();

//---------------* middlewares to enable cors and json body parsing *---------------------------//
app.use(cors());
app.use(express.json());

// ----------------- *  defining  routes here *--------------------- //

// default route
app.get('/', async (req, res) => {
  res.send(
    'welcome to the top music tracks information API. For detailed documentation visit: '
  );
});

// this will list all routes
app.get('/endpoints', async (req, res) => {
  res.send(listEndPoints(app));
});

app.get('/tracks', async (req, res) => {
  const queryObj = { ...req.query };
  const page = req.query.page;
  const limit = req.query.limit;
  const sortOrder = req.query.sort;

  //------- filtering req.query object-----------------//
  const excludedFields = ['page', 'limit', 'sort']; // fields need to be deleted from req.query object

  excludedFields.forEach((item) => delete queryObj[item]);

  try {
    let result = Track.find(queryObj);

    if (sortOrder) {
      result = result.sort(sortOrder);
    }

    if (page) {
      const tracks = await result
        .find({})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const count = await result.countDocuments();
      console.log(count);

      res.status(200).json({
        status: 'success',
        data: { tracks },
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      });
    } else {
      const tracks = await result;

      res.status(200).json({
        status: 'success',
        results: tracks.length,
        data: { tracks },
      });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/tracks/id/:id', async (req, res) => {
  try {
    const trackById = await Track.findById(req.params.id);
    if (trackById) {
      res.json(trackById);
    } else res.status(404).json({ error: 'Track not found' });
  } catch (err) {
    res.status(400).json({ error: 'Id is invalid' });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
