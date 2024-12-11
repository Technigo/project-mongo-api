import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/books";
mongoose.connect(mongoUrl)

  .then(() => {
  console.log('MongoDB successfully connected!')
  })
  .catch((error) => {
  console.error('Error to connect with MongoDB', error)
  })

const Book = mongoose.model('Book', {
  title: String
})

if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    try {
      await Book.deleteMany({});

      const savePromises = booksData.map((bookData) => {
        const book = new Book(bookData); 
        return book.save();
      });

      await Promise.all(savePromises);
      console.log('Database seeded with books data');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  };

  seedDatabase();
}

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Route to get books
app.get('/books', async (req, res) => {
try {
  const books = await Book.find()
  res.json(books)
}catch (error) {
  console.error('Error retrieving books', error);
    res.status(500).send('Server error');
}
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
