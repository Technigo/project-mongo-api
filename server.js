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
    type: Number
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
    type: String
  },
  isbn13: {
    type: String
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
});

const addBooksToDatabase = () => {
  booksData.forEach((book) => {
    new Book(book).save()
  })
}
// addBooksToDatabase()

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 5000
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

app.get('/books', (req, res) => {
  const queryString = req.query.q
  const queryRegex = new RegExp(queryString, "i")
  Book.find({ 'title': queryRegex })
    .then((results) => {
      // succesfull
      console.log('Found : ' + results)
      res.json(results)
    }).catch((err) => {
      console.log('Error ' + err)
      res.json({ message: 'Cannot find this book' })
    })
})

// app.get('/books/:isbn' (req,res) => {

// })

app.get('/', (req, res) => {
  res.send('Hello World')
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
