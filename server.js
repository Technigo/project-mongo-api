import express from 'express'
import bodyParser from 'body-parser'
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
  isbn: String,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({})

    booksData.forEach((bookData) => {
      new Book(bookData).save()
    })
  }
  seedDatabase()
}

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/books', async (req, res) => {
  const { title, author, sort } = req.query
  const titleRegex = new RegExp(title, 'i')
  const authorRegex = new RegExp(author, 'i')

  const sortQuery = (sort) => {
    if (sort === 'rating') {
      return { average_rating: -1 }
    }
  }

  const books = await Book.find({
    title: titleRegex,
    authors: authorRegex
  })
    .sort(sortQuery(sort))

  res.json(books)

})

app.get('/books/:id', async (req, res) => {
  const book = await Book.findById(req.params.id)
  if (book) {
    res.json(book)
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
