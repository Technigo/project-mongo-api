import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import getEndpoints from "express-list-endpoints";
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

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

/*const User = mongoose.model("User",{
  name: String,
  age: Number,
  deceased: Boolean
})*/

const Song = mongoose.model("Song",{
  "id": Number,
    "trackName": String,
    "artistName": String,
    "genre": String,
    "bpm": Number,
    "energy": Number,
    "danceability": Number,
    "loudness": Number,
    "liveness": Number,
    "valence": Number,
    "length": Number,
    "acousticness":Number,
    "speechiness": Number,
    "popularity": Number

})


if(process.env.RESET_DB) {
  const seedDatabase=async () => {
    await Song.deleteMany()
    topMusicData.forEach(singleSong=>{
      const newSong=new Song(singleSong)
      newSong.save()
    })
  }
  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(getEndpoints(app));
});

app.get("/songs", async (req,res)=>{
  Song.find().then(songs=>{
    res.send(songs)
  })
})

app.get('/songs/genre/:genre', async (req, res) => {
  const singleGenre = await Song.find({ genre: req.params.genre })
  res.send(singleGenre)
}) 

app.get("/songs/song", async (req, res)=>{
 const {artistName, trackName}=req.query

//const artistNameRegex= new RegExp(artistName, "i");
//const trackNameRegex= new RegExp(trackName, "i");
//const energyRegex= new RegExp(energy, "i");


if (trackName){const singleSong= await Song.find({
  artistName: artistName,
  trackName: trackName
})
  res.send(singleSong)
}

else { const singleSong= await Song.find({
  artistName: artistName,
})
res.send(singleSong)}
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

