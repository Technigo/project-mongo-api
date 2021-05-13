import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import router from './routes';
import errorHandler from './controllers/errorController';
import data from './data/ufoSightings.json';
import Sighting from './models/sightingModel';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb+srv://dbAdmin:GVjqx6dZ7PLl1Hsv@cluster0.ytdmt.mongodb.net/ufo-sightings?retryWrites=true&w=majority';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Sighting.deleteMany({});

    data.forEach((d) => {
      new Sighting(d).save();
    });
  };

  seedDatabase();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
// Add router module
app.use('/', router);
app.use(errorHandler);
// Start the server
app.listen(port, () => {});
