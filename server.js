import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import books from './data/books.json'
import Book from './model/book'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise



if (process.env.RESET_DATABASE) {
  console.log('Resetting database')

  const seedDatabase = async () => {
      await Book.deleteMany()
      await booksData.forEach((book) => new Book(book).save())
  }
  seedDatabase()
}

// PORT
const port = process.env.PORT || 8080
const app = express()


// MIDDLEWARES
app.use(cors())
app.use(bodyParser.json())


// DISCONNECTED DATABASE
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})


// ROUTES
app.get('/', (req, res) => {
  res.send(`
  <h1>500 book reviews</h1>
  <h3>Read moore...</h3>
  <li>/books</li>
  <li>/books/autors/:authors</li>
  <li>/books/ID/:bookID</li>
  `)
})



// List of all books
app.get('/books', async (req, res) => {
  const item = await Book.find();

  if ( item.length > 0  ) {
    res.json(item)
  } else {
    res.status(404).json({ message: `Error` })
  }
});

// Route for single book by id
app.get('/books/ID/:bookID', async ( req, res ) => {
  const { bookID } = req.params
  const booksByID = await Book.findOne({ bookID: bookID })

  if ( booksByID) {
    res.json(booksByID)
  } else {
    res.status(404).json({ message: `Error, can not find the book.` })
  }
})



// Find books by author 
app.get('/books/authors/:authors', async ( req, res ) => {
  const { authors } = req.params
  const booksByAuthors = await Book.find({ authors: authors })

  if ( booksByAuthors.length > 0 ) {
    res.json({ totalResults: booksByAuthors.length, booksByAuthors})
  } else {
    res.status(404).json({ message: `Error` })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
