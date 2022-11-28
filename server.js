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
  valence: Number,
  length: Number,
  acousticness: Number,
  speechiness: Number,
  popularity: Number
});


if (process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
  }
  resetDataBase();
}

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Routes defined here
app.get("/", (req, res) => {
 res.json({ 
  Message: "Welcome to Top 50 at Spotify! Here you can look at all songs or search for specific song, artist, genre, energy and danceability by typing in the following strings after the adress in the browser:",
  routes: {
    "/songs": "look for all songs availible here",
    "/songs?trackName=*the name of the track*": "search for a specific track",
    "/songs?artistName=*the artist's name*" : "search for songs by a specific artist",
    "/songs?genre=*name of the genre*": "search for a specific genre", 
    "/songs?energy=*number of enery*": "search for a energy level",
    "/Songs?danceability=*number of danceability*": "search for danceability level",
    "/songs/:id": "search for a song by its unique id"
    }
  });
});
app.get('/songs', async (req, res) => {
  const songs = await Song.find()
  res.json(songs)
})

app.get('/songs/', async (req, res) => {
  const {trackName, artistName, genre, energy, danceability} = req.query;
  const response = {
    success: true,
    body: {}
  }
  const matchAllRegex = new RegExp(".*");
  const trackQuery = trackName ? trackName : {$regex: matchAllRegex,  $options: 'i' }
  const artistQuery = artistName ? artistName : {$regex: matchAllRegex,  $options: 'i' }
  const genreQuery = genre ? genre : {$regex: matchAllRegex, $options: 'i'}
  const energyQuery = energy ? energy : {$gt: 0, $lt: 100};
  const danceabilityQuery = danceability ? danceability : {$gt: 0, $lt: 100};

  try {
    response.body = await Song.find({trackName:trackQuery, artistName:artistQuery, genre:genreQuery, energy:energyQuery, danceability:danceabilityQuery})
   if(response.body.length > 1) {  
    res.status(200).json({
      success: true,
      body: response
    });
  } else if(response.body.length === 0) {
    res.status(404).json({
      success: false,
      body: {
        message: 'Sorry, we could not find your query'
      }
    });
  }
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: error
      }
    });
  }
});

// Route to find spec song after unique ID
app.get('/songs/:id', async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id);
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: 'Could not find song'
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: 'Invalid id'
      }
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});