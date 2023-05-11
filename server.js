import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import netflixData from "./data/netflix-titles.json";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";

// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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

const Title = mongoose.model("Title", {
  show_id: Number,
  title: String,
  director: String, 
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String
})

if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Title.deleteMany();
   netflixData.forEach(singleTitle => {
      const newTitle = new Title(singleTitle)
      newTitle.save()
    })

  }
  resetDataBase()
}

// Start defining your routes here
app.get("/", (req, res) => {
  const netflixGuide = {
    Routes: [
      {
        '/movies': 'Get all movies',
        '/movies/:title': 'All movietitles',
        '/cast/:cast': 'Get movie by castmembers',
        '/country/:country': 'Get movie by country',
        '/director/:director': 'Get movie by director'
      }
    ]
  }
  res.json({responseMessage: netflixGuide});
});

app.get("/movies", async (req, res) => {
  const allTheMovies = await movies.find()
  res.status(200).json ({
    success: true,
    body: allTheMovies
  })
});

app.get("/movies/:titles", async (req, res) => {
  try {
    const SingleTitle = await Title.findById(req.params.id)
    if (SingleTitle) {
      res.status(200).json({
        success: true,
        body: SingleTitle
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the title"
        }
      })
    }
  } catch(error) {
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
