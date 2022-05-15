import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
//import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

const Song = mongoose.model("Song", {
  id: Number,
  trackName: String,
  artistName: String,
  genre: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number,
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Song.deleteMany();
    topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong);
      newSong.save();
    });
  };
  seedDatabase();
}

// Add middlewares to enable cors and json body parsing
//adding middleware to check if the database is up or not
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable'})
  }
})

app.use(cors());
app.use(express.json());

app.get("/songs/song/", async (req, res) => {
  // this will retreive only the first found song
  const { artistName, trackName, energy } = req.query;
  
 if (trackName != undefined) { 
  const singleSong = await Song.find({
    artistName: artistName,
    trackName: trackName,
  });
  res.send(singleSong);
 } else {
  const singleSong = await Song.find({
    artistName: artistName,
  });
  res.send(singleSong);
}
});

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// getting a songe genre using the path params
app.get("/songs/song/:genre", async (req, res) => {
  const { genre } = req.params;
  const songByGenre = await Song.find({genre: genre});

  if (!songByGenre) {
    res.status(404).json({
      error: "Not found",
      success: false,
    });
  } else {
    res.status(200).json({
      data: songByGenre,
      success: true,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Hello World!`);
  console.log(`Server running on http://localhost:${port}`);
});
