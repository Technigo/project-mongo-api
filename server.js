import express from "express";
import cors from "cors";
import mongoose from "mongoose";

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
const port = process.env.PORT || 8080;
const app = express();

const GoldenGlobes = mongoose.model("GoldenGlobes", {
  year_film: Number, 
  year_award: Number, 
  ceremony: Number, 
  category: String, 
  nominee: String,
  film: String, 
  win: Boolean
});


if(process.env.RESET_DB) {
  const resetDataBase = async () => {
    await GoldenGlobes.deleteMany();
    goldenGlobesData.forEach(item => {
      const newItem = new GoldenGlobes(item);
      newItem.save();
    })
  }
  resetDataBase();
}

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
app.get("/", (req, res) => {
  const endpoints = {
    Welcome: "Hi! This is an open API about Golden Globes",
    Routes: [
      {
        "/goldenglobes": "Get an array of all Golden Globes objects in the array",
        "/goldenglobes/awardyear/:year_award": "Gives back an array with objects based on the year that is typed",
        "/goldenglobes/nominees/:nominee": "Gives back an array with objects based on the name of the nominee",
        "/goldenglobes/winners/:win": "Gives back an array of all the winners or the ones who did not win",
      },
    ],
  }
  res.send(endpoints)
});

app.get("/goldenglobes", async (req, res) => {
  const allGoldenGlobes = await GoldenGlobes.find()
  res.json(allGoldenGlobes)
})

app.get("/goldenglobes/awardyear/:year_award", async (req, res) => {
  try {
    const yearAward = await GoldenGlobes.find({year_award: req.params.year_award});
    if (yearAward) {
      res.status(200).json({
        success: true,
        body: yearAward
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "No nominee found by that year"
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid input"
      }
    });
  }
  
});
app.get("/goldenglobes/nominees/:nominee", async (req, res) => {
  const { nominee } = req.params
  try {
    const nominees = await GoldenGlobes.find({nominee: nominee});
    if (nominees) {
      res.status(200).json({
        success: true,
        body: nominees
      });
    } else {
      res.status(404).json({
        success: false,
        body: {
          message: "No nominees found"
        }
      });
    }
  } catch(error) {
    res.status(400).json({
      success: false,
      body: {
        message: "Invalid nominee name"
      }
    });
  }
});

app.get("/goldenglobes/winners/:win", async (req, res) => {
  const winners = await GoldenGlobes.find({win: req.params.win})
  res.send(winners)
})


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
//RESET_DB=true npm run dev
// Go here:
//https://github.com/coreybutler/nvm-windows/releases
// downlaod nvm-setup.exe
// run as admin
// open cmd as admin
// type nvm install v16.18.1
//https://mongoosejs.com/docs/queries

//https://regex101.com/

// /yourWodOfChoice/gm - regex to match yourWordOfChoice
// /.*/gm - regex to match every character in a string
