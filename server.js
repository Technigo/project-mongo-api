import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from "dotenv"
import listEndpoints from 'express-list-endpoints'
import { body, validationResult } from "express-validator"
import { isPluginRequired } from '@babel/preset-env'

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/triptracking"
mongoose.connect(mongoUrl)
mongoose.Promise = Promise

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
    message: "This API returns info of users and trips",
    endpoints: endpoints
  })
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
