import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import skotrum from './data/skotrum.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Skotrum = mongoose.model('Skotrum', {
  name: String,
  adress: String,
  phone: String,
  openHours: String,
  note: String,
  webpage: String,
  location: String
});

const Restaurant = mongoose.model('Restaurant', {
  name: String,
  adress: {
    type: mongoose.Schema.Types.String,
    ref: 'Location'
  }
});

const Location = mongoose.model('Location', {
  name: String,
  adress: String,
  location: {
    type: mongoose.Schema.Types.String,
    ref: 'Restaurant'
  }
});

const OpenHours = mongoose.model('OpenHours', {
  Name: String,
  openHours: {
    type: mongoose.Schema.Types.String,
    ref: 'Location'
  }
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Skotrum.deleteMany();
    await Restaurant.deleteMany();
    await Location.deleteMany();
    await OpenHours.deleteMany();

    skotrum.forEach(restData => {
      new Skotrum(restData).save();
      new Restaurant(restData).save();
      new Location(restData).save();
      new OpenHours(restData).save();
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

app.get('/skotrum', async (req, res) => {
  const skotrum = await Skotrum.find();
  console.log(skotrum);

  const { page } = req.query;
  const startIndex = 20 * +page;
  res.json(skotrum.slice(startIndex, startIndex + 20));
});

app.get('/skotrum/:id', async (req, res) => {
  const skotrum = await Skotrum.findById(req.params.id);
  if (skotrum) {
    res.json(skotrum);
  } else {
    res.status(404).json({ error: 'restaurant not found' });
  }
});

app.get('/restaurants', async (req, res) => {
  const restaurant = await Restaurant.find().populate('location');
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404).json({ error: 'restauarnt not found' });
  }
});

app.get('/locations', async (req, res) => {
  const location = await Location.find().populate('Restaurant');
  if (location) {
    res.json(location);
  } else {
    res.status(404).json({ error: 'restauarnt not found' });
  }
});

app.get('/openHours', async (req, res) => {
  const openHours = await OpenHours.find().populate('location');
  if (openHours) {
    res.json(openHours);
  } else {
    res.status(404).json({ error: 'restauarnt not found' });
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


app.get('/skotrum/:id', async (req, res) => {
  const restaurant = await Skotrum.find();
  console.log(restaurant);
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404).json({ error: 'restaurant not found' });
  }
});
    */
