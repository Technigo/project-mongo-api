import express from "express";
const listEndPoints = require("express-list-endpoints");
import { BookModel } from "../models/Book";

// Create an instance of the Express router
// The router method in this code is like setting up a map or a blueprint for handling different kinds of requests in a web application. It helps organize and define how the application should respond when someone visits different URLs. Think of it as creating a list of instructions for the app to follow when it receives specific requests, like "show me all tasks" or "register a new user." This makes the code neat and helps the app know what to do when someone interacts with it.
const router = express.Router();

//Route to list all the endpoints
router.get("/", async (req, res) => {
  const endpoints = listEndPoints(req.app);
  res.json(endpoints);
});

//-----ROUTE 1-------
//Route for geting all the books
router.get("/books", async (req, res) => {
  //Use the BookModel to find all books in the database
  // Mongoose Method: TaskModel.find()
  // Description: This route handles HTTP GET requests and uses the TaskModel to find all tasks in the database. The find() method is a Mongoose method that retrieves all documents from the specified collection (in this case, the "tasks" collection). The found tasks are then responded to the client in JSON format.
  try {
    const books = await BookModel.find();
    res.json(books);
  } catch (error) {
    res.json({ error: error.message });
  }
});

//------ ROUTE 2----------

//A route to return a single result (one book based on id)
router.get("/books/:id", async (req, res) => {
  const id = req.params.id

  //Error message if user gives input that is NaN
  if(isNaN(id)) {
    res.status(400).json({ error: "You must enter a number to get the book ID"})
    return
  }

  try {
    //Matching the id from param with a book with same bookID
    const book = await BookModel.findOne({ bookID: parseInt(id)})

    //Error message when a book with required id does not exost
    if(!book) {
      return res.status(404).json({error: "A book with the required id does not exist. Try again."})
    }
    res.json(book)
  } catch (error) {
    res.json({error: error.message})
  }
})

//-------ROUTE 3--------

// A route to return a selection of books based on author
router.get("/author/:author", async (req, res) => {
  const author = new RegExp(req.params.author, "i") //With RegExp (regular expression) a case-insensitive partial match on the authors field is performed. ("partial - if searching for j.k rowling, also books where she is a co writer are provided")

  try {
    const books = await BookModel.find({ authors: author})

    if(books.length === 0) {
      return res.status(404).json({error: "There are no books written by the specified author"})
    }

    res.json(books)
  } catch (error) {
    res.json({error: error.message})
  }
})


//----- ROUTE 4 ------
// Create a woute to dind books with page count above 500


//-------- BONUS: POST ROUTE -----------

//A route for handling post request (adding a book, with only a title)
router.post("/add", async (req, res) => {
  const title = req.body.title;

  //Check if the title is provided:
  //Checking that the "title" is truthy (not "undefined", "null", or an empty string:)
  if(!title) {
    return res.status(400).json({error: "Title is required to add a book"})
  }

  try {
    const newBook = await BookModel.create({ title: title });
    res.json(newBook);
  } catch (error) {
    //500 response genereally indicates a server-side error
    res.status(500).json({ error: error.message });
  }
});


export default router;
