import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser"; // Helps parse JSON data sent in HTTP requests
import { Book } from "./models/Book.js";
import listEndpoints from "express-list-endpoints";
import fs from "fs"; // File system module to read files
import dotenv from "dotenv";
dotenv.config();

// Initialize express app **before using it**
const app = express(); // node server.js
// Defines the port the app will run on
const port = process.env.PORT || 9000;

// Add middlewares to enable CORS and JSON body parsing
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  // Check if the connection is stable
  if (mongoose.connection.readyState === 1) {
    // 1 means the connection is stable
    next(); // Move to the next middleware or route
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// ----------------Routes Section------------------ //

// Root route ("/"): Lists all available endpoints in the API
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app); // Use the `listEndpoints` library to generate the list
  res.status(200).json(endpoints); // Send the list as a JSON response
});

// POST route to add a new book to the database
app.post("/books", async (req, res) => {
  try {
    // Check if new data has following properties
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).json({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    // Add a new book to the database
    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
    };

    // Add the book to the database
    const book = await Book.create(newBook);

    // Send the new book to the client
    return res.status(201).json(book);
  } catch (err) {
    console.log(err.message); // Log the error for debugging
    res.status(500).json({ message: err.message });
  }
});

// GET route to fetch all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find({}); // Fetch all books from the database

    return res.status(200).json({
      count: books.length,
      data: books, // Send the books as a JSON response
    });
  } catch (err) {
    console.log(err.message); // Log the error
    res.status(500).json({ message: err.message });
  }
});

// GET route to fetch a single book by its ID
app.get("/books/:id", async (req, res) => {
  try {
    // Destructed the id from the param
    const { id } = req.params;
    // Find book by ID
    const book = await Book.findById(id);

    return res.status(200).json(book); // Send the book as a JSON response
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message }); // Handle errors
  }
});

// PUT route to update a book by its ID
app.put("/books/:id", async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).json({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    // Get the book ID from the URL
    const { id } = req.params;

    // Find book by ID and Update
    const result = await Book.findByIdAndUpdate(id, req.body);

    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ message: "Book updated successfully" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// DELETE route to remove a book by its ID
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ message: "Book successfully deleted" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// ----------------- Database and Server ----------------- //

// Seed Database Function
const seedDatabase = async () => {
  try {
    const bookData = JSON.parse(fs.readFileSync("./data/books.json", "utf-8"));
    await Book.deleteMany(); // Remove existing data
    await Book.insertMany(bookData); // Insert new data
    console.log("Database seeded with JSON data!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  }
};

// MongoDB Connection
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books";
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
    if (process.env.RESET_DATABASE) {
      seedDatabase(); // Seed the database if RESET_DATABASE is true
    }
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

mongoose.Promise = Promise;
