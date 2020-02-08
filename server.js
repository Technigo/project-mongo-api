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
    type: Number
  },
  isbn13: {
    type: Number
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
  },
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({})

    booksData.array.forEach((book) => {
      new Book(book).save()
    });
  }
  seedDatabase()
}


const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailble' })
  }
})


app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get('/books', (req, res) => {
  const queryString = req.query.q;
  const queryRegex = new RegExp(queryString, 'i');
  Book.find({ 'title': queryRegex })
    .then((results) => {
      console.log('Found ' + results);
      res.json(results);
    }).catch((err) => {
      console.log('Error ' + err);
      res.json({ message: 'Cannot find this book' })
    })
})

app.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  Book.findOne({ 'isbn': isbn })
    .then((results) => {
      res.json(results);
    }).catch((err) => {
      console.log({ message: 'Error ' + err })
      res.json({ message: 'Cannot find this book' })
    })
})

app.get('/authors', async (req, res) => {
  const queryString = req.query.author
  const authorRegex = new RegExp(queryString, 'i')
  Book.find({ 'authors': authorRegex })
    .then((results) => {
      console.log('Found ' + results);
      res.json(results);
    }).catch((err) => {
      console.log('Error ' + err);
      res.json({ message: 'Cannot find this author' })
    })
})


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
