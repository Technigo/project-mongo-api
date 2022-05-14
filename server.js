import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Song = mongoose.model('Song', {
  id: Number,
  trackName: String, 
  artistName: String,
  genre: String,
  bpm: Number,
  energy: Number,
  danceability: Number,
  loudness: Number,
  liveness: Number, 
});

if(process.env.RESET_DB) {
const seedDatabase = async () => {
await Song.deleteMany();
topMusicData.forEach(singleSong => { 
  const newSong = new Song(singleSong);
  newSong.save();
})
}
seedDatabase();
}

const port = process.env.PORT || 8080;
const app = express();


app.use(cors());
app.use(express.json());

app.get('/songs/song', async (req, res) => {
  const {artistName, genre, energy} = req.query;
const singleSong = await Song.findOne({artistName: artistName, genre: genre, energy: energy});
res.send(singleSong);
});


// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Welcome to the Api for the top music!');
});

app.get('/songs/song/:artistName', async (req, res) => {
  //Will retrive only the first found song
  const artistName = await Song.findOne({ artistName: req.params.artistName });
  res.send(artistName);
});

app.get('/songs/genre/:genre', async (req, res) => {
  const singleGenre = await Song.find({ genre: req.params.genre });
  res.send(singleGenre);
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
