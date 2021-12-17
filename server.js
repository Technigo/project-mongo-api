import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
import netflixData from "./data/netflix-titles.json";
// import topMusicData from './data/top-music.json'

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
  res.send(
    "Hello world and welcome to this Netflix API created by Amanda Tilly"
  );
});

app.get("/titles", async (req, res) => {
  const { cast, director, genre, type, country, title } = req.query;

  try {
    const titles = await Title.find({
      // RegExp = Regular expressions are a sequence of characters that are used for
      // matching character combinations in strings for text matching/searching.
      // In JavaScript, regular expressions are search patterns (JavaScript objects)
      // from sequences of characters. RegExp defines search patterns with a sequence of characters.
      // give possibility to add query params without building a specific endpoint
      // it is works as include and toLowerCase
      // Adding the "i" flag to the function argument to ignore case sensitivity.
      cast: new RegExp(cast, "i"),
      director: new RegExp(director, "i"),
      listed_in: new RegExp(genre, "i"),
      type: new RegExp(type, "i"),
      country: new RegExp(country, "i"),
      title: new RegExp(title, "i"),
      // Above are constructor functions, This method takes in regular expressions as Strings in function arguments.
      // It is advisable to use the constructor function when creating regular expressions whose pattern will change
      // during runtime. For instance, when validating user input or performing iterations.
    });
    if (titles) {
      res.json(titles);
    } else {
      res.status(404).json({ error: "Not found" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid entry" });
  }
});

app.get("/titles/id/:id", async (req, res) => {
  try {
    const titleById = await Title.findById(req.params.id);
    if (titleById) {
      res.json(titleById);
    } else {
      res.status(404).json({ error: "Id not found" });
    }
  } catch (err) {
    res.status(400).json({ error: "Id is invalid" });
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
