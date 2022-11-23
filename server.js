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
// every time the server is re-started. "Await" is used to deal with promises (alike .then). 
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

//Just a test to see all data
app.get("/test", (req, res) => {
  res.json({topMusicData: topMusicData})
});

// Lists the endpoints for all routers that is created in this file. 
app.get("/endpoints", (req, res) => {
  res.send(listEndpoints(app))
})

// Start defining your routes here
app.get("/", (req, res) => {
  res.send({
    Message: "Hello and welcome your Spotify database! Look for songs at these routes:",
    Routes: [
      {
        "/songs": "See all songs in database",
        "/songs/artist/*Name of artist*": "Show songs from a specific artist",
        "/songs/genre/*Name of genre": "Shows songs of a specific genre",
       //"/songs?track=*Name of track*": "Show tracks based on trackname",
        //"/songs?dancing=true": "Show songs great for dancing 💃",
        //"/songs?happy=true": "Show happy songs ✨", 
        //"/songs/search?artist=*Name of artist*": "Search for artist",
        "/songs/song/:id": "Show a single song based on its id",
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

// Return a specific genere 
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

// Finding a single song based on it's ID, example path: /songs/song/1
app.get('/songs/song/:id', async (req, res) => {
  try {
    const singleSong = await Song.findOne({ id: req.params.id });

    if (singleSong) {
      res.json(singleSong);
    } else {
      // Error when the id format is valid, but still no book is found with that id
      res.status(404).json("Sorry, no songs found with that ID");
    }
  } catch (err) {
    // error when the id format is wrong
    res.status(400).json({ error: "Invalid Song ID, double check id value" });
  }
});

// Search artist, example path: /songs/search?artist=shawn (or shawn+mendes)
app.get("/songs/search", (req, res) => {
  const artist = req.query.artist;
  const getArtist = topMusicData.filter((item) => item.artistName.toLowerCase().includes(artist.toLowerCase())) 

  if (getArtist.length === 0) {
    res.status(404).send({
    message: "Could not find any songs by that artist name",
    error: 404,
    success: false
  })
  };

  res.status(200).json({
    data: getArtist,
    success:true })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
