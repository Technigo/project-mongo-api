import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
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
// every time the server is re-started. "Await" is used to deal with promises (like .then). 
if (process.env.RESET_DB) {
  const resetDataBase = async () => {
     // Starts by deleting any pre-existing Book objects to prevent duplicates
    await Song.deleteMany()
     // Creates a new Book instance for each book in the booksData
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
const port = process.env.PORT || 8000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Lists the endpoints for all routers that is created in this file. 
app.get("/endpoints", (req, res) => {
  res.send(listEndpoints(app))
})

// ROUTES
app.get("/", (req, res) => {
  res.send({
    Message: "Hello and welcome your Spotify database! Look for songs at these routes:",
    Routes: [
      {
        "/songs": "See all songs in database",
        "/songs/artist/*Name of artist*": "Show songs from a specific artist",
        "/songs/genre/*Name of genre": "Shows songs of a specific genre",
        "/songs/happy": "Show happy songs ✨",
        "/songs/dancing": "Show songs great for dancing 💃",
        "/songs/happydancing": "Show happy songs great for dancing ⭐",
        "/songs/id/*ID*": "Show a single song based on its id",
      },
    ]});
});

// Lists all songs  
app.get("/songs", async(req,res) => {

   Song.find().then(songs => {
     res.json(songs)
   })
})

// Route to get songs by a specific artist
app.get('/songs/artist/:artistName', async (req, res) => {
  const paramsArtistName = req.params.artistName;
  // Added a regex so that it will search non-case-sensitive and if the name is included
  // in the authors string
  const artist = await Song.find({ artistName: { $regex : new RegExp(paramsArtistName, "i") } });
   
  if (artist.length === 0) {
    res.status(404).json("Sorry, could not find any songs by that artist name");
  }

  res.json(artist);
});

// Route to a specific genere 
app.get("/songs/genre/:genre", async (req, res) => {
  try{
    const singleGenre = await Song.find({ genre: req.params.genre });
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

// Route to a single song based on it's ID
app.get('/songs/id/:_id', async (req, res) => {
  try {
    const singleSong = await Song.findOne({ _id: req.params._id });

    if (singleSong) {
      res.json(singleSong);
    } else {
      // Error when the id format is valid, but still no book is found with that id
      res.status(404).json("Sorry, no songs found with that ID");
    }
  } catch (err) {
    // error when the id format is wrong
    res.status(400).json({ error: "Invalid Song ID, double check value" });
  }
});


// Route to get songs with a high valence value = happy songs!
// $gte is MongoDB's comparison query operator for greater or equal to
app.get('/songs/happy', async (req, res) => {
  const happySongs = await Song.find({ valence: { $gte: 80 } });

  res.json(happySongs);
});

// Route to get songs with a high danceability value
app.get('/songs/dancing', async (req, res) => {
  const danceSongs = await Song.find({ danceability: { $gte: 80 } });

  res.json(danceSongs);
});

// Route to get songs with a high danceability and valence value = happy dance songs!
app.get('/songs/happydancing', async (req, res) => {
  const happyDanceSongs = await Song.find({ danceability: { $gte: 75 }, valence: { $gte: 75 } });

  res.json(happyDanceSongs);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
