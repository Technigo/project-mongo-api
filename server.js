import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import listEndpoints from 'express-list-endpoints';
import dotenv from 'dotenv'

dotenv.config()

import booksData from './data/books.json';

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(bodyParser.json());

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
  text_reviews_count: Number,
});

  // Fills the database with the data from my API
 if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({});

    booksData.forEach(item => {
      const newBook = new Book(item);
      newBook.save();
    });
  };
  seedDatabase();
  console.log('Database has been reset')
 }

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Welcome to the books API. Enter /endpoints to see which endpoints there are.');
});

// lists the endpoints
app.get('/endpoints', (req, res) => res.send(listEndpoints(app)));

// gets all books
app.get('/books', async (req, res) => {
  const books = await Book.find()
  res.json(books);
});

//gets a book with a certain ID
app.get('/books/id/:bookID', async (req, res) => {
  const bookID = await Book.find({bookID: req.params.bookID});
  res.json(bookID);
});

// returns an array of books from a specified author
app.get('/author/:authors', async (req, res) => {
  const author = await Book.find({authors: req.params.authors});
  res.json(author);
});

// returns one book with the specified ISBN-number
app.get('/isbn/:isbn', async (req, res) => {
  const isbn = await Book.find({isbn: req.params.isbn});
  res.json(isbn);
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
