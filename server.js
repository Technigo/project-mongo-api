/* eslint-disable comma-dangle */
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import swiftData from "./data/swift-data.json";

// import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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
app.use(express.json());

const Song = mongoose.model("Song", {
  index: Number,
  name: String,
  album: String,
  artist: String,
  release_date: String,
  length: Number,
  popularity: Number,
  danceability: Number,
  acousticness: Number,
  energy: Number,
  instrumentalness: Number,
  liveness: Number,
  loudness: Number,
  speechiness: Number,
  valence: Number,
  tempo: Number,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Song.deleteMany({});

    swiftData.forEach((item) => {
      const newSong = new Song(item);
      newSong.save();
    });
  };
  seedDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
