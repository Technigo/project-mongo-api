import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import booksData from "./data/books.json";
import dotenv from "dotenv";

dotenv.config();

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
  isbn: { type: Number, unique: true },
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
  lang && (books = await Book.find({ language_code: lang }));

  // Get all books above specific rating, by query
  const ratingAbove = req.query.ratingAbove;
  ratingAbove &&
    (books = await Book.find({ average_rating: { $gte: ratingAbove } }));

  // Get all books below specific rating, by query
  const ratingBelow = req.query.ratingBelow;
  ratingBelow &&
    (books = await Book.find({ average_rating: { $lte: ratingBelow } }));

  // Get single book by ISBN, by query
  const ISBN = Number(req.query.isbn);
  ISBN && (books = await Book.find({ isbn: ISBN }));

  // Get single book by ISBN13, by query
  const ISBN13 = Number(req.query.isbn13);
  ISBN13 && (books = await Book.find({ isbn13: ISBN13 }));

  // Pages with 20 books on each, by query
  const page = req.query.page;
  const start = (page - 1) * 10;
  page && (books = await Book.find().skip(start).limit(10).exec());

  // Show books
  books && books.length > 0
    ? res.json(books)
    : res.status(404).send({ error: "Could not find any books" });
});

// Collection - 10 most popular books by average rating
app.route("/books/popular").get(async (req, res) => {
  const books = await Book.find().sort({ average_rating: -1 }).limit(10);
  res.json(books);
});

// Single result - get book by ID
app.route("/books/:bookId").get(async (req, res) => {
  const bookId = req.params.bookId;
  const book = await Book.findOne({ bookID: bookId }).exec();
  book
    ? res.json(book)
    : res.status(404).send({
        error_message: `Book with ID ${bookId} not found`,
      });
});

// Collection - get books by Author
app.route("/authors/:author").get(async (req, res) => {
  const author = req.params.author;
  const books = await Book.find({ authors: { $regex: author } });
  books
    ? res.json(books)
    : res.status(404).send({ error: `No books by ${author} found` });
});

// Search for anything in title
app.route("/search").get(async (req, res) => {
  const q = req.query.q;
  let result = "";
  q && (result = await Book.find({ title: { $regex: q } }));

  // Show search result
  result && result.length > 0
    ? res.json(result)
    : res.status(404).send({ error: "No search results" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
