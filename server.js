import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Book = mongoose.model('Book', {
  bookID: { type: Number},
  title: { type: String},
  authors: { type: String},
  average_rating: { type: Number},
  isbn: { type: Number},
  isbn13: { type: Number},
  language_code: { type: String},
  num_pages: { type: Number},
  ratings_count: { type: Number},
  text_reviews_count: { type: Number}
})

if(process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Book.deleteMany({})
    
    booksData.forEach((bookData) => {
      new Book(bookData).save()
    })
  }
  seedDatabase()
}

const port = process.env.PORT || 2000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const myEndpoints = require("express-list-endpoints");
// Start defining your routes here
app.get("/", (request, response) => {
  response.send(myEndpoints(app));
});

app.get('/books', async (req,res) => {
  const { title, author, sprt} = req.query
  const titleRegex = new RegExp(title, 'i')
  const authorRegex = new RegExp(author, 'i')

  const sortQuery = (sort) => {
    if (sort === 'rating') {
      return { average_rating: -1}
    }
  }
  const books = await Book.find({
    title: titleRegex,
    authors: authorRegex
  })
  .sort(sortQuery(sort))
  res.json(books)
})

// app.get('/authors', async (req, res) => {
//   const authors = await Author.find()
//   res.json(authors)
// })

app.get('/books/:id', async (req, res) => {
  const book = await Book.findById(req.params.id)
  if (book) {
    res.json(book)
  } else {
    res.status(404).json({ error: 'Book not found' })
  }
})

app.get('/authors/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
    res.json(books)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
