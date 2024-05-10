import express from "express"
import Book from "../models/Book.js"

const router = express.Router()

function getRandomBook(books) {
  const randomIndex = Math.floor(Math.random() * books.length)
  return books[randomIndex]
}

router.get("/randombook", async (req, res) => {
  try {
    const books = await Book.find({})

    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No book were found" })
    }

    const randomBook = getRandomBook(books)

    const exampleLink = `http://${req.headers.host}/book/${randomBook.bookID}`

    res.json({
      message: "Here is a random book for you!",
      example: exampleLink,
      randomBook,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params

  if (isNaN(id)) {
    return res.status(400).json({
      message: "Change the ID in the URL to view your book",
      example: `http://${req.headers.host}/book/1`,
    })
  }

  try {
    const book = await Book.findOne({ bookID: id })

    if (!book) {
      return res.status(404).json({ message: "No book were found" })
    }

    res.json(book)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
