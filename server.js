import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

//Code to set up Mongo database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//Creating schema with data types
const bookSchema = new mongoose.Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: String,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

//Creating Book model
const Book = mongoose.model('Book', bookSchema)

//Seeding the database. Will only run if
// RESET_DB environment variable is present and is true
if (process.env.RESET_DB) {
  const seedDB = async () => {
    //Function strats by deleting previous data to prevent duplicates
    await Book.deleteMany()

    //Creating  a new Book entry for each book
    booksData.forEach(book => {
      const newBook = new Book(book)
      newBook.save()
    })
  }
  seedDB()
}

const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// An endpoint to get all books in the list or filter by title, author or language
app.get('/books', async (req, res) => {
  const { title, authors, language_code } = req.query

  if (title) {
    const booksToSend = await Book.find({
      title: {
        $regex: new RegExp(title, 'i')}//i is not case sensitive
    })
    res.json(booksToSend)
  }

  if (authors) {
    const booksToSend = await Book.find({
      authors: {
        $regex: new RegExp(authors, 'i')}
    })
    res.json(booksToSend)
  }

  if (language_code) {
    const booksToSend = await Book.find({
      language_code: {
        $regex: new RegExp(language_code, 'i')}
    })
    res.json(booksToSend)
  }

  const booksToSend = await Book.find()
  res.json(booksToSend)
})

//An endpoint to query by book id
app.get('/books/:id', async (req, res) => {
  const { id } = req.params
  //const id = req.params.id //old version of destracturing
  //const singleBook = await Book.findOne({ _id: id })//.find() returns an array of objects, to have only an object we use .findOne()
  try {
    const singleBook = await Book.findById(id)//alternative to .findOne()
    res.json(singleBook)
  } catch(error) {
    res.status(404).json({ error: `Sorry, there is no book with id ${id}`, details: error })
  }

})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
