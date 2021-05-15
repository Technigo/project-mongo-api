import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo-books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const bookSchema = new mongoose.Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,

  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

const Book = mongoose.model('Book', bookSchema)

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany()
    await booksData.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })
  }
  seedDatabase()
}


//   PORT=9000 npm start
const port = process.env.PORT || 9007
const app = express()


app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/books', async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

app.get('/books/:bookId', async (req, res) => {
  const { bookId } = req.params
  const singleBook = await Book.findOne({ _id: bookId })
  res.json(singleBook)
})

app.get('/books/author/:authors', async (req, res) => {
  const { authors } = req.params
  const singleAuthor = await Book.find({ author: authors })
  res.json(singleAuthor)
})


// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
