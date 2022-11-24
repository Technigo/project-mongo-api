import express from "express";
import cors from "cors";
import mongoose from "mongoose";
// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start


// const User = mongoose.model("User", {
//   name: String,
//   age: Number,
//   deceased: Boolean
// });

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

// clears the database and renders new user  
if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Book.deleteMany();
    booksData.forEach(singleBook => {
      const newBook = new Book(singleBook);
      newBook.save();
    })
   //  await User.deleteMany();
    // const testUser = new User({name: "Cecilia", age: 27, deceased: false}); 
    // testUser.save(); 
  }
  resetDataBase();  //reset database should be inside an if, to not invoke by accident
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
