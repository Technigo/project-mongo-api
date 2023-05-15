import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import netflixData from "./data/netflix-titles.json";
import dotenv from 'dotenv';

dotenv.config();


// from starter code: const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "project-mongo" })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error(`MongoDB connection error: ${err}`));
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080;
const app = express();
// Will create a list of all endpoints in our API, first do: npm install express-list-endpoints
const listEndpoints = require('express-list-endpoints');

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());


// In MongoDB, a schema defines the structure of a document, including the field names, data types, and any constraints or validations. 
// It serves as a blueprint for how the data should be organized and is used to ensure consistency in the data
// Schema is basically a (mongoose) skeleton

const { Schema } = mongoose;

const titleSchema = new Schema ({
  show_id: Number,
  title: String,
  director: String,
  cast: String,
  country: String,
  date_added: String,
  release_year: Number,
  rating: String,
  duration: String,
  listed_in: String,
  description: String,
  type: String
})

// On the other hand, a model in MongoDB is an object that represents a collection of documents in the database. 
// It acts as an interface between the application and the database, providing methods to perform CRUD operations on the data.
// A model can be created using a schema as a blueprint to ensure that the documents conform to a particular structure and set of rules.

const Title = mongoose.model("Title", titleSchema)


// Reset DB and seeding the database with our local data
// Put the following in the terminal: RESET_DB=true npm run dev
// (You can also add it manually in Compass if you had a fixed dataset)

if (process.env.RESET_DB) {
  const resetDatabase = async () => {
   await Title.deleteMany();
   netflixData.forEach((singleTitle) => {
    const newTitle = new Title(singleTitle);
    newTitle.save()
   })
  }
  resetDatabase();
};


// Start defining your routes here
app.get("/", (req, res) => {
  res.send({
    success: true,
    message: "OK",
    body: {
      content: "A list of Netlix titles",
      endpoints: listEndpoints(app)
    }
  });
});

app.get("/titles", async (req, res) => {
  const { type } = req.query;
  const response = {
    success: true,
    body: {}
  }
  const typeRegex = new RegExp(type)
  console.log('typeRegex', typeRegex)
  // E.g. http://localhost:8080/titles?type=TV

  try {
    const searchResults = await Title.find({type: typeRegex});
    if (searchResults) {
      response.body = searchResults;
      res.status(200).json(response)
    } else {
      response.success = false;
      res.status(404).json(response)
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

app.get("/titles/id/:id", async (req, res) => {
  console.log('req.params.id', req.params.id)
  // console.log('ObjectId(req.params.id)', ObjectId(req.params.id))
  try {
    // const singleTitle = await Title.findById(ObjectId(req.params.id));
    const singleTitle = await Title.findById(req.params.id);
    console.log('singleTitle', singleTitle); // add this line to check if singleTitle contains any data

    if (singleTitle) {
      res.status(200).json({
        success: true,
        body: singleTitle
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Title is not found tihi"
        }
      })
    }
  } catch(e) {
    res.status(500).json({
      success: false,
      body: {
        message: e
      }
    })
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
