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

const Author = mongoose.model('Author', {
  name: String,
})

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
  averageRating: Number,
  isbn: Number,
  isbn13: Number,
  languageCode: String,
  numPages: Number,
  ratingsCount: Number,
  textReviewsCount: Number,
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Author.deleteMany()
    await Book.deleteMany()

    let authors = [{}]
    let authorList = []

    booksData.forEach((item) => {
      const newAuthor = new Author({
        name: item.authors,
      })
      if (!authorList.includes(item.authors)) {
        newAuthor.save()
        authors.push(newAuthor)
        authorList.push(item.authors)
      }
    })

    booksData.forEach((item) => {
      const newBook = new Book({
        ...item,
        authors: authors.find((author) => author.name === item.authors),
      })
      newBook.save()
    })
  }
  seedDatabase()
}

// Middlewares ---------------------------
app.use(cors())
app.use(express.json())

// Error handling if connection to db is anything but connected (1) ---------------
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Main (displays all endpoints) ---------------------------
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// Authors ---------------------------
app.get('/authors', async (req, res) => {
  const { name } = req.query
  let authors = await Author.find({
    name: { $regex: `.*${name}.*`, $options: 'i' },
  })
  if (!name) {
    authors = await Author.find()
  }
  authors.sort((a, b) => (a.name > b.name ? 1 : -1)) // Sorting for string values
  res.json(authors)
})

app.get('/authors/:id', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    res.json(author)
  } else {
    res.status(404).json({ error: 'Author not found.' })
  }
})

app.get('/authors/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    const books = await Book.find({
      authors: mongoose.Types.ObjectId(author.id),
    })
    res.json({
      Author: author.name,
      'Number of books: ': books.length,
      Books: books,
    })
  } else {
    res.status(404).json({ error: 'Author not found.' })
  }
})

// Books ---------------------------
app.get('/books', async (req, res) => {
  const { title, averageRating } = req.query
  let books = await Book.find(req.query).populate('authors')

  books.sort((a, b) => (a.title > b.title ? 1 : -1)) // Sorting for string values

  if (title) {
    books = await Book.find({
      title: { $regex: `.*${title}.*`, $options: 'i' },
    }).populate('authors')
  } else if (averageRating) {
    // gt = greater than
    const bookRatings = await Book.find().gt(
      'averageRating',
      req.query.averageRating,
    )
    books = bookRatings
    // Sorting books by rating
    books.sort((a, b) => b.averageRating - a.averageRating) // Standard sorting (numbers)
  }

  res.json(books)
})

app.get('/books/ratings', async (req, res) => {
  let books = await Book.find()
  const { averageRating } = req.params
  const sortByRating = books.sort((a, b) => b.averageRating - a.averageRating) // Standard sorting (numbers)
  res.json(sortByRating)
})

app.get('/books/id/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
    if (book) {
      res.json(book)
    } else {
      res
        .status(404)
        .json({ error: 'No book with id ${req.params.id} was found' })
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
