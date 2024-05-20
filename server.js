import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import booksData from "./data/books.json";
import dotenv from "dotenv"

dotenv.config()

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongo-books";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

const { Schema } = mongoose;

//Schema - the blueprint
const bookSchema = new Schema({
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

//The model
const BookModel = mongoose.model("BookModel", bookSchema);

//Seed the database
//for demo and reminder for future purposes:
if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await BookModel.deleteMany();

    booksData.forEach((book) => {
      new BookModel(book).save();
    });
  };

  seedDatabase();
}

// Defines the port the app will run on.

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
// http://localhost:8080/
app.get("/", (req, res) => {
  res.send(expressListEndpoints(app));
});

// Get all books
app.get("/books", async (req, res) => {
  const allBooks = await BookModel.find();

  if (allBooks.length > 0) {
    res.json(allBooks);
  } else {
    res.status(404).send("No books found!");
  }
});

//Find book by Id
app.get("/books/:bookId", async (req, res) => {
  const { bookId } = req.params;

  const book = await BookModel.findById(bookId).exec();

  if (book) {
    res.json(book);
  } else {
    res
      .status(404)
      .send("No book was found by it's given Id. Please try again.");
  }
});

// Filter books by author
app.get("/books/authors/:authors", async (req, res) => {
  const author = req.params.authors;

  const booksByAuthors = await BookModel.find({
    authors: { $regex: author, $options: "i" },
  }).exec();

  if (booksByAuthors) {
    res.json(booksByAuthors);
  } else {
    res
      .status(404)
      .send(
        "Couldn't find the author you're looking for. Please try a new search."
      );
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});