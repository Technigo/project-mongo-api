import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import booksData from './data/books.json';

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Mongoose models
const Book = mongoose.model('Book', {
  title: String,
  bookID: Number,
  isbn: String,
  average_rating: Number,
  ratings_count: Number,

  // Tells the server that this relates to the Author model id
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
});

const Author = mongoose.model('Author', {
  name: String
});

// To make it run only when we want to
if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    // To not get several same responses, start with deleting what's already there
    await Book.deleteMany({});
    await Author.deleteMany({});

    // Creating an array with unique authors from booksData. 
    const uniqueAuthors = [... new Set(booksData.map(book => book.authors))];
    await uniqueAuthors.forEach(async (authorName) => {
      const author = await new Author({ name: authorName }).save()

      // Sending books info for each of the authors books
      await booksData.filter(book => book.authors === author.name).forEach(async (book) => {
        await new Book({
          title: book.title,
          author: author,
          average_rating: book.average_rating,
          isbn: book.isbn,
          bookID: book.bookID,
          ratings_count: book.ratings_count,
        }).save()
      })
    })
  }
  seedDatabase();
}

// Defines the port the app will run on. 
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

// Middleware to handle server connection errors
app.use((req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      next()
    } else {
      res.status(503).json({ error: 'Service unavailable' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error! Could not access the server.' });
  }
});

// API ENDPOINTS
// To list all the endpoints in the first view
const listEndpoints = require('express-list-endpoints');
app.get('/', (req, res) => {
  res.send(listEndpoints(app));
});

// To return books
app.get('/books', async (req, res) => {
  // Possibility to search on title with query params as example: '/books?title=potter' 
  const { title } = req.query;
  const queryRegex = new RegExp(title, 'i');
  // Possibility to search on page with page parameter (minValue = 0, default = 0)
  // Usage example: '/books?page=2'
  const page = req.query.page ?? 0; // Get first 20 when typing 'page=0'
  const pageSize = 20; // Shows 20 per page
  const startIndex = page * pageSize; // Calculate startindex
  const books = await Book.find(); // All books
  // Sorts the books based on average_rating, populates it with 
  // the author collection and adds pagination
  const limitedBooks = await Book.find({
    title: queryRegex
  }).sort({
    average_rating: -1
  }).populate('author').skip(startIndex).limit(pageSize);
  // Add an object telling the user how many books the API contains, how many pages, books per page etc. 
  const returnObject = {
    pageSize: pageSize,
    page: page,
    maxPages: parseInt(books.length / pageSize),
    numberOfBooks: books.length,
    limitedBooks,
  };
  if (books) {
    res.status(200).json(returnObject);
  } else {
    // Error handling
    res.status(404).json({ error: 'Data not found' });
  }
});

// To return books with particular ID eg. '/books/955'
app.get('/books/:bookID', async (req, res) => {
  const { bookID } = req.params;
  const book = await Book.findOne({ bookID: bookID });
  if (book) {
    res.json(book);
  } else {
    // Error handling
    res.status(404).json({ error: `Book with id: ${bookID} not found` });
  }
});

// To return book by it's ISBN, eg. '/books/802415318'
app.get('/books/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = await Book.findOne({ isbn: isbn });
    if (book) {
      res.json(book);
    } else {
      // Error handling
      res.status(404).json({ error: `Book with isbn: ${isbn} could not be found!` });
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid author id' });
  }
});

// Route to return all authors
app.get('/authors', async (req, res) => {
  const authors = await Author.find();
  if (authors) {
    res.json(authors);
  } else {
    // Error handling
    res.status(404).json({ error: 'Data not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
