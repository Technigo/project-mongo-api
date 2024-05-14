import mongoose from "mongoose";

// Destructure the Schema object from the mongoose module
const { Schema } = mongoose;

// Define the schema for the Book model
const BookSchema = new Schema({
  bookID: Number,
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: String,
    required: true,
  },
  average_rating: Number,
  isbn: {
    type: String,
    required: true,
    min: 0,
  },
  isbn13: {
    type: String,
    required: true,
    min: 0,
  },
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number,
});

// Create a text index on the title and authors fields
//will allow us to search for books using the $text operator - nb! add before creating the model
BookSchema.index({ title: "text", authors: "text" });

// Create the Book model using the schema
const Book = mongoose.model("Book", BookSchema);

Book.on("index", function (error) {
  if (error) {
    console.log(error.message);
  } else {
    console.log("Text index created for title and authors fields");
  }
});

// Export the Book model
export default Book;
