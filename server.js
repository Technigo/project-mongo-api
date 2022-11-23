import express from "express";
import cors from "cors";
import mongoose from "mongoose"; //som react för frontend 

//import bodyParser from 'body-parser' - Damines error-video?

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
 import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

// Defines the port the app will run on. Defaults to 8080, but can be overridden
// when starting the server. Example command to overwrite PORT env variable value:
// PORT=9000 npm start
const Globe = mongoose.model("Globe", {
    year_film: Number,
    year_award: Number,
    ceremony: Number,
    category: String,
    nominee: String,
    film: String,
    win: Boolean
})

 /* 
    await User.deleteMany();
    const testUser = new User({name: "Sarah", age: 33, deceased: false}) //object med properties (keys)
    testUser.save(); */

if(process.env.RESET_DB) {
  console.log("Resetting database!")
  const resetDataBase = async () => {
    await Globe.deleteMany();
    goldenGlobesData.forEach(singleGlobe => {
      const newGlobe = new Globe(singleGlobe)
      newGlobe.save();
    })
  }
  resetDataBase();
} 

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());
// app.use(bodyParser.json())

app.use((req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    next()
  } else {
    res.status(503).json({ error: 'Service unavailable' })
  }
})

// Start defining your routes here
app.get("/", (req, res) => {
  res.send("Hello Technigo!");
});

app.get("/globes", async (req, res) => {
  const globes = await Globe.find()
  res.json(globes);
});

app.get("/globes/:id", async (req, res) => {
  try {
    const award = await Globe.findById(req.params.id)
    if (award) {
    res.json(award);
   } else {
    res.status(404).json({ error: 'Award not found' })
   }
} catch (err) {
   res.status(400).json({ error: 'Invalid award id' })
 }
});


//Damiens video:
/* app.get("/globes/films", async (req, res) => {
  const films = await Globe.find().populate('film')
  res.json(globes);
}); */



// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//enviroment variables .env (gör en fil - och säger till git att ignorera denna fil, 
//då kan man använda det på samma sätt som att skriva i terminalen)