/* eslint-disable no-console */
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import booksData from './data/books.json'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Books schema
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

// Book Model (with schema added)
// mongo creates collection and calls it with lowercase and adds s to end = books
const Book = mongoose.model('Book', bookSchema)

const authorSchema = mongoose.Schema({
  authors: String
})

const Author = mongoose.model('Author', authorSchema)

// Function to seed/inject data to database
// if to run function only when we wan to
// newBook.save is async - server to backend
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
    // New Book(item).save()
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

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello Books')
})

app.get('/books', async (req, res) => {
  const { author } = req.query

  try {
    if (author) {
      const books = await Book.find({ 
        authors: {
          $regex: new RegExp(author, "i")
        }
      })
      res.json(books)
    } else {
      const books = await Book.find()
      res.json(books)
    }
  } catch (error) {
    res.status(404).json({ error: 'Something went wrong', details: 'error' })
  }
})

app.get('/books/:bookId', async (req, res) => {
  const { bookId } = req.params

  try {
    const singleBook = await Book.findById(bookId)

    res.json(singleBook)
  } catch (error) {
    res.status(404).json({ error: `Book with id number ${bookId} does not excist`, details: 'error' })
  }
})

app.get('/books/title/:bookTitle', async (req, res) => {
  const { bookTitle } = req.params

  try {
    const singleBook = await Book.findOne({
      title: {
        $regex: new RegExp(bookTitle, "i")
      }
    })
    if (singleBook) {
      res.json(singleBook)
    } else {
      res.status(404).json({ error: `Book with title ${bookTitle} does not exist`, details: 'error' })
    }
  } catch (error) {
    res.status(400).json({ error: 'Something went wrong', details: 'error' })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
