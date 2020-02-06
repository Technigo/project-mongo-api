import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project_mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 9001
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Mongoose model of books
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

if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({})

    booksData.forEach((bookData) => {
      new Book(bookData).save()
    })
  }
  seedDatabase()
}

// Start defining the routes
app.get('/', (req, res) => {
  res.send('Books API')
})

// Return the array with all the book objects
app.get('/books', (req, res) => {
  const { language } = req.query
  const queryString = req.query.title 
  const queryRegex = new RegExp(queryString, "i")
 
// Using query for language code
// For example, http://localhost:9001/?language=eng will return books with English language code
  if(language) {
   Book.find({'language_code': language})
     .then((results) => {
       console.log('Found')
       res.json(results)
      }) .catch((err) => {
        console.log('Error ' + err)
        res.json({message: 'Cannot find book', err: err}) 
    })
  }

// Using query for title
// For example, http://localhost:9001/books?title=Harry will return books with 'Harry' in the title
// Also, the books are sorted by average rating from the highest to lowest
  Book.find({'title': queryRegex})
    .sort({'average_rating': -1})
    .then((results) => {
      console.log('Found')
      res.json(results)
    }) .catch((err) => {
       console.log('Error ' + err)
       res.json({message: 'Cannot find book', err: err}) 
    })
})

// Return an individual book object with a specific isbn-number
app.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn 
  Book.findOne({'isbn': isbn})
    .then((results) => {
      res.json(results)
    }) .catch((err) => {
      res.json({message: 'Cannot find the book', err: err})
    })
})

// Return an individual book object with a specific id
app.get('/books/_id/:_id', (req, res) => {
  const _id = req.params._id
  Book.findOne({'_id': _id})
    .then((results) => {
      res.json(results)
    }) .catch((err) => {
      res.json({message: 'Cannot find this book', err: err})
    })
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})