import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import booksData from './data/books.json';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const port = process.env.PORT || 1313;
const app = express();

app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Define the schema and model for a Book.
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
  text_reviews_count: Number
});
const Book = mongoose.model('Book', bookSchema);

// Seed the database with book data if RESET_DB is true.
const seedDatabase = async () => {
  await Book.deleteMany({});
  const bookPromises = booksData.map(bookData => new Book(bookData).save());
  await Promise.all(bookPromises);
};
if (process.env.RESET_DB) {
  seedDatabase();
}

// API documentation route providing endpoint details.
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Book API. Available endpoints:",
    endpoints: {
      allBooks: "/books",
      singleBookByID: "/bookID/:id",
      titlesOnly: "/titles",
      authorsOnly: "/authors",
      booksWithTitles: "/books/title-details",
      languageCodes: "/language_code"
    }
  });
});

// Endpoint to fetch all books, with optional query parameters for filtering by author or language.
app.get("/books", async (req, res) => {
  const { author, language } = req.query;
  let query = {};
  if (author) {
    query.authors = new RegExp(author, 'i'); // Case-insensitive regex search for author
  }
  if (language) {
    query.language_code = language;
  }

  const books = await Book.find(query);
  res.json(books);
});

// Endpoint to fetch a single book by its ID, with validation to ensure the ID is a number.
app.get("/bookID/:id", async (req, res) => {
  const bookId = req.params.id;
  if (!bookId.match(/^[0-9]+$/)) { // Validate that the ID is numeric
    return res.status(400).send({ error: "Invalid book ID format" });
  }

  try {
    const book = await Book.findOne({ bookID: bookId });
    if (book) {
      res.json(book);
    } else {
      res.status(404).send({ error: "Book not found with provided ID" });
    }
  } catch (error) {
    res.status(500).send({ error: "Server error: " + error.message });
  }
});

// Endpoint to fetch all titles from the database.
app.get("/titles", async (req, res) => {
  try {
    const titles = await Book.find().select('title -_id');
    res.json({ titles: titles });
  } catch (error) {
    res.status(500).send({ error: "Server error: " + error.message });
  }
});

// Endpoint to fetch books with details about their titles, including the number of pages and average rating.
app.get("/books/title-details", async (req, res) => {
  try {
    const books = await Book.find().select('title num_pages average_rating -_id');
    res.json({ books: books });
  } catch (error) {
    res.status(500).send({ error: "Server error: " + error.message });
  }
});

// Endpoint to fetch all authors from the database.
app.get("/authors", async (req, res) => {
  try {
    const authors = await Book.find().select('authors -_id');
    res.json({ authors: authors });
  } catch (error) {
    res.status(500).send({ error: "Server error: " + error.message });
  }
});

// Endpoint to fetch books by language code, including the title of each book.
app.get("/language_code", async (req, res) => {
  try {
    const books = await Book.find().select('language_code title -_id');
    res.json({ books: books });
  } catch (error) {
    res.status(500).send({ error: "Server error: " + error.message });
  }
});

// Start the server and listen on the specified port.
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
