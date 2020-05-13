import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import Book from './models/book'
import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

if (process.env.RESET_DB) {
  console.log('Resetting database...')

  const seedDatabase = async () => {
    // Clears database
    await Book.deleteMany()

    // Saves all books from booksData to the database
    await booksData.forEach(book => new Book(book).save())
  }
  seedDatabase()
}

const port = process.env.PORT || 8080
const app = express()

const listEndpoints = require('express-list-endpoints')

// Middlewares to enable cors and json body parsing, and handling if API service is unavailable
app.use(cors())
app.use(bodyParser.json())
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Root endpoint
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// Route for all books
app.get('/books', async (req, res) => {
  const { page, sort, title, author } = req.query
  const pageNo = +page || 1
  const perPage = 10
  const skip = perPage * (pageNo - 1)
  const ERROR_MESSAGE_404 = 'No books found, please try a different query'

  // Used to sort bookslist based on sort query
  const sortQuery = (sort) => {
    if (sort === 'rating_dsc') {
      return { average_rating: -1 }
    } else if (sort === 'rating_asc') {
      return { average_rating: 1 }
    }
  }

  // Bookslist with filters based on title and/or authors query
  // Paginated using limit and skip, change page using page query
  const booksList = await Book.find({
    title: new RegExp(title, 'i'),
    authors: new RegExp(author, 'i')
  })
    .sort(sortQuery(sort))
    .limit(perPage)
    .skip(skip)

  // Used to display total books, checking booksList length without pagination
  const booksListNoPagination = await Book.find({
    title: new RegExp(title, 'i'),
    authors: new RegExp(author, 'i')
  })
  const numBooks = booksListNoPagination.length

  // JSON returned depending on the booksList being empty or not
  if (booksList.length === 0) {
    res.status(404).json({ error: ERROR_MESSAGE_404 })
  } else {
    res.json({
      total_books: numBooks,
      total_pages: Math.ceil(numBooks / perPage),
      page: pageNo,
      books: booksList
    })
  }
})

// Route for single book using ISBN-13 as param
app.get('/books/:isbn13', async (req, res) => {
  const { isbn13 } = req.params
  const ERROR_MESSAGE_404 = `No book found with ISBN-13 ${isbn13}`
  const ERROR_MESSAGE_400 = `${isbn13} is not a valid ISBN-13`
  // Used to check if the isbn13 param starts with 978 followed by 10 numbers
  const isbnCheck = /^(978)([0-9]{10})$/

  // JSON returned depending on the book and the isbn13 param
  // Using the same error message for the last else and the catch (err)
  // To else when number doesn't match the isbnCheck, to catch if it contains a letter
  try {
    const book = await Book.findOne({ isbn13 })
    if (book) {
      res.json(book)
    } else if (!book && isbn13.match(isbnCheck)) {
      res.status(404).json({ error: ERROR_MESSAGE_404 })
    } else (
      err
    )
  } catch (err) {
    res.status(400).json({ error: ERROR_MESSAGE_400 })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})