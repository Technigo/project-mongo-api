import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import topMusicData from "./data/top-music.json";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start


const Song = mongoose.model ("Song", {
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

//if(process.env.RESET_DB) --> cleaning out the database. Can be used instead of true, and then run it in the terminal
if(true) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
    const newSong = new Song(singleSong)
    newSong.save()
    })
  }
  resetDataBase()
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

app.use((req, res, next)=> {
if (mongoose.connection.readyState===1) {
  next()
} else {
  res.status(503).json({error: "Service unavailable"})
}
})

// Start defining your routes here

app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// ROUTE 1: Get a list of all songs
app.get("/songs", async (req, res) => {
  const allTheSongs = await Song.find({}).limit(10).sort({danceability: -1})
  res.status(200).json({
    success: true,
    body: allTheSongs
  });
});


//ROUTE 2: Filter on a specific Artist
app.get("/songs/artist/:artistName", async (req, res) => {
  try {
    const Artist = await Song.find({artistName: req.params.artistName})
    if (Artist) {
      res.status(200).json({
        success: true,
        body: Artist
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find that Artist"
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


// ROUTE 3: Filter on a specific genre and get the top 5 in popularity
app.get("/songs/:genre", async (req, res) => {
  try {
    const Genre = await Song.find({genre: req.params.genre}).limit(5).sort({popularity: -1});
    if (Genre) {
      res.status(200).json({
        success: true,
        body: Genre
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find that genre"
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

// ROUTE 4: Filter on a specific song with ID-number
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



//ROUTE 5: Get names of the tracks with a selected bpm
app.get("/songs/bpm/:bpm", async (req, res) => {
  try {
    const Bpm = await Song.find({bpm: req.params.bpm}).select({trackName: 1})
    if (Bpm) {
      res.status(200).json({
        success: true,
        body: Bpm
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find that bpm"
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

  // ROUTE FROM LIVE SESSION, NOT USING: 

app.get("/songs/", async (req, res) => {
  const {genre, danceability} = req.params;
  const response = {
    sucess: true, 
    body: {}
  }

  const matchAllRegex = new RegExp(".*");
  const genreQuery = genre ? genre : matchAllRegex;
  const danceabilityQuery = danceability ? danceability : /.*/;
  
  try {
    response.body = await Song.find({genre: genreQuery, danceability: danceabilityQuery }).limit(3).sort({energy: -1}).select({trackName: 1, artistName: 1})
    // to explore more: .exec()

    res.status(200).json({
    success: true,
    body: allMatchingSongs
      })

    } catch (error) {
      res.status(400).json({
        success: false,
        body: {
          message: "Invalid id"
        }
      })
    }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// https://regex101.com/
 // https://mongoosejs.com/docs/queries