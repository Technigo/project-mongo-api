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


const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise;

/* STARTER CODE
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;
*/

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
  res.send("Getting some songs!");
});


const { Schema } = mongoose;
//const userSchema = new Schema({
//  name: String,
//  age: Number,
//  active: Boolean
// });

//const User = mongoose.model("User", userSchema);

const songSchema = new Schema({
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

const Song = mongoose.model("Song", songSchema);

if (process.env.RESET_DB) {
  console.log("Resetting database");
  const resetDatabase = async () => {
    await Song.deleteMany();     //without the specific confition it would delete everything, just as find() without any parameters would return everything
    topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong);
      newSong.save()
    })
  }
  resetDatabase();
}


app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findById(req.params.id);
    if (singleSong) {
      res.status(200).json({
        success: true,
        body: singleSong
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Song not found"
        }
      })
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      body: {
        message: err
      }
    })
  }
})


app.get("/songs", async (req, res) => {
  const { genre, danceability, artistName } = req.query;
  const response = {
    success: true,
    body: {}
  }

    
   // If we only wanted to find genre we could use Song.find(genre: genre), and /songs?genre=pop. With the regex we also get all songs that include pop but isn't exclusively pop
  //RegEx only used for strings. "i" to make it case insensitive
  const genreRegex = new RegExp(genre, "i") //this regex looks for everything that includes the genre that was provided by the user
  const danceabilityQuery = { $gte: danceability ? Number(danceability) : 0 }
  const artistNameRegex = new RegExp(artistName, "i");

  //To also display songs with the artist name only in the track name the featured/with artists), we are here cleaning up the artist name from special characters. To make sure we only call replace when there is an artist name (to avoid errors), we are using a ternary operator
  const cleanedUpArtistName = artistName ? artistName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') : "";
  //in the dataset the artist names in tracknames are always in parantheses, so here we specify that we are looking only for the value within parantheses
  const artistNameInTrackNameRegex = new RegExp(`\\((.*?)${cleanedUpArtistName}(.*?)\\)`, "i");

  try {
  const searchResultFromDB = await Song.find({
    genre: genreRegex,
    danceability: danceabilityQuery,
    // $or is a mongoose operator used here to find the artist name value in either artistName or trackName
    $or: [
      { artistName: artistNameRegex },
      { trackName: artistNameInTrackNameRegex }
    ]
  })

    if (searchResultFromDB) {
      response.body = searchResultFromDB
      res.status(200).json(response)
    } else {
      response.success = false,
      res.status(500).json({
      })
    }
  } catch (err) {
    response.success = false,
    response.error = err.message;
    res.status(500).json(response)
  }
})



// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
