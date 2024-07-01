import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { Book } from "./models/Book.js";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());

// Middleware per verificare lo stato della connessione a MongoDB
app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// Connessione a MongoDB
mongoose.connect("mongodb://localhost:27017/bookdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");

  // Route per aggiungere un nuovo libro
  app.post("/books", async (req, res) => {
    try {
      const { title, authors, average_rating, language_code, num_pages } = req.body;
      const newBook = await Book.create({ title, authors, average_rating, language_code, num_pages });
      res.status(201).json(newBook);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

  // Route per ottenere tutti i libri
  app.get("/books", async (req, res) => {
    try {
      const books = await Book.find({});
      res.status(200).json({ count: books.length, data: books });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Route per filtrare i libri per titolo
  app.get("/books/by-title/:title", async (req, res) => {
    try {
      const { title } = req.params;
      const books = await Book.find({ title });
      res.status(200).json({ count: books.length, data: books });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Route per filtrare i libri per autore
  app.get("/books/by-author/:author", async (req, res) => {
    try {
      const { author } = req.params;
      const books = await Book.find({ authors: author });
      res.status(200).json({ count: books.length, data: books });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Route per filtrare i libri per rating medio
  app.get("/books/by-rating/:min/:max", async (req, res) => {
    try {
      const { min, max } = req.params;
      const books = await Book.find({ average_rating: { $gte: min, $lte: max } });
      res.status(200).json({ count: books.length, data: books });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Route per filtrare i libri per codice lingua
  app.get("/books/by-language/:language_code", async (req, res) => {
    try {
      const { language_code } = req.params;
      const books = await Book.find({ language_code });
      res.status(200).json({ count: books.length, data: books });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Route per filtrare i libri per numero di pagine
  app.get("/books/by-pages/:min/:max", async (req, res) => {
    try {
      const { min, max } = req.params;
      const books = await Book.find({ num_pages: { $gte: min, $lte: max } });
      res.status(200).json({ count: books.length, data: books });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Avvio del server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});
