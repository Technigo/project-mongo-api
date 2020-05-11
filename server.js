import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Book = mongoose.model('Book', {
  bookID: {
    type: Number,
  },
  title: {
    type: String,
  },
  authors: {
    type: String,
  },
  average_rating: {
    type: Number,
  },
  isbn13: {
    type: Number,
  },
  language_code: {
    type: String,
  },
  num_pages: {
    type: Number,
  },
  ratings_count: {
    type: Number,
  },
  text_reviews_count: {
    type: Number,
  },
})

if (process.env.RESET_DB) {
  console.log('Resetting database...')
  const seedDatabase = async () => {
    await Book.deleteMany({})

    booksData.forEach(bookData => {
      new Book(bookData).save()
    })
  }

  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8088
const app = express()

const listEndpoints = require('express-list-endpoints')

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// Route for all books
app.get('/books', async (req, res) => {
  const { page, per_page } = req.query
  const numBooks = await Book.estimatedDocumentCount()
  const pageNo = +page || 1
  const perPage = +per_page || 10
  const booksList = await Book.find().limit(perPage).skip(perPage * (pageNo - 1))

  res.json({
    total_books: numBooks,
    total_pages: Math.ceil(numBooks / perPage),
    page: pageNo,
    books: booksList
  })
})

// Route for single book using ISBN13 as param
app.get('/books/:isbn13', async (req, res) => {
  const { isbn13 } = req.params
  const book = await Book.findOne({ isbn13 })

  if (book) {
    res.json(book)
  } else {
    res.status(404).json({ error: `No book found with isbn13 ${isbn}` })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
