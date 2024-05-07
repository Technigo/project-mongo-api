import cors from "cors";
import express from "express";
import expressListEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Getting env file
dotenv.config();

const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongo-bookdata";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Doing the Schema for the book
const { Schema } = mongoose;
const BookSchema = new Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isgn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

// Doing the Book Model with the Schema
const Book = mongoose.model("Book", BookSchema);

// Import the Data
import booksData from "./data/books.json";

// Seed the database with the books
// I have set RESET_DB to false since the database is already seeded now
if (process.env.RESET_DB === true) {
  const seedDatabase = async () => {
    console.log("Reseading database");
    await Book.deleteMany({});

    booksData.forEach((bookData) => {
      new Book(bookData).save();
    });
  };
  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 9090;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// API Documentation with express list endpoints
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.json(endpoints);
});

// All other endpoints
app.get("/books", async (req, res) => {
  const allBooks = await Book.find();
  res.json(allBooks);
});

app.get("/books/:bookId", async (req, res) => {
  const { bookId } = req.params;
  const book = await Book.findOne({ bookID: bookId }).exec();

  if (book) {
    res.json(book);
  } else {
    res.status(404).send("Sorry, there is no book with that ID.");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
