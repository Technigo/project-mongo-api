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
  popularity: Number
})
// Function that makes sure that the datebase does not update itself with the same entries 
// every time the server is re-started. "Await" is used to deal with promises (alike .then). 
if (process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany()
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong)
      newSong.save()
    })
  }
  resetDataBase()
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send({
    Message: "Hello and welcome your Spotify database! Look for songs at these endpoints:",
    Routes: [
      {
        "/songs": "See all songs in database",
        "/songs/song/:id": "Show a single song based on its id",
        "/songs?genre=*Name of genre*": "Show songs in a specific genre", 
        "/songs/search?artist=*Name of artist*": "Search for artist"
      },
    ]});
});

app.get("/test", (req, res) => {
  res.json({topMusicData: topMusicData})

});

// Lists all the songs and data
app.get("/songs", (req, res) => {
  const { artist, genre } = req.query
  let songs = topMusicData

  if (artist) {
    songs = songs.filter((songsByArtist) =>
    songsByArtist.artistName.toLowerCase()
    .includes(artist.toLowerCase()))
  }

  if (genre) {
  songs = songs.filter((type) => 
  type.genre.toLowerCase()
  .includes(genre.toLowerCase())
  )
  }
  res.status(200).json(topMusicData)
})

// Finding a single song based on it's ID, example path: /songs/1
app.get("/songs/song/:id", (req, res) => {
  const singleSong = topMusicData.find((song) => {
    return song.id === +req.params.id
  })
 if (singleSong) {
  res.status(200).json(singleSong)
 } else {
  res.status(404).send({
    message: "Song not found",
    error: 404
  })
 }
}) 

// Search artist, example path: /songs/search?artist=shawn (or shawn+mendes)
app.get("/songs/search", (req, res) => {
  const artist = req.query.artist;
  const getArtist = topMusicData.filter((item) => item.artistName.toLowerCase().includes(artist.toLowerCase())) 

  if (getArtist.length === 0) {
    res.status(404).send({
    message: "Sorry, could not find any songs by that artist name",
    error: 404})
  };

  res.status(200).json(getArtist)
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
