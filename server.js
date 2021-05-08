import express from 'express';
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

// const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: 'Service unavailable' });
  }
});

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/animals';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Animal = mongoose.model('Animal', {
  name: String,
  age: Number,
  isFurry: Boolean,
});

Animal.deleteMany().then(() => {
  new Animal({ name: 'Alfons', age: 2, isFurry: true }).save();
  new Animal({ name: 'Lucy ', age: 5, isFurry: true }).save();
  new Animal({ name: 'Goldy the Goldfish', age: 1, isFurry: false }).save();
});

// Start defining your routes here
app.get('/', (req, res) => {
  console.log(process.env.MY_SECRET);
  Animal.find().then((animals) => {
    res.json(animals);
  });
});

app.get('/:name', (req, res) => {
  try {
    Animal.findOne({ name: req.params.name }).then((animal) => {
      if (animal) {
        res.json(animal);
      } else {
        res.status(404).json({ error: 'Not Found' });
      }
    });
  } catch (err) {
    res.status(400).json({ error: 'Invalid user ID' });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
