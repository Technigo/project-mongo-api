import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";

// Database connection setup
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define a Mongoose model for the Book schema
const Book = mongoose.model('Book', {
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

// Function to seed the database with books data from booksData JSON
const seedDatabase = async () => {
  try {
    // Clear the Book collection before adding new data to prevent duplicates
    await Book.deleteMany({}).maxTimeMS(30000);

    // Loop through the booksData array and save each book to the database
    for (const bookData of booksData) {
      await new Book(bookData).save();
    }
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Seed the database with books data
seedDatabase();

// Initialize the Express app
const port = process.env.PORT || 8080;
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Define endpoint documentation array with paths, methods, and middlewares
app.get("/", (req, res) => {
  const endpoints = [
    { path: "/", methods: ["GET"], middlewares: ["anonymous"] },
    { path: "/books", methods: ["GET"], middlewares: ["anonymous"] },
    { path: "/books/:id", methods: ["GET"], middlewares: ["anonymous"] },
    { path: "/books/author/:author", methods: ["GET"], middlewares: ["anonymous"] },
  ];
  res.json(endpoints);
});

// Route to get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to get a single book by ID
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to get books by a specific author
app.get('/books/author/:author', async (req, res) => {
  try {
    const booksByAuthor = await Book.find({ authors: req.params.author });
    if (!booksByAuthor.length) {
      return res.status(404).json({ message: 'Books by this author not found' });
    }
    res.json(booksByAuthor);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to return API documentation
app.get("/documentation", (req, res) => {
  res.json(endpoints);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

