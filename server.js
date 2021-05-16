import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

import booksData from './data/books.json';

dotenv.config()

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const bookSchema = new mongoose.Schema({
  title: String,
  authors: String,
  average_rating: Number,
  language_code: String
});

const Book = mongoose.model('Book', bookSchema);

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Book.deleteMany();

    booksData.forEach((item) => {
      new Book(item).save();
    });
  };
  seedDB();
}
const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// Routes 

app.get('/', (req, res) => {
  res.send('Welcome to the Book API');
});

// Query parameter to get all the books unless a title or author was specified
app.get('/books', async (req, res) => {
  const { title, authors } = req.query;

  if (title) {
    const books = await Book.find({
      title: {
        $regex: new RegExp(title, 'i')
      }
    });
    res.json(books);
  } else if (authors) {
    const books = await Book.find({
      authors: {
        $regex: new RegExp(authors, 'i')
      }
    })
    res.json(books);
  } else {
    const books = await Book.find();
    res.json(books);
  }
});

// Path parameter a single book by its id
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const singleBook = await Book.findById(id);
    if (singleBook) {
      res.json(singleBook);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch {
    res.status(400).json({ error: 'Invalid request' });
  }
  res.json(singleBook);
});

// Path parameter to get books by author
app.get('/books/author/:author', async (req, res) => {
  const { author } = req.params;

  try {
    const singleBook = await Book.find({ authors: author });
    res.json(singleBook);
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong', details: error });
  }
}); 

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
