/* eslint-disable no-console */
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import listEndpoints from 'express-list-endpoints'

import booksData from './data/books.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const bookSchema = new mongoose.Schema({
  bookID: Number,
  title: {
    type: String,
    lowercase: true
  },
  authors: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
    lowercase: true
  },
  average_rating: Number,
  isbn13: Number,
  language_code: {
    type: String,
    lowercase: true
  },
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

const Book = mongoose.model('Book', bookSchema)

const authorSchema = mongoose.Schema({
  authors: String
})

const Author = mongoose.model('Author', authorSchema)

if (process.env.RESET_DB) {
  console.log('SEEDING!')
  const seedDB = async () => {
    await Book.deleteMany()
    await Author.deleteMany()

    const authorArray = []

    booksData.forEach(async (item) => {
      const newAuthor = new Author(item)
      authorArray.push(newAuthor)
      await newAuthor.save()
    })

    booksData.forEach(async (item) => {
      const newBook = new Book({
        ...item,
        authors: authorArray.find((singleAuthor) => singleAuthor.authors === item.authors)
      })
      await newBook.save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8093
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// Endpoint to get all books and search for title by query param
app.get('/books', async (req, res) => {
  const { title } = req.query

  try {
    if (title) {
      const books = await Book.find({ 
        title: {
          $regex: new RegExp(title, 'i')
        }
      }).populate('authors')
      res.json(books)
    } else {
      const books = await Book.find().populate('authors')
      res.json(books)
    }
  } catch (error) {
    res.status(404).json({ error: 'Something went wrong', details: 'error' })
  }
})

// Endpoint to get bookID by path param
app.get('/books/:bookId', async (req, res) => {
  const { bookId } = req.params

  try {
    const singleBook = await Book.findById(bookId).populate('authors')

    if (singleBook) {
      res.json(singleBook)
    } else {
      res.status(404).json({ error: `Book with id number ${bookId} does not excist`, details: 'error' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid request', details: 'error' })
  }
})

// Enpoint to get author by path param for boook id
app.get('/books/:bookId/author', async (req, res) => {
  const { bookId } = req.params

  try {
    const singleBook = await (await Book.findById(bookId)).populate('authors')
    if (singleBook) {
      const author = await Author.findById(singleBook.authors)
      res.json(author)
    } else {
      res.status(404).json({ error: 'Author not found', details: 'error' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid request', details: 'error' })
  }
})

// Endpoint to get author id by path param
app.get('/authors/:authorID', async (req, res) => {
  const { authorID } = req.params

  try {
    const author = await Author.findById(authorID)
    if (author) {
      res.json(author)
    } else {
      res.status(404).json({ error: `Author with ${authorID} not found`, details: 'error' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' })
  }
})

// Endpoint to get all books from author id by path param
app.get('/author/:authorID/books', async (req, res) => {
  const { authorID } = req.params

  try {
    const author = await Author.findById(authorID)
    if (author) {
      const books = await Book.find({ authors: mongoose.Types.ObjectId(author.id) })
      res.json(books)
    } else {
      res.status(404).json({ error: 'Author id not found', details: 'error' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid request' })
  }
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
