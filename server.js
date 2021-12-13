import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'

// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Welcome to Books API!");
});

//all books data
// with search by queries
// http://localhost:8080/books?author={smth}&title={smth}&lang[]={lang}&lang[]={lang}
app.get("/books", (req, res) => {
  const author = req.query.author?.toLowerCase();
  const title = req.query.title?.toLowerCase();
  const lang = req.query.lang;

  if (lang) {
    if (!Array.isArray(lang) || lang.length === 0) {
      res.status(400).send("lang must be non-empty array");
    }
  }
  let filteredBooks = booksData;

  if (author) {
    filteredBooks = filteredBooks.filter((item) => {
      return item.authors.toLowerCase().includes(author);
    });
  }
  if (title) {
    filteredBooks = filteredBooks.filter((item) => {
      return item.title.toLowerCase().includes(title);
    });
  }
  if (lang) {
    filteredBooks = filteredBooks.filter((item) => {
      return lang.includes(item.language_code);
    });
  }
  if (filteredBooks.length === 0) {
    res.status(404).send("data not found");
  }
  res.json(filteredBooks);
});

// returns most popular books
// http://localhost:8080/popular?kids_friendly=true
app.get("/popular", (req, res) => {
  const showKidsFriendly = req.query.kids_friendly;
  let popularBooks = booksData.filter((item) => {
    return Math.abs(item.average_rating >= 4.4);
  });

  if (showKidsFriendly) {
    popularBooks = popularBooks.filter((item) => item.kids_friendly);
  }

  if (popularBooks.length === 0) {
    res.status(404).send("data not found");
  }
  res.json(popularBooks);
});

//book by ID
app.get("/books/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log({ id });
  const bookById = booksData.filter((item) => {
    const bookWithMatchedId = item.bookID === id;
    return bookWithMatchedId;
  });

  if (!bookById || bookById.length === 0) {
    res.status(404).send("data not found");
  }
  res.json(bookById);
});

//books by rating
app.get("/ratings/:rating", (req, res) => {
  const rating = Math.floor(parseFloat(req.params.rating));
  const selectedBooks = booksData.filter((item) => {
    const filteredBooksMatched = item.average_rating >= rating && item.average_rating < rating + 1;
    return filteredBooksMatched;
  });
  if (selectedBooks.length === 0) {
    res.status(404).send("data not found");
  }
  res.json(selectedBooks);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
