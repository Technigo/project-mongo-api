import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

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

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany();
    booksData.forEach((singleBook) => {
      const newBook = new Book(singleBook);
      newBook.save();
    });
  };
  seedDatabase();
}

app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

//1. endpoint that returns the whole array of book ratings.
app.get("/bookratings", async (req, res) => {
  const books = await Book.find(req.query);
  res.send(books);
});

// 2. endpoint that returns one rated book by its title.
app.get("/bookratings/booktitle/:title", async (req, res) => {
  const bookByTitle = await Book.findOne({ title: req.params.title });
  res.send(bookByTitle);
});

// // 3. endpoint that returns all rated books written by a specific author..
app.get("/bookratings/author/:authors", async (req, res) => {
  const bookByAuthor = await Book.find({ authors: req.params.authors });
  res.send(bookByAuthor);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
