"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _mongoose = _interopRequireDefault(require("mongoose"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// Destructure the Schema object from the mongoose module
var Schema = _mongoose["default"].Schema;

// Define the schema for the Book model
var BookSchema = new Schema({
  bookID: Number,
  title: {
    type: String,
    required: true
  },
  authors: {
    type: String,
    required: true
  },
  average_rating: Number,
  isbn: {
    type: Number,
    required: true,
    min: 0
  },
  isbn13: {
    type: Number,
    required: true,
    min: 0
  },
  language_code: String,
  num_pages: Number,
  ratings_count: Number,
  text_reviews_count: Number
});

// Create a text index on the title and authors fields
//will allow us to search for books using the $text operator - nb! add before creating the model
BookSchema.index({
  title: "text",
  authors: "text"
});

// Create the Book model using the schema
var Book = _mongoose["default"].model("Book", BookSchema);
Book.on("index", function (error) {
  if (error) {
    console.log(error.message);
  } else {
    console.log("Text index created for title and authors fields");
  }
});

// Export the Book model
var _default = exports["default"] = Book;