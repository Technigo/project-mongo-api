import express from "express";
import cors from "cors";

import expressListEndpoints from "express-list-endpoints"
import mongoose from "mongoose";

const mongoURL = process.env.MONGO_URL || "mongodb://localhost/topmusic"
mongoose.connect(mongoURL)
mongoose.Promise = Promise

// import the data
import topMusicData from "./data/top-music.json"

//Seed the database
const seedDatabase = async () => {
  await Song.deleteMany()

  topMusicData.forEach(song => {
    new Song(song).save()
  })
}
seedDatabase()


// Defines the port the app will run on.
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
// http://localhost:8080

