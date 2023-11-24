import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import expressListEndpoints from "express-list-endpoints";
import Book from "./models/Book";
import booksData from "./data/books.json";

mongoose.connect(
  process.env.MONGO_URL ||
    "mongodb+srv://majoh23:vgtSDU58AGrPiM0T@cluster0.9stnyvv.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);
mongoose.Promise = Promise;

const port = process.env.PORT || 9002;
const app = express();

app.use(cors());
app.use(express.json());

const seedDatabase = async () => {
  await Book.deleteMany({});

  booksData.forEach((bookData) => {
    new Book(bookData).save();
  });
};

seedDatabase();

app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/books/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.json(book);
});

app.get("/", (req, res) => {
  res.json(expressListEndpoints(app));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

/* -------------------------------- */

// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";

// // If you're using one of our datasets, uncomment the appropriate import below
// // to get started!
// // import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// // import goldenGlobesData from "./data/golden-globes.json";
// // import netflixData from "./data/netflix-titles.json";
// // import topMusicData from "./data/top-music.json";

// const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo";
// mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.Promise = Promise;

// // Defines the port the app will run on. Defaults to 8080, but can be overridden
// // when starting the server. Example command to overwrite PORT env variable value:
// // PORT=9000 npm start
// const port = process.env.PORT || 8080;
// const app = express();

// // Add middlewares to enable cors and json body parsing
// app.use(cors());
// app.use(express.json());

// // Start defining your routes here
// app.get("/", (req, res) => {
//   res.send("Hello Technigo!");
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
