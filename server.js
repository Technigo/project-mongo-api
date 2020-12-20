import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

const Book = new mongoose.model('Book', {
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


if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Book.deleteMany()
    booksData.forEach(async item => {
      await new Book(item).save()
    })
  }
  populateDatabase()
}

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable at the moment" })
  }
})

app.get('/', (req, res) => {
  res.send('Hello world, welcome to this books API built with MongoDB')
})

app.get('/books', async (req, res) => {
  const allBooks = await Book.find()
  res.json(allBooks)
})

app.get('/books/id/:bookID', async (req, res) => {
  const bookByID = await Book.findOne({ bookID: req.params.bookID });
  if (bookByID) {
    res.json(bookByID);
  } else {
    res.status(404).json({ error: 'Book not found' });
  };
});

app.get('/books/author/:author', async (req, res) => {
  const author = req.params.author
  const booksByAuthor = await Book.find({ authors: { "$regex": author, "$options": "i" } })
  res.json(booksByAuthor)
})

app.get('/books/top-rated', async (req, res) => {
  const topRatedBooks = await Book.find({ average_rating: { $gte: 4.5 } })
  if (topRatedBooks.length > 0) {
    res.json(topRatedBooks)
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})

app.get('/books/short', async (req, res) => {
  const shortBooks = await Book.find({ num_pages: { $lt: 400 } });
  if (shortBooks.length > 0) {
    res.json(shortBooks)
  } else {
    res.status(404).json({ error: 'Book not found' });
  };
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
