import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import spotifyData from "./data/spotify-releases.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-spotify"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const Release = new mongoose.model("Release", {
  album_type: String,
  // artists: [{ external_urls: { spotify: String }, href: String, id: String, name: String, type: String, uri: String }],
  artists: [{ external_urls: { spotify: String }, href: String, id: String, name: String, uri: String }],
  available_markets: [String],
  external_urls: { spotify: String },
  href: String,
  id: String,
  images: [{ height: Number, url: String, width: Number }],
  name: String,
  release_date: String,
  release_date_precision: String,
  total_tracks: Number,
  type: String,
  uri: String
});

if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Release.deleteMany();

    spotifyData.forEach(item => {
      const newRelease = new Release(item);
      newRelease.save();
    })
  }
  populateDatabase();
};

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world")
})

app.get("/releases", async (req, res) => {
  const allReleases = await Release.find();
  res.json(allReleases);
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
