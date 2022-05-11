import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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

//If the database is resetting this will happen
if (process.env.RESET_DB) {
  const SeedDatabase = async () => {
    await Song.deleteMany();
    topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong);
      newSong.save();
    });
  };
  SeedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8090;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/artists", async (req, res) => {
  const artists = await Song.find();
  res.json(artists);
});

app.get("/tracks", async (req, res) => {
  const tracks = await Song.find();
  res.json(tracks);
});

// app.get("/songs/song", async (req, res) => {
// //   //this will retrive only the first found song
// //   const { artistName, trackName, energy } = req.query;

// //   const artistNameRegex = new RegExp(artistName, "i");
// //   const trackNameRegex = new RegExp(trackName, "i");
// //   const energyRegex = new RegExp(energy, "i");

// //   const singleSong = await Song.find({
// //     artistName: artistName,
// //     trackName: trackName,
// //     energy: energy,
// //   });
// //   res.send(singleSong);
// // });

app.get("/songs/song/:artistName", async (req, res) => {
  //this will retrive only the first found song
  const singleSong = await Song.findOne({ artistName: req.params.artistName });
  res.send(singleSong);
});

app.get("/songs/genre/:genre", async (req, res) => {
  //this will retrive only the first found song
  const singleGenre = await Song.find({ genre: req.params.genre });
  res.send(singleGenre);
});

//  try {
//    const artist = await Song.findById(req.params.id);
//  if (artist) {
//   res.json(artist)
// } else {
// }
//   res.status(404).json({error: 'User not find!'})
// } catch (err) {
//   res.status(400).json({error: 'Invalid user Id'})
// }

// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
