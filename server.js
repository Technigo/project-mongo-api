import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
//import listEndpoints from "express-list-endpoints";
dotenv.config();

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo-api";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const BookDataModel = mongoose.model("BookData", {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

// wrap this part in an inviroment variabel

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    console.log("Resetting database!");

    await BookDataModel.deleteMany({});

    booksData.forEach(async (book) => {
      await new BookDataModel(book).save();
    });
  };
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

const port = process.env.PORT || 8080;
const app = express();

const listEndpoints = require("express-list-endpoints");

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// -----Routes and endpoints
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
  //res.send("Hello Technigo");
});

//Route for all books
app.get("/books", async (req, res) => {
  try {
    const booksData = await BookDataModel.find();
    res.json(booksData);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: "Data not found" });
  }
});

//Route for showing a specific id on book
app.get("/books/:bookID", async (req, res) => {
  const { bookID } = req.params;

  try {
    const book = await BookDataModel.findOne({ bookID: +bookID });

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Route for sorting books with highest rating first
app.get("/sortedRating", async (req, res) => {
  try {
    const allBooks = await BookDataModel.find();

    if (!allBooks || allBooks.length === 0) {
      return res.status(404).json({ error: "No books found" });
    }

    // Sort books by average_rating in descending order
    const sortedRating = allBooks.sort(
      (a, b) => b.average_rating - a.average_rating
    );

    res.json({ sortedRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
