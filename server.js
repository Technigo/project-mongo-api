import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import netflixData from './data/netflix-titles.json'


const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())

const User = mongoose.model("User", {
  name: String
})

const User1 = new User({
  name: "Elin"
})

const User2 = new User({
  name: "Tobias"
})

const Title = mongoose.model("Title", {
    show_id: Number,
    title : String,
    director: String,
    cast: String,
    country: String,
    date_added: String,
    release_year: Number,
    rating: String,
    duration: String,
    listed_in: String,
    description: String,
    type: String,
  })

  if (process.env.RESET_DB){
    const seeDatabase = async () => {
      await Title.deleteMany({})

 
      console.log("hello")
      netflixData.forEach((data)=> {
        const newTitle = new Title(data)
        newTitle.save()
      })
    }
    seeDatabase()
  }



// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world')
})

// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`)
})
