import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";

import booksData from "./data/books.json";

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

const mongoURL = process.env.MONGO_URL || "mongodb://localhost/library";
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Mongoos schemas
const bookSchema = new mongoose.Schema({
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

// Mongoose model
const Book = mongoose.model("Book", bookSchema);

// Seed data
if (process.env.RESET_DB) {
  console.log("Resetting the database!");
  const seedDatabase = async () => {
    await Book.deleteMany({});

    booksData.forEach(async book => {
      const newBook = new Book(book);
      await newBook.save();
    });
  };
  seedDatabase();
}

// Start defining your routes here
app.route("/").get((req, res) => {
  const endpoints = expressListEndpoints(app);
  res.send(endpoints);
});

// Fetch all Books
app.route("/books").get(async (req, res) => {
  let books = await Book.find();

  // Get all books in specific language by query
  const lang = req.query.lang;
  lang && (books = books.filter(book => book.language_code === lang));

  // Get all books above specific rating, by query
  const ratingAbove = req.query.ratingAbove;
  ratingAbove &&
    (books = books.filter(book => book.average_rating > ratingAbove));

  // Get all books below specific rating, by query
  const ratingBelow = req.query.ratingBelow;
  ratingBelow &&
    (books = books.filter(book => book.average_rating < ratingBelow));

  // Get single book by ISBN, by query
  const ISBN = req.query.isbn;
  ISBN && (books = books.find(book => book.isbn === +ISBN));

  // Get single book by ISBN, by query
  const ISBN13 = req.query.isbn13;
  ISBN13 && (books = books.filter(book => book.isbn13 === +ISBN13));

  // Pages with 20 books on each, by query
  const page = req.query.page;
  const start = (page - 1) * 10;
  const end = start + 10;
  console.log(start, end);
  page && (books = books.slice(start, end));

  // Show books
  books && books.length > 0
    ? res.json(books)
    : res.status(404).send({ error: "Could not find any books" });
});

// Collection - get books by Author
app.route("/books/popular").get((req, res) => {
  res.json(
    booksData.sort((a, b) => b.average_rating - a.average_rating).slice(0, 10)
  );
});

// Single result - get book by ID
app.route("/books/:bookId").get((req, res) => {
  const bookId = req.params.bookId;
  const book = booksData.find(b => b.bookID === +bookId);
  book
    ? res.json(book)
    : res.status(404).send({ error: `Book ID ${bookId} not found` });
});

// Collection - get books by Author
app.route("/authors/:author").get((req, res) => {
  const author = req.params.author;
  const books = booksData.filter(b => b.authors.includes(author));
  books
    ? res.json(books)
    : res.status(404).send({ error: `No books by ${author} found` });
});

app.route("/search").get((req, res) => {
  // Search for anything
  const q = req.query.q;
  let result = "";
  q &&
    (result = booksData.filter(book => Object.values(book).join().includes(q)));

  // Show result
  result && result.length > 0
    ? res.json(result)
    : res.status(404).send({ error: "No search results" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
