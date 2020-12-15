import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 

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

//WHAT IF I WANT TO KEEP THE isbn: Number? HOW TO FIX ALL OF THEM TO type number?

//custom environmental variable
if (process.env.RESET_DATABASE) {

  const populateDatabase = async () => {

    //after this line of code is executed, lines 38- can continue
    await Book.deleteMany()

    booksData.forEach(book => {
      const newBook = new Book(book)
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
app.get('/', (req, res) => {
  Book.find().then(book => {
    res.json(book)
  })
})

app.get("/:authors", (req, res) => {
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
