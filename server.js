import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv';

import booksData from './data/books.json';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const bookSchema = new mongoose.Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: String,
  num_pages: Number
});

const Book = mongoose.model('Book', bookSchema);

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Book.deleteMany();

    booksData.forEach(async (item) => {
      const newBook = new Book({
        bookID: item.bookID,
        title: item.title,
        authors: item.authors,
        average_rating: item.average_rating,
        isbn: item.isbn,
        num_pages: item.num_pages
      });
      await newBook.save();
    });
  };

  seedDB();
}

const port = process.env.PORT || 8080;
const app = express();

// Middlewares 
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: 'Service unavailable' });
  }
});

// ROUTES
// Home
app.get('/', (req, res) => {
  try {
    res.send(listEndpoints(app));
  } catch (err) {
    res.status(404).send({ error: "Page not found" });
  }
});

// All books
// Books by author, query path: '/books?author=adams'
// Books by title, query path: '/books?title=chamber'
// Books by isbn, query path: '/books?isbn=439785960'
app.get('/books', async (req, res) => {
  const { author, title, isbn } = req.query;
  let booksToSend = await Book.find();

  try {
    if (author) {
      booksToSend = await Book.find({ authors: new RegExp(author, "i") });
    } 
    if (title) {
      booksToSend = await Book.find({ title: new RegExp(title, "i") });
    }
    if (isbn) {
      booksToSend = await Book.find({ isbn: new RegExp(isbn, "i") });
    }
    if (booksToSend.length === 0) {
      res.status(404).send(`Sorry, could not find any books!`);
    }
  
    res.json(booksToSend);
  } catch (err) {
    res.status(404).send({ error: "Page not found" });
  }
});

// Books by top rating (4 or higher)
app.get('/books/toprating', async (req, res) => {
  try {
    const booksByTopRating = await Book.find({ average_rating: { $gte: 4 } });
    res.json(booksByTopRating);
  } catch (err) {
    res.status(404).send({ error: "Page not found" });
  }
});

// Books by short reads (less than 500 pages)
app.get('/books/shortread', async (req, res) => {
  try {
    const booksByShortRead = await Book.find({ num_pages: { $lt: 500 } });
    res.json(booksByShortRead);
  } catch (err) {
    res.status(404).send({ error: "Page not found" });
  }
});

// Books by id
app.get('/books/:bookId', async (req, res) => {
  const { bookId } = req.params;

  try {
    const singleBook = await Book.findById(bookId);
    if (singleBook) {
      res.json(singleBook);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid book ID' });
  }
});

// Start the server
app.listen(port, () => {
});
