import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

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
    popularity: Number
});

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
  const singleSong = await Song.findOne({artistName: req.params.artistName});
  res.send(singleSong);
})



app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
