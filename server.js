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

app.get('/restaurants/:id', async (req, res) => {
  const restaurant = await Skotrum.findById(req.params.id);
  res.json(restaurant);
});

app.get('/:location', async (req, res) => {
  const location = await Skotrum.find({ location: req.params.location });
  res.json(location);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
