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

const Film = mongoose.model("Film", {
  id: Number,
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
});

if(true) {
  const resetDataBase = async () => {
    await Film.deleteMany();
    netflixData.forEach(singleFilm => {
      const newFilm = new Film(singleFilm);
      newFilm.save();
    })
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
  res.send({
    "Netflix API": "You can serch for movie/show, title or ID",
    Routes: [
      {
        "/all": "Get all the info inside the API",
        "/all/id/:id": "Filter by ID all the data",
        "/data/": "You can search for title, tpye or country(/data?title,country,type={info})"
      },
    ],
  })
});
app.get("/all", async (req, res) => {
  const allTheData = await Film.find({})
  res.status(200).json({
    success: true,
    body: allTheData
  });
});

app.get("/all/id/:id", async (req, res) => {
  try {
    const singleFilm = await Film.findById(req.params.id)
    if (singleFilm) {
      res.status(200).json({
        success: true,
        body: singleFilm
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the Film"
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

app.get("/data/", async (req, res) => {
  const {title, country, type} = req.query;

  const titleQuery = title ? title : /.*/gm;
  const countryQuery = country ? country : /.*/gm;
  const typeQuery = type ? type : /.*/gm;

  try {
    const response = await Film.find({title: titleQuery, country: countryQuery, type: typeQuery});
    res.status(200).json({
      success: true,
      films: response
    })
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: "Invalid id-request"
    })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
