import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import booksRouter from "./routes/books.js"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"

const apiRoutes = [
  {
    path: "/",
    methods: ["GET"],
  },
  {
    path: "/books",
    methods: ["GET"],
  },
]

mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err))

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json(apiRoutes)
})

app.use("/books", booksRouter)

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
