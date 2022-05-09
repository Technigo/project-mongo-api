import express from "express";
import cors from "cors";
import bodyParser from 'body-parser'
import mongoose from "mongoose";
import NetflixItem from "./models/NetflixItem"
import netflixItems from "./routes/netflixItems"

import listEndpoints from "express-list-endpoints"

import netflixData from "./data/netflix-titles.json";

import dotenv from 'dotenv'
dotenv.config()

const mongoUrl = process.env.MONGO_URL || "https://netflix-titles-mongodb-project.herokuapp.com/";

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  console.log('connected to Mongo DB')
});

console.log("MONGO_URL", process.env.MONGO_URL)

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
app.use('/api/netflixshows', netflixItems)

app.get("/", async (req, res) => {
  res.send(listEndpoints(app));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

