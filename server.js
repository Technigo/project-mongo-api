import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"; 
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }); // connection. Using the method connect, passing on the url and then the parameter object
mongoose.Promise = Promise;

// const User = mongoose.model("User", {
//   name: String,
//   age: Number,
//   deceased: Boolean
// });

//model how your data set will look like
const Song = mongoose.model("Song", {
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
  "acousticness": Number,
  "speechiness": Number,
  "popularity": Number
});


//map out all data from our json into our db
if (process.env.RESET_DB) {
    const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
    const newSong = new Song (singleSong);
    newSong.save();
   })
    // await User.deleteMany();
    // const testUser = new User ({name: "Lisa", age: 53, deceased: false });
    // testUser.save();
  }
  resetDataBase();
}

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
  response.status(200).json({
    Hello: "Here you can see all my routes!",
    Routes: [
      { "/songs": "all the song data" },
      { "/titles": "a list of all titles" },
      
    ],
  });
});
app.get("/songs", async (req, res) => {
  const allTheSongs = await Song.find({}); //Song is the model variable
  res.status(200).json({
    success: true,
    body: allTheSongs
  });
});
app.get("/songs/id/:id", async (req, res) => {
  const allTheSongs = await Song.find({}); //Song is the model variable
  res.status(200).json({
    success: true,
    body: allTheSongs
  });
});


// get a single song by using findById
app.get("/songs/id/:id", async (req, res) => {
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
          message: "Could not find the song"
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    });
  }
  
});

// app.get("/songs/genre/:genre/danceability/:danceability", async (req, res) => {
  app.get("/songs/", async (req, res) => {

    const {genre, danceability} = req.query;
    const response = {
      success: true,
      body: {}
    }
    const matchAllRegex = new RegExp(".*");
    const genreQuery = genre ? genre : matchAllRegex;
    const danceabilityQuery = danceability ? danceability : /.*/;
  
    try {
      // if ( req.params.genre && req.params.danceability) {
        response.body = await Song.find({genre: genreQuery, danceability: danceabilityQuery}).limit(2).sort({energy: 1}).select({trackName: 1, artistName: 1})
        //.exec() => to explore if you're curious enough :P
      // } else if (req.params.genre && !req.params.danceability) {
      //   response.body = await Song.find({genre: req.params.genre});
      // } else if (!req.params.genre && req.params.danceability) {
      //   response.body = await Song.find({danceability: req.params.danceability});
      // }
      res.status(200).json({
        success: true,
        body: response
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        body: {
          message: error
        }
      });
    }
  
  });

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
