import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { Book } from "./models/BookModel";
import listEndpoints from "express-list-endpoints";

// Defining the port
const port = process.env.PORT || 8000;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  // Check if conntection is stable
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

//Defining routes____________//

app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.status(200).json(endpoints);
});

// Route for save a new book
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
    // Create a new instans
    const book = await Book.create(newBook);
    // Send the new book to the client
    return res.status(201).json(book);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Route for Get All Books from DB
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find({});

    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Route for Geting One Book from DB using ID
app.get("/books/:id", async (req, res) => {
  try {
    // Destructed the id from the param
    const { id } = req.params;
    // Find book by ID
    const book = await Book.findById(id);

    return res.status(200).json(book);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

// Route for Updating a Book
app.put("/books/:id", async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).json({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    // Destructed the id from the param
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

// Route for Deleting Book
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

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/bookStore";
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("App is conntected to db");
    // Start the server when conntected to db
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
mongoose.Promise = Promise;