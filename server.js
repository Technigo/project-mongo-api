import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
//import dotenv from "dotenv";
//import books from "./data/books.json" assert { type: "json" };
import { Book } from "./models/Book.js";
import listEndpoints from "express-list-endpoints";

// Initialize the app **before using it**
const app = express();
// Defines the port the app will run on
const port = process.env.PORT || 9000;

// Add middlewares to enable CORS and JSON body parsing
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  // Check if the connection is stable
  if (mongoose.connection.readyState === 1) {
    next();
  } else {
    res.status(503).json({ error: "Service unavailable" });
  }
});

// ----------------Define routes------------------ //
app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.status(200).json(endpoints);
});

// app.get("/authors", async (req, res) => {
//   const authors = await Author.find();
//   res.json(authors);
// });


// Route for a new book
app.get("/books", async (req, res) => {
  const books = await Book.find().populate("author");
  res.json(books);
});






// Start the server **after initialization**
// node server.js
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});





 const Author = mongoose.model("Author", { name: String });

//RESET_DATABASE=true npm run dev
if (process.env.RESET_DATABASE) {
  const seedDatabase = async () => {
    await Author.deleteMany();

    const tolkien = new Author({ name: "J.R.R Tolkien" });
    await tolkien.save();
  };
  seedDatabase();
}

// MongoDB connection setup
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/books";
mongoose.connect(mongoUrl);

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

