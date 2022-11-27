import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb+srv://kristin-larsson:MONGODB_PASSWORD@cluster0.6asmbxp.mongodb.net/projectMongoApi?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start

const Book = mongoose.model("Book", {
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
});


if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Book.deleteMany();
    booksData.forEach(singleBook => {
      const newBook = new Book(singleBook);
      newBook.save();
    })
  }
  resetDataBase();
}


const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Defining routes
app.get("/", (req, res) => {
const navigation = {
    guide: "Routes for this API",
    Endpoints: [
      {
        "/books": "Display all books",
        "/id/:id": "Display a book with special ID",
        "/author/:authors": "Display all books from an author"
      },
    ],
  };
  res.send(navigation);
});

// First route /books
app.get("/books", async (req, res) => {
  const allTheBooks = await Book.find()
    res.status(200).json({
      success: true,
      body: allTheBooks
      })
    });

// Second route /id
app.get("/books/id/:id", async (req, res) => {
  try {
    const singelBook = await Book.findById(req.params.id)
    if (singelBook) {
    res.status(200).json({
      success: true,
      body: singelBook
      })
    } else {
    res.status(404).json({
      success: false,
      body: {
        message: "No book with that ID"
      }
      })
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
      })
  }
});

// Third route /author
app.get("/books/author/:authors", async (req, res) => {
  try {
    const singelAuthor = await Book.find({ authors: req.params.authors })
    if (singelAuthor) {
    res.status(200).json({
      success: true,
      body: singelAuthor
      })
    } else {
    res.status(404).json({
      success: false,
      body: {
        message: "No book with that author"
      }
      })
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid author"
      }
      })
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

