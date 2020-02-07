import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'
import skotrum from './data/skotrum.json';

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/skotrum-mongo-project';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Skotrum = mongoose.model('Skotrum', {
  name: {
    type: String
  },
  adress: {
    type: String
  },
  phone: {
    type: String
  },
  openHours: {
    type: String
  },
  note: {
    type: String
  },
  webpage: {
    type: String
  },
  location: {
    type: String
  }
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Skotrum.deleteMany();

    skotrum.forEach(restData => {
      new Skotrum(restData).save();
    });
  };
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Skotrum');
});

app.get('/restaurants', async (req, res) => {
  const restaurant = await Skotrum.find();
  res.json(restaurant);
});

app.get('/skotrum', async (req, res) => {
  const restaurant = await Skotrum.find();
  console.log(restaurant);
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404).json({ error: 'restaurant not found' });
  }
});

app.get('/restaurants/:id', async (req, res) => {
  const restaurant = await Skotrum.findById(req.params.id);
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404).json({ error: 'restaurant not found' });
  }
});

app.get('/open', async (req, res) => {
  const queryString = req.query.q;
  console.log(queryString);
  const queryRegex = new RegExp(queryString, 'i');
  const openHours = await Skotrum.find({ openHours: queryRegex });
  if (openHours) {
    res.json(openHours);
  } else {
    res.status(404).json({ error: 'openhours not found' });
  }
});

app.get('/:location', async (req, res) => {
  const paramString = req.params.location;
  console.log(paramString);
  const paramsRegex = new RegExp(paramString, 'i');
  const location = await Skotrum.find({ location: paramsRegex });
  if (location) {
    console.log(location);
    res.json(location);
  } else {
    res.status(404).json({ error: 'location not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

/* 
const PER_PAGE = 2;
_____
-----
  const { page } = req.query;
  const startIndex = PER_PAGE * +page;
  const data = skotrum.slice(startIndex, startIndex + PER_PAGE);
 res.json({
    totalPage: Math.floor(skotrum.length / PER_PAGE),
    currentPage: +page,
    data
    */
