import mongoose from "mongoose";
const { Schema } = mongoose;

// // Dynamic import for JSON (asynchronous)
// let data;
// import("./data/books.json", { assert: { type: "json" } })
//   .then((module) => {
//     data = module.default;
//   })
//   .catch((err) => console.error(err));

export const bookSchema = new Schema({
  bookID: { type: Number },
  title: { type: String },
  authors: { type: String },
  average_rating: { type: Number },
  isbn: { type: Number },
  isbn13: { type: Number },
  language_code: { type: String },
  num_pages: { type: Number },
  ratings_count: { type: Number },
  text_reviews_count: { type: Number },
});

export const bookModel = mongoose.model("books", bookSchema);
