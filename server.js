import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

//connecting to the database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8081
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

//is the database working- catch if not
//if next isn't invoked than express won't call the next line of code.
//use mongoose ready state. if 1 then connected
app.use((req, res, next) => {
  if(mongoose.connection.readyState === 1){
    next()
  } else {
    res.status(503).json({ error: 'service unavailable' })
  }
})

//second param --> object--> called schema
//start with capital letter reserved for Models in Mongoose.
//string is going to be name of collection with the 1st string param -->  start with lower case and with and ends with an s
const Book = new mongoose.model('Book', {
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

//clean database before population
//stop until deleteMany is finished--> only populate after the data base is clean
if (process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Book.deleteMany()

    booksData.forEach(book => {
      const newBook = new Book(book)
      newBook.save()
    })
  }
  populateDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello again world')
})

//why would you have an error message here? 
//i stands for ignore case -->in regexp
app.get('/books', async (req, res) => {
  const { title, author, rating } = req.query
  const titleRegex = new RegExp(title, 'i')
  const authorRegex = new RegExp(author, 'i')

  const sortBooks = (rating) => {
    if (rating === 'high') {
      return {average_rating: -1}
    } else if (rating === 'low') {
      return {average_rating: 1}
    } else {
      return res.status(400).json({ error: 'invalid value. Sort by high or low' })
    }
  }

  const books = await Book.find({
    title: titleRegex,
    authors: authorRegex
  })
    .sort(sortBooks(rating))

  res.json(books)
})

//findOne returns one element. returns an object instead of an array with an object
app.get('/books/book/:id', async (req, res) => {
  try {
    const bookId = await Book.findOne({ bookID: req.params.id })
    if (bookId) {
      res.json(bookId)
    } else {
      res.status(404).json({ error: 'book not found'})
    }
  } catch (err) {
    res.status(400).json({ error: 'invalid id'})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
