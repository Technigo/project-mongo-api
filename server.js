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
  console.log("Resetting database");

  const seedDatabase = async () => {
    await Book.deleteMany(); // fixes so it does not load more objects with new rendering

    booksData.forEach((item) => {
      const newBook = new Book(item);
      newBook.save();
    });
  };
  seedDatabase();
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

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("API of books");
});

app.get("/books/:id", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.get("/books/id/:id", async (req, res) => {
  const book = await Book.findById(req.params.bookID);
  res.json(book);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
