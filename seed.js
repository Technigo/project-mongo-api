import mongoose from "mongoose";
import dotenv from "dotenv";
import { Book } from "./models/Book.js";

dotenv.config();

const books = [
  {
    bookID: 1,
    title: "The Great Gatsby",
    authors: "F. Scott Fitzgerald",
    average_rating: 3.9,
    isbn: 9780743273565,
    isbn13: 9780743273565,
    language_code: "eng",
    num_pages: 180,
    ratings_count: 3679942,
    text_reviews_count: 61843,
  },
  {
    bookID: 2,
    title: "To Kill a Mockingbird",
    authors: "Harper Lee",
    average_rating: 4.3,
    isbn: 9780061120084,
    isbn13: 9780061120084,
    language_code: "eng",
    num_pages: 324,
    ratings_count: 4255821,
    text_reviews_count: 88731,
  },
  // Aggiungi altri libri come desideri
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    
    await Book.deleteMany({});
    console.log("Cleared the Books collection");

    await Book.insertMany(books);
    console.log("Inserted books data");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

seedDB();
