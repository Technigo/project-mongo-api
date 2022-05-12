import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-real";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8090;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

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
  popularity: Number
})

if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Song.deleteMany()
    topMusicData.forEach( singleSong => {
      const newSong = new Song(singleSong);
      newSong.save()
    })
  }
  seedDatabase();
}

app.get("/songs/song", async (req,res) => {
  const {artistName, trackName} = req.query

  const myRegex = /.*/gm
  if (trackName) {
    const singleSong = await Song.find({artistName: artistName ? artistName: myRegex, trackName: trackName})
    res.send(singleSong);
  } else {
    const singleSong = await Song.find({artistName: artistName});
    res.send(singleSong);
  }

  // http://localhost:8090/songs/song?artistName=Marshmello&trackName=Happier - en låt från en artist FUNKAR
  // http://localhost:8090/songs/song?trackName=Happier - en låt med ett givet namn FUNKAR
  // http://localhost:8090/songs/song?artistName=Marshmello - alla låtar från en artist FUNKAR

})
// My routes
app.get("/", (req, res) => {
  res.send('Hello hannas world')
})

// Start the server
app.listen(port, () => {
  console.log(`Hello worlds!`)
  console.log(`Server running on http://localhost:${port}`);
});