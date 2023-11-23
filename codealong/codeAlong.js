// // import express from "express";
// // import cors from "cors";
// // import mongoose from "mongoose";
// // import bodyParser from "body-parser";
// // import dotenv from "dotenv";
// // //import listEndpoints from "express-list-endpoints";
// // dotenv.config();

// // If you're using one of our datasets, uncomment the appropriate import below
// // to get started!
// // import avocadoSalesData from "./data/avocado-sales.json";
// //import booksData from "./data/books.json";
// // import goldenGlobesData from "./data/golden-globes.json";
// // import netflixData from "./data/netflix-titles.json";
// // import topMusicData from "./data/top-music.json";

// // const mongoUrl =
// //   process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo-api";
// // mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
// // mongoose.Promise = Promise;

// const Author = mongoose.model("Author", {
//   name: String,
// });

// const Book = mongoose.model("Book", {
//   title: String,
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Author",
//   },
// });

// const BookDataModel = mongoose.model("BookData", {
//   bookID: Number,
//   title: String,
//   authors: String,
//   average_rating: Number,
//   isbn: Number,
//   isbn13: Number,
//   language_code: String,
//   num_pages: Number,
//   ratings_count: Number,
//   text_reviews_count: Number,
// });

// // wrap this part in an inviroment variabel

// if (process.env.RESET_DATABASE) {
//   const seedDatabase = async () => {
//     console.log("Resetting database!");

//     await BookDataModel.deleteMany({});

//     booksData.forEach(async (book) => {
//       await new BookDataModel(book).save();
//     });
//   };
//   seedDatabase();
// }

// // if (process.env.RESET_DATABASE) {
// //   const seedDatabase = async () => {
// //     console.log("Resetting database!");

// //     // this delete makes the authors just to run ones and not be duplicates
// //     await Author.deleteMany();

// //     const tolkien = new Author({ name: "J.R.R Tolkien" });
// //     await tolkien.save();

// //     const rowling = new Author({ name: "J.K Rowling" });
// //     await rowling.save();

// //     await new Book({
// //       title: "Harry Potter and the Philosopher's Stone",
// //       author: rowling,
// //     }).save();
// //     await new Book({
// //       title: "Harry Potter and the Chamber of Secrets",
// //       author: rowling,
// //     }).save();
// //     await new Book({
// //       title: "Harry Potter and the Prisoner of Azkaban",
// //       author: rowling,
// //     }).save();
// //     await new Book({
// //       title: "Harry Potter and the Goblet of Fire",
// //       author: rowling,
// //     }).save();
// //     await new Book({
// //       title: "Harry Potter and the Order of the Phoenix",
// //       author: rowling,
// //     }).save();
// //     await new Book({
// //       title: "Harry Potter and the Half-Blood Prince",
// //       author: rowling,
// //     }).save();
// //     await new Book({
// //       title: "Harry Potter and the Deathly Hallows",
// //       author: rowling,
// //     }).save();
// //     await new Book({ title: "The Lord of the Rings", author: tolkien }).save();
// //     await new Book({ title: "The Hobbit", author: tolkien }).save();
// //   };
// //   seedDatabase();
// // }

// // Defines the port the app will run on. Defaults to 8080, but can be overridden
// // when starting the server. Example command to overwrite PORT env variable value:
// // PORT=9000 npm start

// const port = process.env.PORT || 8080;
// const app = express();

// const listEndpoints = require("express-list-endpoints");

// // Add middlewares to enable cors and json body parsing
// app.use(cors());
// app.use(express.json());

// // -----Routes and endpoints
// app.get("/", (req, res) => {
//   res.send(listEndpoints(app));
//   //res.send("Hello Technigo");
// });

// app.get("/authors", async (req, res) => {
//   const authors = await Author.find();
//   res.json(authors);
// });

// app.get("/authors/:id", async (req, res) => {
//   const author = await Author.findById(req.params.id);
//   res.json(author);
// });

// app.get("/authors/:id/books", async (req, res) => {
//   const author = await Author.findById(req.params.id);
//   if (author) {
//     const books = await Book.find({
//       author: mongoose.Types.ObjectId(author.id),
//     });
//     res.json(books);
//   } else {
//     res.status(404).json({ error: "Author not found" });
//   }
// });

// // I get null on author in this route instead if it's being connected with authors rout. Why?

// app.get("/books", async (req, res) => {
//   try {
//     const booksData = await BookDataModel.find();
//     res.json(booksData);
//   } catch (error) {
//     console.error(error);
//     res.status(404).json({ error: "Data not found" });
//   }
// });

// // app.get("/books", async (req, res) => {
// //   try {
// //     const books = await Book.find().populate("author");
// //     console.log(books);
// //     res.json(books);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ error: "Internal Server Error" });
// //   }
// // });

// // Start the server

// // app.listen(port, () => {
// //   console.log(`Server running on http://localhost:${port}`);
// // });
