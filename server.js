import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

// const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;
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
})

//Reset database
const Song = mongoose.model("Song", songSchema);

if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Song.deleteMany();
    topMusicData.forEach((singleSong) => {
      const newSong = new Song(singleSong);
      newSong.save();
    });
  }
  resetDatabase();
  // call a function while declaring it - extra curriculum 
}

// Start defining your routes here
app.get("/", (req, res) => {

  res.send({
    Message: "Browse in top music data titles, below you find the different endpoints",
    Routes: [{
      "/songs": "This engpoint returns a list of top music titles",
      "/songs/id/:id" : "This engpoint returns a specific music item by music id. exampel: /songs/id/2",
      "/songs/artist/:artistname" :"This endpoint returns a list of the music titles by a specific artist name, exampel: Lady Gaga",
      "/songs/genre&danceability": "This endpoint returns a list of the top music titles in a specific genre, exampel: /songs?genre=pop&danceability=76",
      
    }]
  });

});


//Route1 : all songs from database
app.get("/songs", (request, response) => {
  const songes = topMusicData;
  if (songes) {
    response.status(200).json({
      success: true,
      message: "OK",
      body: {
        topMusicData: songes
      }
    })
  } else {
    response.status(500).json({
      success: false,
      message: "songes not found",
      body: {}
    })
  }
})
// test pagination 10 song item on each page, total 5 pages.
// app.get("/songs", (request, response) => {
//   const { limit = 10, page = 1 } = request.query;
//   const startIndex = (page - 1) * limit;
//   const endIndex = page * limit;
//   const songes = topMusicData.slice(startIndex, endIndex);
//   if (songes.length > 0) {
//     response.status(200).json({
//       success: true,
//       message: "OK",
//       body: {
//         topMusicData: songes
//       },
//       pagination: {
//         currentPage: parseInt(page, 10),
//         totalPages: Math.ceil(topMusicData.length / limit),
//         totalItems: topMusicData.length,
//         itemsPerPage: limit,
//       }
//     })
//   } else {
//     response.status(404).json({
//       success: false,
//       message: "No songs found",
//       body: {}
//     })
//   }
// })

//Route2 : get one song item from topMusicData by input song's ID.
app.get("/songs/id/:id", async (req, res) => {
  try {
    const singleSong = await Song.findOne({id: req.params.id});
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
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

//Route 3: get song item by artist name
app.get("/songs/artist/:artistname", async(req,res) => {
  try{
    const artistName = await Song.findOne({artistName: new RegExp(req.params.artistname,"i")}); 
    if(artistName){
      res.status(200).json({
        success:true,
        body:artistName
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Artist not found"
        }
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
})

// Route4 : get song item by grenre and danceability.
app.get("/songs", async (req, res) => {
  const {genre, danceability } = req.query;
  const response = {
    success: true,
    body:{}
  }
  // Regex only for strings
  const genreRegex = new RegExp(genre);
  const danceabilityQuery =  { $gt: danceability ? danceability : 0 }

  try {
    const searchResultFromDB = await Song.find({genre: genreRegex, danceability: danceabilityQuery})
    if (searchResultFromDB) {
      response.body = searchResultFromDB
      res.status(200).json(response)
    } else {
      response.success = false,
      res.status(500).json(response)
    }
  } catch(e) {
    response.success = false,
    res.status(500).json(response)
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
