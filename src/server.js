import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import booksRouter from "./routes/books.js"
import updateBookRouter from "./routes/updateBook.js"
import bookRouter from "./routes/book.js"
import dotenv from "dotenv"
import importBooks from "./server/importBooks.js"

dotenv.config()

mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`, {
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
})

const db = mongoose.connection
db.on("error", console.error.bind(console, "Anslutningsfel:"))
db.once("open", () => {
  console.log("Ansluten till databasen")
  importBooks()
})

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  const endpoints = listEndpoints(app)
  res.json(endpoints)
})

app.use("/books", booksRouter)
app.use("/update-book", updateBookRouter)
app.use("/book", bookRouter)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
