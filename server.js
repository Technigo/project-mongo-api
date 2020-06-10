import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose, { mongo } from 'mongoose'
import booksData from "./data/books.json"
import dotenv from "dotenv"

const ERR_CANNOT_FIND_ISBN = "cant fint the book"
dotenv.config()
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/Books-wk18" // create uniqe name for project
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

/* 
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: "service very unavailable" })
  }
}) Work in progress */



const Book = mongoose.model("Book", {
  bookID: {
    type: Number,
  },
  title: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author", // Döp modeller med CAPS
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
  read: {
    type: Boolean,
    default: false,
  },
  num_pages: {
    type: Number,
  },
})

const Review = mongoose.model("Review", {
  review: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  likes: {
    type: Number,
    default: 0,
  },
})

// Vill skapa ett object för author, som tar värdet av book..
const Author = mongoose.model("Author", {
  books: [{  //[] for a list/ arr of books by author, ADD[]!!!
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book"
  }],
  author: {
    type: String,
  },
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
  //save books from json to database VARFÖRHAR AWAIT INGEN FUNCTIONHÄR...?
  seedDatabase()
}

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello Happy World')
})

app.get("/books", async (req, res) => {
  const { query } = req.query
  const queryRegex = new RegExp(query, "i") // ignores CaSe finds book - http://localhost:8080/books/?query=potter
  const books = await Book.find({ title: queryRegex }).sort({ average_rating: -1 })
  console.log(`found ${books.length} books`)
  res.json(books)
})


/// TURN THIS INTO QUERY ENPOINT /books?read=true
app.get("/books/unread", async (req, res) => {
  const unreadBooks = await Book.find({ read: false })
    .sort({ num_pages: -1 })
    .limit(20)
  res.status(200).json(unreadBooks)
})

app.get("/books/read", async (req, res) => {
  const ReadBooks = await Book.find({ read: true })
    .sort({ num_pages: -1 })
    .limit(20)
  res.status(200).json(ReadBooks)
})

/// authors /: id / books
app.get("/authors", async (req, res) => {
  try {
    const authors = await Author.find().populate("books")
    if (authors) {
      res.json(authors)
    } else {
      res.status(404).json({ error: `Cant find the author person` })
    }
  } catch (err) {
    res.status(400).json({ error: "Author not found" })
  }
})
app.get('/authors/:id', async (req, res) => {
  const author = await Author.findById(req.params.id)
  if (author) {
    res.json(author)
  } else {
    res.status(404).json({ error: "Author not found" })
  }
})

app.get("/authors/:id/books", async (req, res) => {
  try {
    const author = await Book.find()
    if (author) {
      const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
      res.json(books)
    }
  } catch (err) {
    res.status(404).json({ error: "Author not found" })
  }
})


app.get("/books/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params
    console.log(`GET / books ${isbn}`)
    const book = await Book.findOne({ isbn })
    if (book) {
      res.status(200).json(book)
    } else {
      res.status(404).json({ error: `Cant find book isbn:${isbn} did you miss a nr?` })  //Do I need two error messages & can I combine a message using isbn:${isbn} and the error constant I made above??
    }
  } catch (err) {
    res.status(400).json({ error: `try a better question` })
  }
})

app.put("/books/:isbn/read", async (req, res) => {
  const { isbn } = req.params
  console.log(`PUT /books/${isbn}/read`)
  await Book.updateOne({ isbn: isbn }, { read: true }) // what to find and the update
  res.status(201).json()
})

app.post("/books/:isbn/review", async (req, res) => {
  const { isbn } = req.params
  const { review, book } = req.body
  await Book.updateOne({ isbn }, { $inc: { text_reviews_count: 1 } }) // CAn I do only one isb {isbn} ?
  await new Review({ review, book }).save() //change name
  res.status(201).json() // consider use savedReview?
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
