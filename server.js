import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//Used schema just to try it out
const bookSchema = new mongoose.Schema({
  bookID: Number,
  title: {
    type: String,
    lowercase: true,
  },
  authors: {
    type: String,
    lowercase: true
  },
  average_rating: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

//Mongoose model
const Book = mongoose.model('Book', bookSchema)

// Seeds data
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany()
    await booksData.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })
  }
  seedDatabase()
}

// Defines the port the app will run on. 
const port = process.env.PORT || 8082
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// List all endpoints
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

//Endpoint to show all books
app.get('/books', async (req, res) => {
  const books = await Book.find(req.query)
  res.json(books)
})

//Endpoint to get a uniqe book id from one book
app.get('/books/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params
    const singleBook = await Book.findById(bookId)
    if (bookId) {
      res.json(singleBook)
    } else {
      res.status(404).json({ error: 'Id not found' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid book id', details: error })
  }
})

//Endpoint that shows one specifik booktitle
app.get('/books/title/:bookTitle', async (req, res) => {
  const { bookTitle } = req.params
  if (bookTitle) {
    const singleBookTitle = await Book.findOne({ title: bookTitle })
    res.json(singleBookTitle)
  }
})

//Endpoint that shows all the books from one specifik author
app.get('/books', async (req, res) => {
  const { authors } = req.query
  if (authors) {
    const books = await Book.find({
      authors: {
        $regex: new RegExp(authors, 'i')
      }
    })
    res.json(books)
  } else {
    const books = await Book.find()
    res.json(books)
  }
})

// Start the server
app.listen(port, () => { })
