import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import netflixData from "./data/netflix-titles.json";
import expressListEndpoints from "express-list-endpoints";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/netflix-titles";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const { Schema } = mongoose;

// Schema
const titleSchema = new Schema({
  title: String,
  director: String,
  country: String,
  date_added: String,
  release_year: Number,
  duration: String,
  description: String,
  type: String,
});

//The model
const Title = mongoose.model("Title", titleSchema);

//Seed the database
const seedDatabase = async () => {
  await Title.deleteMany();
  netflixData.forEach((title) => {
    new Title(title).save();
  });
};

seedDatabase();

// Defines the port the app will run on
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.send(endpoints);
});

//Get all titles
app.get("/titles", async (req, res) => {
  const allTitles = await Title.find();

  if (allTitles.length > 0) {
    res.json(allTitles);
  } else {
    res.status(404).send("No titles was found");
  }
});

//Get all titles of type movie
app.get("/titles/movies", async (req, res) => {
  const titleIsMovie = await Title.find({ type: "Movie" }).exec();

  if (titleIsMovie.length > 0) {
    res.json(titleIsMovie);
  } else {
    res.status(404).send("No movies was found");
  }
});

//Get all titles of type TV Show
app.get("/titles/tv-show", async (req, res) => {
  const titleIsTvShow = await Title.find({ type: "TV Show" }).exec();

  if (titleIsTvShow.length > 0) {
    res.json(titleIsTvShow);
  } else {
    res.status(404).send("No TV Shows was found");
  }
});

//Get one title
app.get("/titles/:titleId", async (req, res) => {
  const { titleId } = req.params;

  const title = await Title.findById(titleId).exec();

  if (title) {
    res.json(title);
  } else {
    res.status(404).send("No title was found");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
