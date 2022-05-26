import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.Promise = Promise;

// Port for running app
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//Invoke the upcoming lines by next function, if the database is not connected it will give an error message
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({
      error: "Service unavailable"
    })
  }

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
});

//This deletes the database and awaits until the deletion is done and seeds it with new songs from the json file topMusicData- (resets)

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
  }
  seedDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  const routeInfo = {
    Welcome: "Welcome to this API for songs",
    Routes: [{
      "/songs": "See all songs in the database",
      "/songs/songs/:artistName": "See all songs by a specific artist",
      "/songs/:id" : "See song with a specifik id",
      "/songs/genre/:genre": "See all songs of a specific genre such as pop or reggaeton",
      "songs/song?trackName=": "See the song with a specific trackname",
      "songs/song?trackName=&artistName=": "See the song with a specific trackname and artistname"

    }, ],
  }
  res.send(routeInfo)
});

app.get("/songs", async (req, res) => {
  const allSongs = await Song.find()
  res.json(allSongs)
})

 
 //this will retrieve all songs by an artist
app.get("/songs/songs/:artistName", async (req, res) => {
 
  const artistsSongs = await Song.find({
    artistName: req.params.artistName
  });
  res.send(artistsSongs);
});


//this gets you the songs in a special genre like pop or reggeaton
app.get("/songs/genre/:genre", async (req, res) => {
  try {
    const singleGenre = await Song.find({
      genre: req.params.genre
    });
    if (singleGenre) {
      res.json(singleGenre)
    } else {
      res.status(404).json({
        error: "Sorry, can not find the genre you were looking for"
      })
    }
  } catch (err) {
    res.status(400).json({
      error: "Oops! That input is invalid for a genre"
    })
  }
});

//this will retrieve a specific artist and/or the track: example: http://localhost:8080/songs/song?artistName=Marshmello&trackName=Happier

app.get("/songs/song/", async (req, res) => {
  
  const {
    artistName,
    trackName
  } = req.query

    if (trackName && artistName) {
    const queryTrackArtist = await Song.find({
      trackName: trackName,
      artistName: artistName
    });
    res.send(queryTrackArtist);
  } else if (trackName) {
    const queryTrack = await Song.find({
      trackName: trackName
    });
    res.send(queryTrack);
  } else if (artistName) {
    const queryArtist = await Song.find({
      artistName: artistName
    });
    res.send(queryArtist);
  }
});

//this will retrieve the specific song matching the id
app.get("/songs/:id", async (req, res) => {
 
  try {
    const songId = parseInt(req.params.id);
    console.log(songId);

    const songById = await Song.findOne({id:songId});
    console.dir(songById);

    if (songById) {
      res.json(songById);
    } else {
      res.status(404).json({
        error: "Can not find song with the id"
      })
    }
  } catch (err) {
    console.dir(err);
    res.status(400).json({
      error: "Input invalid for id"
    })
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Showing in terminal: Server running on http://localhost:${port}`);
});