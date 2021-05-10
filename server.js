import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";

import sites from "./data/tech-sites.json";

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
//
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
// import booksData from './data/books.json'
// import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = Promise;

const siteSchema = new mongoose.Schema({
  name: String,
  language: String,
  type: String,
  knowledge_focus: String,
  topic: String,
  url: String,
  description: String,
  offer_training: Boolean,
  free_or_paid: String
});

const Site = mongoose.model('Site', siteSchema);

if (process.env.RESET_DB) {
  const seedDB = async () => {
    await Site.deleteMany();
    await sites.forEach(item => {
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
app.get("/", (req, res) => {
  res.send(listEndpoints(app));
});

app.get("/techsites", async (req, res) => {
  Site.find((err, data) => {
    res.json(data);
  })
});


// Start the server
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`Server running on http://localhost:${port}`);
});
