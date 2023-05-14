import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
import Data from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const { Schema } = mongoose;
const dataSchema = new Schema ({
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

const Title = mongoose.model('Title', dataSchema)

if (process.env.RESET_DB) {
  const resetDatabase = async () => {
    await Title.deleteMany();
    Data.forEach((title) => {
      const newTitle = new Title(title)
      newTitle.save();
    })
  }
  resetDatabase();

}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
  res.json(listEndpoints(app));
});

app.get("/titles/all/", async (req, res) => {
  // in case you just want all titles :)
  try { 
  const titles = await Title.find();
  if (titles) {
    res.status(200).json({
      success: true,
      body: titles 
    }) 
  } else { 
    res.status(404).json({
      success: false,
      body: { message: "Titles not found" },
    }) 
  } 
} 
  catch(err) {res.status(500).json({
    success: false,
    body: { message: err }
  });}
})


app.get("/titles/", async (req, res) => {
  const page = req.query.page || 0;
  const perPage = req.query.perPage || 10;
  try { 
  const titles = await Title.find().limit(perPage).skip(page * perPage);
  if (titles) {
    res.status(200).json({
      success: true,
      body: titles 
    }) 
  } else { 
    res.status(404).json({
      success: false,
      body: { message: "Titles not found" },
    }) 
  } 
} 
  catch(err) {res.status(500).json({
    success: false,
    body: { message: err }
  });}
})


app.get("/title/id/:id", async(req, res) => {
  try {
    const singleTitle = await Title.findById(req.params.id)
    if (singleTitle) {
      res.status(200).json({
        success: true,
        body: singleTitle
      })
    } else {
      res.status(404).json({
        success: false,
        body: { message: "No such title" }
    })
  } 
}
  catch(err) {
    res.status(500).json({
      success: false,
      body: { message: err }
    })
  }
})

app.get("/title/random", async (req, res) => {
  // https://www.mongodb.com/docs/upcoming/reference/operator/aggregation/sample/#pipe._S_sample
  const randomTitle = await Title.aggregate([{$sample:{size: 1}}])
  try {
    if(randomTitle) {
      res.status(200).json({success: true, body: randomTitle});
    } else {
      res.status(404).json({success: false, body: {message: "Random title not found"}})
    }
  }
  catch(err) { 
    res.status(500).json({ success: false, body: "Error: " + err });
  }
})

app.get("/movies", async (req, res) => {
  const movieTitles = await Title.find({ type: "Movie"})
  try {
    if(movieTitles) {
      res.status(200).json({success: true, body: movieTitles});
    } else {
      res.status(404).json({success: false, body: {message: "No titles with type:movie found"}})
    }
  }
  catch(err) { 
    res.status(500).json({ success: false, body: "Error: " + err });
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
