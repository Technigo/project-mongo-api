/* eslint-disable linebreak-style */

import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Book = mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Book.deleteMany()

    booksData.forEach((item) => {
      const newBook = new Book(item)
      newBook.save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// Start defining your routes here

// endpoint to get all books

app.get('/', async (req, res) => {
  const books = await Book.find()
  res.json(books) 
})

// endpoint to get one book by id
app.get('/books/:bookId', async (req, res) => {
  const { bookId } = req.params

  try {
    const book = await Book.findById(bookId)
    res.json(book)
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong', details: error })
  }
})

// query by the author
app.get('/books', async (req, res) => {
  const { authors } = req.query
  try {
    if (authors) {
      const booksQueried = await Book.find({
        authors: {
          $regex: new RegExp(authors, "i")
        }
      })
  
      if (booksQueried.length > 0) {
        res.json(booksQueried)
      } else {
        res.status(404).json({ error: 'Not found' })
      }
    }
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong', details: error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
