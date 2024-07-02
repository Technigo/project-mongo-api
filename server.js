import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { Book } from "./models/Book.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Ensure MONGO_URI is defined
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in the environment variables.");
  process.exit(1);
}

// Database connection
mongoose.set("strictQuery", true);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

connectDB();

// Routes

// Endpoint Informativo
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Books API",
    endpoints: [
      {
        path: "/",
        methods: ["GET"],
        middlewares: ["anonymous"],
        usageInfo: {
          description: "Welcome message with API endpoints information.",
        },
      },
      {
        path: "/books",
        methods: ["GET"],
        middlewares: ["anonymous"],
        usageInfo: {
          description: "Get all books.",
        },
      },
      {
        path: "/books/:id",
        methods: ["GET"],
        middlewares: ["anonymous"],
        usageInfo: {
          description: "Get a single book by ID.",
        },
      },
      {
        path: "/books",
        methods: ["POST"],
        middlewares: ["anonymous"],
        usageInfo: {
          description: "Add a new book.",
        },
      },
      {
        path: "/books/:id",
        methods: ["PUT"],
        middlewares: ["anonymous"],
        usageInfo: {
          description: "Update a book by ID.",
        },
      },
      {
        path: "/books/:id",
        methods: ["DELETE"],
        middlewares: ["anonymous"],
        usageInfo: {
          description: "Delete a book by ID.",
        },
      },
    ],
  });
});

app.post("/books", async (req, res) => {
  try {
    const books = req.body;
    if (!Array.isArray(books) || !books.length) {
      return res.status(400).json({ message: "Request body must be an array of books" });
    }
    const insertedBooks = await Book.insertMany(books);
    res.status(201).json(insertedBooks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBook) return res.status(404).json({ message: "Book not found" });
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
