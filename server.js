import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import netflixData from './data/netflix-titles.json';

dotenv.config();

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
