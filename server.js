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
  res.send("Hello Technigo!")
})

/*app.get("/authors", async (req, res) => {
  const authors = await Author.find();
  res.json(authors)
})

app.get("/authors/:id", async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    res.json(author);
  } else {
    res.status(404).json({ error: "Author not found." });
  }
});

app.get("/authors/:id/books", async (req, res) => {
  const author = await Author.findById(req.params.id);
  if (author) {
    const books = await Book.find({
      author: mongoose.Types.ObjectId.createFromHexString(author.id),
    });
    res.json(books);
  } else {
    res.status(404).json({ error: "Author not found." });
  }
});*/

app.get("/books", async (req, res) => {
  //const books = await Book.find().populate("author");
  const books = await Book.find()
  res.json(books)
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

