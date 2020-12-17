import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import mongoose from "mongoose"

import booksData from "./data/books.json"

// CODE FOR DATABASE
const mongoUrl =
  process.env.MONGO_URL || "mongodb://localhost/project-mongo-api"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// BOOK MODEL
const Book = mongoose.model("Book", {
  bookID: {
    type: Number,
  },
  title: {
    type: String,
  },
  authors: {
    type: String,
  },
  average_rating: {
    type: Number,
  },
  isbn: {
    type: String,
  },
  isbn13: {
    type: String,
  },
  language_code: {
    type: String,
  },
  num_pages: {
    type: Number,
  },
  ratings_count: {
    type: Number,
  },
  text_reviews_count: {
    type: Number,
  },
})

// RESET DATABASE - Deleting existing data to prevent dublicates
if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Book.deleteMany()
    await booksData.forEach((book) => new Book(book).save())
  }
  seedDatabase()
}

// SERVER
const port = process.env.PORT || 8080
const app = express()

// MIDDLEWARES
app.use(cors())
app.use(bodyParser.json())

// ROUTES
app.get("/", (req, res) => {
  res.send("This is an API with books")
})

// ENDPOINT BOOKS
app.get("/books", async (req, res) => {
  const { author, title, language } = req.query
  let allBooks = await Book.find({
    authors: new RegExp(author, "i"),
    title: new RegExp(title, "i"),
    language_code: new RegExp(language, "i"),
  })
  res.json(allBooks)
})

// ENDPOINT SINGLE BOOK
app.get("/books/:id", async (req, res) => {
  const { id } = req.params
  const singleBook = await Book.findOne({ bookID: id })

  if (singleBook) {
    res.json(singleBook)
  } else {
    res.status(404).json({ error: "Book not found " })
  }
})

// START SERVER
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})