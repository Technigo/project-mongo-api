import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import tedData from './data/ted.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

// Middleware --------------------------------
app.use(cors());
app.use(bodyParser.json());

// Models ------------------------------------
const Talk = new mongoose.model('Talk', {
  description: String,
  event: String,
  main_speaker: String,
  name: String,
  speaker_occupation: String,
  tags: Array,
  url: String,
});

const Event = new mongoose.model('Event', {
  name: String,
});

// To reset and populate database ------------

const populateDatabase = async () => {
  await Talk.deleteMany();
  await Event.deleteMany();

  tedData.forEach((item) => {
    item.tags = JSON.parse(item.tags);
    const newTalk = new Talk(item);
    newTalk.save();
  });

  // Remove all dublicate events and create a new array
  const allEvents = Array.from(new Set(tedData.map((talk) => talk.event)));
  allEvents.forEach((item) => {
    const newEvent = new Event({ name: item });
    newEvent.save();
  });
};
populateDatabase();

// Routes ----------------------------------------------------------------
app.get('/', (req, res) => {
  res.json(
    'Welcome to TED-talks API - by Karin! Read full documentation here: 👉 https://github.com/karinnordkvist/karinnordkvist-Technigo-17-20-Mongo-API/blob/master/Documentation.md.'
  );
});

// TALKS ---------------------------------------
app.get('/talks', (req, res) => {
  const queriedTalks = req.query.search;
  const queryRegex = new RegExp(queriedTalks, 'i');
  Talk.find({ name: queryRegex }, (err, data) => {
    if (err) {
      res.status(400).json({ error: 'Invalid request' });
    } else {
      res.json({ 'Amount of talks': data.length, data: data });
    }
  });
});

// TALKS BY ID --------------------------------
app.get('/talks/:id', (req, res) => {
  Talk.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(404).json({
        error: `Could not find any talk with the id ${req.params.id}`,
      });
    } else {
      res.json(data);
    }
  });
  //
});
// EVENTS ------------------------------------
app.get('/events', (req, res) => {
  Event.find({}, (err, data) => {
    if (err) {
      res.status(404).json({
        error: `Error`,
      });
    } else {
      res.json({ 'Amount of events': data.length, data: data });
    }
  });
});

// SPEAKERS --------------------------------
app.get('/speakers', (req, res) => {
  Talk.find({}, (err, data) => {
    if (err) {
      res.status(404).json({
        error: `Error`,
      });
    } else {
      const allSpeakers = Array.from(
        new Set(data.map((talk) => talk.main_speaker))
      );
      res.json({ 'Amount of speakers': allSpeakers.length, data: allSpeakers });
    }
  });
});

// CATEGORIES --------------------------------
app.get('/categories', (req, res) => {
  Talk.find({}, (err, data) => {
    if (err) {
      res.status(404).json({
        error: `Error`,
      });
    } else {
      const allCategories = Array.from(
        new Set(
          [].concat.apply(
            [],
            data.map((talk) => talk.tags)
          )
        )
      );
      res.json({
        'Amount of categories': allCategories.length,
        data: allCategories,
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
