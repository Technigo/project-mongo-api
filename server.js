const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const topSongsData = require("./data/500topsongs.json");

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const songSchema = new mongoose.Schema({
  title: String,
  description: String,
  artist: String,
  writers: String,
  producer: String,
  position: String,
});

const Song = mongoose.model("Member", songSchema);
// inject all data to our data base

if (process.env.RESET_DB) {
  const SeedDB = async () => {
    await Song.deleteMany();

    await topSongsData.forEach((item) => {
      const newSong = new Song(item);
      newSong.save();
    });
  };
  SeedDB();
}

// Defines the port the app will run on. Defaults to 8080
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Top songs");
});

app.get("/songs", async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
});
// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
