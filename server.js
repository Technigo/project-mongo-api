import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import goldenGlobesData from "./data/golden-globes.json";

dotenv.config()

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const port = process.env.PORT || 8080;
const app = express();

const GoldenGlobes = mongoose.model("GoldenGlobes", {
  year_award: Number, 
  nominee: String, 
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

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const endpoints = {
    Welcome: "Hi! This is an open API about Golden Globes",
    Routes: [
      {
        "/goldenglobes": "An array of all Golden Globes objects",
        "/goldenglobes/year/:year_award": "Gives back an array with objects based on the year that is typed",
        "/goldenglobes/nominees/:nominee": "Gives back an array with objects based on the name of the nominee",
        "/goldenglobes/winners/:win": "Gives back an array of all the winners or the ones who did not win. True/False",
      },
    ],
  }
  res.send(endpoints)
});

app.get("/goldenglobes", async (req, res) => {
  const allGoldenGlobes = await GoldenGlobes.find()
  res.json(allGoldenGlobes)
})

app.get("/goldenglobes/year/:year_award", async (req, res) => {
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


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//RESET_DB=true npm run dev
