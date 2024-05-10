import mongoose from "mongoose"
import Book from "../models/Book.js"
import booksData from "../data/books.js"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err))

booksData.forEach(async (bookData) => {
  try {
    const book = new Book(bookData)
    await book.save()
    console.log(`Book saved: ${book.title}`)
  } catch (error) {
    console.error(`Error saving book: ${error.message}`)
  }
})
