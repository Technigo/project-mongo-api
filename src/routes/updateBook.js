import express from "express"
import Book from "../models/Book.js"

const router = express.Router()

router.put("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const existingBook = await Book.findById(id)

    if (!existingBook) {
      return res.status(404).json({ message: "Book not found" })
    }

    Object.assign(existingBook, req.body)

    const updatedBook = await existingBook.save()

    res.json(updatedBook)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
