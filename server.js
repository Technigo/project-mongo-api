import express from "express";
import cors from "cors";
import bodyParser from 'body-parser'
import mongoose from "mongoose";

import netflixData from "./data/netflix-titles.json";

require('dotenv/config')

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/world-streaming-entertainment";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('connected to Mongo DB')
});
mongoose.Promise = Promise;


const port = process.env.PORT || 8000;
const app = express();

const NetflixItem = mongoose.model('NetflixItem', {
  "show_id": Number,
  "title": String,
  "director": String,
  "cast": String,
  "country": String,
  "date_added": String,
  "release_year": Number,
  "rating": String,
  "duration": String,
  "listed_in": String,
  "description": String,
  "type": String
})

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


app.get("/", async (req, res) => {
  const allNetflixItems = await NetflixItem.find()
  res.json(allNetflixItems)
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
