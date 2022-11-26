import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
import theOffice from "./data/the-Office.json"
import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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
});


const Office = mongoose.model("Office", {
  parent_id: Number,
  parent: String,
  reply: String,
  character: String
});

// RESET_DB=true npm run dev

if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Song.deleteMany();
    topMusicData.forEach(singleSong => {
      const newSong = new Song(singleSong);
      newSong.save();
    })
    // await User.deleteMany();
    // const testUser = new User({name: "Daniel", age: 28, deceased: false});
    // testUser.save();
  }
  resetDataBase();
}

if(process.env.RESET_OFFICE) {
  const resetDataBase = async () => {
    await Office.deleteMany();
    theOffice.forEach(singleQuote => {
      const newQuote = new Office(singleQuote);
      newQuote.save();
    })
    // await User.deleteMany();
    // const testUser = new User({name: "Daniel", age: 28, deceased: false});
    // testUser.save();
  }
  resetDataBase();
}


const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send([
    {"/": "Start page"},
    {"/songs/all": "Displays all songs"}
  ]);
});

 app.get("/songs/:all", async (req, res) => {
    // const allTheSongs = await Song.find({}); all songs 
  // --- OBS! försök alltid att göra try & catch, för att skydda -----!
    try {
      const allTheSongs = await Song.find({});
      if (allTheSongs) {
      res.status(200).json({
        success: true,
        body: allTheSongs
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find songs"
        }
    })
  }
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: "invalid input"
      }
    })
  }
  }) 

  app.get("/office", async (req, res) => {
    // const allTheSongs = await Song.find({}); all songs 
  // --- OBS! försök alltid att göra try & catch, för att skydda -----!
    try {
      const allQuotes = await Office.find({});
      if (allQuotes) {
      res.status(200).json({
        success: true,
        body: allQuotes
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find quotes"
        }
    })
  }
  } catch (error) {
    res.status(400).json({
      success: false,
      body: {
        message: "invalid input"
      }
    })
  }
  }) 

app.get("/songs/id/:id", async (req, res) => {
/*   const allTheSongs = await Song.find({}); all songs */
// --- OBS! försök alltid att göra try & catch, för att skydda -----!
  try {
    const singleSong = await Song.findById(req.params.id); // one song leta genom ID
    if (singleSong) {
    res.status(200).json({
      success: true,
      body: singleSong
    })
  } else {
    res.status(404).json({
      success: false,
      body: {
        message: "Could not find song"
      }
  })
}
} catch (error) {
  res.status(400).json({
    success: false,
    body: {
      message: "Invalid id"
    }
  })
}
})

app.get("/songs/", async (req, res) => {

  const {genre, danceability} = req.query;
  const response = {
    success: true,
    body: {}
  }
 /*  const matchAllRegex = new RegExp(".*"); ***** är ett sätt att göra det. annars senenadnför
  const genreQuery = genre ? genre : matchAllRegex; */
  const genreQuery = genre ? genre : /.*/;
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

//användbara sidor: https://regex101.com/
// 