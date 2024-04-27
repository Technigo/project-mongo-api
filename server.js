import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";
import booksData from "./data/books.json" assert { type: "json" };

dotenv.config();

mongoose.set("strictQuery", false);

// Setup MongoDB connection
const mongoUrl =
  process.env.MONGO_URI ||
  "mongodb+srv://eva:eva1@mongo.selepe3.mongodb.net/?retryWrites=true&w=majority&appName=mongo";

//"mongodb://localhost/project-mongo-books";
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connection successful"))
  .catch((err) => console.error("MongoDB connection error:", err));

const bookSchema = new mongoose.Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

const BookModel = mongoose.model("Book", bookSchema);

// Function to seed the database
const seedDatabase = async () => {
  try {
    await BookModel.deleteMany(); // Increase timeout is not needed here
    await BookModel.insertMany(booksData);
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/books", async (req, res) => {
  try {
    const allBooks = await BookModel.find();
    res.json(allBooks);
  } catch (error) {
    console.error("Failed to fetch books:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/books/:bookID", async (req, res) => {
  try {
    const { bookID } = req.params;
    const singleBook = await BookModel.findOne({ bookID });
    if (singleBook) {
      res.json(singleBook);
    } else {
      res.status(404).json({ error: "Book not found, try another number" });
    }
  } catch (error) {
    console.error("Error retrieving book:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json({ endpoints });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

/*import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import dotenv from "dotenv";
import booksData from "./data/books.json" assert { type: "json" };

dotenv.config();

mongoose.set("strictQuery", false);

const mongoUrl =
  process.env.MONGO_URI ||
  mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connection successful"))
    .catch((err) => console.error("MongoDB connection error:", err));

const bookSchema = new mongoose.Schema({
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

const BookModel = mongoose.model("Book", bookSchema);

const seedDatabase = async () => {
  try {
    await BookModel.deleteMany({}, { timeout: 20000 }); // Increase timeout to 20 seconds
    await BookModel.insertMany(booksData);
    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDatabase();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.get("/books", async (req, res) => {
  try {
    const allBooks = await BookModel.find();
    res.json(allBooks);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/books/:bookID", async (req, res) => {
  try {
    const { bookID } = req.params;
    const singleBook = await BookModel.findOne({ bookID });
    if (singleBook) {
      res.json(singleBook);
    } else {
      res.status(404).json({ error: "Book not found, try another number" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  const endpoints = listEndpoints(app);
  res.json(endpoints);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});




/*app.get("/", (req, res) => {
  const htmlContent = `
    <div class="bg-pink-100 h-screen flex justify-center items-center">
      <div class="text-center">
        <h1 class="text-4xl font-bold mb-4">Hello Technigo! This is the documentation of the API.</h1>
        <p>Here you will find <a href="/books" class="text-blue-500">View All Books</a></p>
        <p><a href="/books/123" class="text-blue-500">View Book by ID</a></p>
      </div>
    </div>
  `;
  res.send(htmlContent);
});*/
