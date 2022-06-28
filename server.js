import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import listEndpoints from "express-list-endpoints"


// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json"
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/dorotheas-project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

// Defines the port the app will run on. 
//Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(express.json())



const NetflixTitle = mongoose.model('NetflixTitle', {
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

// const newTitle = new Title ({title: 'Breaking bad', director: 'random dude'})
// const newTitle2 = new Title ({title: 'Clark', director: 'Jonas Åkerlund'})





if(process.env.RESET_DB) {

  const seedDatabase = async () => {

    await NetflixTitle.deleteMany({})
   
    netflixData.forEach((title) => {

      const newTitle = new NetflixTitle(title)
      newTitle.save()
    })
    // newTitle.save()
    // newTitle2.save()

  }

  seedDatabase()
  
}


// Start defining your routes here
app.get("/", (req, res) => {
  // res.json(netflixData.slice(0, 100))
  res.send(listEndpoints(app))


})


app.get("/alltitles", async (req, res) => {


  const allTitles = await NetflixTitle.find()
  res.json(allTitles.slice(0, 10))

})


app.get("/titles/id/:id", async (req, res) => {
const {id} = req.params

const titleByID = await NetflixTitle.findById(id)

try {
if (titleByID) {
  res.json(titleByID)
} else {
  res.status(404).json({error: 'not found'})
} 
} catch(err) {
  res.json({error: 'ERROR!!!!'})
}


})



app.get("/movies", (req, res) => {

})




app.get("/release-year", (req, res) => {

})



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
