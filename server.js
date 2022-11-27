import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
import topMusicData from "./data/top-music.json";

dotenv.config()
const mongoUrl = process.env.MONGO_URL || `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PW}@cluster0.lmkbhok.mongodb.net/mongoAPI?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;
// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

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
if(process.env.RESET_DB){
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song (singleSong);
      newSong.save();
    })

  }
  resetDataBase();
}
const port = process.env.PORT || 8080;
const app = express();

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({
      error: `Service unavailable`
    })
  }
})
// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send({ "Routes": listEndpoints(app)});
});


/// All songs
app.get("/songs", async (req, res) => {
  const allSongs = await Song.find({});
    res.status(200).json({
    success: true,
    body: allSongs
    });
  });

  //sorts all songs based on popularity rating
  app.get("/songs/popularity", async (req, res) => {
    try {
      let popular = await Song.find()
      popular = popular.sort((a, b) => b.popularity - a.popularity)
      res.json({ length: popular.length, data: popular })
    } catch {
      res.status(400).json ({ error: `invalid request` })
    }
  })


///endpoint that returns only one single item
app.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const singleSongID = await Song.findById(req.params.id);
    
    

    if (singleSongID) {
      res.status(200).json({
        success: true,
        body: singleSongID
      });
    } else {
      res.status(404).json({
        success: false,
        status_code: 404,
        body: {
          message: `Could not find the song with provided ID ${id}`
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      status_code: 400,
      body: {
        message: `Invalid id ${id}`
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
  const matchAllNumeric = new RegExp("[0-9]");
  const genreQuery = genre ? genre : {$regex: matchAllRegex,  $options: 'i' };
  const danceabilityQuery = danceability ? danceability : {$gt: 0, $lt: 100};

  try {
    // if ( req.params.genre && req.params.danceability) {
      response.body = await Song.find({genre: genreQuery, danceability:danceabilityQuery}).limit(2).sort({energy: 1}).select({trackName: 1, artistName: 1})
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
//RESET_DB=true npm run dev
// Go here:
//https://github.com/coreybutler/nvm-windows/releases
// downlaod nvm-setup.exe
// run as admin
// open cmd as admin
// type nvm install v16.18.1
//https://mongoosejs.com/docs/queries

//https://regex101.com/

// /yourWodOfChoice/gm - regex to match yourWordOfChoice
// /.*/gm - regex to match every character in a string