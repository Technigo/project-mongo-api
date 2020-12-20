import express, { response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import eruptionsData from './data/volcanic-eruptions.json';

// Database URL and connection
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
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
app.use(bodyParser.json());

// To list all endpoints
const endpoints = require('express-list-endpoints');

// Database model for the volcanic eruption object
const Eruption = mongoose.model('Eruption', {
  id: Number,
  name: String,
  country: String,
  region: String,
  type: String,
  activity_evidence: String,
  last_known_eruption: String,
  latitude: Number,
  longitude: Number,
  elevation_meters: Number,
  dominant_rock_type: String,
  tectonic_setting: String,
});

// Populate database if the environment variable RESET_DATABASE is true
if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Eruption.deleteMany();

    eruptionsData.forEach(item => {
      new Eruption(item).save();
    });
  };
  populateDatabase();
}

// Error message if database connection is down
app.use((request, response, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).send({ error: 'Service unavailable' });
  }
});

// / endpoint (root)
// RETURNS: A list of all endpoints as an array
//
app.get('/', (request, response) => {
  response.send(endpoints(app));
});

app.get('/eruptions', async (request, response) => {
  const allEruptions = await Eruption.find();
  response.json(allEruptions);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
