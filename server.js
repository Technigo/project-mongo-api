import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import listEndpoints from 'express-list-endpoints'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//creating schema with data types
const bookSchema = new mongoose.Schema({
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
})

//creating model
const Book = mongoose.model('Book', bookSchema)

//seeding database
if (process.env.Reset_DB) {
  const seedDB = async () => {
    //deleting previous data
    await Book.deleteMany()
    //creating new entry for each book
    booksData.forEach(item => {
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

// ROUTES
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/books', async (req, res) => {
  Book.find().then(data => {
    res.json(data)
  })
})

//endpoints returning single elements
app.get('/books/:bookId', async (req, res) => {
  const { bookId } = req.params

  try {
    const singleBook = await Book.findOne({ _id: bookId })
    if (singleBook){
      res.json(singleBook)
    } else {
      res.status(404).json({ error: 'Book not found' })
    }
  } catch(error) {
    res.status(400).json({ error: 'something went wrong - sorry about that', details: error })
  }
})

app.get('/books/book/:bookIsbn', async (req, res) => {
  const { isbn } = req.params

  try {
    const singleBook = await Book.findOne({ bookIsbn: isbn })
    if (singleBook) {
      res.json(singleBook)
    } else {
      res.status(404).json({ error: 'Book not found' })
    }
  } catch(error) {
    res.status(400).json({ error: 'something went wrong - sorry about that', details: error })
  }
})

//endpoint returning array of elements
app.get('/books/', async (req, res) => {
  const { language_code, authors, title } = req.query

if (language_code)  {
  const booksArray = await Book.find({
    language_code: {
      $regex: new RegExp(language_code, 'i')}
  })
  res.json(booksArray)
}

if (authors)  {
  const booksArray = await Book.find({
    authors: {
      $regex: new RegExp(authors, 'i')}
  })
  res.json(booksArray)
}

if (title)  {
  const booksArray = await Book.find({
    title: {
      $regex: new RegExp(title, 'i')}
  })
  res.json(booksArray)
}

  const booksArray = await Book.find()
  res.json(booksArray)
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
