import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: String,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

if (process.env.RESET_DATABASE) {
  console.log('Resetting database!');

  const seedDatabase = async () => {
    await Book.deleteMany();
    await booksData.forEach((book) => new Book(book).save());
  };
  seedDatabase();
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(404).json({ error: 'Service unavailable' })
  }
})

app.get('/', (req, res) => {
  res.send('Welcome to my BOOKS database! Check the readme for endpoint documentation')
})

app.get('/books', async (req, res) => {
  const { query } = req.query;
  const queryRegex = new RegExp(query, 'i')
  const books = await Book.find({ title: queryRegex }).sort({
    average_rating: -1,
  })
  res.json(books)
})

app.get('/books/:isbn', async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = await Book.findOne({ isbn: isbn });
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: `Could not find book with isbn=${isbn}` });
    }
  } catch (err) {
    res.status(400).json({ error: 'invalid request' })
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})