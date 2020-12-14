import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose, { connection } from 'mongoose'

import books from './data/books.json'

// Connects to mongodb
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo" // project-mongo will be the name of our database, we decide what to name it here
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8082
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
    await Book.deleteMany() // await makes it wait until this is finnished, as this takes some time, until you continue to the next line
    books.forEach(async item => {
      await new Book(item).save()
    })
  }
  populateDatabase()
}

// didn't work
// app.use((request, response, next) => {
//   if (connection.readyState === 1) {
//     next()
//   } else {
//     response.status(503).json({ error: 'Database unavailable' })
//   }
// })

// Routes are defined here
app.get('/', (request, response) => {
  response.send("Welcome to Annika's book API, this time with MongoDB")
})

app.get('/books', async (request, response) => {

  const search = request.query.search
  const language = request.query.language
  const sort = request.query.sort

  if (search && language && sort === 'rating-desc') {
    filteredBooks = await Book.find({
      $and: [{
        $or: [
          { authors: { $regex: ("\\b" + search + "\\b"), $options: "i" } },
          { title: { $regex: ("\\b" + search + "\\b"), $options: "i" } }
        ]
      },
      { language_code: { $regex: language, $options: "i" } }
      ]
    },
      'title authors language_code average_rating num_pages'
    ).sort(
      { average_rating: -1 }
    ).exec()
    if (filteredBooks.length > 0) {
      return response.json(filteredBooks)
    } else {
      return response.status(404).json({ error: "No such combination" })
    }
  }

  if (search && language && sort === 'pages-asc') {
    filteredBooks = await Book.find({
      $and: [{
        $or: [
          { authors: { $regex: ("\\b" + search + "\\b"), $options: "i" } },
          { title: { $regex: ("\\b" + search + "\\b"), $options: "i" } }
        ]
      },
      { language_code: { $regex: language, $options: "i" } }
      ]
    },
      'title authors language_code average_rating num_pages'
    ).sort(
      { num_pages: 1 }
    ).exec()
    if (filteredBooks.length > 0) {
      return response.json(filteredBooks)
    } else {
      return response.status(404).json({ error: "No such combination" })
    }
  }

  // if (sort !== 'rating-desc' || sort !== 'pages-asc') {
  //   return response.status(404).json({ error: "No such sorting" })
  // }

  if (search && language) {
    const filteredBooks = await Book.find({
      $and: [{
        $or: [
          { authors: { $regex: ("\\b" + search + "\\b"), $options: "i" } },
          { title: { $regex: ("\\b" + search + "\\b"), $options: "i" } }
        ]
      },
      { language_code: { $regex: language, $options: "i" } }
      ]
    },
      'title authors language_code average_rating num_pages'
    ).exec()
    if (filteredBooks.length > 0) {
      return response.json(filteredBooks)
    } else {
      return response.status(404).json({ error: "No such combination" })
    }
  }

  if (search && sort === 'rating-desc') {
    const filteredBooks = await Book.find({
      $or: [
        { authors: { $regex: ("\\b" + search + "\\b"), $options: "i" } },
        { title: { $regex: ("\\b" + search + "\\b"), $options: "i" } }
      ]
    },
      'title authors language_code average_rating num_pages',
    ).sort(
      { average_rating: -1 }
    ).exec()
    if (filteredBooks.length > 0) {
      return response.json(filteredBooks)
    } else {
      return response.status(404).json({ error: "No such combination" })
    }
  }

  if (search && sort === 'pages-asc') {
    const filteredBooks = await Book.find({
      $or: [
        { authors: { $regex: ("\\b" + search + "\\b"), $options: "i" } },
        { title: { $regex: ("\\b" + search + "\\b"), $options: "i" } }
      ]
    },
      'title authors language_code average_rating num_pages',
    ).sort(
      { num_pages: 1 }
    ).exec()
    if (filteredBooks.length > 0) {
      return response.json(filteredBooks)
    } else {
      return response.status(404).json({ error: "No such combination" })
    }
  }

  if (search) {
    const filteredBooks = await Book.find({
      $or: [
        { authors: { $regex: ("\\b" + search + "\\b"), $options: "i" } },
        { title: { $regex: ("\\b" + search + "\\b"), $options: "i" } }
      ]
    },
      'title authors language_code average_rating num_pages'
    ).exec()
    if (filteredBooks.length > 0) {
      return response.json(filteredBooks)
    } else {
      return response.status(404).json({ error: "No title match" })
    }
  }

  else {
    const books = await Book.find({}, 'title authors language_code average_rating num_pages').exec()
    response.json(books)
  }
})

app.get('/books/:id', async (request, response) => {
  try {
    const book = await Book.findById({ _id: request.params.id }, 'title authors language_code average_rating num_pages').exec()
    if (book) {
      response.json(book)
    } else {
      response.status(404).json({ error: "Book not found" })
    }
  }
  catch (error) {
    response.status(400).json({ error: "Invalid book id" })
  }
})

// Starts the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
