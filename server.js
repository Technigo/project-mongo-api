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
  console.log('Resetting database!');
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
  //res.send('Books API created by Gabriella Bolin using MongoDB.');
  res.send(listEndpoints(app));
});

// To return all books
app.get('/books', async (req, res) => {
  // Possibility to search on title with query params as example: '/books?title=potter' 
  const { title } = req.query;
  const queryRegex = new RegExp(title, 'i');
  const books = await Book.find({ title: queryRegex }).sort({
    average_rating: -1,
  }).populate('author');
  // Add an object telling the user how many books the API contains
  const returnObject = { numberOfBooks: books.length, books };
  if (books) {
    res.json(returnObject);
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
