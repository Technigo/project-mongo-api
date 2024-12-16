import express from "express";
import cors from "cors";
import mongoose from "mongoose";
/* import booksData from "./data/books.json" */


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl);
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


const Book = mongoose.model('Book', {
  "bookID": Number,
  "title": String,
  "authors": String,
  "average_rating": Number,
  "isbn": Number,
  "isbn13": Number,
  "language_code": String,
  "num_pages": Number,
  "ratings_count": Number,
  "text_reviews_count": Number
})



if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({})

    data.forEach((booksData) => {
      new Book(booksData).save()
    })
  }

  seedDatabase()
}


// Home page - first route
app.get("/", (req, res) => {
  res.send("Welcome to the website where you can find your favourite book!");
});

// Route with all the books - full API
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching books" });
  }
});


// Ge books based on number of pages (needs to be befor bookID otherwise that route will override this)
app.get("/books/pages", async (req, res) => {
  const { min, max } = req.query;

  // Parse min and max values or assign default values
  const minPages = parseInt(min, 10) || 0; // Default: 0 pages
  const maxPages = parseInt(max, 10) || Number.MAX_SAFE_INTEGER; // Default: No upper limit

  console.log(`Filtering books with num_pages between ${minPages} and ${maxPages}`);

  try {
    // Query to find books within the range
    const numberOfPages = await Book.find({
      num_pages: { $gte: minPages, $lte: maxPages },
    });

    // Return books if found, otherwise send 404
    if (numberOfPages.length > 0) {
      res.json(numberOfPages);
    } else {
      res.status(404).json({
        error: `No books found with page count between ${minPages} and ${maxPages}`,
      });
    }
  } catch (error) {
    // Handle any server-side errors
    res.status(500).json({ error: "An error occurred while fetching books" });
  }
});


// Get individual books from id
app.get("/books/:bookID", async (req, res) => {
  const bookID = parseInt(req.params.bookID);

  try {
    const book = await Book.findOne({ bookID: bookID });

    if (book) {
      res.json(book); // return the specifik book
    } else {
      res.status(404).json({ error: "Book not found" }); // error page if book not founf
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the book" }); // 500 page when wrong
  }
});


// Get book-books by author
app.get("/books/authors/:author", async (req, res) => {
  const author = req.params.author;

  try {
    // $regex = to match name and not case sensitive
    const booksByAuthor = await Book.find({
      authors: { $regex: author, $options: "i" }, // "i" case-insensitive
    });

    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor); // Returnera böckerna om de finns
    } else {
      res.status(404).json({ error: "No books found for this author" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching books" });
  }
});




// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
