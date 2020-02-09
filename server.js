import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


const Book = mongoose.model('Book', {
  bookID: {
    type: String
  },
  title: {
    type: String
  },
  authors: {
    type: String
  },
  average_rating: {
    type: Number
  },
  isbn: {
    unique: true,
    type: Number
  },
  isbn13: {
    type: Number
  },
  language_code: {
    type: String
  },
  num_pages: {
    type: Number
  },
  ratings_count: {
    type: Number
  },
  text_reviews_count: {
    type: Number
  }
})

const addBooksToDatabase = () => {
  // await Book.deleteMany
  booksData.forEach((book) => {
    new Book(book).save()
  })
}
// addBooksToDatabase()

const port = process.env.PORT || 9000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/books', (req, res) => {
  const queryString = req.query.query
  const queryRegex = new RegExp(queryString, "i")
  Book.find({ 'title': queryRegex })
    .sort({ 'average_rating': -1 })
    .then((results) => {
      //if it works
      console.log('Found : ' + results)
      res.json(results)
    }).catch((err) => {
      //if it doesn't work
      console.log('Error ' + err)
      res.json({ message: "No books found", err: err })
    })
})


app.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn
  Book.findOne({ 'isbn': isbn })
    .then((results) => {
      res.json(results)
    }).catch((err) => {
      res.json({ message: "Book not found", err: err })
    })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
