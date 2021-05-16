import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

import sites from "./data/tech-sites.json";

dotenv.config();

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const siteSchema = new mongoose.Schema({
  siteId: Number,
  name: String,
  language: String,
  type: String,
  programming_language: String,
  topic: String,
  url: String,
  description: String,
  offer_training: Boolean,
  free_or_paid: String,
});

const Site = mongoose.model("Site", siteSchema);

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Site.deleteMany();
    await sites.forEach((item) => {
      const newSite = new Site(item);
      newSite.save();
    });
  };
  seedDB();
}

const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here

//displays all endpoints in the startpage

app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

//endpoint to display all techsites, with use of aggregate that sorts by name, and let you query for topic and/or free or paid

app.get("/techsites", async (req, res) => {
  const { topic, free_or_paid, sort, page, per_page } = req.query;

  try {
 
    const techsites = await Site.aggregate([
      {
        $match: {
          topic: {
            $regex: new RegExp(topic || "", "i"),
          },
          free_or_paid: {
            $regex: new RegExp(free_or_paid || "", "i"),
          },
        },
      },
      {
        $sort: {
          name: 1,
        },
      }
    ]);
    res.json(techsites);
  } catch (error) {
    res.status(400).json({ error: "Something went wrong", details: error })
  }
  });

  //endpoint to display one techsite with a specified id, id is the mongoose one
  

app.get("/techsites/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const singleSite = await Site.findById(id);
    res.json(singleSite);
  } catch (error) {
    res.status(400).json({ error: "Something went wrong", details: error });
  }
});

//endpoint to display one techsite with the specified name, case insensitive and allow to only use one word in a string.
app.get("/techsites/name/:name", async (req, res) => {
  const { name } = req.params;

  try {
    const singleSite = await Site.findOne({
      name: { $regex: "\\b" + name + "\\b", $options: "i" },
    });
    res.json(singleSite);
  } catch (error) {
    res.status(400).json({ error: "Something went wrong", details: error });
  }
});

//endpoint to display all techsites of a specific type, case insensitive and allow to only use one word in a string

app.get("/techsites/type/:type", async (req, res) => {
  const { type } = req.params;

  try {
    const sitesOfType = await Site.find({
      type: { $regex: "\\b" + type + "\\b", $options: "i" },
    });
    res.json(sitesOfType);
  } catch (error) {
    res.status(400).json({ error: "Something went wrong", details: error });
  }
});

//endpoint to display techsites in a specific language, case insensitive and allow to only use one word in a string

app.get("/techsites/language/:language", async (req, res) => {
  const { language } = req.params;

  try {
    const sitesOfLanguage = await Site.find({
      language: { $regex: "\\b" + language + "\\b", $options: "i" },
    });
    res.json(sitesOfLanguage);
  } catch (error) {
    res.status(400).json({ error: "Something went wrong", details: error });
  }
});

// Start the server
app.listen(port, () => {
});
