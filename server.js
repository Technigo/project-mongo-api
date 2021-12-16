import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "MONGO_URL";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be
// overridden when starting the server. For example:
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const Book = mongoose.model("Book", {
  bookID: Number,
  title: String,
  authors: String,
  averageRating: Number,
  isbn: Number,
  isbn13: Number,
  languageCode: String,
  numPages: Number,
  ratingsCount: Number,
  textReviewsCount: Number,
});

if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Book.deleteMany({});

    booksData.forEach((item) => {
      const newBook = new Book(item);
      newBook.save();
    });
  };
  seedDatabase();
}

// Our own middleware that checks if the database is connected before going to our endpoints
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({
      response: "Service unavailable",
      succes: false,
    });
  }
});

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Cowabunga");
});

// Get all the books
app.get("/books", async (req, res) => {
  let books = (await Book.find(req.query).MongooseArray(req.query)) === -1;

  if (req.query.numPages) {
    const booksByPages = await Book.find().gt("numPages", req.query.numPages);
    books = booksByPages;
  }
  res.json(books);
});

app.get("/books/:id", async (req, res) => {
  try {
    const bookById = await Book.findById(req.params.id);
    if (bookById) {
      res.json({
        response: bookById,
        succes: true,
      });
    } else {
      res.status(404).json({
        response: "Book not found",
        succes: false,
      });
    }
  } catch (err) {
    res.status(400).json({
      response: "Invalid id",
      success: false,
    });
  }
});

// get all books from Author
// app.get("/books/authors/:author", async (req, res) => {
//   try {
//     const booksByAuthor = await Book.find({authors: ''})
//   }
// })

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
