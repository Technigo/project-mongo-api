import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import { Book } from "./models/bookModel";
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDB");
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err.message);
  process.exit(1); // Exit process with error code
});

mongoose.Promise = global.Promise;

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// Routes
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.status(200).json(endpoints);
});

// POST a new book
app.post("/books", async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;
    if (!title || !author || !publishYear) {
      return res.status(400).json({
        message: "Send all required fields: title, author, publishYear",
      });
    }

    const newBook = {
      title,
      author,
      publishYear,
    };

    const book = await Book.create(newBook);
    return res.status(201).json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET all books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find({});
    return res.status(200).json({
      count: books.length,
      data: books,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET one book by ID
app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json(book);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// PUT update a book by ID
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, publishYear } = req.body;
    if (!title || !author || !publishYear) {
      return res.status(400).json({
        message: "Send all required fields: title, author, publishYear",
      });
    }
    const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json({ message: "Book updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});

// DELETE a book by ID
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(200).json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: err.message });
  }
});
