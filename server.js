import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'
import Book from './models/book'

//connecting to the database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

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

//what is the correct error message here? 
//limit is amount of search results for a single page
//i stands for ignore case -->in regexp
//math.ceil rounds the number up to the next largest integer.
app.get('/books', async (req, res) => {
  const { title, author, rating, page = 1, limit = 10 } = req.query
  const titleRegex = new RegExp(title, 'i')
  const authorRegex = new RegExp(author, 'i')

  try {
    const sortBooks = (rating) => {
      if (rating === 'high') {
        return {average_rating: - 1}
      } else if (rating === 'low') {
        return {average_rating: 1}
      }
    }

    const books = await Book.find({
      title: titleRegex,
      authors: authorRegex
    })
      .sort(sortBooks(rating))
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()
    
    //gets total amount of documents in the Book collection
    //totalPages - takes the above and divides it with the limit(nr of results per page) to get the total amount of pages
    const count = await Book.countDocuments()
    res.json({
      books,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch(err) {
    res.status(404).json({ error: 'books not found'})
  }
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
