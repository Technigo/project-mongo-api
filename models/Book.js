// models/Book.js
import mongoose from "mongoose";

const { Schema } = mongoose;

// Schema - the blueprint
const bookSchema = new Schema(
  {
    bookID: { type: Number, required: true },
    title: { type: String, required: true, maxlength: 255 },
    authors: { type: String, required: true, maxlength: 255 },
    average_rating: { type: Number, min: 0, max: 5 },
    language_code: { type: String, enum: ["eng", "en-US", "other"] },
    num_pages: { type: Number, min: 0 },
  },
  {
    timestamps: true,
    // Opzionale: definisci indici per migliorare le performance delle query
    // Esempio: index: { title: "text", authors: "text" }
  }
);

// The model
export const Book = mongoose.model("Book", bookSchema);

