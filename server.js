import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

const Book = new mongoose.model('Book', {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: String,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Book.deleteMany()

    booksData.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })

  }
  populateDatabase()
}

app.get('/', (req, res) => {
  res.send(`Hello, Welcome to Sandra's API for books`)
})

app.get('/books', async (req, res) => {
  const allBooks = await Book
    .find({ authors: { "$regex": req.query.author ?? '' }, title: { "$regex": req.query.title ?? '' } })
    .sort({ title: 'asc', authors: -1 })
  res.json(allBooks)
})

app.get('/books/:id', async (req, res) => {
  const book = await Book.findById(req.params.id)
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: "Not found" });
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})



