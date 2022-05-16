import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
 import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

//
const Books = mongoose.model('Books', {
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
})

if(process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Books.deleteMany({})
    booksData.forEach(book => {
       const newBook = new Books(book);
       newBook.save();
    })
  }
  
  seedDatabase()
}
  
  
// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Welcome to Suki's book APIs!");
});

app.get("/books", async (req, res) => {
 
  const books = await Books.find(req.query);

  //Retrieve data collection which has average rating greater than the query parameters
  if(req.query.average_rating) {
    const bookByRating = await Books.find().gt('average_rating',req.query.average_rating);
   
    res.json({ 
      data: bookByRating,
      success: true 
    })
  } 
   
  res.json({
    data: books,   
  })
});

app.get("/books/author/:author", async(req,res) => {
  const book = await Books.find({ authors: req.params.author });

  if(book) {
    res.status(200).json({
      data: book,
      success: true
    })
  } else {
    res.status(404).json({
      message: 'author not found',
      success: false
    })
  }
  
 
})

app.get("/books/id/:id", async(req,res) => {

  //Try if the request id is valid before looking for the data
  try {
    const book = await Books.findById(req.params.id);
    if(book) {
      res.json(book)
    } else {
      res.status(404).json({ error: 'Book not found' })
    }
  } catch(err) {
    res.status(400).json({error: 'id is invalid', err: err})
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
