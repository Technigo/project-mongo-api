import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import booksData from './data/books.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


app.use((req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      next()
    } else {
      res.status(503).json({ error: 'Service is Unavailable' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Error! Could NOT access the server.' });
  }
})

const Book = new mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Book.deleteMany();

    booksData.forEach(item => {
      const newBook = new Book(item);
      newBook.save();
    })
  }
  populateDatabase();
}


app.get('/', (req, res) => {
  res.send('Welcome to the Book API')
})

app.get('/books', async (req, res) => {
  const alltheBooks = await Book.find(req.query)
  res.json(alltheBooks)
})

app.get('/books/:id', async (req, res) => {
  try {
    const oneBook = await Book.findOne({ bookID: req.params.id })

    if (oneBook) {
      res.json(oneBook)
    } else {
      res.status(404).json({ Error: ' The book is not found' })
    }
  } catch (error) {
    res.status(400).json({ Error: 'Invalid Book ID' })
  }
})

app.get('/authors/:author', async (req, res) => {
  const byAuthor = await Book.find({ authors: req.params.author })
  if (byAuthor.length > 0) {
    res.json(byAuthor)
  } else {
    res.status(404).json({ error: 'Invalid Author' })
  }
})

app.get('/titles/:title', async (req, res) => {
  const bookTitle = await Book.findOne({ title: req.params.title })
  if (bookTitle) {
    res.json(bookTitle)
  } else {
    res.status(404).json({ error: 'Invalid Title' })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})