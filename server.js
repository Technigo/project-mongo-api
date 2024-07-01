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

  // Routes

  // Route per aggiungere un nuovo libro
  app.post("/books", async (req, res) => {
    try {
      const { title, authors, publishYear } = req.body;
      const newBook = await Book.create({ title, authors, publishYear });
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

  // Altri endpoint per aggiornare, eliminare e filtrare i libri possono essere aggiunti qui

  // Avvio del server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});
