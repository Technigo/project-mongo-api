import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import skotrum from './data/skotrum.json';

const mongoUrl =
  process.env.MONGO_URL || 'mongodb://localhost/skotrum-mongo-project';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Skotrum = mongoose.model('Skotrum', {
  id: Number,
  name: String,
  adress: String,
  phone: String,
  openHours: String,
  note: String,
  webpage: String,
  location: String,
  hasChangingRooms: Boolean
});

const Restaurant = mongoose.model('Restaurant', {
  name: String,
  adress: {
    type: mongoose.Schema.Types.String,
    ref: 'BabyRooms'
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
  name: String,
  openHours: {
    type: mongoose.Schema.Types.String,
    ref: 'Location'
  }
});

const BabyRooms = mongoose.model('BabyRooms', {
  name: String,
  note: String,
  hasChangingRooms: {
    type: mongoose.Schema.Types.Boolean,
    ref: 'Restaurant'
  }
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Skotrum.deleteMany();
    await Restaurant.deleteMany();
    await Location.deleteMany();
    await OpenHours.deleteMany();
    await BabyRooms.deleteMany();

    skotrum.forEach(restData => {
      new Skotrum(restData).save();
      new Restaurant(restData).save();
      new Location(restData).save();
      new OpenHours(restData).save();
      new BabyRooms(restData).save();
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

// Middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Routes
app.get('/', (req, res) => {
  res.send('Skotrum');
});

//to find all babyrooms in sthlm
app.get('/findbabyrooms', async (req, res) => {
  const skotrum = await Skotrum.find();
  console.log(skotrum);

  res.json(skotrum);
});

//to find one babyroom by id
app.get('/findbabyrooms/:id', async (req, res) => {
  const skotrum = await Skotrum.findById(req.params.id);
  if (skotrum) {
    res.json(skotrum);
  } else {
    res.status(404).json({ error: 'restaurant not found' });
  }
});

// to find restaurants with babyrooms including name and adress
app.get('/restaurants', async (req, res) => {
  const restaurant = await Restaurant.find().populate('Location');
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404).json({ error: 'restauarnt not found' });
  }
});

//route to find restaurants with babyrooms including name, adress and location
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

// Route to see what restaurants that have babyrooms. It also get notes, if the restaurant have other solutions for babyrooms.
app.get('/babyrooms', async (req, res) => {
  const babyrooms = await BabyRooms.find().populate('Restaurant');
  if (babyrooms) {
    res.json(babyrooms);
  } else {
    res.status(404).json({ error: 'restauarnt not found' });
  }
});

// Route to get restarant name and opening hours
app.get('/openings', async (req, res) => {
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

// Route with path params to be able to show restaurants by seraching for location. E.g. only write 'va' and all restaurants in vasastan will show.
app.get('/:locations', async (req, res) => {
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
