import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// Import the books data from a JSON file
import booksData from "./data/books.json";

// Define the MongoDB connection URL
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";

// Connect to MongoDB using Mongoose
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define the Mongoose model for the 'Book' collection
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
});

// // Function to seed the database with book data
// const seedDatabase = async () => {
//   // Delete all existing documents in the 'Book' collection
//   await Book.deleteMany();

//   // Iterate over the books data and save each book to the database
//   booksData.forEach((booksItem) => {
//     new Book(booksItem).save();
//   });
// };

// // Seed the database with book data
// seedDatabase();

// Define the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
const listEndpoints = require("express-list-endpoints");

// Add middlewares to enable CORS (Cross-Origin Resource Sharing) and JSON body parsing
app.use(cors());
app.use(express.json());

// Root endpoint that returns a list of all available endpoints
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

// Endpoint to get all books from the database
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Endpoint to get a book by its ID
app.get("/books/:id", async (req, res) => {
  const bookId = req.params.id;

  try {
    // Find a book in the database by its ID
    const book = await Book.findOne({ bookID: bookId });

    // If the book is found, return it in the response, otherwise, return a 404 error
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get books by a specific author
app.get("/books/author/:author", async (req, res) => {
  const author = req.params.author;

  try {
    // Find books in the database by the specified author
    const booksByAuthor = await Book.find({ authors: author });

    // If books are found, return them in the response, otherwise, return a 404 error
    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.status(404).json({ error: "Books by the author not found" });
    }
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to get a book by its ISBN
app.get("/books/isbn/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  try {
    // Find a book in the database by its ISBN
    const bookByIsbn = await Book.findOne({ isbn: isbn });

    // If the book is found, return it in the response, otherwise, return a 404 error
    if (bookByIsbn) {
      res.json(bookByIsbn);
    } else {
      res.status(404).json({ error: "Book with the specified ISBN not found" });
    }
  } catch (error) {
    // Handle internal server error
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server and log the port it's running on
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
