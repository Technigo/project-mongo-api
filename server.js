import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import booksData from './data/books.json';

dotenv.config();

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const bookSchema = new mongoose.Schema({
  title: String,
  authors: String,
  average_rating: Number,
  language_code: String,
  num_pages: Number,
  isbn13: Number,
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

  const books = await Book.aggregate([
    {
      $match: {
        title: {
          $regex: new RegExp(title || '', 'i')
        },
        authors: {
          $regex: new RegExp(authors || '', 'i')
        }
      }
    }
    // {
    //   $sort: {
    //     average_rating: +sort,
    //   },
    // }
    // {
    //   $skip: Number((page - 1) * per_page + 1)
    // },
    // {
    //   $limit: Number(per_page)
    // }
  ]);
  res.json(books);
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
});

// Path parameter to get book by ISBN13
app.get('/books/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;

  try {
    const singleBook = await Book.findOne({ isbn13: isbn });
    if (singleBook) {
      res.json(singleBook);
    } else {
      res.status(404).json({ error: 'Not found' });
    }
  } catch {
    res.status(400).json({ error: 'Invalid request' });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
