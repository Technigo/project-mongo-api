import express from 'express'
import listEndpoints from 'express-list-endpoints'
import cors from 'cors'
import mongoose from 'mongoose'
import booksdata from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const bookSchema = new mongoose.Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  num_pages: Number
})

const Book = mongoose.model('Book', bookSchema)

if (process.env.RESET_DB) {
  const seedDataBase = async () => {
    await Book.deleteMany()

    await booksdata.forEach((item) => {
      const newBook = new Book({
        bookID: item.bookID,
        title: item.title,
        average_rating: item.average_rating,
        num_pages: item.num_pages
      })
      newBook.save()
    })
  }
  seedDataBase()
}

const port = process.env.PORT || 8081
const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send(listEndpoints(app))
})

app.get('/books', async (req, res) => {
  const { bookTitle } = req.query

  if (bookTitle) {
    const books = await Book.find({
      title: {
        $regex: new RegExp(bookTitle, "i")
      }
    })
    res.json(books)
  } else {
    const books = await Book.find()
    res.json(books)
  }

  const books = await Book.find()
  res.json(books)
})

app.get('/books/:bookId', async (req, res) => {
  const { bookId } = req.params
  
  try {
    const singleBook = await Book.findById(bookId)
    res.json(singleBook)
  } catch (error) {
    res.status(404).json({ error: 'Could not find book with this ID', details: error })
  }
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
