import mongoose from "mongoose";

const { Schema } = mongoose;

const bookSchema = new Schema({
  bookID: { type: Number, }, 
  title: { type: String },
  authors: { type: String },
  average_rating: { type: Number }, 
  isbn: { type: Number },
  isbn13: { type: Number },
  language_code: { type: String }, 
  num_pages: { type: Number },
  ratings_count: { type: Number },
  text_reviews_count: {  type: Number }
});

const BookModel = mongoose.model("Book", bookSchema);

export { BookModel };