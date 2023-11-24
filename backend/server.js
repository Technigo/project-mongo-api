import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const songModel = require("./models/song")
const songRoutes = require("./routes/songRoutes")

import data from "../data/top-music.json"

//Setting up the database
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// The port the app will run on
const port = process.env.PORT || 8080
const app = express()

// Add middlewares
app.use(cors())
app.use(express.json()) //Parses incoming JSON-files
app.use(express.urlencoded({ extended: false })) //Parse arrays and strings

//Check if the database is available/connected (readyState = 1)
app.use((req, res, next)=>{
  if(mongoose.connection.readyState !== 1){
    res.status(503).json({error: "service unavailable"})
  } else {
    next()
  }
})

const seedDataBase = async () => {
  await songModel.deleteMany({})
  data.forEach(song => {
    console.log(song)
    new songModel(song).save()
  })
}

if (process.env.RESET_DB) {
  seedDataBase()
}

//Calling the function that contains all routes & endpoints
app.use("/", songRoutes)

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
