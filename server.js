import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import booksData from "./data/books.json";
import siteData from "./data/sites.json";
import listEndpoints from "express-list-endpoints";
//const dotenv = require("dotenv");
//dotenv.config({ path: "./config.env" });

const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/MongoProject";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

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

//I imported my database through Compass

// if (process.env.RESET_DB) {
//   const seedDatabase = async () => {
//     await Book.deleteMany({});
//     booksData.forEach(async (bookData) => {
//       await new Book(bookData).save();
//     });
//   };
//   seedDatabase();
// }

// Defines the port the app will run on. Defaults to 8080, but can be overridden
const port = process.env.PORT || 8080;
const app = express();

// Add middlewares to enable cors and json body parsing
app.use(cors());
app.use(express.json());

// Start defining your routes here
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

//End point for name of site (one result)
app.get("/name/:name", async (req, res) => {
  const siteName = req.params.name.toLowerCase().replaceAll(" ", "");
  Site.find({ name: siteName }).then((name) => {
    if (name) {
      res.json(name);
    } else {
      res.status(404).json({ error: `Name not found` });
    }
  });
});

// const str = "You are a BUTT HEAD";
// const allSpacesRemoved = str.toLowerCase().replaceAll(" ", "");
// console.log(allSpacesRemoved); // ABC

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
