import express, { request, response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import booksData from './data/books.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo" //url to our database
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

//custom model via constructor mongoose.model
const Book = mongoose.model("Book", {
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

//custom environmental variable
if (process.env.RESET_DATABASE) {

  const populateDatabase = async () => {

    //after this line of code is executed, lines 38- can continue
    await Book.deleteMany()

    booksData.forEach(book => {

      //new document
      const newBook = new Book(book)

      //saving the document to database
      newBook.save()
    })
  }
  populateDatabase()
}


// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
//localhost:8080/
app.get("/", (request, response) => {

  response.send("Endpoints with data: / -> the front page, /books -> returns a list of all books, books/:isbn13 -> returns a single book")
})


// --------------- returns all books ------------------
//localhost:8080/books
app.get('/books', async (request, response) => {

  const books = await Book.find()

  response.json(books)
})


//---------- returns book by isbn13---------------------
//localhost:8080/books/9780060920081
app.get("/books/:isbn13", async (request, response) => {

  //get isbn13 from the endpoint
  const bookId = request.params.isbn13

  const bookISBN13 = await Book.findOne({ isbn13: bookId })

  if (bookISBN13) {
    response.json(bookISBN13)
  } else {
    response.status(404).json({ error: `The book with ISBN13 ${bookId} was not found.` })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
