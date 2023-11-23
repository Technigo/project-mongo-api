import express from "express";
import cors from "cors";
import mongoose from "mongoose";


import booksData from "./data/books.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Book = mongoose.model('Book', {
    bookID: Number,
    title: String,
    authors: String,
    average_rating: Number,
    isbn: Number,
    isbn13: Number,
    language_code: String,
    num_pages: Number,
    ratings_count: Number,
    text_reviews_count: Number
})

const seedDatabase = async () => {
  await Book.deleteMany()

  booksData.forEach((booksItem) => {
    new Book(booksItem).save()
  })
}
seedDatabase()


// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require("express-list-endpoints")

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
 res.send(listEndpoints(app))
});

app.get("/books", async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

app.get("/books/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    const book = await Book.findOne({ bookID: bookId });

    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/books/author/:author", async (req, res) => {
  const author = req.params.author;

  try {
    const booksByAuthor = await Book.find({ authors: author });

    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.status(404).json({ error: "Books by the author not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
