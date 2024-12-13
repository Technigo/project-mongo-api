import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import booksData from "./data/books.json";

dotenv.config();

if (!process.env.MONGO_URL) {
  console.error("Error: MONGO_URL is not defined in the .env file.");
  process.exit(1); // Stop the app if MONGO_URL is not defined
} else {
  console.log("Mongo URL loaded successfully!");
}

// Connecting to mongo Atlas using the secret data from env. file
const mongoUrl = process.env.MONGO_URL
console.log('Mongo URL:', mongoUrl);

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    // Exit if the connection fails
    process.exit(1);
  });

mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
console.log(process.env.PORT);
const app = express();

const Book = mongoose.model("Book", new mongoose.Schema({
  bookID: Number,
  title: String,
  authors: String,
}));

// Seeding data
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({});

    booksData.forEach((bookData) => {
      new Book(bookData).save();
    });


  console.log("Database seeded with book data!");

  };
  seedDatabase()
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here

// Home page listing all endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app)
  res.json({
    message: "Hello and welcome to the libray! Here are all the endpoints:",
    endpoints: endpoints
  });
});

// Route to fetch all books
app.get("/books", async (req, res) => {
  const books = await Book.find()
  res.json(books)
});

// Route to fetch details for a single book
app.get("/books/:bookID", async (req, res) => {
  const { bookID } = req.params;
  
  try {
    const book = await Book.findOne({ bookID: bookID });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  };
});

// Route to get book by author
app.get("/books/authors/:author", async (req, res) => {
  const { author } = req.params;
  try {
    const books = await Book.find({ authors: new RegExp(author, "i") });

    if (books.length === 0) {
      return res.status(404).send("No books found for this author");
    }
    res.json(books);
  } catch(error) {
    console.error("Error retrieving books by author", error);
    res.status(500).send("Server error");
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
