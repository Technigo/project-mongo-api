import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import netflixData from "./data/netflix-titles.json"

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const port = process.env.PORT || 8080
const app = express()

app.use(cors())
app.use(express.json())

const Title = mongoose.model("Title", {
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

if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await Title.deleteMany();
   netflixData.forEach(singleTitle => {
      const newTitle = new Title(singleTitle)
      newTitle.save()
    })

  }
  resetDataBase()
}

// Routes

app.get("/", (req, res) => {
  res.send("This is an api for Netflix-titles. Go to /titles to see all titles, and then add the _id of the title in /titles/ to see a specific title")
  })

app.get("/titles", async (req, res) => {
  const allTheTitles = await Title.find({})
  res.status(200).json ({
    success: true,
    body: allTheTitles
  })
})

app.get("/titles/:id", async (req, res) => {
  try {
    const SingleTitle = await Title.findById(req.params.id)
    if (SingleTitle) {
      res.status(200).json({
        success: true,
        body: SingleTitle
      })
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "Could not find the title"
        }
      })
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid id"
      }
    })
  }
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
