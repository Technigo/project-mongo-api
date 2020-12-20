import express, { response, request } from 'express';
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
const Eruption = new mongoose.model('Eruption', {
  id: Number,
  name: String,
  country: String,
  region: String,
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Type',
  },
  activity_evidence: String,
  last_known_eruption: String,
  latitude: Number,
  longitude: Number,
  elevation_meters: Number,
  dominant_rock_type: String,
  tectonic_setting: String,
});

//Database model for the region object
const Type = new mongoose.model('Type', {
  type: String,
});

// Reset and populate database if the environment variable RESET_DATABASE is true
if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Type.deleteMany();
    await Eruption.deleteMany();
    //await Region.deleteMany();

    let types = [];
    let regions = [];

    // Types - remove duplicates and create new array
    const allTypes = Array.from(
      new Set(eruptionsData.map(eruption => eruption.type))
    );
    allTypes.forEach(async item => {
      const newType = new Type({ type: item });
      types.push(newType);
      await newType.save();
      //.push(new Type(item).save());
    });

    // Eruptions - all volcanic eruptions from the data
    eruptionsData.forEach(async item => {
      const newEruption = new Eruption({
        ...item,
        type: types.find(typeItem => typeItem.type === item.type),
      });
      await newEruption.save();
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

// /eruptions endpoint
// RETURNS: A collection of all eruptions from MongoDB as an array
//
// PARAMETERS:
// - page (default: 1): a number indicating what page number to show
//    usage: /eruptions/?page=1
// - region: a string
//    usage: /eruptions?region=Antarctica
app.get('/eruptions', async (request, response) => {
  const { page, region } = request.query;
  const pageNumber = +page || 1;
  const pageSize = 20;
  const skip = pageSize * (pageNumber - 1);
  const totalEruptions = await Eruption.find({
    region: new RegExp(region, 'i'),
  });
  const allEruptions = await Eruption.find({
    region: new RegExp(region, 'i'),
  })
    .populate('type')
    .limit(pageSize)
    .skip(skip);

  const returnObject = {
    totalNumberOfEruptions: totalEruptions.length,
    eruptionsPerPage: pageSize,
    currentPage: `${pageNumber}/${Math.ceil(totalEruptions.length / pageSize)}`,
    results: allEruptions,
  };

  if (allEruptions.length === 0) {
    response.status(404).send({ error: 'Not found' });
  } else {
    response.json(returnObject);
  }
});

// /eruptions/:id endpoint
// RETURNS: One unique item
//
// PARAMETERS:
// - id: a unique number
//    usage: /eruptions/390847
//
app.get('/eruptions/:id', async (request, response) => {
  try {
    const singleVolcano = await Eruption.findById(request.params.id);
    if (singleVolcano) {
      response.json(singleVolcano);
    } else {
      response
        .status(404)
        .send({ error: `No volcano with id ${request.params.id} was found` });
    }
  } catch {
    response
      .status(400)
      .send({ error: `${request.params.id} is not a valid id` });
  }
});

// /types endpoint
// RETURNS: A collection of all types from volcanic-eruptions.json as an array
//
// PARAMETERS:
// - name: a string
//    usage: /types?type=Stratovolcano
//
app.get('/types', async (request, response) => {
  const types = await Type.find({
    type: new RegExp(request.query.type, 'i'),
  });

  if (types) {
  }
  response.json({
    totalNumberOfTypes: types.length,
    result: types,
  });
});

// /types/:id endpoint
// RETURNS: One unique item
//
// PARAMETERS:
// - id: a unique number
//    usage: /types/390847
//
app.get('/types/:id', async (request, response) => {
  try {
    const singleType = await Type.findById(request.params.id);
    if (singleType) {
      response.json(singleType);
    } else {
      response
        .status(404)
        .send({ error: `No type with id ${request.params.id} was found` });
    }
  } catch {
    response
      .status(400)
      .send({ error: `${request.params.id} is not a valid id` });
  }
});

// /types/:id/eruptions
app.get('/types/:id/eruptions', async (request, response) => {
  const type = await Type.findById(request.params.id);

  if (type) {
    const eruptions = await Eruption.find({
      type: mongoose.Types.ObjectId(type.id),
    }).populate('type');
    response.json({
      totalNumberOfEruptions: eruptions.length,
      result: eruptions,
    });
  } else {
    response.status(404).json({
      error: `No eruptions found for type with id ${request.params.id}`,
    });
  }
  Type.find({ type: type }).populate('type');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
