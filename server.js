import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bookRouter from "./routes/bookRoutes";
import { BookModel } from "./models/book";
import bookData from "./data/books.json";
import dotenv from "dotenv";
dotenv.config();

// Define the seedDatabase function
  // if (process.env.RESET_DB) {
  //  const seedDatabase = async () => {
  //   await BookModel.deleteMany({})
  //    bookData.forEach((book) => {
  //       new BookModel(book).save();
  //     });
  
  //   }}
  
   
    

  const seedDatabase = async () => {
    await BookModel.deleteMany({})
    bookData.forEach((book) => {
    new BookModel(book).save();
  });
    
}
seedDatabase();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:127.0.0.1:27017/books";


mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

mongoose.Promise = global.Promise; 

const app = express();

// Add middlewares to enable cors and json body parsing
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// Use book routes
app.use("/", bookRouter);


// Catch-all route for unknown endpoints
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});





