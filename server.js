import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// Schema
const { Schema } = mongoose;
const bookSchema = new Schema ({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
})

// Model
const Book = mongoose.model("Book", bookSchema)

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello World!");
});

//Route to all books
app.get("/books", async (req, res) => {
  const books = await Book.find()
  res.json(books)
})

// Route to a single book
// Note that id here refers to the object-id, which can be found in compass
app.get("/books/id/:id", async (req, res) => {
  try {
    const singleBook = await Book.findById(req.params.id)
    if (singleBook) {
      res.status(200).json({
        success: true,
        body: singleBook
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Book not found"
        }
      })
    }
  } catch(e) {
    res.status(404).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
