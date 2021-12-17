import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'
import theOfficeData from './data/the-office.json';

const mongoUrl = process.env.MONGO_URL || 'MONGO_URL';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Episode = mongoose.model('Episode', {
  season: Number,
  episodeNum: Number,
  title: String,
  originalAirDate: String,
  imdbRating: Number,
  totalVotes: Number,
  desc: String,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Episode.deleteMany({});

    theOfficeData.forEach(item => {
      const newEpisode = new Episode(item);
      newEpisode.save();
    });
  };
  seedDatabase();
}

// middleware that checks if the database is connected before going to our endpoints
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({
      response: 'Service unavailable',
      succes: false,
    });
  }
});

app.get('/', (req, res) => {
  res.send(
    'type /endpoints in the URL to start. Endpoints are case sensitive.'
  );
});

app.get('/endpoints', (req, res) => {
  res.send(listEndpoints(app));
});

app.get('/episodes', async (req, res) => {
  const seasons = await Episode.find(req.query);
  res.json(seasons);
});

// get one episode based on iD
app.get('/episodes/id/:id', async (req, res) => {
  // this will only be triggered IF we have an ID, otherwise we'll just see the episodes
  const { id } = req.params;
  try {
    const episodeById = await Episode.findById(id);
    if (episodeById) {
      res.json(episodeById);
    } else {
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (err) {
    res.status(400).json({ error: 'invalid id' });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
