import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import booksData from './data/books.json'
import res from 'express/lib/response'

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

// const Author = mongoose.model('Author', {
//   name: String
// })

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  // author: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Author'
  // },
  averageRating: Number,
  isbn: Number,
  isbn13: Number,
  languageCode: String,
  numPages: Number,
  ratingsCount: Number,
  textReviewsCount: Number
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Author.deleteMany()
    await Book.deleteMany()

    booksData.forEach((book) => {
      new Book(book).save()
    })
  }

  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.send(listEndpoints(app)) // All endpoints listed on start page '/'
})

app.get('/authors', async (req, res) => {
  const authors = await Author.find()
  res.json(authors)
})

app.get('/books', async (req, res) => {
  const books = await Book.find()
  // const books = await Book.find().populate('author')
  // res.json(books)
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const results = {}

  if (endIndex < booksData.length) {
    results.next = {
      page: page + 1,
      limit: limit
    }
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit
    }
  }

  // Sorting books by title
  const { title } = req.params
  books.sort((a, b) => (a.title > b.title ? 1 : -1)) // Sorting for string values

  results.results = books.slice(startIndex, endIndex)

  res.json(results)
})

app.get('/books/ratings', async (req, res) => {
  const books = await Book.find()

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 20

  const startIndex = (page - 1) * limit
  const endIndex = page * limit

  const results = {}

  if (endIndex < booksData.length) {
    results.next = {
      page: page + 1,
      limit: limit
    }
  }

  if (startIndex > 0) {
    results.previous = {
      page: page - 1,
      limit: limit
    }
  }

  // Sorting books by rating
  const { averageRating } = req.params
  const sortByRating = books.sort((a, b) => b.averageRating - a.averageRating)

  results.results = sortByRating.slice(startIndex, endIndex)
  res.json(results)
})

app.get('/books/search', (req, res) => {
  const { title, authors, isbn } = req.query

  let filteredBooksData = booksData

  if (title) {
    filteredBooksData = filteredBooksData.filter(
      (item) => item.title.toLowerCase().indexOf(title.toLowerCase()) !== -1
    )
  } else if (authors) {
    filteredBooksData = filteredBooksData.filter(
      (item) => item.authors.toLowerCase().indexOf(authors.toLowerCase()) !== -1
    )
  } else if (isbn) {
    filteredBooksData = filteredBooksData.filter(
      (item) => item.isbn.indexOf(isbn) !== -1
    )
  }

  console.log(filteredBooksData)

  res.json({
    response: filteredBooksData,
    success: true
  })

  //   if (filteredBooksData !== []) {
  //     res.json({
  //       response: filteredBooksData,
  //       success: true
  //     })
  //   } else if (filteredBooksData === []) {
  //     res
  //       .status(404)
  //       .json({ error: 'No book by that title, author or ISBN was found' })
  //   }
})

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)

    if (book) {
      res.json(book)
    } else {
      res.status(404).json({ error: 'Book was not found' })
    }
  } catch {
    res.status(400).json({ error: 'Invalid book id format' })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
