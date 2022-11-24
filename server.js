import express from "express";
import cors from "cors";
import mongoose from "mongoose"; //som react för frontend 
import dotenv from "dotenv";

//import bodyParser from 'body-parser' - Damines error-video?

// import avocadoSalesData from "./data/avocado-sales.json";
// import booksData from "./data/books.json";
// import goldenGlobesData from "./data/golden-globes.json";
// import netflixData from "./data/netflix-titles.json";
// import topMusicData from "./data/top-music.json";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || `mongodb+srv://spacecake:${process.env.STRING_PW}@cluster0.jgvyhjl.mongodb.net/mongoAPI?retryWrites=true&w=majority`;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const Globe = mongoose.model("Globe", {
    year_film: Number,
    year_award: Number,
    ceremony: Number,
    category: String,
    nominee: String,
    film: String,
    win: Boolean
})

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

app.get("/allglobes", async (req, res) => {
  const globes = await Globe.find({})
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

app.get("/globes/", async (req, res) => {
  const { category, nominee, film } = req.query;
  const response = {
    success: true,
    body: {} // syns två gånger på sidan.... 
  }
  /* const matchRegex = new RegExp (".*") */
  const categoryQuery = category ? category : /.*/;
  const nomineeQuery = nominee ? nominee : /.*/;
  const filmQuery = film ? film : /.*/;

  try {
    response.body = await Globe.find({category: categoryQuery, nominee: nomineeQuery, 
      film: filmQuery})
      // .limit(2).sort({ggg: }).select({ggg: 5, hhh: })

    res.status(200).json({
      success: true,
      body: response
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      body: { 
        message: error
      }
    })
  }
});


//Damiens video:
/* app.get("/globes/films", async (req, res) => {
  const films = await Globe.find().populate('film')
  res.json(globes);
}); */

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// /myWord/gm - regex to match myWord
// /.*/gm - regex to match every character in a string 