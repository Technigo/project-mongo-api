import mongoose from "mongoose";

const { Schema } = mongoose;

export const titleSchema = new Schema({
  show_id: {
    type: Number,
    // required: true,
    // minlength: 5,
  },
  title: {
    type: String,
    // required: true,
    // minlength: 5,
  },
  director: {
    type: String,
    // required: true,
    // minlength: 5,
  },
  cast: {
    type: [String],
    // required: true,
  },
  country: {
    type: String,
    // required: true,
    // minlength: 3,
  },
  date_added: {
    type: String,
    // required: true,
    // minlength: 5,
  },
  release_year: {
    type: Number,
    // required: true,
    // minlength: 4,
  },
  rating: {
    type: String,
    // required: true,
  },
  duration: {
    type: String,
    // required: true,
  },
  listed_in: {
    type: [String],
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  type: {
    type: String,
    // required: true,
  },
  // watched: {
  //   type: Boolean,
  // },
  //   createdAt: {
  //     type: Date,
  //     default: Date.now,
  //   },
});

export const TitleModel = mongoose.model("titles", titleSchema);
