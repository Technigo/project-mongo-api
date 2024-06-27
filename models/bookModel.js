/* This code snippet is defining a Mongoose schema and model for a "Book" entity in a Node.js
application. Here's a breakdown of what each part is doing: */
import mongoose from "mongoose";

const { Schema } = mongoose;

// Schema - the blueprint
const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publishYear: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// The model
export const Book = mongoose.model("Book", bookSchema);