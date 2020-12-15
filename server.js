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

const port = process.env.PORT || 8099
const app = express()

app.use(cors())
app.use(bodyParser.json())
 

const Book = mongoose.model('Book', {
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

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany()

    booksData.forEach((item) => {
      new Book(item).save()
    }) 
  }
  seedDatabase()
}

app.get('/', (req, res) => {
  res.send('Welcome!')
})

app.get('/books', async ( req, res) => {
  const allBooks = await Book.find()
  res.json(allBooks)
})

app.get('/books/book/:bookID', async (req, res) => {
  const oneBook = await Book.findOne( { bookID: req.params.bookID })
  if (oneBook) {
    res.json(oneBook)
  } else {
    res.status(404).json({ error: 'No book found with that ID' })
  }
})

app.get('/books/authors/:authorName', async (req, res) => {
  const AuthorName = req.params.authorName

  const authorBooks = await Book.find({ authors: { $regex : new RegExp(AuthorName, "i") } })
  // regex added so the search is non-case-sensitive

  if ( authorBooks.length === 0) {
    res.status(404).json('no books found by that author')
  } else {
    res.json(authorBooks)
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
