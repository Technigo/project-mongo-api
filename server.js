import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from 'dotenv'

// Load configuration variables from the .env file into process.env with purpose to keep sensitive inormation
dotenv.config()

// Import of dataset
import booksData from "./data/books.json"

// Access the MONGO_URL environment variable, connects to MongoDB using Mongoose and sets Mongoose to use native JavaScript promises
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Creates mongoose model with the name "Book"
const Books = mongoose.model("Book", {
  bookID: Number,
  title: String,
  authors: String,
  average_rating: Number,
  isbn: Number,
  isbn13: Number,
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_review_count: Number
})

// Defining an asynchronous function with purpose to clear existing data from the Books collection and then populate it with new data from the booksData array
const seedDatabase = async () => {
  // Remove all existing documents in the Books collection
  await Books.deleteMany({})
  // Iterate over each item in the booksData array
  booksData.forEach((bookItem) => {
    // Creating a new Books document using data from bookItem
    new Books(bookItem).save()
  })
}
seedDatabase()

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()
const listEndpoints = require("express-list-endpoints")


// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

// ***** Defining routes starts here *****
// Route for documentation and "/" with endpoints
app.get("/", (req, res) => {
  res.send(listEndpoints(app))
})

// Route to get a array of all books
app.get("/books", async (req, res) => {
  try {
    // Fetch all books from the database
    const allBooks = await Books.find()

    // Send the array of books as a JSON response
    res.json(allBooks)
  } catch (error) {
    // If there is an error, send an error response
    res.status(500).json({ error: "Internal Server Error" })
  }
});

// Route to get a single book by ID
app.get("/books/:bookID", async (req, res) => {
  try {
    // Extract the bookID from the request parameters
    const { bookID } = req.params

    // Fetch the book from the database based on the bookID
    const singleBook = await Books.findOne({ bookID: parseInt(bookID) })

    // Check if the book was found
    if (singleBook) {
      // Send the book as a JSON response
      res.json(singleBook)
    } else {
      // If the book with the specified ID is not found, send a 404 response
      res.status(404).json({ error: "Book not found, try another number" })
    }
  } catch (error) {
    // If there is an error, send an error response
    res.status(500).json({ error: "Internal Server Error" })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
});


// *** For Mongo *** 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://idahcollin:ophJvsUqdZ4RTSAC@cluster0.3nrildb.mongodb.net/firstMongo?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

