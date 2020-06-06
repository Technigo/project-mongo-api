import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from './data/books.json'
import Book from './models/book'
import Author from './models/author'

// DATABASE
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/project-mongo'
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


// RESET DATABASE
if (process.env.RESET_DATABASE) {
  console.log(booksData.length)
  console.log('Resetting data')

  const seedDatabase = async () => {
    await Book.deleteMany()
    await Author.deleteMany()
    await booksData.forEach((author) => new Author(author).save())
    await booksData.forEach((book) => new Book(book).save())
  }
  seedDatabase()
}


// SERVER
// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example: PORT=9000 npm start
const port = process.env.PORT || 8080


// INSTANCE
// Creates an instance of express which gives access to all functions from express to create a server
const app = express()


// MIDDLEWARES
// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


// SERVER CONNECTION CHECK
// Error handling when the server is not connected
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Error message' })
  }
})


// API ENDPOINTS
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/authors', async (req, res) => {
  const authors = await Author.find()
  console.log(`Found ${authors.length} authors..`)
  res.json(authors)
})

app.get('/books', async (req, res) => {
  const { title } = req.query;
  const queryRegex = new RegExp(title, 'i')
  const books = await Book.find({ title: queryRegex }).populate('authors').sort({
    average_rating: -1,
  })
  console.log(`Found ${books.length} books..`)
  res.json(books);
})

app.get('/books/:isbn', async (req, res) => {
  const { isbn } = req.params
  const book = await Book.findOne({ isbn: isbn })
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ error: `Could not find book with isbn=${isbn}` })
  }
})

// START SERVER
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
