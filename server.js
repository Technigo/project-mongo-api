import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";

// Defines the port the app will run on. Defaults to 8080, but can be overridden when starting the server. For example: PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


//mongoURL is the address of my database in my local machine
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//Model: Must use camel case / model name must be the same as the variable
const Book = mongoose.model("Book", {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
});

//RESET_DB: RESET_DB=true npm run dev
//deleteMany: It's a function from mongoose and it delete all the info we have stored in the database before 
//saving it so it does not duplicate and this way, we ensure we don't have anything in the database before we start 
//Seedind a database:
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({}); 

    booksData.forEach(item => {
      const newBook = new Book(item)
      newBook.save()
    })

  };
  seedDatabase();
}





// Endpoints
app.get("/", (req, res) => {
  res.send("Welcome to my world!");
});

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});





// This code is the model we created instead of using the json data and that's why doesn't need any looping

// const User = mongoose.model("User", {
//   name: String,
//   age: Number,
// });

// const newUser = new User({
//   name: "Lola",
//   age: 35,
// });

// const newUser2 = new User({
//   name: "Ana",
//   age: 27,
// });

// if (process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     await User.deleteMany({});

//     newUser.save();
//     newUser2.save();
//   };
//   seedDatabase();
// }
