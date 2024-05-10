import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import expressListEndpoints from "express-list-endpoints"
import booksData from "./data/books.json"

const port = process.env.PORT || 8080
const app = express()
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/book-site"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

//Schemas and models
const { Schema } = mongoose

const bookSchema = new Schema({
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
})

const Book = mongoose.model("Book", bookSchema)

//Function for seeding the database
if (process.env.RESET_DB) {
  console.log("Resetting database.")

  const seedDatabase = async () => {
    await Book.deleteMany()

    booksData.forEach((book) => {
      new Book(book).save()
    })   
  }
  seedDatabase()
}

// Start defining your routes here
app.get("/", (req, res) => {
  res.send(endpoints)
})

/*app.get("/authors", async (req, res) => {
  const authors = await Author.find();
  res.json(authors)
})

*/

// Get all books
app.get("/books", async (req, res) => {
  const books = await Book.find()

  if (books.length > 0) {
    res.json(books)
  } else {
    res.status(404).json({ error: "No books found." })
  }
})

// Query to sort by rating
app.get("/books/popular", async (req, res) => {
  const popularBooks = await Book.find().sort({ average_rating: -1 })
  res.json(popularBooks)
})

// Get one book based on id
app.get("/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id).exec()

  if (book) {
    res.json(book)
  } else {
    res.status(404).json({ error: "No book found." })
  }
})

// Get a list of authors
/*app.get("/authors", async (req, res) => {
  const books = await Book.find()
  const authors = books.sort({authors})
    .map((book) => book.artistName)
  //const uniqueAuthors = [...new Set(authors)]
  res.json(authors)
})*/

// Get all books from an author
app.get("/authors/:author", async (req, res) => {
  const authorName = req.params.author
  const booksFromAuthor = await Book.find({ 
      authors: { $regex: authorName, $options: "i" } 
    })
  if (booksFromAuthor.length > 0) {
    res.json(booksFromAuthor)
  } else {
    res.status(404).json({ error: "No books found by the author." })
  }
})

// Query to find a title.toLowerCase().replace(/ /g, "-").replace(".", "")



const endpoints = expressListEndpoints(app)

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
