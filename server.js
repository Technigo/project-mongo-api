import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from "./data/avocado-sales.json";
import booksData from "./data/books.json";
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Book = mongoose.model("Book", {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: String,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

if (process.env.RESET_DB) {
  console.log("DB RESET...");

  const seedDB = async () => {
    await Book.deleteMany();
    booksData.forEach((book) => new Book(book).save());
  };
  seedDB();
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Books API. Available queries: id, title, language, author, isbn. The endpoint for the queries is /books?title=harry. You can also use params to search for a single ID on this endpoint /books/id/1. You can also get all books on the endpoint /books/all"
  );
});

app.get("/books/all", (req, res) => {
  Book.find().then((data) => {
    res.json(data);
  });
});

app.get("/books/id/:id", async (req, res) => {
  const id = req.params.id;

  const getBookByID = await Book.findOne({ bookID: id });

  if (getBookByID === null) {
    res.status(404).json({ error: "No book with that ID." });
  } else {
    res.json(getBookByID);
  }
});

app.get("/books", async (req, res) => {
  const { id, author, title, language, isbn } = req.query;

  const authorRegexp = new RegExp(author, "i");
  const titleRegexp = new RegExp(title, "i");
  const languageRegexp = new RegExp(language, "i");
  const isbnRegexp = new RegExp(isbn, "i");

  const searchQuery = {};

  if (id !== undefined) {
    searchQuery.bookID = +id;
  }
  if (author !== undefined) {
    searchQuery.authors = authorRegexp;
  }
  if (title !== undefined) {
    searchQuery.title = titleRegexp;
  }
  if (language !== undefined) {
    searchQuery.language_code = languageRegexp;
  }
  if (isbn !== undefined) {
    searchQuery.isbn = isbnRegexp;
  }

  const searchQueryResult = await Book.find(searchQuery);

  if (searchQueryResult.length === 0) {
    res.status(404).json({
      error:
        "Could't not find anything in the database that matches your search query.",
    });
  } else {
    res.json(searchQueryResult);
  }
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
