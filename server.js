import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import listEndpoints from "express-list-endpoints";
import booksData from "./data/books.json";

dotenv.config(); // Load environment variables from env. file

// Check if MongoDB string is provided in env. file 
if (!process.env.MONGO_URL) {
  console.error("Error: MONGO_URL is not defined in the .env file.");
  process.exit(1); // Stop the app if MONGO_URL is not defined
} else {
  console.log("Mongo URL loaded successfully!");
}

// Connect to Mongo Atlas using connection string from env. file
const mongoUrl = process.env.MONGO_URL
console.log('Mongo URL:', mongoUrl);

mongoose.connect(mongoUrl)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit if connection fails
  });

mongoose.Promise = Promise;

// Define the port the app will run on, defaults 8080
const port = process.env.PORT || 8080;
console.log(process.env.PORT);
const app = express();

// Define book model using Mongoose schema
const Book = mongoose.model("Book", new mongoose.Schema({
  bookID: Number,
  title: String,
  authors: String,
}));

// Seed the database
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({}); // Clear existing database

    booksData.forEach((bookData) => {
      new Book(bookData).save(); //Save each book 
    });

    console.log("Database seeded with book data!");
  };
  seedDatabase(); // Call to seed database
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Define routes for API
// Home route to list all available endpoints
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app); // Automaticlly list all endpoints
  res.json({
    message: "Hello and welcome to the libray! Here are all the endpoints:",
    endpoints: endpoints
  });
});

// Route to fetch all books
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// Route to fetch details for a single book by its ID
app.get("/books/:bookID", async (req, res) => {
  const { bookID } = req.params;
  
  try {
    const book = await Book.findOne({ bookID: bookID }); // Find a book by bookID

    if (!book) {
      return res.status(404).json({ message: "Book not found" }); // Handle not found
    }

    res.json(book); // Send book details
  } catch (error) {
    res.status(500).json({ message: error.message }); // Handle server errors
  }
});

// Route to fetch book by author
app.get("/books/authors/:author", async (req, res) => {
  const { author } = req.params;
  try {
    // Use a case-insensitive regex to match authors
    const books = await Book.find({ authors: new RegExp(author, "i") });

    if (books.length === 0) {
      return res.status(404).send("No books found for this author"); // Handle no results
    }
    res.json(books); // Send list of books by the author
  } catch(error) {
    console.error("Error retrieving books by author", error); // Log error
    res.status(500).send("Server error"); // Handle server errors
  }
});

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
