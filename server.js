import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import siteData from "./data/sites.json";
import listEndpoints from "express-list-endpoints";
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

//------Connect to database------//
const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/MongoProject";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

//-----Check connection is working----//
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

//-----Define mongoose model based on Site database----//
const Site = mongoose.model("Site", {
  name: String,
  description: String,
  dateinscribed: Number,
  dateend: Number,
  areah: Number,
  category: String,
  country: String,
  region: String,
});

//I imported my database through Compass and didn't use this code
if (process.env.RESET_DB) {
  const seedDatabase = async () => {
    await Book.deleteMany({});

    booksData.forEach((bookData) => {
      new Book(bookData).save();
    });
  };

  seedDatabase();
}

//-------Defines the port the app will run on-----//
const port = process.env.PORT || 8080;
const app = express();

//--------Add middlewares-------//
app.use(cors());
app.use(express.json());

//---------END POINTS---------//

//lists all end points
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

//----- End point for all sites-----//
app.get("/sites", async (req, res) => {
  const sites = await Site.find();
  res.json(sites);
});

//----- End point for all sites from date inscribed-----//
app.get("/date/:dateinscribed", async (req, res) => {
  const siteDate = req.params.dateinscribed;
  Site.find({ dateinscribed: siteDate }).then((date) => {
    if (date) {
      res.json(date);
    } else {
      res.status(404).json({ error: `Date not found` });
    }
  });
});

//End point for all sites in a country
app.get("/country/:country", async (req, res) => {
  const siteCountry = req.params.country;
  const regex = new RegExp("^" + siteCountry + "$", "i"); // Case-insensitive regex to make sure if user types lowercase it will still match with the database
  Site.find({ country: { $regex: regex } }).then((country) => {
    if (country) {
      res.json(country);
    } else {
      res.status(404).json({ error: `Country not found` });
    }
  });
});

//End point for name of site (one result) eg. (must include spaces, havent added any handling for this)
app.get("/name/:name", async (req, res) => {
  // const siteName = req.params.name.toLowerCase().replaceAll(" ", ""); //this doesn't work, found solution with regex through google
  const siteName = req.params.name;
  const regex2 = new RegExp("^" + siteName + "$", "i");
  Site.find({ name: { $regex: regex2 } }).then((name) => {
    if (name) {
      res.json(name);
    } else {
      res.status(404).json({ error: `Name not found` });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
