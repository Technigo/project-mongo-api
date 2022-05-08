import express from "express";
import cors from "cors";
import bodyParser from 'body-parser'
import mongoose from "mongoose";
import NetflixItem from "./models/NetflixItem"

import listEndpoints from "express-list-endpoints"

import netflixData from "./data/netflix-titles.json";


require('dotenv/config')

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/world-streaming-entertainment";

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('connected to Mongo DB')
});

mongoose.Promise = Promise;

const port = process.env.PORT || 8000;
const app = express();

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await NetflixItem.deleteMany({})

    netflixData.forEach((item) => {
      new NetflixItem(item).save()
    })
  }
  seedDatabase()
}

app.use(cors());
app.use(bodyParser.json())
app.use(express.json());

const netflixItemsRoute = require('./routes/netflixItems')
app.use('/api/netflixshows', netflixItemsRoute)

app.get("/", async (req, res) => {
  res.send(listEndpoints(app));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

