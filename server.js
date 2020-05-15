import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import booksData from "./data/books.json"
import dotenv from "dotenv"


dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-wk18" // create uniqe name for project
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//   PORT=9000 npm start  <-- VAD?

const port = process.env.PORT || 8080
const app = express()
// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

/* app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "service very unavailable" })
  }
}) */


//Mongoose model - VARFÖR KOMMER DET INTE UPP
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
  ratings_count: {
    type: Number,
  },
  isbn: {
    type: String,
  },
})

// Vill skapa ett object för author, som tar värdet av book..
const Author = mongoose.model("Author", {
  name: String,
  books: {  //[] for a list/ arr of books by author
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book"
  }
})

if (process.env.RESET_DATABASE) {  // RESET_DATABASE=true seeds database 
  console.log("ResettingDB")

  const seedDatabase = async () => {
    await Book.deleteMany() // avoid doubles
    await Author.deleteMany()
    await booksData.forEach((book) => {
      new Book(book).save()
      new Author({
        name: book.authors
      }).save()
    })
  }
  //save books from json to database VARFÖRHAR AWAIT INGEN FUNCTIONHÄR?
  seedDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

app.get("/books", async (req, res) => {
  const books = await Book.find()
  console.log(`found ${books.length} books`)
  res.json(books)
})

app.get("/books/:isbn", async (req, res) => {
  const { isbn } = req.params
  const book = await Book.findOne({ isbn: isbn })
  if (book) {
    res.json(book)
  } else {
    res.status(404).json({ error: `Cant find book isbn:${isbn}` })
  }
})

app.get("/authors", async (req, res) => {
  try {
    const authors = await Author.find().populate("books") //Author model
    if (authors) {
      res.json(authors)
    } else {
      res.status(404).json({ error: `Cant find author` })
    }
  } catch (err) {
    res.status(400).json({ error: "Author not found" })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
