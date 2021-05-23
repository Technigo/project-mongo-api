/* eslint-disable no-shadow */
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import listEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

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
    type: String,
    lowercase: true
  },
  average_rating: Number,
  isbn: {
    type: String,
    lowercase: true
  },
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

// RESET_DB=true npm run dev
if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Book.deleteMany()

    booksData.forEach((item) => {
      new Book(item).save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

// list with all endpoints
app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

// query to get all books or filter on author and/or title
app.get('/books', async (req, res) => {
  const { author, title } = req.query
  const authorRegex = new RegExp(author, 'i')
  const titleRegex = new RegExp(title, 'i')

  try {
    const books = await Book.find({
      authors: authorRegex,
      title: titleRegex
    })
    res.json(books)
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong', details: error })
  }
})

// find book based on id
app.get('/books/:id', async (req, res) => {
  const { id } = req.params
  
  try {
    const findId = await Book.findById(id)
    if (findId) {
      res.json(findId)
    } else {
      res.status(404).json('Sorry, no book found with that ID')
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid request', details: error })
  }
})

// find book based on ISBN
app.get('/books/isbn/:isbn', async (req, res) => {
  try {
    const findIsbn = await Book.findOne({ isbn: req.params.isbn })

    if (findIsbn) {
      res.json(findIsbn)
    } else {
      res.status(404).json('Sorry, no book with that ISBN')
    }
  } catch (error) {
    res.status(400).json({ error: 'Invalid ISBN', details: error })
  }
})

// endpoint to get a list with the 10 books that has the highest rating
app.get('/top10', async (req, res) => {
  const top10 = await Book.find().sort({ average_rating: -1 }).limit(10).exec()
  res.json(top10)
})

app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
