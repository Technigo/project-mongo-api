import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

//The name of the database - mongodb://localhost/books
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/mongo-project-books"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise


//AUTHOR MODEL: Should be the same variable name and model name. 
const Author = mongoose.model('Author', {
  name: String
})

//BOOK MODEL
const Book = mongoose.model('Book', {
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



//Wrap the seed in an enviorment variable to prevent it from re-run everytime we start the server.
if (process.env.RESET_DATABASE) {
  console.log('Resetting database!!')
  const seedDatabase = async () => {
    await Author.deleteMany()
    await Book.deleteMany()

    booksData.forEach((book) => {
      new Book(book).save()
    })

    const tolkien = new Author({ name: "J.R.R. Tolkien" })
    await tolkien.save()

    const rowling = new Author({ name: "J.K. Rowling" })
    await rowling.save()

    //   await new Book({ title: "Harry Potter and the Philosopher's Stone", author: rowling }).save()
    //   await new Book({ title: "Harry Potter and the Chamber of Secrets", author: rowling }).save()
    //   await new Book({ title: "Harry Potter and the Prisoner of Azkaban", author: rowling }).save()
    //   await new Book({ title: "Harry Potter and the Goblet of Fire", author: rowling }).save()
    //   await new Book({ title: "Harry Potter and the Order of the Phoenix", author: rowling }).save()
    //   await new Book({ title: "Harry Potter and the Half-Blood Prince", author: rowling }).save()
    //   await new Book({ title: "Harry Potter and the Deathly Hallows", author: rowling }).save()
    //   await new Book({ title: "The Lord of the Rings", author: tolkien }).save()
    //   await new Book({ title: "The Hobbit", author: tolkien }).save()
  }
  seedDatabase()
}

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 9090
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

//A function that recives a request, the response and the argument "next". 
//It will execute before the routes below, if it's not evoked next() it will block the code coming next. The conenction.readyState checks that the connection is good.
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Start defining your routes here
app.get('/', (req, res) => {
  res.json(booksData)
})

app.get('/authors', async (req, res) => {
  const authors = await Author.find()
  res.json(authors)
})

//http://localhost:9090/authors/5e3d235bba4169150e4600bf
app.get('/authors/:id', async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    if (author) {
      res.json(author)
    } else {
      res.status(404).json({ error: 'Author not found' })
    }
  } catch (err) {
    res.status(400).json({ error: 'Invalid book id' })
  }
})

// http://localhost:9090/books/5e3d22873cf95214f0714937
// app.get('/books/:id', async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id)
//     if (book) {
//       res.json(book)
//     } else {
//       res.status(404).json({ error: 'Book not found' })
//     }
//   } catch (err) {
//     res.status(400).json({ error: 'Invalid book id' })
//   }
// })

//http://localhost:9090/authors/5e3d23f8b187b7152aecbef2/books
app.get('/authors/:id/books', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
    res.json(books)
  } else {
    res.status(404).json({ error: 'Author not found' })
  }
})

// app.get('/books', async (req, res) => {
//   const books = await Book.find().populate('author')
//   res.json(books)
// })

//http://localhost:9090/books?title=harry
app.get('/books', (req, res) => {
  const queryString = req.query.title;
  const queryRegex = new RegExp(queryString, "i")
  console.log(queryString)
  Book.find({ 'title': queryRegex })
    .then((results) => {
      // console.log('Found : ' + results)
      res.json(results)
    }).catch((err) => {
      console.log('Error ' + err)
      res.json({ message: 'Cannot fint this book', err: err })
    })
})

//http://localhost:9090/books/439785960
app.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  Book.findOne({ 'isbn': isbn })
    .then((results) => {
      res.json(results)
    }).catch((err) => {
      res.json({ message: 'Cannot fint this book', err: err })
    })
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
