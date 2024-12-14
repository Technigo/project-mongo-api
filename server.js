import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from "dotenv"
import listEndpoints from 'express-list-endpoints'
import { body, validationResult } from "express-validator"
import { isPluginRequired } from '@babel/preset-env'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/post-codealong"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

const Task = mongoose.model("Task", {
  text: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 140
  },
  complete: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: () => new Date()
  }
})

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8070
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())


// Start defining your routes here
app.get('/', (req, res) => {
  //documentation
  //Express List Endpoints
  const endpoints = listEndpoints(app)

  res.send({
    message: "Hello World!",
    endpoints: endpoints
  })
})

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: "desc" }).limit(20).exec();
  res.json(tasks);
})

app.post("/tasks", async (req, res) => {
  // Retrieve the info sent by client to API endpoint
  const { text, complete } = req.body;

  // Use mongoose model to create the database entry
  const task = new Task({ text, complete });

  try {
    // Success 201 created new data
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: "Could not save task to the Database", error: err.errors });
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
