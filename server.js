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

// Book.deleteMany().then(() => {

//   new Book({
//     "bookID": 1,
//     "title": "Harry Potter and the Half-Blood Prince (Harry Potter  #6)",
//     "authors": "J.K. Rowling-Mary GrandPré",
//     "average_rating": 4.56,
//     "isbn": 439785960,
//     "isbn13": 9780439785969,
//     "language_code": "eng",
//     "num_pages": 652,
//     "ratings_count": 1944099,
//     "text_reviews_count": 26249
//   }).save()

//   new Book({
//     "bookID": 2,
//     "title": "Harry Potter and the Order of the Phoenix (Harry Potter  #5)",
//     "authors": "J.K. Rowling-Mary GrandPré",
//     "average_rating": 4.49,
//     "isbn": 439358078,
//     "isbn13": 9780439358071,
//     "language_code": "eng",
//     "num_pages": 870,
//     "ratings_count": 1996446,
//     "text_reviews_count": 27613
//   }).save()

//   new Book({
//     "bookID": 3,
//     "title": "Harry Potter and the Sorcerer's Stone (Harry Potter  #1)",
//     "authors": "J.K. Rowling-Mary GrandPré",
//     "average_rating": 4.47,
//     "isbn": 439554934,
//     "isbn13": 9780439554930,
//     "language_code": "eng",
//     "num_pages": 320,
//     "ratings_count": 5629932,
//     "text_reviews_count": 70390
//   }).save()
// })

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
  //TODO: update with all possible endpoints
  response.send("Hello, visitor. Endpoints with data: / -> the front page, /books -> returns a list of all books, ")
})

// --- returns all books ---
//localhost:8080/books
app.get('/books', async (request, response) => {

  const books = await Book.find()
  response.json(books)
})

// --- returns a book based on its ISBN13
//localhost:8080/id/:isbn13


// ---TODO: returns book by isbn13 ---
app.get("/books/:isbn13", async (request, response) => {

  //get isbn13 from the endpoint
  const bookId = request.params.isbn13
  console.log(`Isbn13: ${bookId}`)

  // compare the number to one in the database
  const bookISBN13 = await Book.findOne({ isbn13: bookId })

  if (bookISBN13) {
    response.json(bookISBN13)
  } else {
    response.status(404).json({ error: `The book with ISBN13 ${bookId} was not found.` })
  }
})

// --- retuns all authors ---
// I guess I need a new collection (authors only?) to do that?
// app.get("/authors", async (request, response) => {
//   const authors = await Books.find()
//   response.json(authors)
// })

// ---- returns the first document with searched author ----
//TODO: returns all books from an author -> need to connect the books with authors 
app.get("/:author", (request, response) => {

  //includes function
  // await Book.filter({ author: req.params.author.toLocaleLowerCase() })
  //define what can be included -> input can be lowercase, compare to lowercased db entry

  Book.findOne({ authors: req.params.authors }).then(book => {
    if (book) {
      res.json(book)
    } else {
      res.status(404).json({ error: `Author not found` })
    }
  })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
