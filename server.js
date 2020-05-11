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
    // Clears database
    await Book.deleteMany({})

    // Saves all books from booksData to the database
    await booksData.forEach(book => new Book(book).save())
  }
  seedDatabase()
}

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
  const { page, sort } = req.query

  const sortQuery = (sort) => {
    if (sort === 'rating_dsc') {
      return { average_rating: -1 }
    } else if (sort === 'rating_asc') {
      return { average_rating: 1 }
    }
  }

  const numBooks = await Book.estimatedDocumentCount()
  const pageNo = +page || 1
  const perPage = 10
  const booksList = await Book.find()
    .sort(sortQuery(sort))
    .limit(perPage)
    .skip(perPage * (pageNo - 1))

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
