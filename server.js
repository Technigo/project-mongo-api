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
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  main_speaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speaker',
  },
  name: String,
  speaker_occupation: String,
  tags: Array,
  url: String,
});

const Event = new mongoose.model('Event', {
  name: String,
});

const Speaker = new mongoose.model('Speaker', {
  name: String,
});

// To reset and populate database ------------
if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Talk.deleteMany();
    await Event.deleteMany();
    await Speaker.deleteMany();

    let events = [{}];
    let speakers = [{}];

    // EVENTS - Remove all dublicate events and create a new array
    const allEvents = Array.from(new Set(tedData.map((talk) => talk.event)));
    allEvents.forEach((item) => {
      const newEvent = new Event({ name: item });
      newEvent.save();
      events.push(newEvent);
    });

    // SPEAKERS - Remove all dublicate events and create a new array
    const allSpeakers = Array.from(
      new Set(tedData.map((talk) => talk.main_speaker))
    );
    allSpeakers.forEach((item) => {
      const newSpeaker = new Speaker({
        name: item,
      });
      newSpeaker.save();
      speakers.push(newSpeaker);
    });

    // ALL TALKS - including connected events and speakers
    tedData.forEach((item) => {
      item.tags = JSON.parse(item.tags);
      const newTalk = new Talk({
        ...item,
        event: events.find((event) => event.name === item.event),
        main_speaker: speakers.find(
          (speaker) => speaker.name === item.main_speaker
        ),
      });
      newTalk.save();
    });
  };
  populateDatabase();
}

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
  Talk.find({ name: queryRegex })
    .populate('event')
    .populate('main_speaker')
    .then((data) => {
      if (data.length === 0) {
        res.status(400).json({ error: 'Invalid request' });
      } else {
        res.json(data);
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
      res.json({
        'Amount of events': data.length,
        data: data,
      });
    }
  });
});

// EVENTS BY ID --------------------------
app.get('/events/:id', (req, res) => {
  Event.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(404).json({
        error: `Could not find any talk with the id ${req.params.id}`,
      });
    } else {
      res.json(data);
    }
  });
});

// TALKS BY EVENT -----------------------
app.get('/events/:id/talks', async (req, res) => {
  const event = await Event.findById(req.params.id);
  Talk.find({ event: event })
    .populate('event')
    .populate('main_speaker')
    .then((data) => {
      res.json({
        Event: event.name,
        'Amount of talks': data.length,
        data: data,
      });
    })
    .catch((error) => res.status(400).json(error));
});

// SPEAKERS --------------------------------
app.get('/speakers', (req, res) => {
  Speaker.find({}, (err, data) => {
    if (err) {
      res.status(404).json({
        error: `Error`,
      });
    } else {
      const allSpeakers = Array.from(new Set(data.map((talk) => talk)));
      res.json({ 'Amount of speakers': allSpeakers.length, data: allSpeakers });
    }
  });
});

// SPEAKER BY ID --------------------------
app.get('/speakers/:id', (req, res) => {
  Speaker.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(404).json({
        error: `Could not find any speaker with the id ${req.params.id}`,
      });
    } else {
      res.json(data);
    }
  });
});

// TALKS BY SPEAKER -----------------------
app.get('/speakers/:id/talks', async (req, res) => {
  const speaker = await Speaker.findById(req.params.id);
  Talk.find({ main_speaker: speaker })
    .populate('event')
    .populate('main_speaker')
    .then((data) => {
      if (data.length === 0) {
        res.status(404).json({
          error: `Could not find any talks by ${req.params.id}`,
        });
      } else {
        res.json({
          Speaker: speaker.name,
          'Amount of talks': data.length,
          data: data,
        });
      }
    })
    .catch((error) => console.log(error));
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

// TALKS BY CATEGORY -----------------------
app.get('/categories/:category/talks', (req, res) => {
  const queriedCategory = req.params.category;
  const queryRegex = new RegExp(queriedCategory, 'i');

  Talk.find({ tags: queryRegex }, (err, data) => {
    if (data.length === 0) {
      res.status(404).json({
        error: `Couldn't find any talks on ${queriedCategory}`,
      });
    } else {
      res.json({
        Query: req.params.category,
        'Amount of talks': data.length,
        data: data,
      });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
