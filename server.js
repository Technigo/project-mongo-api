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

const Author = mongoose.model('Author', {
  name: String
})

if(process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Author.deleteMany()
    
    const tolkien = new Author ({name: 'J.R.R Tolkien'})
    await tolkien.save()
  
    const rowling = new Author({name: 'J.K Rowling'})
    await rowling.save()
  }
  seedDatabase()
}
// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 3800
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

const Books = new mongoose.model('Books', {
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

if(process.env.RESET_DATABASE) {
  const populateDatabase = async () => {
    await Books.deleteMany()
  
    booksData.forEach(item => {
      const newBook = new Books(item)
      newBook.save()
    })
  }
  populateDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/authors', async (req,res) => {
  const authors = await Author.find()
  res.json(authors)
})

app.get('/books', async (req, res) => {
  const allBooks = await Books.find()
  res.json(allBooks)
})

app.get('/books/:id', async (req,res) => {
  const singleBook = await Books.findOne({ id: req.params.id})
  res.json(singleBook)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
