import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import netflixData from "./data/netflix-titles.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Title = mongoose.model("Title", {
  show_id: Number,
  title: String,
  director:String, 
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String,
})

if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Title.deleteMany();
    netflixData.forEach(singleItem => {
      const newTitle = new Title(singleItem);
      newTitle.save();
    })
  }
  seedDatabase();
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
app.get('/', (req, res) => {
  res.json({
    responseMessage: "Netflix titles API ",
    endpoints: 
      {
        "/titles": "lists all the tv-shows & movies on Netflix",
          "/titles/movies": "lists all the tv-shows & movies on Netflix",
            "/titles/movies/:id": "lists all the tv-shows & movies on Netflix",
          "/titles/tvshows": "lists all the tv-shows & movies on Netflix",
          "/titles/tvshows/:id": "lists all the tv-shows & movies on Netflix",
          "/titles/latest": "lists all latest titles in a descending chronological order",
            "/titles/latest?limit=<number>": "Same as above but with the query so you can limit the result to the latest 10 shows for example",

      }});
});


// list all titles
app.get("/titles", async (req, res) => {
  const allTheTitles = await Title.find({});
  res.status(200).json({
    success: true,
    body: allTheTitles
  });
});

// list all movies
app.get("/titles/movies", async (req, res) => {
  const allTheMovies = await Title.find({ type: 'Movie' });
  res.status(200).json({
    success: true,
    body: allTheMovies
  });
});

// list a specific movie
app.get("/titles/movies/:id", async (req, res) => {
  try {
const singleMovie= await Title.findById(req.params.id);
const allTheMovies = await Title.find({ type: 'Movie' });
  if (singleMovie && allTheMovies) {
    res.status(200).json({
      success: true,
      body: singleMovie
    });
  } else {
    res.status(404).json({
      success: false,
      body: {
        message: "Item not found"
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
})

// list all tv-shows
app.get("/titles/tvshows", async (req, res) => {
  const allTheTvShows = await Title.find({ type: 'TV Show' });
  res.status(200).json({
    success: true,
    body: allTheTvShows
  });
});

// list a specific tv-show
app.get("/titles/tvshows/:id", async (req, res) => {
    try {
  const singleTvShow = await Title.findById(req.params.id);
  const allTheTvShows = await Title.find({ type: 'TV Show' });
    if (singleTvShow && allTheTvShows) {
      res.status(200).json({
        success: true,
        body: singleTvShow
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Item not found"
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
})


// see the x latest titles
//e.g. http://localhost:8080/titles/latest?limit=10
app.get("/titles/latest", async (req, res) => {
  const {limit} = req.query
  const latestTitles = await Title.find({}).limit(limit).sort({release_year: -1}).select({title: 1, release_year: 1, type: 1})
  res.status(200).json({
    success: true,
    body: latestTitles
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
