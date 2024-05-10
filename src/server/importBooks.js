import Book from "../models/Book.js"
import booksData from "../data/Books.js"
import mongoose from "mongoose"

function importBooks() {
  mongoose.connection.collection("books").drop()
  booksData.forEach(async (bookData) => {
    try {
      const book = new Book(bookData)
      await book.save()
      console.log(`Book saved: ${book.title}`)
    } catch (error) {
      console.error(`Error saving book: ${error.message}`)
    }
  })
}

export default importBooks