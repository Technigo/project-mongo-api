import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import netflixData from './data/netflix-titles.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/netflix';
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

try {
  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch (error) {
  console.log(error);
}

mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Show schema
const Show = mongoose.model('Show', {
  title: String,
  director: String,
  cast: String,
  country: String,
  date: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String
});

// Delete content and prepare MongoDB with new data
Show.deleteMany().then(() => {
  netflixData.forEach(show => {
    delete show.show_id;
    new Show({ ...show }).save();
  });
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get('/shows', (req, res) => {
  Show.find().then(shows => {
    res.json(shows);
  });
});

app.get('/shows/:id', (req, res) => {
  Show.find({ _id: req.params.id }).then(show => {
    if (show) {
      res.json(show);
    } else {
      res.status(404).json({
        error: 'Not found'
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
