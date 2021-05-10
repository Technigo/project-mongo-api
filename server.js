const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { topSongsData } = require("./data/500topsongs.json");

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const { newTopSongs } = require("./data/cleanSongs")

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// model a specific set of rules for how the document will look like
// every document created should look like this: 
const songSchema = new mongoose.Schema({
  title: String,
  description: String,
  artist: String,
  writers: String,
  producer: String,
  position: Number
});

// Mongoose = ORM - Object Relational Mapping.
// Model consist of schemas
const Song = mongoose.model("Song", songSchema);

if (process.env.RESET_DB) {
  const SeedDB = async () => {
    await Song.deleteMany();

    // asyncronys code
    // operation we do in backend, save this in the data base 
    await newTopSongs.forEach((item) => {
      const newSong = new Song(item);
      newSong.save();
    });
  };
  SeedDB();
}

// const SeedDB = () => {
//   topSongsData.forEach((item) => {
//     const newSong = new Song(item)
//     newSong.save()
//   })
// }
// SeedDB()
// inject all data to our data base

// const newSong = new Song({
//   title: "kjsnfk",
//   description: "flksnkfn",
//   appears_on: "flksnkfn",
//   artist: "flksnkfn",
//   writers: "flksnkfn",
//   producer: "flksnkfn",
//   position: "flksnkfn"
// })
// newSong.save()

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
