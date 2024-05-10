import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"
import booksRouter from "./routes/books.js"
import updateBookRouter from "./routes/updateBook.js"
import bookRouter from "./routes/book.js"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err))

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
