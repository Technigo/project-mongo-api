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
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "Service unavailable." })
  }
})

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
  const documentation = {
    Welcome: "Welcome to the Book API!",
    Endpoints: expressListEndpoints(app).map((endpoint) => {
      return {
        path: endpoint.path,
        methods: endpoint.methods,
        middlewares: endpoint.middlewares,
      }
    }),
    QueryParameters: {
      title: "Filter books by name (case-insensitive).",
      sortByRating: "Sort books by rating (true/false)."
    }
  }
  res.json(documentation)
})

// Get all books
app.get("/books", async (req, res) => {
  let books = await Book.find()
  //Query to search for title
  const title = req.query.title
  //Query to sort by rating
  const sortByRating = req.query.sortByRating

  if (title) {
    books = await Book.find({ title: { $regex: title, $options: "i" }})
  } 
  
  if (sortByRating) {
    books = await Book.find().sort({ average_rating: -1 })
  }

  if (books.length > 0) {
    res.json(books)
  } else {
    res.status(404).json({ error: "No books found." })
  }
})

// Get one book based on id
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).exec()
    if (book) {
      res.json(book)
    } else {
      res.status(404).json({ error: "No book found." })
    }
  } catch (error) {
    res.status(400).json({error: "Invalid id."})
  }
})

// Get all books from an author
app.get("/books/author/:author", async (req, res) => {
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

// Get a list of authors
app.get("/authors", async (req, res) => {
  const authors = await Book.find().sort({ authors: 1 })
  res.json(authors.map((book) => book.authors))
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
