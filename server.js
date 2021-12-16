import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
import netflixData from "./data/netflix-titles.json";
// import topMusicData from './data/top-music.json'

// dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongo-netflix";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
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
  type: String,
});

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Title.deleteMany({});

    netflixData.forEach((item) => {
      const newTitle = new Title(item);
      newTitle.save();
    });
  };
  seedDatabase();
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/titles", async (req, res) => {
  const { cast, director, genre, type, country, title } = req.query;

  try {
    const titles = await Title.find({
      cast: new RegExp(cast, "i"),
      director: new RegExp(director, "i"),
      listed_in: new RegExp(genre, "i"),
      type: new RegExp(type, "i"),
      country: new RegExp(country, "i"),
      title: new RegExp(title, "i"),
    });
    res.json(titles);
  } catch (err) {
    res.status(400).json({ error: "Invalid title" });
  }
});

app.get("/titles/id/:id", async (req, res) => {
  const titleById = await Title.findById(req.params.id);
  res.json(titleById);
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
