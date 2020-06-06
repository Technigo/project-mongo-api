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
  const seedDatabase = async () => {
    await Book.deleteMany()
    await Author.deleteMany()
    // await booksData.forEach((book) => new Book(book).save());
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
  res.json(authors)
})

app.get('/books', async (req, res) => {
  const books = await Author.find().populate('author')
  res.json(books)
})

app.get('/books', async (req, res) => {
  const { query } = req.query;
  const queryRegex = new RegExp(query, 'i');
  const books = await Book.find({ title: queryRegex }).sort({
    average_rating: -1,
  });
  res.json(books);
});


// START SERVER
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
