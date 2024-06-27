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
    language: {
      type: String,
      required: false,
    },
    average_rating: {
      type: Number,
      required: false,
    },
    num_pages: {
      type: Number,
      required: false,
    },
    ratings_count: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// The model
export const Book = mongoose.model("Book", bookSchema);
