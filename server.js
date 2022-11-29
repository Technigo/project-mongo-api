import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";
// import { resolveShowConfigPath } from "@babel/core/lib/config/files";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// model of how something will look
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

if(process.env.RESET_DB) {
  const seedDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
  }
  seedDataBase();
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send({
    Message: "Browse in top music data titles, below you find the different endpoints",
    Routes: [{
      "/songs": "All songs in the database",
      "/songs/genre/:genre": "get songs in the same genre, exampel: pop ",
      "/trackname/:trackname": "Gives you a specific song, exampel: bad guy",
      "/artist/:artistName": "All songs from one artist, exampel: Post Malone",
      "/bpm/:bpm": " all songes in a specific BPM, exampel: 75",



    }]
  });
});

// All songs 

app.get("/songs", async(req,res) => {
  await Song.find().then(songs => {
    res.json(songs)
  })
})


// return a song name by ID 
app.get("songs/id/:id", async(req, res) => {
  try{
    const songByID = await Song.findById(req.params.id);
    if(songByID) {
      res.status(200).json({
        data: songByID,
        success: true, 
      })
    } else {
      res.status(404).json({
        error: ' Song not found, try again ',
        success: false, 
      })
    }
  } catch(err) {
    res.status(400).json({ error: "invalied songname" })
  }
  })

// Return a specific genere 
app.get("/songs/genre/:genre", async (req, res) => {
  try{
    const singleGenre = await Song.find({ genre: new RegExp(req.params.genre,"i")  });
    if(singleGenre){
      res.status(200).json({
      data: singleGenre,
      success: true, 
    })
    } else {
      res.status(404).json({
        error: ' Song not found, try again ',
        success: false, 
      })
    }
  }
  catch(err) {
    res.status(400).json({ error: "invalied songname" })
  } 
})

// Single song by name 
app.get("/trackname/:trackname", async(req,res) => {
  try{
    const songsTrackName = await Song.findOne({ trackName: new RegExp(req.params.trackname ,"i") })
    if(songsTrackName) {
      res.status(200).json({
        data: songsTrackName,
        success: true, 
      }) 
    } else {
      res.status(404).json({
        error: ' Track name not found ',
        success: false, 
      })
    }
  } catch(err) {
    res.status(400).json({ error: "invalied Track name" })
  }

})

// all songs by a specific artist - only get a blank on ed sheeran , why ? 
app.get("/artist/:artistName", async(req, res) => {
  try{
    const artistSongs = await Song.find({ artistName: new RegExp(req.params.artistName,"i")  })
    if(artistSongs){
      res.status(200).json({
        data: artistSongs,
        success: true, 
      }) 
    }else {
      res.status(404).json({
        error: ' artist not found ',
        success: false, 
      })
    }
  }catch(err) {
    res.status(400).json({ error: "invalied Artistname" })
  }
})

// get by BPM but want to show a range, how to do it ? 
app.get("/bpm/:bpm", async(req,res) => {
  try{
    const songsBpm= await Song.find({ bpm: req.params.bpm});
    if(songsBpm) {
      res.status(200).json({
      data: songsBpm,
      success: true, 
    }) 
  } else{
    res.status(404).json({
      error: ' Song not found, try again ',
      success: false, 
    })
  }
  }catch(err) {
    res.status(400).json({ error: "invalied BPM number" })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
