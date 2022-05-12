import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const User = mongoose.model("User", {
//value types, do not go to the database but allows us to create objects that do
name: String,
age: Number,
deceased: Boolean
})

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

  //the await delateMany means wait for the deletion to begin
  //and the populate the database anew
  //for every song put in new record in the database
  if(process.env.RESET_DB) {
    const seedDatabase = async () => {
      await Song.deleteMany();
      topMusicData.forEach( singleSong => {
        const newSong = new Song(singleSong);
        newSong.save();
      })
    }
    seedDatabase();
  }

app.use(cors());
app.use(express.json());

app.get("/songs/song/:artistName", async (req, res) => {
  //this will retrieve only the first song
  const singleSong = await Song.findOne({artistName: req.params.artistName})
  res.send(singleSong)
})

app.get("/songs/song/:artistName", async (req, res) => {
  //this will retrieve all artists songs
  const singleSong = await Song.find({artistName: req.params.artistName})
  res.send(singleSong)
})

//query path: http://localhost:8080/songs/song?artistName=Marshmello&trackName=Happier&energy=79
app.get("/songs/song", async (req, res) => {
  const {artistName, trackName, energy} = req.query
  const singleSong = await Song.find({artistName: artistName, 
    trackName: trackName, 
    energy: energy})
  res.send(singleSong)
})

app.get("/songs/song", async (req, res) => {
  const {artistName, trackName, energy} = req.query
  console.log("artistName", artistName)

  // const artistNameRegex = new RegExp(artistName, "i")
  // const trackNameRegex = new RegExp(trackName, "i")
  // const energyRegex = new RegExp(energy, "i")

  if (trackName) {
    const singleSong = await Song.find({artistName: artistName, trackName: trackName, energy: energy})
    res.send(singleSong)
  } else {
    const singleSong = await Song.find({artistName: artistName})
    res.send(singleSong)
  }
})

//http://localhost:8080/songs/song?artistName=Marshmello&trackName=Happier&energy=79 

// http://localhost:8080/songs/song?artistName=Marshmello&trackName=Happier -> one song from one artist
// http://localhost:8080/songs/song?trackName=Happier -> a song with a given name
// http://localhost:8080/songs/song?artistName=Marshmello -> all songs from given artist
 

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Hello world`)
  console.log(`Server running on http://localhost:${port}`);
});
