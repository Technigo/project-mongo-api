import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose, { connection } from 'mongoose'

import books from './data/books.json'

// Connects to mongodb
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8081
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Create mongoose model for Book
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

if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Book.deleteMany()
    books.forEach(async item => {
      await new Book(item).save()
    })
  }
  populateDatabase()
}

app.use((request, response, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    response.status(503).json({ error: 'Database unavailable' })
  }
})

const filteredFields = 'title authors language_code average_rating num_pages'

// Routes are defined here
app.get('/', (request, response) => {
  response.send("Welcome to Annika's book API, this time with MongoDB")
})

app.get('/books', async (request, response) => {

  const search = request.query.search
  const language = request.query.language
  const sort = request.query.sort

  let books = []
  let findTitle = null
  let findAuthor = null
  let findLanguage = null
  let sortBooks = null

  if (search) {
    findTitle = { $regex: ("\\b" + search + "\\b"), $options: "i" }
    findAuthor = { $regex: ("\\b" + search + "\\b"), $options: "i" }
  } else {
    null
  }

  if (language) {
    findLanguage = { $regex: language, $options: "i" }
  } else {
    null
  }

  if (sort) {
    if (sort === 'pages-asc') {
      sortBooks = { num_pages: 1 }
    } else if (sort === 'rating-desc') {
      sortBooks = { average_rating: -1 }
    } else {
      return response.status(404).json(
        { error: "Wrong sort input" }
      )
    }
  } else {
    null
  }

  if (search && language && sort || search && language || search & sort || language && sort) {
    books = await Book.find({
      $and: [{
        $or: [
          { authors: findAuthor },
          { title: findTitle }
        ]
      },
      { language_code: findLanguage }
      ]
    },
      filteredFields
    ).sort(
      sortBooks
    ).exec()
  }

  if (search && !language || language && !search) {
    books = await Book.find({
      $or: [{
        $or: [
          { authors: findAuthor },
          { title: findTitle }
        ]
      },
      { language_code: findLanguage }
      ]
    },
      filteredFields
    ).sort(
      sortBooks
    ).exec()
  } else {
    null
  }

  if (sort && !search && !language || !sort && !search && !language) {
    books = await Book.find(
      {},
      filteredFields
    ).sort(
      sortBooks
    ).exec()
  }

  if (books.length > 0) {
    return response.json(books)
  } else {
    return response.status(404).json(
      { error: "Not found" }
    )
  }
})


app.get('/books/:id', async (request, response) => {
  try {
    const book = await Book.findById(
      { _id: request.params.id },
      filteredFields
    ).exec()
    if (book) {
      response.json(book)
    } else {
      response.status(404).json(
        { error: "Book not found" }
      )
    }
  }
  catch (error) {
    response.status(400).json(
      { error: "Invalid book id" }
    )
  }
})

// Starts the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
