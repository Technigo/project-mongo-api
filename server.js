import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Book = mongoose.model("Book", {
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

if (process.env.RESET_DATABASE) {
  //RESET_DATABASE=true npm run dev
  console.log("Resetting database");

  const populateDatabase = async () => {
    await Book.deleteMany(); // fixes so it does not load more objects with new rendering

    booksData.forEach((item) => {
      const newBook = new Book(item);
      newBook.save();
    });
  };
  populateDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8081;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Global error
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Not available" });
  }
});

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("API of books");
});

//gets all the books
app.get("/books/", async (req, res) => {
  const allBooks = await Book.find(); // looks for all attributes
  res.json(allBooks);
});

//gets a book by the isbn number
app.get("/books/isbn/:isbn/", async (req, res) => {
  try {
    const singleBook = await Book.findOne({ isbn: req.params.isbn });
    if (singleBook) {
      res.json(singleBook);
    } else {
      res.status(404).json({ error: "Isbn not found" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid isbn number" });
  }
});

//gets the books from a specific author (when searching for name)
app.get("/books/author/:name/", async (req, res) => {
  try {
    const singleAuthor = await Book.find({ authors: req.params.name });
    if (singleAuthor) {
      res.json(singleAuthor);
    } else {
      res.status(404).json({ error: "Author not found" });
    }
  } catch (err) {
    res.status(400).json({ error: "Invalid author name" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
